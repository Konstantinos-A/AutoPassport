import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import { ethers } from "ethers";
import AutoPassportABI from "../AutoPassport.json";
import useWallet from "../hooks/useWallet";

const passportAddress = process.env.REACT_APP_PASSPORT_CONTRACT_ADDRESS;

const Register = () => {
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [status, setStatus] = useState("");

  const { signer, isCollaborator, role } = useWallet();

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!vin || !make || !model || !year || !color || !fuelType) {
      return setStatus("All fields are required.");
    }

    if (!isCollaborator || role !== "ministry") {
      return setStatus("Only the Ministry can register vehicles.");
    }

    try {
      const contract = new ethers.Contract(
        passportAddress,
        AutoPassportABI.abi,
        signer
      );

      const tx = await contract.registerVehicle(
        vin,
        make,
        model,
        year,
        color,
        fuelType
      );

      await tx.wait();

      setStatus("✅ Vehicle registered successfully.");
      setVin("");
      setMake("");
      setModel("");
      setYear("");
      setColor("");
      setFuelType("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Vehicle registration failed.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Register New Vehicle
      </Typography>

      {/* 🔍 Debug Info */}
      <Typography variant="body2" sx={{ mb: 2, color: "gray" }}>
        Role: <strong>{role}</strong> | Collaborator:{" "}
        <strong>{isCollaborator ? "Yes" : "No"}</strong>
      </Typography>

      {status && (
        <Alert
          severity={status.startsWith("✅") ? "success" : "error"}
          sx={{ my: 2 }}
        >
          {status}
        </Alert>
      )}

      {!isCollaborator || role !== "ministry" ? (
        <Alert severity="warning">
          You do not have permission to register vehicles.
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Fuel Type"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Register Vehicle
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default Register;
