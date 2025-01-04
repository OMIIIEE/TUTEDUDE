import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  fetchRecommendations,
  fetchPendingRequests,
  acceptRequest,
  rejectRequest,
} from "../features/friends/friendsSlice"; // Assuming these actions are defined in your slice
import axios from "../api/auth"; // Ensure the axios instance is set up for API requests

const Friends = ({ user }) => {
  const dispatch = useDispatch();

  // Local state for pagination and search query
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const { friends, recommendations, pendingRequests, loading, error } =
    useSelector((state) => state.friends);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchRecommendations());
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  // Handle accepting a friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.post("/handle-request", {
        fromUserId: requestId,
        action: "accept", // Accept action
      });

      dispatch(acceptRequest({ fromUserId: requestId }));
      alert("Friend request accepted!");
      console.log(response.data);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Handle rejecting a friend request
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.post("/handle-request", {
        fromUserId: requestId,
        action: "reject", // Reject action
      });

      dispatch(rejectRequest(requestId));
      alert("Friend request rejected!");
      console.log(response.data);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  // Pagination logic
  const indexOfLastFriend = currentPage * itemsPerPage;
  const indexOfFirstFriend = indexOfLastFriend - itemsPerPage;
  const currentFriends = friends
    .filter((friend) =>
      `${friend.fullname.firstname} ${friend.fullname.lastname}`
        .toLowerCase()
        .includes(searchQuery)
    )
    .slice(indexOfFirstFriend, indexOfLastFriend);

  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = pendingRequests
    .filter((request) =>
      `${request.fullname.firstname} ${request.fullname.lastname}`
        .toLowerCase()
        .includes(searchQuery)
    )
    .slice(indexOfFirstRequest, indexOfLastRequest);

  const indexOfLastRecommendation = currentPage * itemsPerPage;
  const indexOfFirstRecommendation =
    indexOfLastRecommendation - itemsPerPage;
  const currentRecommendations = recommendations
    .filter((recommendation) =>
      `${recommendation.fullname.firstname} ${recommendation.fullname.lastname}`
        .toLowerCase()
        .includes(searchQuery)
    )
    .slice(indexOfFirstRecommendation, indexOfLastRecommendation);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Friends, Requests, or Recommendations"
          className="p-2 border border-gray-300 rounded-lg w-full"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Friends List Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friends List</h2>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <ul className="space-y-4">
            {currentFriends.map((friend) => (
              <li key={friend._id} className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">
                    {friend.fullname.firstname} {friend.fullname.lastname}
                  </span>
                  <span className="text-sm text-gray-500">@{friend.username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pending Requests Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Friend Requests</h2>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          {currentRequests.length === 0 ? (
            <p className="text-center text-gray-500">No pending requests.</p>
          ) : (
            currentRequests.map((request) => (
              <li key={request._id} className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">
                    {request.fullname.firstname} {request.fullname.lastname}
                  </span>
                  <span className="text-sm text-gray-500">@{request.username}</span>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))
          )}
        </div>
      </div>

      {/* Friend Recommendations Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friend Recommendations</h2>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <ul className="space-y-4">
            {currentRecommendations.map((recommendation) => (
              <li key={recommendation._id} className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">
                    {recommendation.fullname.firstname} {recommendation.fullname.lastname}
                  </span>
                  <span className="text-sm text-gray-500">@{recommendation.username}</span>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Add Friend
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pagination Buttons */}
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
          disabled={currentPage * itemsPerPage >= friends.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Friends;
