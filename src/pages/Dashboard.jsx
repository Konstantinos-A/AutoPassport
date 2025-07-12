import React, { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, ROLE_CONTRACT_ADDRESS } from '../config';
import { ethers } from 'ethers';
import PassportABI from '../AutoPassport.json';
import RBACABI from '../RBACAccessControl.json';
import VehicleDocumentsPanel from './VehicleDocumentsPanel';
import {
  LayoutDashboard,
  ShieldCheck,
  UserCog,
  History,
  Trash2,
  AlertCircle,
  Repeat,
  FolderCog,
  Wallet
} from 'lucide-react';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [account, setAccount] = useState('');
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        const network = await provider.getNetwork();
        if (network.name !== "sepolia") {
          alert("Please switch to Sepolia testnet in MetaMask.");
          return;
        }

        const passportContract = new ethers.Contract(CONTRACT_ADDRESS, PassportABI.abi, provider);
        const rbacContract = new ethers.Contract(ROLE_CONTRACT_ADDRESS, RBACABI.abi, provider);

        const userRole = await rbacContract.getRole(userAddress);
        setRole(userRole.toString());
        console.log("Detected role:", userRole.toString());

        const eventFilter = passportContract.filters.VehicleRegistered();
        const logs = await passportContract.queryFilter(eventFilter, -1000);
        const formattedEvents = logs.map(log => ({
          vin: log.args[0],
          registrar: log.args[1],
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      {/* Header with title and wallet info */}
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </h2>

        <div className="bg-gray-100 text-blue-900 p-3 rounded border shadow font-mono text-sm w-fit space-y-1">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-blue-700" />
            <span>
              <span className="font-semibold">Wallet:</span> {account}
            </span>
          </div>
          {role && (
            <div className="flex items-center space-x-2">
              <UserCog className="w-4 h-4 text-blue-700" />
              <span>
                <span className="font-semibold">Ρόλος:</span> {role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ministry section */}
      {role === '4' && (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded space-y-1">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-800" />
            <span>Επισκόπηση Υπουργείου</span>
          </h3>
          <p className="text-sm text-blue-800">
            Έχετε πρόσβαση σε λειτουργίες εποπτείας και διαχείρισης ρόλων.
          </p>
        </div>
      )}

      {/* Vehicle registrations */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Registered Vehicles</h3>
        {events.length === 0 ? (
          <p>No vehicles registered yet.</p>
        ) : (
          <ul className="list-disc pl-6">
            {events.map((event, index) => (
              <li key={index}>
                VIN: {event.vin}, Registered By: {event.registrar}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <a
          href="/roles"
          className="p-3 rounded shadow border flex items-center space-x-2 text-white hover:opacity-90"
          style={{ backgroundColor: '#044587' }}
        >
          <UserCog className="w-4 h-4" />
          <span>Διαχείριση Ρόλων</span>
        </a>
        <a
          href="/history"
          className="p-3 rounded shadow border flex items-center space-x-2 text-white hover:opacity-90"
          style={{ backgroundColor: '#044587' }}
        >
          <History className="w-4 h-4" />
          <span>Προβολή Ιστορικού</span>
        </a>
        <a
          href="/deregister"
          className="p-3 rounded shadow border flex items-center space-x-2 text-white hover:opacity-90"
          style={{ backgroundColor: '#044587' }}
        >
          <Trash2 className="w-4 h-4" />
          <span>Απόσυρση Οχήματος</span>
        </a>
        <a
          href="/accident"
          className="p-3 rounded shadow border flex items-center space-x-2 text-white hover:opacity-90"
          style={{ backgroundColor: '#044587' }}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Δήλωση Ατυχήματος</span>
        </a>
        <a
          href="/transfer"
          className="p-3 rounded shadow border flex items-center space-x-2 text-white hover:opacity-90"
          style={{ backgroundColor: '#044587' }}
        >
          <Repeat className="w-4 h-4" />
          <span>Μεταβίβαση Οχήματος</span>
        </a>
        <a
          href="/access"
          className="p-3 rounded shadow border flex items-center space-x-2 text-white hover:opacity-90"
          style={{ backgroundColor: '#044587' }}
        >
          <FolderCog className="w-4 h-4" />
          <span>Διαχείριση Πρόσβασης</span>
        </a>
      </div>

      <VehicleDocumentsPanel />
    </div>
  );
}

export default Dashboard;
