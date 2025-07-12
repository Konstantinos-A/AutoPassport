import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, PINATA_API_KEY, PINATA_SECRET_API_KEY } from '../config';
import AutoPassportABI from '../AutoPassport.json';

function AccidentForm() {
  const [vin, setVin] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !vin || !description || !date) {
      return alert('Συμπλήρωσε όλα τα πεδία και ανέβασε αρχείο.');
    }

    setLoading(true);

    try {
      // Upload file to IPFS via Pinata
      const formData = new FormData();
      formData.append('file', file);

      const metadata = JSON.stringify({
        name: 'accident-report',
        keyvalues: { vin, description, date }
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });

      const ipfsHash = response.data.IpfsHash;
      console.log('✅ Uploaded to IPFS:', ipfsHash);

      // Log to smart contract
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AutoPassportABI, signer);

        const collaborator = await signer.getAddress();
        const tx = await contract.addDocument(
          vin,
          date,
          description,
          collaborator,
          ipfsHash,
          '',
          ethers.constants.HashZero,
          3 // DocumentType.Accident
        );

        await tx.wait();
        alert('✅ Το ατύχημα καταχωρήθηκε επιτυχώς στο blockchain!');
      } else {
        alert('Εγκατάστησε το MetaMask.');
      }
    } catch (error) {
      console.error(error);
      alert('Σφάλμα κατά την υποβολή.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">⚠️ Καταχώρηση Ατυχήματος</h2>

      <input
        type="text"
        placeholder="VIN"
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        placeholder="Περιγραφή ατυχήματος"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full"
        required
      />

      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '⏳ Καταχώρηση...' : 'Καταχώρηση Ατυχήματος'}
      </button>
    </form>
  );
}

export default AccidentForm;
