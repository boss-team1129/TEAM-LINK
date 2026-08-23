#!/usr/bin/env python3
"""Generate TEAM LINK rich-menu PNGs from the repository's existing artwork."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "richmenu"
HOME = ROOT / "images" / "home"
WIDTH, HEIGHT = 2500, 1686
FONT_REGULAR = Path("/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc")
FONT_BOLD = Path("/System/Library/Fonts/ヒラギノ角ゴシック W7.ttc")


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size=size)


def vertical_gradient(top, bottom):
    image = Image.new("RGB", (WIDTH, HEIGHT), top)
    pixels = image.load()
    for y in range(HEIGHT):
        ratio = y / max(1, HEIGHT - 1)
        color = tuple(round(top[i] * (1 - ratio) + bottom[i] * ratio) for i in range(3))
        for x in range(WIDTH):
            pixels[x, y] = color
    return image


def rounded_card(base, box, fill, radius=48, outline=(205, 164, 88, 120), shadow=18):
    x, y, w, h = box
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((x + 8, y + 16, x + w + 8, y + h + 16), radius, fill=(88, 58, 42, 46))
    layer = layer.filter(ImageFilter.GaussianBlur(shadow))
    base.alpha_composite(layer)
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle((x, y, x + w, y + h), radius, fill=fill, outline=outline, width=3)


def paste_icon(base, name, box):
    icon = Image.open(HOME / name).convert("RGBA")
    icon.thumbnail((box[2], box[3]), Image.Resampling.LANCZOS)
    x = box[0] + (box[2] - icon.width) // 2
    y = box[1] + (box[3] - icon.height) // 2
    base.alpha_composite(icon, (x, y))


def centered(draw, box, text, text_font, fill, y_offset=0):
    x, y, w, h = box
    bounds = draw.textbbox((0, 0), text, font=text_font)
    tw, th = bounds[2] - bounds[0], bounds[3] - bounds[1]
    draw.text((x + (w - tw) / 2, y + (h - th) / 2 + y_offset), text, font=text_font, fill=fill)


def draw_tabs(base, active):
    draw = ImageDraw.Draw(base)
    draw.rectangle((0, 0, WIDTH, 220), fill=(255, 250, 241, 255))
    draw.line((1250, 42, 1250, 178), fill=(203, 174, 126, 150), width=3)
    for index, label in enumerate(("メイン", "TEAM LINK")):
        x = index * 1250
        is_active = label == active
        if is_active:
            draw.rounded_rectangle((x + 54, 32, x + 1196, 194), 48, fill=(214, 174, 93, 255))
        centered(draw, (x, 0, 1250, 220), label, font(68, True), (255, 253, 247) if is_active else (91, 65, 53))
    draw.line((0, 219, WIDTH, 219), fill=(200, 158, 78, 180), width=2)


def draw_check_mark(draw, center, radius=78):
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(199, 153, 70), outline=(242, 219, 163), width=6)
    draw.line((x - 38, y + 2, x - 8, y + 34, x + 48, y - 40), fill=(255, 253, 246), width=18, joint="curve")


def draw_main():
    base = vertical_gradient((255, 249, 236), (244, 233, 239)).convert("RGBA")
    draw_tabs(base, "メイン")
    draw = ImageDraw.Draw(base)

    rounded_card(base, (60, 250, 2380, 340), (255, 252, 244, 247), radius=58)
    draw_check_mark(draw, (270, 420))
    draw.text((410, 322), "来店しました", font=font(96, True), fill=(83, 57, 45))
    draw.text((414, 457), "今日の来店を記録します（1日1回まで）", font=font(44), fill=(137, 110, 93))

    cards = [
        ((60, 620, 773, 470), "reservation.png", "予約をする", "ご予約はこちら", (255, 244, 227, 248)),
        ((863, 620, 774, 470), "reservation.png", "予約確認", "ご予約状況を確認", (246, 237, 226, 248)),
        ((1666, 620, 774, 470), "coupon.png", "クーポン", "お得な情報", (255, 235, 239, 248)),
        ((60, 1120, 773, 470), "gacha.png", "今月のガチャ", "毎月のお楽しみ", (239, 233, 251, 248)),
        ((863, 1120, 774, 470), "fortune.png", "占い", "今日の運勢", (238, 241, 255, 248)),
        ((1666, 1120, 774, 470), "mypage.png", "マイページ", "デジタル会員証", (247, 239, 229, 248)),
    ]
    for box, image_name, title, subtitle, color in cards:
        rounded_card(base, box, color, radius=48, shadow=14)
        x, y, w, h = box
        paste_icon(base, image_name, (x + 205, y + 35, w - 410, 225))
        centered(draw, (x + 20, y + 270, w - 40, 92), title, font(57, True), (75, 53, 44))
        centered(draw, (x + 20, y + 360, w - 40, 64), subtitle, font(34), (133, 104, 89))
    return base


def draw_hair_mark(draw, box):
    x, y, w, h = box
    colors = ((110, 70, 52), (205, 153, 91), (104, 61, 46), (229, 192, 126))
    for index, color in enumerate(colors):
        offset = index * w / 5
        draw.arc((x + offset, y, x + offset + w * 0.62, y + h), 190, 352, fill=color, width=28)
        draw.arc((x + offset + 8, y + 8, x + offset + w * 0.62, y + h - 8), 190, 352, fill=(246, 218, 162), width=7)


def draw_products_mark(draw, center):
    x, y = center
    gold = (197, 151, 66)
    draw.rounded_rectangle((x - 130, y - 92, x + 130, y + 112), 42, fill=(255, 252, 245), outline=gold, width=8)
    draw.line((x - 92, y - 20, x + 92, y - 20), fill=gold, width=8)
    draw.line((x - 52, y - 88, x - 52, y + 108), fill=(230, 202, 148), width=6)
    for dx, dy, size in ((-176, -94, 28), (170, -52, 22), (144, 118, 18)):
        draw.line((x + dx - size, y + dy, x + dx + size, y + dy), fill=gold, width=7)
        draw.line((x + dx, y + dy - size, x + dx, y + dy + size), fill=gold, width=7)


def draw_service():
    base = vertical_gradient((255, 247, 238), (238, 233, 247)).convert("RGBA")
    draw_tabs(base, "TEAM LINK")
    draw = ImageDraw.Draw(base)

    rounded_card(base, (60, 250, 2380, 590), (255, 236, 241, 248), radius=58)
    paste_icon(base, "lounge.png", (130, 285, 750, 500))
    draw.text((930, 360), "ご縁ラウンジ", font=font(92, True), fill=(92, 55, 55))
    draw.text((935, 500), "素敵なご縁を見つけよう", font=font(48), fill=(143, 91, 99))
    draw.rounded_rectangle((935, 590, 1455, 690), 48, fill=(255, 252, 248), outline=(220, 167, 175), width=3)
    centered(draw, (935, 590, 520, 100), "COMING SOON", font(35, True), (172, 111, 118))

    rounded_card(base, (60, 870, 1160, 740), (252, 241, 228, 248), radius=55)
    draw_hair_mark(draw, (210, 925, 860, 320))
    centered(draw, (100, 1215, 1080, 115), "EXTENSION", font(78, True), (80, 53, 43))
    centered(draw, (100, 1335, 1080, 72), "シールエクステ", font(42), (135, 99, 78))
    centered(draw, (100, 1430, 1080, 72), "スタイルとメニューを見る", font(34), (153, 125, 107))

    rounded_card(base, (1280, 870, 1160, 740), (245, 239, 252, 248), radius=55)
    draw_products_mark(draw, (1860, 1105))
    centered(draw, (1320, 1215, 1080, 115), "おすすめ商品", font(72, True), (76, 55, 64))
    centered(draw, (1320, 1340, 1080, 72), "サロンおすすめの商品をチェック", font(38), (128, 102, 115))
    centered(draw, (1320, 1430, 1080, 72), "順次ご紹介します", font(34), (151, 126, 139))
    return base


def save_optimized(image, path):
    rgb = image.convert("RGB")
    palette = rgb.quantize(colors=192, method=Image.Quantize.FASTOCTREE)
    palette.save(path, format="PNG", optimize=True, compress_level=9)
    if path.stat().st_size > 1_000_000:
        palette = rgb.quantize(colors=128, method=Image.Quantize.FASTOCTREE)
        palette.save(path, format="PNG", optimize=True, compress_level=9)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    outputs = (("main.png", draw_main()), ("teamlink.png", draw_service()))
    for filename, image in outputs:
        path = OUT / filename
        save_optimized(image, path)
        with Image.open(path) as saved:
            assert saved.size == (WIDTH, HEIGHT), f"invalid dimensions: {saved.size}"
        assert path.stat().st_size <= 1_000_000, f"{filename} exceeds LINE's 1 MB limit"
        print(f"{path.relative_to(ROOT)} {path.stat().st_size} bytes {WIDTH}x{HEIGHT}")


if __name__ == "__main__":
    main()
