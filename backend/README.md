# Production mint preparation

Status: local production candidate, not audited, deployed, hosted, or connected to the public mint page. Existing successful testnet rehearsal remains intact. This package adds rules absent from that rehearsal.

## Working policy

Live US$5 token holding required at every mint, after Pons graduation. First mint per wallet is free; subsequent mints cost US$5 in ETH plus gas. This live-check policy is an implementation assumption pending owner confirmation. Transfers do not reset the free claim. A user can transfer holdings across wallets, so this policy does NOT guarantee one free claim per person. Snapshot eligibility would require different implementation.

Pons docs checked 2026-09-27: https://docs.ponsfamily.com/ — graduation stays in the existing token/WETH pool, no migration event. Token address will be supplied by the owner. Public copy must not reveal a ticker.

## Architecture

GET /quote?buyer=0x… → server reads graduation, prices, balance and mint count → EIP-712 quote → wallet submits mint(quote, signature) with exact ETH → contract rechecks token balance, nonce, signature, expiry, caps and payment.

The server signer is trusted for USD valuations and graduation verification. It cannot withdraw funds or mint on behalf of a collector, but a compromised signer can issue artificially low thresholds/prices. Keep it separate from contract ownership and treasury; support rotation through setQuoteSigner. Mint starts paused. Quotes expire in 60 seconds, with an on-chain ceiling of 120 seconds. Prices can move during a quote's lifetime; this is quote-time USD valuation, not exact execution-time USD.

The contract uses sequential token IDs and padded metadata filenames matching the generator (0001.json through 10000.json). Random assignment/reveal has not been added. Owner may change metadata only while paused and before permanent freeze. Treasury, token, supply and per-wallet cap are constructor-fixed. Ownership uses two-step transfer.

## Local commands

npm run build:production
npm run test:production
npm run start:mint-api

Without MINT_ENABLED=true the API runs disabled; /quote returns 503 and /health reports disabled. It binds 127.0.0.1:8788. Build output is ignored by Git. No keys belong in dist/ or the repository. The website currently uses static hosting; this Node service needs separate server hosting or a reviewed worker port. Do not assume deploying the static site deploys the backend.

## Configuration required before launch

- RPC_URL: production RPC on chain 4663.
- NFT_ADDRESS: reviewed production NFT deployment.
- TOKEN_ADDRESS: owner's confirmed Dehumain token address.
- QUOTE_SIGNER_KEY: secret supplied by the server host's secret manager, never browser code.
- PRICE_ADAPTER_MODULE: absolute path to reviewed server module exporting async read().
- MINT_ENABLED=true only after launch review and infrastructure configuration.

Adapter return schema:

```js
{ chainId: 4663, token: '0x...', graduated: true,
  observedAt: 1234567890, // oldest timestamp among price and graduation inputs
  tokenUsd18: '...', ethUsd18: '...' } // positive integer USD prices scaled by 1e18
```

No price adapter or credentials are fabricated. Adapter must verify the token's canonical Pons pool and launch factory, check graduation, token ordering and decimals, use a manipulation-resistant token/WETH valuation (with adequate history and liquidity), and a verified fresh ETH/USD source. Never use an unprotected instantaneous pool spot price or a caller-supplied price. Insufficient history, liquidity, missing feeds or stale data must close minting. Current quote code requires source data no older than 60 seconds. Adapter design/feed availability must be verified with the actual token and deployed pool before this service can issue real quotes.

## Still required

Final supply/wallet cap, full approved artwork and metadata CID, token launch address and pool verification, production price adapter, graduation check, admin/treasury selection, independent contract review, HTTPS backend hosting, request rate limits, uptime/quote monitoring, final frontend transaction integration, controlled production deployment and launch. Existing main mint page remains disabled. No mainnet transaction has been sent.

Use the tests as engineering validation, not an audit or a promise of launch readiness. Agent activation is separate and is not implemented here.
