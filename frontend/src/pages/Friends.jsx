import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, fetchRecommendations, fetchPendingRequests, acceptRequest, rejectRequest } from "../features/friends/friendsSlice"; // Assuming these actions are defined in your slice

const Friends = () => {
  const dispatch = useDispatch();
  const { friends, recommendations, pendingRequests, loading, error } = useSelector(
    (state) => state.friends
  );

  useEffect(() => {
    dispatch(fetchFriends());  // Fetch friends when the component mounts
    dispatch(fetchRecommendations());  // Fetch recommendations when the component mounts
    dispatch(fetchPendingRequests());  // Fetch pending friend requests when the component mounts
  }, [dispatch]);

  // Handle accepting a friend request
  const handleAcceptRequest = (requestId) => {
    dispatch(acceptRequest({ fromUserId: requestId })); // Dispatch the accept action
    alert("Friend request accepted!");
  };

  // Handle rejecting a friend request
  const handleRejectRequest = (requestId) => {
    dispatch(rejectRequest(requestId)); // Reject the request
    alert("Friend request rejected!");
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Friends List Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friends List</h2>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li key={friend._id} className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">{friend.fullname.firstname} {friend.fullname.lastname}</span>
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
          {pendingRequests.length === 0 ? (
            <p className="text-center text-gray-500">No pending requests.</p>
          ) : (
            <ul className="space-y-4">
              {pendingRequests.map((request) => (
                <li key={request._id} className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium">{request.fullname.firstname} {request.fullname.lastname}</span>
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
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Friend Recommendations Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friend Recommendations</h2>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <ul className="space-y-4">
            {recommendations.map((recommendation) => (
              <li key={recommendation._id} className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">{recommendation.fullname.firstname} {recommendation.fullname.lastname}</span>
                  <span className="text-sm text-gray-500">@{recommendation.username}</span>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Add Friend
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Friends;
