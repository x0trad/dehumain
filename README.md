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
The designated test wallet is `0x7dae73bfb82c7ad059d9c135532283c9b7e48e27`.
First mint is free; the following two use a fixed 0.0001 test ETH each (not a USD oracle price).
The contract allows Robinhood testnet 46630 and local test chain 1337 only.
A wallet allowlist simulates token eligibility. No token contract or agent activation exists.

Install development dependencies with `npm ci`, compile with `npm run build:test`, then run `npm test`.
Local contract checks passed: access gate, free-first pricing, exact paid pricing, transfer does not reset free mint, metadata, supply cap, refund authorization and mainnet rejection.
Ganache uses its JavaScript fallback on this Node installation. It is development-only.

### Remaining before on-chain use

- User deploys with test ETH through their wallet; record the resulting contract address.
- Complete three actual testnet mints and verify ownership and tokenURI on the explorer.

No test contract has been deployed. No on-chain mint or production change has been made.
The main `/mint/` page remains prelaunch. See `CLAUDE.md` for a concise continuation handoff.
