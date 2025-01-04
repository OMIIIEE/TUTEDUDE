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
        className="lg:hidden p-4 bg-gray-800 text-white fixed top-0 left-0 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static z-40`}
      >
        <h2 className="mb-6 text-3xl font-semibold text-center mt-4">My App</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/friends"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaUserFriends className="mr-3" />
              Friends
            </Link>
          </li>
        </ul>
        <Button
          className="mt-8 w-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </Button>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
