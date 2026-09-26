# Dehumain handoff

Read `README.md` before changing anything. The current production site is a static site in `dist/`, hosted with the Sites configuration in `.openai/hosting.json`.

## Current public narrative

- Refer to the unrevealed asset only as **Dehumain token**. Do not publish its ticker.
- The Dehumain token launches before the NFT collection.
- After migration, a wallet holding at least US$5 worth of Dehumain token qualifies for one free NFT mint while supply lasts.
- Additional production mints are planned to cost US$5 worth of ETH, plus gas.
- NFT owners may later pay separately to activate an AI-agent type.
- Agent types are planned at token market caps of US$100k, US$300k, US$500k, then every additional US$200k.
- The project is planned for Robinhood Chain. Do not restore the older Arc narrative or the obsolete “one token per NFT” narrative.

## Test mint

- `/mint/` remains the public prelaunch page and must not send transactions.
- `/test-mint/` is a separate Robinhood Chain testnet rehearsal for exactly three generated portraits.
- Designated test wallet: `0x7DAe73bfB82C7aD059d9C135532283C9b7e48e27`.
- First test mint is free except gas. The next two cost exactly `0.0001` test ETH each, plus gas.
- The fixed test price is a simulation. It is not a US$5 oracle implementation.
- The allowlisted wallet simulates Dehumain-token eligibility. No token contract or agent activation exists.
- The test contract rejects deployment on Robinhood Chain mainnet and permits only chain IDs 46630 and 1337.
- No test contract has been deployed unless a later commit records an address and explorer link.

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

After the test page is published, open `/test-mint/`, connect only the designated public wallet, obtain Robinhood Chain test ETH, deploy once through the wallet, and record the resulting contract address. Every deployment or mint requires the user to review and approve the wallet transaction.
