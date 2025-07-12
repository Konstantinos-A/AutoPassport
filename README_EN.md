# AutoPassport Blockchain App

AutoPassport is a decentralized application (DApp) for digital vehicle history management. It is implemented using Ethereum smart contracts and decentralized storage via IPFS.

---

## Contents

- [Project Description](#-project-description)
- [Smart Contracts](#-smart-contracts)
- [Frontend (React UI)](#-frontend-react-ui)
- [Technologies](#-technologies)
- [Usage Instructions](#-usage-instructions)


---

## Project Description

The system supports:

- Vehicle registration
- Document uploads (Inspection, Insurance, Service, etc.)
- Ownership transfer
- Document deactivation
- Role-based access control via RBAC

---

## Smart Contracts

### `AutoPassport.sol`

Handles:

- Vehicle registration (`registerVehicle`)
- Adding documents (`addDocument`)
- Ownership transfer (`transferOwnership`)
- Deactivating documents (`deactivateDocument`)
- Document retrieval (`getDocuments`)

Struct: `Document`

```solidity
struct Document {
  string date;
  string description;
  string ipfsHash1;
  string ipfsHash2;
  string combinedHash;
  address submittedBy;
  bool isActive;
}
```

Events: `DocumentAdded`, `VehicleRegistered`, `OwnershipTransferred`, `DocumentDeactivated`

---

### `RBACAccessControl.sol`

Handles user roles. Supports:

- `setRole(address, Role)`
- `getRole(address)`
- `hasRole(address, string)`
- Enum `Role` includes: Owner, Insurance, Service, Ministry, KTEO, Police, ScrapCenter

---

## 🖥️ Frontend (React UI)

Main Components:

### `Dashboard.jsx`

- Connected wallet display
- Registered vehicle log (`VehicleRegistered` events)
- Document viewer per VIN (`VehicleDocumentsPanel`)
- Navigation to all sub-features

### `UploadForm.jsx`

- Form for uploading documents
- Uploads 2 files to IPFS via Pinata
- Computes `combinedHash` and stores via smart contract

### `TransferForm.jsx`

- Transfers vehicle ownership using `transferOwnership(...)`

### `VehicleHistory.jsx`

- Retrieves vehicle document history by VIN
- Displays active/inactive document status
- Allows deactivation (by Ministry or registrar only)

### `AccessManagement.jsx` & `RoleManager.jsx`

- Role assignment UI
- RBAC control with smart contract integration

---

## Technologies

- Solidity (Smart Contracts)
- Hardhat
- React + Tailwind
- Ethers.js
- IPFS (Pinata)
- MetaMask
- Sepolia Testnet

---

## Usage Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start frontend
npm run dev

# 3. (Optional) Deploy smart contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
--------------------------------------------------------------
--------------------------------------------------------------
##CAREFULL
-------- YOU NEED TO HAVE an .env file under the **AutoPassport/** Directory -----
This file must contain the following entries:
REACT_APP_PINATA_API_KEY=<PINATA API KEY
REACT_APP_PINATA_SECRET_API_KEY=<SECRET API KEY>
REACT_APP_PASSPORT_CONTRACT_ADDRESS=<AUTOPASSPORT SMART CONTRACT ADDRESS>
REACT_APP_RBAC_CONTRACT_ADDRESS=<RBAC CONTRACT ADDRESS>

```

---
