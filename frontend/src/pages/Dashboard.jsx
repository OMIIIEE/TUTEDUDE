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
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]); // Track sent requests
  const usersPerPage = 5;

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/"); 
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleSendRequest = async (userId) => {
    try {
      await axios.post(`/send-request`, { toUserId: userId });
      setSentRequests((prev) => [...prev, userId]); // Add to sent requests list
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleCancelRequest = async (userId) => {
    try {
      await axios.post(`/cancel-request`, { toUserId: userId }); // Endpoint to cancel request
      setSentRequests((prev) => prev.filter((id) => id !== userId)); // Remove from sent requests list
      alert("Friend request canceled!");
    } catch (error) {
      console.error("Error canceling friend request:", error);
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
      <div className="p-6 bg-white shadow-md rounded-lg mx-4 mt-6 mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">User Dashboard</h1>
        <div className="mt-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={() => setSearchQuery("")}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Responsive User List/Table */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Table for large screens */}
            <table className="hidden lg:table w-full bg-white shadow-lg rounded-lg">
              <thead className="bg-gray-200 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-3">First Name</th>
                  <th className="px-6 py-3">Last Name</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{user.fullname.firstname}</td>
                    <td className="px-6 py-4">{user.fullname.lastname}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      {sentRequests.includes(user._id) ? (
                        <Button
                          onClick={() => handleCancelRequest(user._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Cancel Request
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSendRequest(user._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Send Request
                        </Button>
                      )}
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
                  className="bg-white shadow-lg p-4 rounded-lg flex flex-col space-y-2"
                >
                  <span className="font-semibold text-lg">
                    {user.fullname.firstname} {user.fullname.lastname}
                  </span>
                  <span className="text-gray-500">@{user.username}</span>
                  <span className="text-gray-400">{user.email}</span>
                  {sentRequests.includes(user._id) ? (
                    <Button
                      onClick={() => handleCancelRequest(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel Request
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSendRequest(user._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Send Request
                    </Button>
                  )}
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-3">
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-sm disabled:opacity-50"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-sm disabled:opacity-50"
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
