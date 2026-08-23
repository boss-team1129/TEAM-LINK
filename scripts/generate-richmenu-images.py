#!/usr/bin/env python3
"""Generate TEAM LINK rich-menu SVG templates and 2500x1686 PNG previews."""

from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
from base64 import b64encode
import html
import mimetypes
import os
import subprocess

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images" / "richmenu"
SOURCE = OUT / "source"
HOME = ROOT / "images" / "home"
WIDTH, HEIGHT = 2500, 1686
EXTENSION_VISUAL_URL = (
    "https://boss-team1129.github.io/Kimikea-Connect/"
    "assets/home-gallery/stylebook-20260714.jpg"
)


def extension_visual() -> Path:
    path = SOURCE / "extension-hair-crop.jpg"
    if not path.exists():
        with urlopen(EXTENSION_VISUAL_URL, timeout=30) as response:
            source = Image.open(BytesIO(response.read())).convert("RGB")
        left = round(source.width * 0.43)
        crop = source.crop((left, 0, source.width, source.height))
        crop.save(path, format="JPEG", quality=92, optimize=True)
    return path


def svg_header() -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">
      <defs>
        <linearGradient id="pageBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff9ec"/><stop offset=".52" stop-color="#faedef"/><stop offset="1" stop-color="#eee9f8"/>
        </linearGradient>
        <linearGradient id="ivoryCard" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#fffef9"/><stop offset="1" stop-color="#f8ecdc"/>
        </linearGradient>
        <linearGradient id="pinkCard" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#fff9fa"/><stop offset="1" stop-color="#f7dfe7"/>
        </linearGradient>
        <linearGradient id="lavenderCard" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#fdfbff"/><stop offset="1" stop-color="#e9e1f6"/>
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#f2d99a"/><stop offset=".45" stop-color="#c99b47"/><stop offset="1" stop-color="#f5dfaa"/>
        </linearGradient>
        <linearGradient id="photoShade" x1="0" y1="0" x2="1" y2="0">
          <stop stop-color="#2c1d18" stop-opacity=".72"/><stop offset=".62" stop-color="#2c1d18" stop-opacity=".16"/><stop offset="1" stop-color="#2c1d18" stop-opacity="0"/>
        </linearGradient>
        <filter id="cardShadow" x="-15%" y="-15%" width="130%" height="145%">
          <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#5e3d32" flood-opacity=".18"/>
        </filter>
        <filter id="smallShadow" x="-15%" y="-20%" width="130%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#5e3d32" flood-opacity=".16"/>
        </filter>
        <style>
          text {{ font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Noto Sans JP", sans-serif; }}
          .serif {{ font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; }}
          .brown {{ fill:#50382f; }} .muted {{ fill:#80695d; }} .goldText {{ fill:#a9782f; }}
        </style>
      </defs>
      <rect width="2500" height="1686" fill="url(#pageBg)"/>
    '''


def card(x, y, width, height, fill, radius=48) -> str:
    return f'''<g filter="url(#cardShadow)">
      <rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}" stroke="#c9a45e" stroke-width="4"/>
      <rect x="{x + 7}" y="{y + 7}" width="{width - 14}" height="{height - 14}" rx="{max(12, radius - 7)}" fill="none" stroke="#ffffff" stroke-opacity=".78" stroke-width="4"/>
    </g>'''


def tabs(active: str) -> str:
    items = []
    for index, label in enumerate(("メイン", "TEAM LINK")):
        x = index * 1250
        selected = active == label
        if selected:
            items.append(f'<rect x="{x + 50}" y="30" width="1150" height="164" rx="54" fill="url(#gold)" filter="url(#smallShadow)"/>')
        items.append(
            f'<text x="{x + 625}" y="142" text-anchor="middle" font-size="72" font-weight="800" '
            f'fill="{"#fffdf8" if selected else "#50382f"}">{html.escape(label)}</text>'
        )
    return '<rect width="2500" height="220" fill="#fffbf2"/><path d="M1250 44V176" stroke="#cfb17d" stroke-width="3"/>' + ''.join(items)


def clipped_image(image_path: Path, clip_id: str, x, y, width, height, radius=38) -> str:
    uri = os.path.relpath(image_path, SOURCE).replace(os.sep, "/")
    return f'''<defs><clipPath id="{clip_id}"><rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}"/></clipPath></defs>
      <image x="{x}" y="{y}" width="{width}" height="{height}" preserveAspectRatio="xMidYMid slice"
        clip-path="url(#{clip_id})" xlink:href="{uri}"/>'''


def contained_image(image_path: Path, x, y, width, height) -> str:
    uri = os.path.relpath(image_path, SOURCE).replace(os.sep, "/")
    return f'''<image x="{x}" y="{y}" width="{width}" height="{height}"
      preserveAspectRatio="xMidYMid meet" xlink:href="{uri}"/>'''


def inline_image_references(svg_text: str) -> str:
    """Embed referenced images only in the temporary SVG passed to sips.

    The checked-in SVG remains small and editable with relative asset paths, while
    the macOS renderer receives a self-contained document it can render reliably.
    """
    paths = [
        HOME / "reservation.png",
        HOME / "coupon.png",
        HOME / "gacha.png",
        HOME / "fortune.png",
        HOME / "mypage.png",
        HOME / "lounge.png",
        OUT / "shopping.png",
        OUT / "instagram.png",
        SOURCE / "extension-hair-crop.jpg",
    ]
    rendered = svg_text
    for image_path in paths:
        relative = os.path.relpath(image_path, SOURCE).replace(os.sep, "/")
        mime_type = mimetypes.guess_type(image_path.name)[0] or "application/octet-stream"
        encoded = b64encode(image_path.read_bytes()).decode("ascii")
        rendered = rendered.replace(f'xlink:href="{relative}"', f'xlink:href="data:{mime_type};base64,{encoded}"')
    return rendered


def main_svg() -> str:
    parts = [svg_header(), tabs("メイン")]
    parts.append(card(60, 250, 2380, 340, "url(#ivoryCard)", 58))
    parts.append('''<circle cx="255" cy="420" r="90" fill="url(#gold)" filter="url(#smallShadow)"/>
      <path d="M210 421l31 34 67-78" fill="none" stroke="#fffdf8" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="410" y="405" class="serif brown" font-size="118" font-weight="800">来店しました</text>
      <text x="414" y="494" class="muted" font-size="40" font-weight="600">今日の来店を記録（1日1回）</text>''')

    items = [
        (60, 620, "reservation.png", "予約をする", "ご予約はこちら", "url(#ivoryCard)"),
        (863, 620, "reservation.png", "予約確認", "予約状況を確認", "url(#ivoryCard)"),
        (1666, 620, "coupon.png", "クーポン", "お得な情報", "url(#pinkCard)"),
        (60, 1120, "gacha.png", "今月のガチャ", "毎月のお楽しみ", "url(#lavenderCard)"),
        (863, 1120, "fortune.png", "占い", "今日の運勢", "url(#lavenderCard)"),
        (1666, 1120, "mypage.png", "マイページ", "会員情報を見る", "url(#ivoryCard)"),
    ]
    for index, (x, y, image_name, title, subtitle, fill) in enumerate(items):
        parts.append(card(x, y, 773 if x != 863 else 774, 470, fill))
        icon_x = x + 204
        parts.append(clipped_image(HOME / image_name, f"mainIcon{index}", icon_x, y + 28, 365, 235, 42))
        parts.append(f'<rect x="{icon_x}" y="{y + 28}" width="365" height="235" rx="42" fill="none" stroke="#fff" stroke-opacity=".82" stroke-width="4"/>')
        parts.append(f'<text x="{x + 386.5}" y="{y + 357}" text-anchor="middle" class="serif brown" font-size="82" font-weight="800">{html.escape(title)}</text>')
        parts.append(f'<text x="{x + 386.5}" y="{y + 418}" text-anchor="middle" class="muted" font-size="31" font-weight="600">{html.escape(subtitle)}</text>')
    parts.append('</svg>')
    return ''.join(parts)


def gift_icon() -> str:
    return '''<g transform="translate(1505 940)" filter="url(#smallShadow)">
      <path d="M-105 5h210v180h-210z" fill="#fffaf0" stroke="#bd8b37" stroke-width="10"/>
      <path d="M-128-42h256v68h-256z" fill="url(#gold)" stroke="#bd8b37" stroke-width="8"/>
      <path d="M0-42v227M-115 26h230" stroke="#bd8b37" stroke-width="10"/>
      <path d="M-6-43c-86-7-110-79-49-92 46-10 66 39 55 92M6-43c86-7 110-79 49-92-46-10-66 39-55 92" fill="none" stroke="#d1a45b" stroke-width="12"/>
    </g>'''


def instagram_icon() -> str:
    return '''<g transform="translate(2135 940)" filter="url(#smallShadow)">
      <rect x="-108" y="-108" width="216" height="216" rx="58" fill="#fffaf8" stroke="#b98757" stroke-width="11"/>
      <circle cx="0" cy="0" r="53" fill="none" stroke="#b98757" stroke-width="11"/>
      <circle cx="70" cy="-70" r="14" fill="#b98757"/>
    </g>'''


def service_svg() -> str:
    extension = extension_visual()
    parts = [svg_header(), tabs("TEAM LINK")]
    parts.append(card(60, 250, 2380, 390, "url(#pinkCard)", 58))
    parts.append(clipped_image(HOME / "lounge.png", "loungeVisual", 98, 278, 650, 334, 42))
    parts.append('''<text x="810" y="403" class="serif brown" font-size="102" font-weight="800">ご縁ラウンジ</text>
      <text x="815" y="492" fill="#986670" font-size="43" font-weight="600">素敵なご縁を見つけよう</text>
      <rect x="816" y="526" width="440" height="74" rx="37" fill="#fffdf9" stroke="#d2a7ad" stroke-width="3"/>
      <text x="1036" y="576" text-anchor="middle" fill="#a66e77" font-size="30" font-weight="800" letter-spacing="4">COMING SOON</text>''')

    parts.append(card(60, 670, 1120, 956, "url(#ivoryCard)", 54))
    parts.append(clipped_image(extension, "extensionVisual", 88, 698, 1064, 284, 40))
    parts.append('<rect x="88" y="698" width="1064" height="284" rx="40" fill="url(#photoShade)"/>')
    parts.append('''<text x="130" y="795" fill="#fffdf9" font-size="75" font-weight="900" letter-spacing="4">EXTENSION</text>
      <text x="134" y="862" fill="#fffdf9" font-size="38" font-weight="700">シールエクステ</text>''')
    extension_buttons = [
        (1020, "01", "スタイル図鑑"), (1134, "02", "マップ"), (1248, "03", "ランキング"),
        (1362, "04", "講習案内"), (1476, "05", "AI診断"),
    ]
    for y, number, label in extension_buttons:
        parts.append(f'''<g filter="url(#smallShadow)">
          <rect x="95" y="{y}" width="1050" height="102" rx="36" fill="#fffdf8" stroke="#c8a05a" stroke-width="3"/>
          <rect x="112" y="{y + 13}" width="76" height="76" rx="25" fill="url(#gold)"/>
          <text x="150" y="{y + 66}" text-anchor="middle" fill="#fff" font-size="33" font-weight="900">{number}</text>
          <text x="225" y="{y + 70}" class="brown" font-size="51" font-weight="900">{label}</text>
          <text x="1092" y="{y + 68}" text-anchor="middle" class="goldText" font-size="48" font-weight="700">›</text>
        </g>''')

    parts.append(card(1210, 670, 590, 956, "url(#pinkCard)", 54))
    parts.append(contained_image(OUT / "shopping.png", 1225, 700, 560, 520))
    parts.append('''<text x="1505" y="1320" text-anchor="middle" class="serif brown" font-size="73" font-weight="900">おすすめ商品</text>
      <text x="1505" y="1402" text-anchor="middle" class="muted" font-size="32" font-weight="700">サロンおすすめの商品を</text>
      <text x="1505" y="1452" text-anchor="middle" class="muted" font-size="32" font-weight="700">チェック</text>
      <path d="M1405 1502h200" stroke="#c49a52" stroke-width="4"/>
      <text x="1505" y="1572" text-anchor="middle" class="goldText" font-size="38" font-weight="800">詳しく見る ›</text>''')

    parts.append(card(1830, 670, 610, 956, "url(#lavenderCard)", 54))
    parts.append(contained_image(OUT / "instagram.png", 1855, 690, 560, 535))
    parts.append('''<text x="2135" y="1320" text-anchor="middle" class="serif brown" font-size="78" font-weight="900">Instagram</text>
      <text x="2135" y="1408" text-anchor="middle" class="muted" font-size="35" font-weight="700">最新情報をチェック</text>
      <rect x="1935" y="1480" width="400" height="88" rx="44" fill="#fffdf9" stroke="#bca6cd" stroke-width="3"/>
      <text x="2135" y="1538" text-anchor="middle" fill="#8d759e" font-size="30" font-weight="800">公式Instagramを見る ›</text>''')
    parts.append('</svg>')
    return ''.join(parts)


def render(svg_text: str, stem: str):
    svg_path = SOURCE / f"{stem}.svg"
    render_svg_path = SOURCE / f".{stem}-render.svg"
    png_path = OUT / f"{stem}.png"
    svg_path.write_text(svg_text, encoding="utf-8")
    render_svg_path.write_text(inline_image_references(svg_text), encoding="utf-8")
    try:
        subprocess.run(
            ["sips", "-s", "format", "png", str(render_svg_path), "--out", str(png_path)],
            check=True, stdout=subprocess.DEVNULL,
        )
    finally:
        render_svg_path.unlink(missing_ok=True)
    with Image.open(png_path) as image:
        assert image.size == (WIDTH, HEIGHT), f"invalid dimensions: {image.size}"
        palette = image.convert("RGB").quantize(colors=192, method=Image.Quantize.FASTOCTREE)
        palette.save(png_path, format="PNG", optimize=True, compress_level=9)
    assert png_path.stat().st_size <= 1_000_000, f"{png_path.name} exceeds LINE's 1 MB limit"
    print(f"{png_path.relative_to(ROOT)} {png_path.stat().st_size} bytes {WIDTH}x{HEIGHT}")


def main():
    SOURCE.mkdir(parents=True, exist_ok=True)
    render(main_svg(), "main")
    render(service_svg(), "teamlink")


if __name__ == "__main__":
    main()
