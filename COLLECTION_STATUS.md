# Dehumain collection status

Generated locally on 2026-09-27 with `--balanced --seed dehumain-final-v1`.

- Output: `generated/collection-10000/` (ignored by Git)
- 10,000 unique PNG images at 900 × 900
- 10,000 matching local-review metadata files
- Image data: 5,152,272,139 bytes; output folder approximately 4.9 GiB
- Selection: exact category balance, with each trait count differing by at most one
- No AI or image-generation API calls used
- Not uploaded, pinned, or mint-ready: metadata still uses relative local image paths

Validated balance:

| Category | Traits | Minimum count | Maximum count |
| --- | ---: | ---: | ---: |
| Eyes | 32 | 312 | 313 |
| Head | 39 | 256 | 257 |
| Mouth | 29 | 344 | 345 |
| Body | 30 | 333 | 334 |

Integrity references:

- `manifest.json`: `1e33c36a71ea926aa7f4e5bd0d2c03f7da54fd81d60f5d76376fa1f1874f1162`
- `rarity.csv`: `b6732f8a66c3239216edad18686a1e33733dca5627d77f03493ce6d2562425be`
- `contact-sheet.jpg`: `3c3a6dceff1d0112668f070023403fcf531bdb31edf6bf1c944b33147afee65d`

## Storage sequence

1. Upload and pin `images/` as one public IPFS directory.
2. Record and independently verify the image CID through more than one gateway.
3. Rewrite each JSON `image` field to `ipfs://<IMAGE_CID>/<TOKEN_ID>.png`.
4. Validate all 10,000 rewritten metadata files against the image CID.
5. Upload and pin `metadata/` as a second public IPFS directory.
6. Configure the NFT contract base URI as `ipfs://<METADATA_CID>/`.
7. Pin both CIDs with a second independent provider and retain the local source, manifest and CAR backup.

Do not upload the current local-review metadata as final metadata. Do not place a pinning API token in the repository or browser code.
