#!/usr/bin/env python3
"""
Convert JPEG/JPG images to WebP and generate responsive size variants.

Usage:
    python scripts/optimize-images.py

Converts all JPEG/JPG images in images/ to WebP (same directory, same stem).
For the 3 layout-critical images, also generates smaller resized versions
for use with srcset/image-set.
"""

import os
import sys
from pathlib import Path

from PIL import Image

IMAGE_DIR = Path('images')
WEBP_QUALITY = 80
JPEG_QUALITY = 85

RESIZE_CONFIG = {
    'hero.jpeg': [
        ('hero-640w', 640),
    ],
    'amman-clear.jpeg': [
        ('amman-clear-480w', 480),
    ],
    'history.jpg': [
        ('history-480w', 480),
    ],
}

IMAGE_EXTENSIONS = {'.jpg', '.jpeg'}


def convert_to_webp(src_path: Path, dst_path: Path) -> int | None:
    """Convert image to WebP. Returns saved bytes or None if skipped."""
    if dst_path.exists():
        src_mtime = src_path.stat().st_mtime
        dst_mtime = dst_path.stat().st_mtime
        if dst_mtime >= src_mtime:
            return None

    img = Image.open(src_path)
    img.save(dst_path, 'WEBP', quality=WEBP_QUALITY)
    original_size = src_path.stat().st_size
    new_size = dst_path.stat().st_size
    saved = original_size - new_size
    pct = (saved / original_size) * 100
    print(f"  ✓  {dst_path.name}  ({new_size // 1024} KB, saved {pct:.0f}%)")
    return saved


def resize_jpeg(src_path: Path, dst_path: Path, max_width: int) -> None:
    """Resize a JPEG to a given max width, preserving aspect ratio."""
    img = Image.open(src_path)
    w, h = img.size
    if w <= max_width:
        return
    ratio = max_width / w
    new_size = (max_width, int(h * ratio))
    img = img.resize(new_size, Image.LANCZOS)
    img.save(dst_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)


def resize_webp(src_path: Path, dst_path: Path, max_width: int) -> None:
    """Resize and save as WebP."""
    img = Image.open(src_path)
    w, h = img.size
    if w <= max_width:
        return
    ratio = max_width / w
    new_size = (max_width, int(h * ratio))
    img = img.resize(new_size, Image.LANCZOS)
    img.save(dst_path, 'WEBP', quality=WEBP_QUALITY)


def main():
    total_saved = 0
    total_original = 0

    # --- Step 1: Convert all JPEG/JPG to WebP ---
    print("=" * 55)
    print("  Step 1: Converting JPEG/JPG → WebP (all images)")
    print("=" * 55)

    for root, _dirs, files in os.walk(IMAGE_DIR):
        root_path = Path(root)
        for fname in sorted(files):
            src = root_path / fname
            if src.suffix.lower() not in IMAGE_EXTENSIONS:
                continue

            dst = root_path / f'{src.stem}.webp'
            saved = convert_to_webp(src, dst)
            if saved is not None:
                total_saved += saved
                total_original += src.stat().st_size

    # --- Step 2: Generate responsive size variants ---
    print("\n" + "=" * 55)
    print("  Step 2: Generating responsive size variants")
    print("=" * 55)

    for orig_name, variants in RESIZE_CONFIG.items():
        src = IMAGE_DIR / orig_name
        if not src.exists():
            print(f"  ⚠  {orig_name} not found, skipping")
            continue

        for stem, width in variants:
            jpeg_dst = IMAGE_DIR / f'{stem}{src.suffix}'
            webp_dst = IMAGE_DIR / f'{stem}.webp'

            resize_jpeg(src, jpeg_dst, width)
            resize_webp(src, webp_dst, width)
            print(f"  ✓  {stem}{src.suffix}  ({width}w)")
            print(f"  ✓  {stem}.webp  ({width}w)")

    # --- Summary ---
    if total_original:
        pct = (total_saved / total_original) * 100
        print(f"\n  Total saved: {total_saved // 1024} KB  ({pct:.0f}% reduction)")
    else:
        print("\n  No new conversions needed (all WebP files are up to date)")
    print()


if __name__ == '__main__':
    main()
