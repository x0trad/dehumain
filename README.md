# dehumain
Dehumain — an AI-generated portrait collection planned for Robinhood Chain.

## Current product direction

One shared token: Dehumain token on Robinhood Chain. No separate token per NFT.
After migration, wallets meeting the US$5 holding eligibility rules receive one free mint while supply lasts. Additional mints cost US$5 in ETH, and collectors pay gas on all mints.
NFT holders may optionally pay an activation fee to pair any NFT with an available agent type. New types are planned at Dehumain token market caps of $100k, $300k, $500k, then every additional $200k.
Activation fees, usage allowances, migration details, valuation source, snapshot timing and wallet limits remain undecided.

## Implementation status

The mint page supports browser-wallet connection and network switching only. Token and NFT contracts, eligibility enforcement, payments and agent activation are not implemented. No transaction or signature requests are made.
Artwork and metadata must be prepared and uploaded before launch. Never store private keys in the site or metadata.
Run wallet checks with `node tests/mint-wallet.cjs`.

## Test mint rehearsal

A separate `/test-mint/` page and `contracts/DehumainTest.sol` have been prepared.
The three generated portraits and exact traits are in `dist/test-mint/`.
The V2 designated test wallets are `0x7dae73bfb82c7ad059d9c135532283c9b7e48e27` and `0x9c7d99d2774f2af996af0801751f02c29da675d6`.
Each wallet's first V2 mint is free; a later mint uses a fixed 0.0001 test ETH (not a USD oracle price).
The contract allows Robinhood testnet 46630 and local test chain 1337 only.
A wallet allowlist simulates token eligibility. No token contract or agent activation exists.

Install development dependencies with `npm ci`, compile with `npm run build:test`, then run `npm test`.
Local contract checks passed: access gate, free-first pricing, exact paid pricing, transfer does not reset free mint, metadata, supply cap, refund authorization and mainnet rejection.
Ganache uses its JavaScript fallback on this Node installation. It is development-only.

### Archived V1 on-chain test state

- Contract: [`0x991d85bc21705B9fc1d774222214e887c8626f9d`](https://explorer.testnet.chain.robinhood.com/address/0x991d85bc21705B9fc1d774222214e887c8626f9d)
- Deployment: [`0x0dae7844f1c729d7b37e9709d825d3ecbae7543b0d91c6a33195ceefaceb30ca`](https://explorer.testnet.chain.robinhood.com/tx/0x0dae7844f1c729d7b37e9709d825d3ecbae7543b0d91c6a33195ceefaceb30ca)
- Test NFT #1 mint: [`0x9821f92827e4bc112880d454414082ff4c250b48a683059dacfe5cfb1a4614f9`](https://explorer.testnet.chain.robinhood.com/tx/0x9821f92827e4bc112880d454414082ff4c250b48a683059dacfe5cfb1a4614f9)
- Verified after mint: supply `1 / 3`, wallet mint count `1`, and token ID 1 belongs to the designated wallet.
- V1 remains on-chain unchanged. The new two-wallet V2 contract must be deployed separately and its address recorded here.

No production contract or production mint has been made.
The main `/mint/` page remains prelaunch. See `CLAUDE.md` for a concise continuation handoff.

## Collection generation

The offline Trait Lab compositor and its 130 source layers are in `generator/`. A balanced 10,000-image collection has been generated locally and validated. Generated media is intentionally excluded from Git because it is approximately 4.9 GiB. See `COLLECTION_STATUS.md` for exact counts, integrity references and the required image-first IPFS upload sequence. The current metadata uses local review paths and is not ready to mint until the image CID is inserted and the metadata directory is uploaded separately.
