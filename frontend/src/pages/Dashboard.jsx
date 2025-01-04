import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import axios from "../api/auth"; // Ensure axios instance is set up for API requests

const Dashboard = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Display only 5 users at a time

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
      await axios.post(`/send-request`, { toUserId: userId }); // Modify URL to send friend request
      console.log("Friend request sent!");
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

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.fullname.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullname.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-3">
        {/* Displaying the name of the logged-in user */}
        <h1 className="mb-4 text-3xl font-semibold text-gray-800">
          Welcome! You can send friend requests to other users
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border-b text-xl">First Name</th>
                <th className="px-4 py-2 border-b text-xl">Last Name</th>
                <th className="px-4 py-2 border-b text-xl">Username</th>
                <th className="px-4 py-2 border-b text-xl">Email</th>
                <th className="px-4 py-2 border-b text-xl">Gender</th>
                <th className="px-4 py-2 border-b text-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
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

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-4 py-2 mx-1 bg-gray-300 rounded-lg"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-4 py-2 mx-1 bg-gray-300 rounded-lg"
              disabled={currentPage * usersPerPage >= filteredUsers.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
