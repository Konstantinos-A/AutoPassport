# 🚗 AutoPassport – Ψηφιακό Ιστορικό Οχημάτων στο Blockchain

Το AutoPassport είναι μια αποκεντρωμένη εφαρμογή (DApp) για την ασφαλή καταγραφή και διαχείριση του ιστορικού ενός οχήματος με χρήση έξυπνων συμβολαίων Ethereum και αποθήκευση σε IPFS.

---

## 📦 Περιεχόμενα

- [Περιγραφή Έργου](#περιγραφή-έργου)
- [Έξυπνα Συμβόλαια](#έξυπνα-συμβόλαια)
- [Διεπαφή Χρήστη (React UI)](#διεπαφή-χρήστη-react-ui)
- [Τεχνολογίες](#τεχνολογίες)
- [Οδηγίες Εκτέλεσης](#οδηγίες-εκτέλεσης)
- [Συντελεστές](#συντελεστές)

---

## 🧾 Περιγραφή Έργου

Η εφαρμογή υποστηρίζει:

- Εγγραφή οχήματος
- Καταχώριση εγγράφων (ΚΤΕΟ, Ασφάλεια, Service, κ.ά.)
- Μεταβίβαση κυριότητας
- Απενεργοποίηση εγγράφων
- Διαχείριση ρόλων με βάση μοντέλο RBAC (Role-Based Access Control)

---

## 🔐 Έξυπνα Συμβόλαια

### `AutoPassport.sol`

Υλοποιεί:

- `registerVehicle` για την αρχική εγγραφή
- `addDocument` για προσθήκη εγγράφου
- `transferOwnership` για μεταβίβαση
- `deactivateDocument` για απόσυρση/απενεργοποίηση εγγράφου
- `getDocuments` για ανάκτηση ιστορικού

Κύρια δομή:

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

---

### `RBACAccessControl.sol`

- Εκχώρηση ρόλων: `setRole(address, Role)`
- Ανάκτηση ρόλου: `getRole(address)`
- Ρόλοι: Ministry, Insurance, Service, Owner, KTEO, Police, ScrapCenter

---

## 🖥️ Διεπαφή Χρήστη (React UI)

### `Dashboard.jsx`

- Προβολή συνδεδεμένου wallet
- Λίστα εγγεγραμμένων οχημάτων
- Πρόσβαση σε όλες τις λειτουργίες μέσω συνδέσμων
- Υποενότητα: `VehicleDocumentsPanel` για εμφάνιση εγγράφων βάσει VIN

### `UploadForm.jsx`

- Ανέβασμα αρχείων στο IPFS (Pinata)
- Υπολογισμός hash εγγράφων
- Καταχώριση εγγράφου μέσω συμβολαίου

### `TransferForm.jsx`

- Μεταβίβαση κυριότητας μέσω `transferOwnership`

### `VehicleHistory.jsx`

- Ανάκτηση όλων των εγγράφων για VIN
- Δυνατότητα απενεργοποίησης (μόνο για αρμόδιους ρόλους)

### `RoleManager.jsx`, `AccessManagement.jsx`

- Εκχώρηση και προβολή ρόλων
- Πλήρης ενσωμάτωση RBAC

---

## 🧪 Τεχνολογίες

- Solidity (Έξυπνα Συμβόλαια)
- Hardhat
- React + TailwindCSS
- Ethers.js
- IPFS μέσω Pinata
- MetaMask
- Sepolia Testnet

---

## ▶️ Οδηγίες Εκτέλεσης

```bash
npm install       # Εγκατάσταση εξαρτήσεων
npm run dev       # Εκκίνηση React εφαρμογής
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

---
