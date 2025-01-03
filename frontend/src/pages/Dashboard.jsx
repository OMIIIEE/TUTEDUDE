import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import axios from "../api/auth"; // Ensure axios instance is set up for API requests
import { FaHome, FaUserFriends, FaStar, FaSignOutAlt } from "react-icons/fa"; // Importing icons

const Dashboard = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const { token, user } = useSelector((state) => state.auth); // Access the logged-in user's data

  // Fetch users from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/"); // Modify this URL to get all users
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]); // Runs when the token is available

  // Handle friend request button click
  const handleSendRequest = async (userId) => {
    try {
      await axios.post(`/friend-request`, { toUserId: userId }); // Modify URL to send friend request
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  return (
    <div className="flex h-screen">
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
          <li>
            <Link
              to="/recommendations"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaStar className="mr-3" />
              Recommendations
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

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        {/* Displaying the name of the logged-in user */}
        <h1 className="mb-4 text-3xl font-semibold text-gray-800">
          Welcome, {user?.fullname?.firstname || "User"}!
        </h1>

        {/* User Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border-b text-xl">First Name</th>
                <th className="px-4 py-2 border-b text-xl">Last Name</th>
                <th className="px-4 py-2 border-b text-xl">Username</th>
                <th className="px-4 py-2 border-b text-xl">Email</th>
                <th className="px-4 py-2 border-b text-xl">Gender</th>
                <th className="px-4 py-2 border-b text-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-4 py-2 border-b">{user.fullname.firstname}</td>
                  <td className="px-4 py-2 border-b">{user.fullname.lastname}</td>
                  <td className="px-4 py-2 border-b">{user.username}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.gender}</td>
                  <td className="px-4 py-2 border-b">
                    <Button
                      onClick={() => handleSendRequest(user._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      Send Friend Request
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;