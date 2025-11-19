# Sim dApp

A sample Ethereum dApp built with **Next.js (App Router)**, **Chakra UI**, **Hardhat**,**tailwind CSS** and **Ethers.js**. Users can connect their wallet, view assets, and buy them on a local Hardhat blockchain.

---

## Features

- Connect wallet using MetaMask
- View a list of mock assets
- Buy assets
- Hardhat local blockchain with mock assets

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Chakra UI, Tailwind CSS
- **Blockchain:** Ethereum, Hardhat, Ethers.js
- **Smart Contracts:** Solidity (MockAsset contract)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd my-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up `.env.local`

Create a `.env.local` file at the root of your project:

```env
NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS=<will be set automatically>
```

### 4. Run Hardhat local blockchain and deploy contracts

```bash
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

This will:

1. Compile contracts
2. Start Hardhat local node
3. Deploy contracts
4. Update `.env.local` with deployed contract address

### 5. Start the Next.js development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dApp.

---

## Usage

1. Click **Connect Wallet**
2. Switch network if prompted (the dApp will automatically attempt to switch to Hardhat local)
3. Browse assets and click **Buy**
4. Ownership of assets updates in real-time

---

## Hardhat Notes

- Hardhat node starts at `http://127.0.0.1:8545`
- Default chain ID: `31337`
- Private keys are provided by Hardhat for local testing
- Use a Private key to test buy functionality
- You can reset the blockchain by restarting the Hardhat node

---

## Folder Structure

```
my-project/
│
├─ hardhat/                # Smart contracts & scripts
│   ├─ contracts/
│   ├─ scripts/
│
├─ app/                    # Next.js app router pages/components
│   ├─ layout
│   ├─ page
│   ├─ providers
│   ├─ utils
│
├─ components/             # UI Components
├─ context/                # React context for Wallet & Contracts
├─ constants/              # Constants
├─ services/               # Ethers.js contract service functions
├─ hooks/                  # hooks for wallet and contract functionalities
└─ public/                 # Static assets
```

---

## Assumptions and Trade-offs

- User is comfortable switching networks when prompted
- App is only required to run against a local Hardhat node
- Assets stored in contract are simple structs (id, name, src, price, owner)

- The frontend trusts the contract data without caching — simplicity over optimization
- No IPFS or real metadata storage used for assets
- Error handling is intentionally lightweight for readability
- Using Chakra UI + TailwindCSS together (acceptable in small projects)
- Smart contract lacks advanced marketplace features (bids, buyback, royalties, etc.)

---

## Bonus Features

- Auto Network Switching (If MetaMask is not on chain 31337, the app:)
- Tries to switch
- If chain is missing → automatically adds Hardhat network
- Tries switching again
- Lazy-loaded Assets
- Reusable wallet hook with auto reconnect,chain switching etc

---

## Architectural Decisions

1. Next.js App Router Over Pages Router

- The project uses the App Router for:
- Co-locating UI + logic in route segments
- Built-in layouts for global providers (Chakra, WalletContext)
- Future scalability (API routes, middleware, parallel routing)

### Trade-off:

- Because this is a dApp (a highly client-side experience), many components are marked "use client".

2. React Context for Wallet & Contract State

- Two separate contexts exist:
- WalletContext → manages provider, signer, chain, account
- ContractContext → manages asset loading, buying, and contract calls

- Separation of concerns (wallet logic ≠ contract logic)
- Easier testing (Contexts can be mocked independently)
- Cleaner React tree — only subscribing components re-render

### Trade-off:

- Contexts may introduce additional render layers vs Zustand/Jotai.
- Given app size, this is acceptable.

3. Ethers.js v6 Instead of Wagmi/RainbowKit

- Ethers.js is used directly for wallet/data:
- Lightweight and dependency-free
- Complete control over provider and signer states
- Avoided vendor lock-in for a small project

### Trade-off:

- Manual handling of events (accountsChanged, chainChanged) vs built-ins.

4. Local Hardhat Network as Primary Chain

- The app is designed to run purely on localhost:8545, because:
- Development simplicity
- Deterministic accounts with known private keys
- Instant block mining → fast UX
- Zero RPC cost

### Trade-off:

- Not instantly portable to testnets without additional provider logic.

5. Manual Contract Service Layer

- All contract interactions go through /services/contractService.ts.
- Ensures consistent instantiation of contracts
- Avoids instantiating contracts inside UI components
- Enables swapping networks or ABIs in the future without touching UI

### Trade-off:

- Adds light abstraction overhead.

6. Tailwind + Chakra UI Hybrid

- The project uses Chakra UI for layout & components but Tailwind for utility styling (spacing, backgrounds, responsive tweaks).

- Chakra offers polished components and accessibility
- Tailwind enables fine-grained quick styling
- Eliminates need to write custom CSS files

### Trade-off:

- Two styling systems → slight cognitive overhead.

7. Minimal Client-Side State (No Redux / Zustand)

- Global wallet state lives in context
- Assets are fetched on demand
- No user-generated content or pagination
- Adding a state management library was unnecessary.

8. Simple Error Handling Strategy

- Errors (e.g., missing MetaMask, network switching failure, buy failure) are surfaced via Chakra Toaster notifications.
- Consistent UX
- Errors stay visible without interrupting workflow
- No need for modal dialogs or error boundaries

### Trade-off:

- Toaster messages are non-blocking → user may still attempt actions in invalid state.

9. Backend-less Architecture

- No server or backend is used.
- All data comes from the smart contract
- Product of the decentralized-first approach
- Simpler project footprint

### Trade-off:

- Cannot index or cache data; relies entirely on blockchain state.
