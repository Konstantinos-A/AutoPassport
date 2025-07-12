import React, { useState } from "react";
import { ethers } from "ethers";
import AutoPassportABI from "../AutoPassport.json";
import { CONTRACT_ADDRESS } from "../config";

const documentTypes = [
  "Service", "KTEO", "Insurance", "Accident", "OwnershipTransfer", "Retirement", "Other"
];

function VehicleDocumentsPanel() {
  const [vin, setVin] = useState("");
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    if (!vin) return alert("VIN is required.");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AutoPassportABI, provider);
      const docs = await contract.getDocuments(vin);
      setDocuments(docs);
    } catch (error) {
      console.error("Fetch failed", error);
      alert("Error fetching documents.");
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">🔍 Έγγραφα για VIN</h3>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="VIN"
          className="input"
        />
        <button onClick={fetchDocuments} className="px-3 py-2 bg-blue-600 text-white rounded">
          Ανάκτηση
        </button>
      </div>

      {documents.length > 0 && (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th>#</th>
              <th>Ημερομηνία</th>
              <th>Περιγραφή</th>
              <th>Τύπος</th>
              <th>Κατάσταση</th>
              <th>Προβολή</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={idx} className={doc.isActive ? "" : "text-gray-400"}>
                <td>{idx}</td>
                <td>{doc.date}</td>
                <td>{doc.description}</td>
                <td>{documentTypes[doc.docType]}</td>
                <td>{doc.isActive ? "✅ Ενεργό" : "❌ Ανενεργό"}</td>
                <td>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHashPartA.replace("ipfs://", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mr-2"
                  >
                    Part A
                  </a>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsHashPartB.replace("ipfs://", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Part B
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VehicleDocumentsPanel;
