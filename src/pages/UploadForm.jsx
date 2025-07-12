import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Paper,
  Alert,
  Tooltip,
} from "@mui/material";
import { ethers } from "ethers";
import axios from "axios";
import AutoPassportABI from "../AutoPassport.json";
import useWallet from "../hooks/useWallet";

const passportAddress = process.env.REACT_APP_PASSPORT_CONTRACT_ADDRESS;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataSecret = process.env.REACT_APP_PINATA_SECRET_API_KEY;

const documentLabels = {
  Service: "Service",
  KTEO: "KTEΟ",
  Insurance: "Ασφάλιση",
  Accident: "Ατύχημα",
  OwnershipTransfer: "Μεταβίβαση",
  RegistrationLicense: "Άδεια Κυκλοφορίας",
  Retirement: "Απόσυρση",
  Other: "Άλλο",
};

const UploadForm = () => {
  const [vin, setVin] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [docType, setDocType] = useState("Service");
  const [partA, setPartA] = useState(null);
  const [partB, setPartB] = useState(null);
  const [status, setStatus] = useState("");

  const { signer, isCollaborator, role } = useWallet();

  const baseTypes = [
    "Service",
    "KTEO",
    "Insurance",
    "Accident",
    "OwnershipTransfer",
    "Retirement",
    "Other",
  ];

  const documentTypes =
    role === "ministry" ? [...baseTypes, "RegistrationLicense"] : baseTypes;

  const isUploadBlocked =
    docType === "RegistrationLicense" && role !== "ministry";

  const pinToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(url, formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecret,
      },
    });

    return `ipfs://${res.data.IpfsHash}`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!isCollaborator) {
      return setStatus("You do not have permission to upload documents.");
    }

    if (!vin || !date || !description || !partA || !partB) {
      return setStatus("All fields are required.");
    }

    try {
      const cidA = await pinToIPFS(partA);
      const cidB = await pinToIPFS(partB);
      const combinedHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(cidA + cidB)
      );

      const contract = new ethers.Contract(
        passportAddress,
        AutoPassportABI.abi,
        signer
      );

      const documentTypeEnum = {
        Service: 0,
        KTEO: 1,
        Insurance: 2,
        Accident: 3,
        OwnershipTransfer: 4,
        RegistrationLicense: 5,
        Retirement: 6,
        Other: 7,
      };

      const userAddress = await signer.getAddress();
      const onChainRole = await contract.getRole(userAddress);

      console.log("📡 On-chain role:", Number(onChainRole));
      console.log("📨 docType:", docType, "→", documentTypeEnum[docType]);
      console.log("👤 Local role:", role, "👥 isCollaborator:", isCollaborator);
      console.log("🧾 VIN:", vin, "📅 Date:", date);

      const tx = await contract.addDocument(
        vin,
        date,
        description,
        cidA,
        cidB,
        combinedHash,
        documentTypeEnum[docType]
      );

      await tx.wait();
      setStatus("✅ Document uploaded successfully.");
      setVin("");
      setDate("");
      setDescription("");
      setDocType("Service");
      setPartA(null);
      setPartB(null);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      const reason =
        err?.error?.message ||
        err?.reason ||
        err?.message ||
        "❌ Failed to upload document.";
      setStatus(reason);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload Vehicle Document
      </Typography>

      {status && (
        <Alert severity={status.startsWith("✅") ? "success" : "error"} sx={{ my: 2 }}>
          {status}
        </Alert>
      )}

      {docType === "RegistrationLicense" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Μόνο το Υπουργείο μπορεί να ανεβάσει Άδεια Κυκλοφορίας.
        </Alert>
      )}

      <Box component="form" onSubmit={handleUpload} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="VIN"
          fullWidth
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          required
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField
          select
          label="Document Type"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          fullWidth
        >
          {documentTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {documentLabels[type]}
            </MenuItem>
          ))}
        </TextField>
        <Box>
          <Typography variant="body2">File Part A</Typography>
          <input type="file" required onChange={(e) => setPartA(e.target.files[0])} />
        </Box>
        <Box>
          <Typography variant="body2">File Part B</Typography>
          <input type="file" required onChange={(e) => setPartB(e.target.files[0])} />
        </Box>
        <Tooltip
          title={
            isUploadBlocked ? "Μόνο το Υπουργείο μπορεί να ανεβάσει αυτόν τον τύπο." : ""
          }
        >
          <span>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isUploadBlocked}
            >
              Upload
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default UploadForm;