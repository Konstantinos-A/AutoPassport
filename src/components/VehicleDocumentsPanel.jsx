import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import AutoPassportABI from "../AutoPassport.json";

const passportAddress = process.env.REACT_APP_PASSPORT_CONTRACT_ADDRESS;

const VehicleDocumentsPanel = ({ vin }) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    setError("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        passportAddress,
        AutoPassportABI.abi,
        signer
      );

      const docs = await contract.getDocuments(vin);
      console.log("📥 Έγγραφα:", docs);
      setDocuments(docs);
    } catch (err) {
      console.error("❌ Σφάλμα κατά την ανάκτηση ιστορικού:", err);
      setError("Σφάλμα κατά την ανάκτηση ιστορικού.");
    }
  };

  useEffect(() => {
    if (vin) {
      fetchDocuments();
    }
  }, [vin]);

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  if (documents.length === 0) {
    return <div className="text-gray-500 italic">Δεν βρέθηκαν καταγραφές.</div>;
  }

  return (
    <div className="space-y-4 mt-4">
      {documents.map((doc, index) => (
        <div key={index} className="p-4 border rounded shadow bg-white">
          <p><strong>📅 Ημερομηνία:</strong> {doc.date}</p>
          <p><strong>🧾 Περιγραφή:</strong> {doc.description}</p>
          <p>
            <strong>📁 Μέρος A:</strong>{" "}
            <a
              href={`https://ipfs.io/ipfs/${doc.cidA.replace("ipfs://", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Προβολή
            </a>
          </p>
          <p>
            <strong>📁 Μέρος B:</strong>{" "}
            <a
              href={`https://ipfs.io/ipfs/${doc.cidB.replace("ipfs://", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Προβολή
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default VehicleDocumentsPanel;
