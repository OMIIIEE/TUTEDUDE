import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import axios from "../api/auth";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state
  const usersPerPage = 5;

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("/"); // Replace with your API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleSendRequest = async (userId) => {
    try {
      await axios.post(`/send-request`, { toUserId: userId });
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullname.firstname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.fullname.lastname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white shadow">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 mt-4 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Responsive User List/Table */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          // Loader Component
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Table for large screens */}
            <table className="hidden lg:table w-full bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">First Name</th>
                  <th className="px-4 py-2">Last Name</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{user.fullname.firstname}</td>
                    <td className="px-4 py-2">{user.fullname.lastname}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <Button
                        onClick={() => handleSendRequest(user._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Send Request
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* List for small screens */}
            <ul className="block lg:hidden space-y-4">
              {currentUsers.map((user) => (
                <li
                  key={user._id}
                  className="bg-white shadow p-4 rounded-lg flex flex-col space-y-2"
                >
                  <span className="font-semibold">
                    {user.fullname.firstname} {user.fullname.lastname}
                  </span>
                  <span className="text-gray-600">@{user.username}</span>
                  <span className="text-gray-500">{user.email}</span>
                  <Button
                    onClick={() => handleSendRequest(user._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Send Request
                  </Button>
                </li>
              ))}
            </ul>

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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
