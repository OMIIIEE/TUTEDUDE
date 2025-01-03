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
    dispatch(acceptRequest(requestId)); // Accept the request
    alert("Friend request accepted!");
  };

  // Handle rejecting a friend request
  const handleRejectRequest = (requestId) => {
    dispatch(rejectRequest(requestId)); // Reject the request
    alert("Friend request rejected!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Friends List</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.fullname.firstname} {friend.fullname.lastname}</li> // Display friend names
        ))}
      </ul>

      <h2>Pending Friend Requests</h2>
      <ul>
        {pendingRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          pendingRequests.map((request) => (
            <li key={request._id}>
              {request.fullname.firstname} {request.fullname.lastname} - Pending
              <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
              <button onClick={() => handleRejectRequest(request._id)}>Reject</button>
            </li>
          ))
        )}
      </ul>

      <h2>Friend Recommendations</h2>
      <ul>
        {recommendations.map((recommendation) => (
          <li key={recommendation.id}>{recommendation.fullname.firstname} {recommendation.fullname.lastname}</li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
