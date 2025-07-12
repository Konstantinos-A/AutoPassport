import { useState, useEffect } from "react";
import { ethers } from "ethers";
import RBAC from "../RBACAccessControl.json"; // <-- σημείωση εδώ

const rbacAddress = process.env.REACT_APP_RBAC_CONTRACT_ADDRESS;

const roleMap = {
  0: "none",
  1: "owner",
  2: "service",
  3: "insurance",
  4: "ministry",
  5: "police",
  6: "scrapcenter",
  7: "kteo",
};

const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("none");
  const [isCollaborator, setIsCollaborator] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        console.warn("🦊 MetaMask not found.");
        return;
      }

      try {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);

        const signer = ethProvider.getSigner();
        setSigner(signer);

        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        const contract = new ethers.Contract(rbacAddress, RBAC.abi, signer); // ✅ σωστό εδώ
        const rawRole = await contract.getRole(userAddress);

        console.log("🔍 getRole → raw value:", rawRole.toString());

        const parsedRole = roleMap[parseInt(rawRole)] || "none";
        setRole(parsedRole);

        if (parsedRole !== "none" && parsedRole !== "owner") {
          setIsCollaborator(true);
        }

      } catch (error) {
        console.error("❌ Error during wallet init:", error);
      }
    };

    init();
  }, []);

  return { provider, signer, account, role, isCollaborator };
};

export default useWallet;
