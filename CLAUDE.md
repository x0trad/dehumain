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
- Deployed test contract: `0x991d85bc21705B9fc1d774222214e887c8626f9d`.
- Deployment transaction: `0x0dae7844f1c729d7b37e9709d825d3ecbae7543b0d91c6a33195ceefaceb30ca`.
- Test NFT #1 was minted to the designated wallet in transaction `0x9821f92827e4bc112880d454414082ff4c250b48a683059dacfe5cfb1a4614f9`.
- Current verified state after that mint: `minted = 1`, wallet mint count `= 1`, and token ID 1 is owned by the designated wallet.

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

Open `/test-mint/`, connect only the designated public wallet, load the prefilled deployed contract, and continue with test NFT #2 when ready. The remaining two mints cost `0.0001` test ETH each plus testnet gas. Every mint requires the user to review and approve the Rabby transaction.
