import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  FilePlus,
  Repeat,
  ShieldCheck,
  AlertCircle,
  Trash2,
  History,
  LayoutDashboard,
  UserCog,
  FolderCog
} from 'lucide-react';

function Sidebar({ role }) {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">AutoPassport</div>
      <nav className="flex flex-col space-y-2 p-4">
        <NavLink to="/lookup" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <span>Αναζήτηση</span>
        </NavLink>

        {role === "Service" && (
          <>
            <NavLink to="/register" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <FilePlus className="w-4 h-4" />
              <span>Καταχώρηση Οχήματος</span>
            </NavLink>
            <NavLink to="/transfer" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <Repeat className="w-4 h-4" />
              <span>Μεταβίβαση</span>
            </NavLink>
          </>
        )}

        {role === "Insurance" && (
          <NavLink to="/insurance" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Ασφάλιση</span>
          </NavLink>
        )}

        {role === "Police" && (
          <NavLink to="/accident" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Ατύχημα</span>
          </NavLink>
        )}

        {role === "ScrapCenter" && (
          <NavLink to="/retire" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Απόσυρση</span>
          </NavLink>
        )}

        {role === "KTEO" && (
          <NavLink to="/history" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>Ιστορικό</span>
          </NavLink>
        )}

        {role === "Ministry" && (
          <>
            <NavLink to="/dashboard" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/roles" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <UserCog className="w-4 h-4" />
              <span>Διαχείριση Ρόλων</span>
            </NavLink>
            <NavLink to="/access" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <FolderCog className="w-4 h-4" />
              <span>Πρόσβαση</span>
            </NavLink>
            <NavLink to="/register" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <FilePlus className="w-4 h-4" />
              <span>Καταχώρηση</span>
            </NavLink>
            <NavLink to="/transfer" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <Repeat className="w-4 h-4" />
              <span>Μεταβίβαση</span>
            </NavLink>
            <NavLink to="/insurance" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Ασφάλιση</span>
            </NavLink>
            <NavLink to="/accident" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Ατύχημα</span>
            </NavLink>
            <NavLink to="/retire" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Απόσυρση</span>
            </NavLink>
            <NavLink to="/history" className="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>Ιστορικό</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
