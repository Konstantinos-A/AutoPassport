import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Car } from 'lucide-react'; // Lucide icons

function Navbar({ address }) {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold flex items-center space-x-2">
          <Car className="w-5 h-5 text-white" />
          <span>AutoPassport dApp</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/upload" className="hover:underline">Upload</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/access" className="hover:underline">Access</Link>
          {address && (
            <span className="flex items-center space-x-2 bg-white text-blue-700 text-sm px-3 py-1 rounded-full font-mono shadow">
              <Wallet className="w-4 h-4" />
              <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;