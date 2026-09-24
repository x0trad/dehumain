# dehumain
Dehumain — an AI-generated portrait collection envisioned for Arc.

## Mint interface

`dist/mint/` is a pre-launch wallet preparation page, not a deployed NFT mint.
It supports injected EIP-1193 wallets, EIP-6963 discovery fallback, network switching,
account changes, rejection handling and local disconnect. No signing, approvals or
transactions are requested. There is no eligibility verdict until contracts exist.

Confirmed product rules: Robinhood Chain; first mint per eligible wallet free;
subsequent mints cost USD 5 worth of ETH; collectors pay gas. Proposed holder
eligibility is USD 5 in DEHUMAIN. Token is not deployed yet.

Remaining launch dependencies:
- Token and NFT contracts, reviewed ABIs and deployment addresses.
- Market-cap milestone and measurement rules; eligibility snapshot and price source.
- ETH/USD pricing method enforced by the contract, stale-price handling and wallet limits.
- Completed art collection and metadata, persistent storage and reveal/assignment policy.
- Contract-enforced free claim accounting that is not reset by NFT transfers.
- Integration tests for eligibility, paid/free mint, failed transactions and sold-out state.
- Independent contract review and testnet end-to-end rehearsal before accepting funds.

Artwork should be generated and reviewed before launch, then uploaded with one
metadata record per token ID. Do not put private keys in source, metadata or the site.

Run wallet-state checks: `node tests/mint-wallet.cjs`.
