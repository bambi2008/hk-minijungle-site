"""Extract original embedded PNG assets from the supplied seven-page design PDF."""
import argparse
from pathlib import Path
from pypdf import PdfReader


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("out", type=Path)
    args = parser.parse_args()
    reader = PdfReader(args.pdf)
    if len(reader.pages) != 7:
        raise ValueError("Expected the reviewed seven-page source document")
    args.out.mkdir(parents=True, exist_ok=True)
    for number, page in enumerate(reader.pages, 1):
        images = sorted(page.images, key=lambda item: len(item.data), reverse=True)
        if len(images) != 2:
            raise ValueError(f"Page {number}: expected scene and detail images")
        for kind, item in zip(("scene", "detail"), images):
            if not item.data.startswith(bytes.fromhex("89504e470d0a1a0a")):
                raise ValueError("Expected original embedded PNG bytes")
            target = args.out / f"plant-design-{number:02d}-{kind}.png"
            if target.exists() and target.read_bytes() != item.data:
                raise FileExistsError(f"Refusing to replace different asset: {target}")
            target.write_bytes(item.data)
            print(f"{target.name}: {item.image.size}, {len(item.data)} bytes")


if __name__ == "__main__":
    main()
