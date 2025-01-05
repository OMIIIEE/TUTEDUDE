import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden p-4 bg-indigo-600 text-white fixed top-0 left-0 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static z-40`}
      >
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-3xl font-bold text-white mb-8">My App</h2>
          <nav className="space-y-6 w-full">
            <Link
              to="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaHome className="mr-4 text-2xl" />
              <span className="text-lg">Dashboard</span>
            </Link>
            <Link
              to="/friends"
              className="flex items-center p-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaUserFriends className="mr-4 text-2xl" />
              <span className="text-lg">Friends</span>
            </Link>
            <Button
              className="mt-8 w-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2 text-2xl" />
              <span className="text-lg">Logout</span>
            </Button>
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
