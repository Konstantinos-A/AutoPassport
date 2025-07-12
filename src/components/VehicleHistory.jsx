import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config";
import AutoPassportABI from "../AutoPassport.json";
import useWallet from "../hooks/useWallet";

const documentTypes = [
  "Service",
  "KTEO",
  "Insurance",
  "Accident",
  "OwnershipTransfer",
  "Retirement",
  "Other",
  "RegistrationLicense"
];

function VehicleHistory() {
  const [vin, setVin] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signer } = useWallet();

  const fetchHistory = async () => {
    if (!vin.trim()) return alert("Συμπλήρωσε το VIN.");
    setLoading(true);
    setError(null);
    setHistory([]);

    try {
      const cleanVin = vin.trim().toUpperCase();
      console.log("📦 VIN που στέλνεται:", cleanVin);

      const provider = signer?.provider || new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AutoPassportABI.abi, provider);

      const records = await contract.getDocuments(cleanVin);
      console.log("✅ Επιστροφή συμβολαίου:", records);

      setHistory(records);
    } catch (err) {
      console.error("❌ Σφάλμα κατά την ανάκτηση ιστορικού:", err);
      setError(err.reason || err.message || "Άγνωστο σφάλμα");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📜 Ιστορικό Οχήματος</h2>
      <div className="flex space-x-4 items-center mb-4">
        <input
          type="text"
          placeholder="Εισάγετε VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <button
          onClick={fetchHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Αναζήτηση
        </button>
      </div>

      {loading && <p>⏳ Φόρτωση...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

      <div className="mt-4">
        {history.length === 0 && !loading && !error && (
          <p className="text-gray-500">Δεν βρέθηκαν καταγραφές.</p>
        )}

        {history.map((doc, i) => (
          <div key={i} className="border p-3 mb-3 rounded bg-gray-50">
            <p><strong>Ημερομηνία:</strong> {doc.date}</p>
            <p><strong>Τύπος:</strong> {documentTypes[doc.docType] || "Άγνωστο"}</p>
            <p><strong>Περιγραφή:</strong> {doc.description}</p>
            <p>
              <strong>IPFS A:</strong>{" "}
              <a
                href={`https://ipfs.io/ipfs/${doc.ipfsHashPartA.replace("ipfs://", "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
                {doc.ipfsHashPartA}
              </a>
            </p>
            <p>
              <strong>IPFS B:</strong>{" "}
              <a
                href={`https://ipfs.io/ipfs/${doc.ipfsHashPartB.replace("ipfs://", "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
                {doc.ipfsHashPartB}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleHistory;
