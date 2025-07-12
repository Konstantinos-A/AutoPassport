import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, PINATA_API_KEY, PINATA_SECRET_API_KEY } from '../config';
import AutoPassportABI from '../AutoPassport.json';

function InsuranceForm() {
  const [vin, setVin] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vin || !insuranceDetails || !file) return alert('Συμπληρώστε όλα τα πεδία');

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: 'insurance-document',
      keyvalues: { vin, insuranceDetails }
    });

    formData.append('pinataMetadata', metadata);

    try {
      const ipfsRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        }
      });

      const ipfsHash = ipfsRes.data.IpfsHash;
      console.log('✅ IPFS Hash:', ipfsHash);

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AutoPassportABI, signer);

        const date = new Date().toISOString();
        const tx = await contract.addDocument(vin, date, insuranceDetails, ipfsHash);
        await tx.wait();

        alert('Καταχωρήθηκε επιτυχώς στο blockchain!');
        setVin('');
        setInsuranceDetails('');
        setFile(null);
      } else {
        alert('Πρέπει να έχετε εγκατεστημένο το MetaMask');
      }
    } catch (err) {
      console.error(err);
      alert('Σφάλμα κατά την καταχώρηση');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="VIN"
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        className="w-full border p-2"
        required
      />
      <textarea
        placeholder="Στοιχεία ασφάλειας"
        value={insuranceDetails}
        onChange={(e) => setInsuranceDetails(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Καταχώρηση Ασφάλειας
      </button>
    </form>
  );
}

export default InsuranceForm;
