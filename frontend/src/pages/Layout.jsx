// src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUserFriends, FaStar, FaSignOutAlt } from "react-icons/fa";
// import { Button } from "./ui/button"; // Assuming you have this Button component
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 p-6 bg-gray-800 text-white shadow-lg h-full">
        <h2 className="mb-6 text-3xl font-semibold text-center">My App</h2>
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
          {/* <li>
            <Link
              to="/recommendations"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaStar className="mr-3" />
              Recommendations
            </Link>
          </li> */}
        </ul>
        <Button
          className="mt-8 w-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
};

export default Layout;
