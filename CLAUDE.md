# Dehumain handoff

Read `README.md` before changing anything. The current production site builds from the Vinext app in `site/` into `dist/`, hosted with the Sites configuration in `.openai/hosting.json`.

## Current public narrative

- Refer to the unrevealed asset only as **Dehumain token**. Do not publish its ticker.
- The Dehumain token launches before the NFT collection.
- After migration, a wallet holding at least US$5 worth of Dehumain token qualifies for one free NFT mint while supply lasts.
- Additional production mints are planned to cost US$5 worth of ETH, plus gas.
- NFT owners may later pay separately to activate an AI-agent type.
- The NFT is a Membership Pass. Potential ecosystem benefits must be described as future possibilities until released. It is not a giveaway ticket.
- Promotional campaigns are separate from membership and must offer their own published rules and free participation route. NFT ownership must not automatically create campaign entries or improve odds. The membership multiplier is disabled by default and must not appear in public copy while disabled.
- Agent types are planned at token market caps of US$100k, US$300k, US$500k, then every additional US$200k.
- The project is planned for Robinhood Chain. Do not restore the older Arc narrative or the obsolete “one token per NFT” narrative.

## Test mint

- `/mint/` remains the public prelaunch page and must not send transactions.
- `/test-mint/` is a separate Robinhood Chain testnet rehearsal for exactly three generated portraits.
- Designated V2 test wallets: `0x7DAe73bfB82C7aD059d9C135532283C9b7e48e27` and `0x9c7d99d2774f2af996af0801751f02c29da675d6`.
- Each designated wallet's first V2 mint is free except gas. A later mint by that wallet costs exactly `0.0001` test ETH, plus gas.
- The fixed test price is a simulation. It is not a US$5 oracle implementation.
- The allowlisted wallet simulates Dehumain-token eligibility. No token contract or agent activation exists.
- The test contract rejects deployment on Robinhood Chain mainnet and permits only chain IDs 46630 and 1337.
- Deployed test contract: `0x991d85bc21705B9fc1d774222214e887c8626f9d`.
- Deployment transaction: `0x0dae7844f1c729d7b37e9709d825d3ecbae7543b0d91c6a33195ceefaceb30ca`.
- Test NFT #1 was minted to the designated wallet in transaction `0x9821f92827e4bc112880d454414082ff4c250b48a683059dacfe5cfb1a4614f9`.
- Current verified state after that mint: `minted = 1`, wallet mint count `= 1`, and token ID 1 is owned by the designated wallet.
- That address is the archived V1 one-wallet contract. V2 requires a fresh deployment because deployed contracts cannot be edited.
- V2 uses the first test wallet as its fixed treasury and allows both listed wallets to mint.

## Commands

```sh
npm ci
npm run build:test
npm test
```

`npm run build:test` recompiles `contracts/DehumainTest.sol` and refreshes the browser contract artifact. It does not overwrite the three image or trait files.

## Before any real launch

- Do not add a private key, seed phrase, signer secret, or custodial wallet to this repository or the browser code.
- Do not treat the test contract as production-ready.
- Production work still needs finalized supply and wallet limits, token contract, valuation source, snapshot or live-balance policy, US$5 ETH pricing method, metadata storage choice, treasury controls, pause/recovery policy, audit, and full testnet rehearsal.
- Preserve the exact generated traits in `dist/test-mint/collection.json` unless the artwork itself changes.

## Safe next step

Open `/test-mint/`, connect either designated public wallet, deploy the two-wallet V2 contract once, and record its address. Each wallet's first V2 mint is free plus testnet gas. Every deployment and mint requires the user to review and approve the Rabby transaction.

## Offline collection generator

`generator/README.md` documents the local batch compositor. The Trait Lab's 130 layers + base are extracted in `generator/assets/`, with source hash, trait names and checksums in `generator/collection.json`. Actual embedded dimensions are 900×900. Generate through `scripts/generate-collection.py`; no AI API calls. `generated/` is ignored by Git. The balanced 10,000-image collection exists locally at `generated/collection-10000/` and passed count, uniqueness, metadata, hash and category-balance validation. See `COLLECTION_STATUS.md`. Production metadata still needs final hosted image URIs.

## Production candidate backend

See `backend/README.md` before continuing. `contracts/Dehumain.sol` and the quote service are local candidates only. `npm run test:production` validates the new rules independently of the old testnet rehearsal. Live holding checks at each mint are a working assumption. The confirmed production token address is `0xFA78111742D290DCF3b5266b9f6dEb75033e4602`; public site copy must still call it only **Dehumain token** and must not reveal its ticker. Pons lists the token on its ETH bonding curve and it has not graduated. Pons graduation has no migration transaction. Canonical post-graduation pool verification, the price adapter, final collection storage, hosting, independent review and frontend transaction wiring remain outstanding. No production NFT deployment or public mint enablement has happened.

## Waitlist site

The hosted site builds from the Vinext app in `site/` and uses the Site D1 binding `DB`. `/waitlist` stores normalized X handles, normalized EVM wallet addresses, unique card codes, timestamps and `pending_verification` status. The first migration is `site/drizzle/0000_marvelous_amazoness.sql`. The X links intentionally open `@DehumAinVerse`; the team verifies social actions manually and does not require a hard-coded post URL. The waitlist card says `REGISTERED`, not `APPROVED`, because entry is pending manual review. This mint waitlist never creates a promotional campaign entry. `/campaign` is an informational preview only; no campaign, prize, terms acceptance, points or entries are live. See `CAMPAIGN_ARCHITECTURE.md` before implementing the separate campaign system.
