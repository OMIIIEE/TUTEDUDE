import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  fetchRecommendations,
  fetchPendingRequests,
  acceptRequest,
  rejectRequest,
} from "../features/friends/friendsSlice"; // Ensure these actions are defined in your slice
import axios from "../api/auth";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

const Friends = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFriends, setShowFriends] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const itemsPerPage = 5;

  const { friends, recommendations, pendingRequests, loading, error } =
    useSelector((state) => state.friends);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchRecommendations());
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post("/handle-request", {
        fromUserId: requestId,
        action: "accept",
      });
      dispatch(acceptRequest({ fromUserId: requestId }));
      alert("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.post("/handle-request", {
        fromUserId: requestId,
        action: "reject",
      });
      dispatch(rejectRequest(requestId));
      alert("Friend request rejected!");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loader
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  // Error
  if (error)
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  // Pagination logic
  const getPaginatedItems = (items) =>
    items
      .filter((item) =>
        `${item.fullname.firstname} ${item.fullname.lastname}`
          .toLowerCase()
          .includes(searchQuery)
      )
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentFriends = getPaginatedItems(friends);
  const currentRequests = getPaginatedItems(pendingRequests);
  const currentRecommendations = getPaginatedItems(recommendations);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Friends, Requests, or Recommendations"
          className="p-2 border border-gray-300 rounded-lg w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-6">
        {/* Friends List Section */}
        <div>
          <button
            className="w-full flex justify-between items-center text-xl font-semibold text-gray-800 bg-gray-200 py-2 px-4 rounded-lg"
            onClick={() => setShowFriends(!showFriends)}
          >
            {showFriends ? "Hide Friends List" : "Show Friends List"}
            {showFriends ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-500" />
            )}
          </button>
          {showFriends && (
            <div className="mt-4 bg-white shadow rounded-lg p-4">
              {currentFriends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <span className="font-medium">{friend.fullname.firstname}</span>{" "}
                    <span>{friend.fullname.lastname}</span>
                    <p className="text-sm text-gray-500">@{friend.username}</p>
                  </div>
                </div>
              ))}
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
                  disabled={currentFriends.length < itemsPerPage}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pending Requests Section */}
        <div>
          <button
            className="w-full flex justify-between items-center text-xl font-semibold text-gray-800 bg-gray-200 py-2 px-4 rounded-lg"
            onClick={() => setShowRequests(!showRequests)}
          >
            {showRequests ? "Hide Pending Requests" : "Show Pending Requests"}
            {showRequests ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-500" />
            )}
          </button>
          {showRequests && (
            <div className="mt-4 bg-white shadow rounded-lg p-4">
              {currentRequests.length === 0 ? (
                <p className="text-center text-gray-500">No pending requests.</p>
              ) : (
                currentRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <span className="font-medium">{request.fullname.firstname}</span>{" "}
                      <span>{request.fullname.lastname}</span>
                      <p className="text-sm text-gray-500">@{request.username}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Friend Recommendations Section */}
        <div>
          <button
            className="w-full flex justify-between items-center text-xl font-semibold text-gray-800 bg-gray-200 py-2 px-4 rounded-lg"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            {showRecommendations
              ? "Hide Recommendations"
              : "Show Recommendations"}
            {showRecommendations ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-500" />
            )}
          </button>
          {showRecommendations && (
            <div className="mt-4 bg-white shadow rounded-lg p-4">
              {currentRecommendations.map((recommendation) => (
                <div
                  key={recommendation._id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <span className="font-medium">{recommendation.fullname.firstname}</span>{" "}
                    <span>{recommendation.fullname.lastname}</span>
                    <p className="text-sm text-gray-500">@{recommendation.username}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
