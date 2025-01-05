import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  fetchRecommendations,
  fetchPendingRequests,
  acceptRequest,
  rejectRequest,
} from "../features/friends/friendsSlice";
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );

  if (error)
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-blue-100 to-indigo-200 rounded-xl shadow-lg">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Friends, Requests, or Recommendations"
          className="p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>

      {/* Vertical Stack of Sections */}
      <div className="space-y-8">
        {/* Friends List Section */}
        <div>
          <button
            className="w-full flex justify-between items-center text-2xl font-semibold text-indigo-800 bg-indigo-100 py-3 px-6 rounded-lg hover:bg-indigo-200 transition duration-300"
            onClick={() => setShowFriends(!showFriends)}
          >
            {showFriends ? "Hide Friends List" : "Show Friends List"}
            {showFriends ? (
              <ChevronUpIcon className="h-6 w-6 text-indigo-500" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-indigo-500" />
            )}
          </button>
          {showFriends && (
            <div className="mt-4 bg-white shadow-lg rounded-lg p-6">
              {currentFriends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex justify-between items-center py-4 border-b border-gray-200"
                >
                  <div>
                    <span className="font-semibold text-indigo-800">{friend.fullname.firstname}</span>{" "}
                    <span className="text-indigo-600">{friend.fullname.lastname}</span>
                    <p className="text-sm text-gray-500">@{friend.username}</p>
                  </div>
                </div>
              ))}
              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="px-6 py-2 mx-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="px-6 py-2 mx-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
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
            className="w-full flex justify-between items-center text-2xl font-semibold text-red-800 bg-red-100 py-3 px-6 rounded-lg hover:bg-red-200 transition duration-300"
            onClick={() => setShowRequests(!showRequests)}
          >
            {showRequests ? "Hide Pending Requests" : "Show Pending Requests"}
            {showRequests ? (
              <ChevronUpIcon className="h-6 w-6 text-red-500" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-red-500" />
            )}
          </button>
          {showRequests && (
            <div className="mt-4 bg-white shadow-lg rounded-lg p-6">
              {currentRequests.length === 0 ? (
                <p className="text-center text-gray-500">No pending requests.</p>
              ) : (
                currentRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex justify-between items-center py-4 border-b border-gray-200"
                  >
                    <div>
                      <span className="font-semibold text-indigo-800">{request.fullname.firstname}</span>{" "}
                      <span className="text-indigo-600">{request.fullname.lastname}</span>
                      <p className="text-sm text-gray-500">@{request.username}</p>
                    </div>
                    <div className="space-x-4">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
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
            className="w-full flex justify-between items-center text-2xl font-semibold text-green-800 bg-green-100 py-3 px-6 rounded-lg hover:bg-green-200 transition duration-300"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            {showRecommendations
              ? "Hide Recommendations"
              : "Show Recommendations"}
            {showRecommendations ? (
              <ChevronUpIcon className="h-6 w-6 text-green-500" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-green-500" />
            )}
          </button>
          {showRecommendations && (
            <div className="mt-4 bg-white shadow-lg rounded-lg p-6">
              {currentRecommendations.map((recommendation) => (
                <div
                  key={recommendation._id}
                  className="flex justify-between items-center py-4 border-b border-gray-200"
                >
                  <div>
                    <span className="font-semibold text-indigo-800">{recommendation.fullname.firstname}</span>{" "}
                    <span className="text-indigo-600">{recommendation.fullname.lastname}</span>
                    <p className="text-sm text-gray-500">@{recommendation.username}</p>
                  </div>
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
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
