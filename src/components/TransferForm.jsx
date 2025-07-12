
import React, { useState } from "react";
import { ethers } from "ethers";
import AutoPassportABI from "../AutoPassport.json";
import { CONTRACT_ADDRESS } from "../config";

function TransferForm() {
  const [vin, setVin] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!vin || !newOwner) {
      alert("Συμπληρώστε το VIN και τη διεύθυνση του νέου ιδιοκτήτη.");
      return;
    }

    try {
      if (!window.ethereum) throw new Error("Install MetaMask");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AutoPassportABI, signer);

      const tx = await contract.transferOwnership(vin, newOwner);
      await tx.wait();
      alert("✅ Μεταβίβαση ιδιοκτησίας επιτυχής.");
    } catch (err) {
      console.error(err);
      alert("❌ Αποτυχία μεταβίβασης: " + err.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl mb-4">🔁 Μεταβίβαση Ιδιοκτησίας Οχήματος</h2>
      <form onSubmit={handleTransfer}>
        <input
          type="text"
          placeholder="VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Διεύθυνση Νέου Ιδιοκτήτη (0x...)"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          className="input"
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
          Μεταβίβαση
        </button>
      </form>
    </div>
  );
}

export default TransferForm;
