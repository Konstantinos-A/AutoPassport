import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ROLE_CONTRACT_ADDRESS } from "../config";
import RBACAccessControlABI from "../RBACAccessControl.json";
import { Wallet, UserCog, ShieldOff, ShieldPlus } from "lucide-react";

const roles = {
  1: "Owner",
  2: "Συνεργείο",
  3: "Ασφαλιστική",
  4: "Υπουργείο",
  5: "Αστυνομία",
  6: "Κέντρο Απόσυρσης",
  7: "KTEO"
};

function AccessManagement() {
  const [address, setAddress] = useState("");
  const [roleId, setRoleId] = useState("1");
  const [message, setMessage] = useState("");
  const [isMinistry, setIsMinistry] = useState(false);
  const [account, setAccount] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkRole = async () => {
      try {
        if (!window.ethereum) return alert("MetaMask is not installed");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        const rbac = new ethers.Contract(
          ROLE_CONTRACT_ADDRESS,
          RBACAccessControlABI.abi,
          provider
        );
        const role = await rbac.getRole(userAddress);
        setUserRole(role.toString());
        setIsMinistry(role.toString() === "4");
      } catch (err) {
        console.error("Access check error:", err);
      }
    };

    checkRole();
  }, []);

  const handleAssignRole = async () => {
    if (!window.ethereum) return alert("Χρειάζεται MetaMask account");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const roleContract = new ethers.Contract(
        ROLE_CONTRACT_ADDRESS,
        RBACAccessControlABI.abi,
        signer
      );

      const tx = await roleContract.setRole(address, parseInt(roleId));
      await tx.wait();
      setMessage("✅ Ο ρόλος αποδόθηκε με επιτυχία.");
    } catch (err) {
      console.error("⚠️ Σφάλμα:", err);
      setMessage("❌ Σφάλμα κατά την ανάθεση ρόλου: " + (err?.reason || err.message));
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-6 max-w-2xl mx-auto">
      {/* Header with title and wallet info */}
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <ShieldPlus className="w-5 h-5 text-blue-800" />
          <span>Ανάθεση Ρόλων</span>
        </h2>

        <div className="bg-gray-100 text-blue-900 p-3 rounded border shadow font-mono text-sm w-fit space-y-1">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-blue-700" />
            <span>
              <span className="font-semibold">Wallet:</span> {account}
            </span>
          </div>
          {userRole && (
            <div className="flex items-center space-x-2">
              <UserCog className="w-4 h-4 text-blue-700" />
              <span>
                <span className="font-semibold">Ρόλος:</span> {userRole}
              </span>
            </div>
          )}
        </div>
      </div>

      {isMinistry ? (
        <>
          <input
            type="text"
            placeholder="Διεύθυνση χρήστη"
            className="border p-2 mb-2 w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            {Object.entries(roles).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignRole}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Ανάθεση Ρόλου
          </button>
          {message && <p className="mt-2 text-sm text-center">{message}</p>}
        </>
      ) : (
        <p className="text-red-600 font-semibold mt-4 flex items-center space-x-2">
          <ShieldOff className="w-4 h-4" />
          <span>Δεν έχετε δικαιώματα πρόσβασης για διαχείριση ρόλων.</span>
        </p>
      )}
    </div>
  );
}

export default AccessManagement;
