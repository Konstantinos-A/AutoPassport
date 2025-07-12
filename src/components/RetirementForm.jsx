import React, { useState } from 'react';
import axios from 'axios';
import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from '../config';

function RetirementForm() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Απαιτείται αρχείο");

    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "retirement-data",
      keyvalues: { description }
    });

    formData.append("pinataMetadata", metadata);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        }
      });

      console.log("✅ IPFS Hash:", res.data.IpfsHash);
      alert("Η απόσυρση καταχωρήθηκε!");
    } catch (err) {
      console.error(err);
      alert("Σφάλμα καταχώρησης");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        placeholder="Περιγραφή απόσυρσης"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border"
        required
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full"
        required
      />
      <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
        Καταχώρηση Απόσυρσης
      </button>
    </form>
  );
}

export default RetirementForm;
