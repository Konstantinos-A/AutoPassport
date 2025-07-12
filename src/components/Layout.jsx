import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children, role, account }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">🚘 AutoPassport</h1>
          <div className="text-sm text-gray-600">
            Συνδεδεμένος:{" "}
            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
