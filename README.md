# dehumain
Dehumain — an AI-generated portrait collection envisioned for Arc.

## Current product direction

One shared token: $DM001 on Robinhood Chain. No separate token per NFT.
After migration, wallets meeting the US$5 holding eligibility rules receive one free mint while supply lasts. Additional mints cost US$5 in ETH, and collectors pay gas on all mints.
NFT holders may optionally pay an activation fee to pair any NFT with an available agent type. New types are planned at $DM001 market caps of $100k, $300k, $500k, then every additional $200k.
Activation fees, usage allowances, migration details, valuation source, snapshot timing and wallet limits remain undecided.

## Implementation status

The mint page supports browser-wallet connection and network switching only. Token and NFT contracts, eligibility enforcement, payments and agent activation are not implemented. No transaction or signature requests are made.
Artwork and metadata must be prepared and uploaded before launch. Never store private keys in the site or metadata.
Run wallet checks with `node tests/mint-wallet.cjs`.
