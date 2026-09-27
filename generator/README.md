# Dehumain batch generator

Offline compositor extracted from the Dehumain Trait Lab export on 2026-09-27.
The 130 embedded WebP layers and base are **900 × 900**, despite the lab's 1500 × 1500 label. No upscaling is applied. Obtain original Photoshop exports to generate genuine 1500 × 1500 artwork.

Requires Python 3 and Pillow (`python3 -m pip install -r generator/requirements.txt`). No AI API, wallet, network or paid service is used during generation.

```sh
python3 scripts/generate-collection.py --count 100 --out generated/sample-100
python3 scripts/generate-collection.py --count 10000 --balanced --seed dehumain-final-v1 --out generated/collection-10000
```

Run from the repository root. Existing output folders are refused. `--balanced` distributes each enabled trait as evenly as mathematically possible: counts within a category differ by at most one.

## Configuration

`collection.json` preserves exact Trait Lab names and asset checksums. Paint order is base → Body → Mouth → Head → Eyes. Set a trait's `weight` to 0 to disable it. Without `--balanced`, larger weights increase selection probability. With `--balanced`, every enabled trait receives an equal quota and positive weight values are otherwise ignored. Exact balance may be impossible when the collection size is not divisible by the number of traits; the difference is at most one.

Add forbidden combinations to `exclude`, for example `{"Head":"specshead","Eyes":"nerd"}`. This is only an example, not an active restriction. No None traits are selected by default. The 1,085,760 theoretical combinations do not guarantee that all results look different or visually compatible.

## Outputs

- `images/0001.png`: full available resolution PNGs.
- `metadata/0001.json`: corresponding standard NFT metadata.
- `rarity.csv`: observed counts and percentages, including absent traits; not a rarity ranking.
- `manifest.json`: token mapping, seed, config hash, file/pixel hashes and rejected combinations.
- `config.json`: configuration snapshot.
- `contact-sheet.jpg`: first 100 images for review.

The script rejects repeated trait combinations and exactly identical composite pixels. It does not identify all near-duplicates or artistic collisions; review samples and contact sheets before production. A failed run leaves INCOMPLETE.txt and must not be uploaded as a finished collection.

Local metadata uses relative image paths for review. Upload images first, then replace those paths with the final image CID before uploading metadata. `--image-base ipfs://ACTUAL_IMAGE_CID` can create final URIs when the CID is already known. Merely supplying this option does not upload or validate hosted files. Do not mint relative review URIs.

Deterministic seeds reproduce trait selection with the same Python/config/assets. PNG byte encoding can vary across Pillow versions. Dependencies are pinned for the current tested environment. Generation runs locally and does not consume per-image LLM tokens.
