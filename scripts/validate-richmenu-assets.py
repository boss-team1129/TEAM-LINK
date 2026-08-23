#!/usr/bin/env python3
"""Validate TEAM LINK rich-menu images and tap geometry without API calls."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 2500, 1686
MAX_BYTES = 1_000_000

MAIN_AREAS = [
    (0, 0, 1250, 220),
    (1250, 0, 1250, 220),
    (60, 250, 2380, 340),
    (60, 620, 773, 470),
    (863, 620, 774, 470),
    (1666, 620, 774, 470),
    (60, 1120, 773, 470),
    (863, 1120, 774, 470),
    (1666, 1120, 774, 470),
]

SERVICE_AREAS = [
    (0, 0, 1250, 220),
    (1250, 0, 1250, 220),
    (60, 250, 2380, 590),
    (60, 870, 1160, 740),
    (1280, 870, 1160, 740),
]


def intersects(left, right):
    lx, ly, lw, lh = left
    rx, ry, rw, rh = right
    return lx < rx + rw and rx < lx + lw and ly < ry + rh and ry < ly + lh


def validate_areas(name, areas):
    for index, (x, y, width, height) in enumerate(areas):
        assert min(x, y, width, height) >= 0, f"{name} area {index} has a negative value"
        assert width and height, f"{name} area {index} is empty"
        assert x + width <= WIDTH and y + height <= HEIGHT, f"{name} area {index} is outside the image"
    for left_index, left in enumerate(areas):
        for right_index, right in enumerate(areas[left_index + 1 :], left_index + 1):
            assert not intersects(left, right), f"{name} areas {left_index} and {right_index} overlap"


def validate_image(filename):
    path = ROOT / "images" / "richmenu" / filename
    assert path.exists(), f"missing {path}"
    with Image.open(path) as image:
        assert image.format == "PNG", f"{filename} is not PNG"
        assert image.size == (WIDTH, HEIGHT), f"{filename} is {image.size}"
    assert path.stat().st_size <= MAX_BYTES, f"{filename} exceeds LINE's 1 MB limit"
    return path.stat().st_size


if __name__ == "__main__":
    main_size = validate_image("main.png")
    service_size = validate_image("teamlink.png")
    validate_areas("main", MAIN_AREAS)
    validate_areas("service", SERVICE_AREAS)
    print(f"OK main.png={main_size}B teamlink.png={service_size}B areas=14")
