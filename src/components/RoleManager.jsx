import React, { useEffect, useState } from "react";
import { ROLE_CONTRACT_ADDRESS } from "../config";
import { ethers } from "ethers";
import RBAC from "../RBACAccessControl.json";

const RBACAccessControlABI = RBAC.abi;

const roleMap = {
  1: "Owner",
  2: "Service",
  3: "Insurance",
  4: "Ministry",
  5: "Police",
  6: "ScrapCenter",
  7: "KTEO",
};

function RoleManager() {
  const [users, setUsers] = useState([]);
  const [updatedRoles, setUpdatedRoles] = useState({});
  const [isMinistry, setIsMinistry] = useState(false);
  const [account, setAccount] = useState("");

  useEffect(() => {
    checkPermission();
    loadUsers();
  }, []);

  const checkPermission = async () => {
    if (!window.ethereum) return alert("MetaMask is not installed");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    const contract = new ethers.Contract(
      ROLE_CONTRACT_ADDRESS,
      RBACAccessControlABI,
      provider
    );

    const roleValue = await contract.getRole(address);
    setIsMinistry(roleValue.toString() === "4"); // 4 = Ministry
  };

  const loadUsers = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      ROLE_CONTRACT_ADDRESS,
      RBACAccessControlABI,
      provider
    );

    try {
      const roleIds = [1, 2, 3, 4, 5, 6, 7]; // All roles except 0 (None)
      let allUsers = [];

      for (let roleId of roleIds) {
        const addresses = await contract.getRoleMembers(roleId);
        addresses.forEach((addr) => {
          allUsers.push({ address: addr, role: roleId });
        });
      }

      setUsers(allUsers);
    } catch (err) {
      console.error(err);
      alert("Σφάλμα κατά την φόρτωση των χρηστών");
    }
  };

  const updateRole = async (address, role) => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      ROLE_CONTRACT_ADDRESS,
      RBACAccessControlABI,
      signer
    );

    try {
      const tx = await contract.setRole(address, parseInt(role));
      await tx.wait();
      alert("Ρόλος ενημερώθηκε");
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Σφάλμα στην ενημέρωση ρόλου");
    }
  };

  if (!isMinistry) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <p className="text-red-600 font-semibold">
          Δεν έχεις άδεια για διαχείριση ρόλων.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">🔐 Διαχείριση Ρόλων</h2>
      <p className="text-sm text-gray-500">Συνδεδεμένος: {account}</p>

      {users.map((user, i) => (
        <div key={i} className="border-b py-2 flex items-center justify-between">
          <div>
            <p className="text-sm">{user.address}</p>
            <p className="text-xs text-gray-500">
              Τρέχων ρόλος: {roleMap[user.role]}
            </p>
          </div>
          <select
            value={updatedRoles[user.address] || user.role}
            onChange={(e) =>
              setUpdatedRoles({ ...updatedRoles, [user.address]: e.target.value })
            }
            className="border p-2 rounded"
          >
            {Object.entries(roleMap).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <button
            onClick={() => updateRole(user.address, updatedRoles[user.address])}
            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
            disabled={parseInt(user.role) === parseInt(updatedRoles[user.address])}
          >
            Ενημέρωση
          </button>
        </div>
      ))}
    </div>
  );
}

export default RoleManager;
