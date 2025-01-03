import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/friends";  // Make sure axios is correctly configured with the correct baseURL

// Initial state
const initialState = {
  friends: [],
  recommendations: [],
  pendingRequests: [],  // New state for pending requests
  loading: false,
  error: null,
};

// Fetch friends list
export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/friends");  // Ensure the endpoint is correct
      return response.data;
    } catch (error) {
      // Improved error handling
      const errorMsg = error.response ? error.response.data.message : 'An error occurred while fetching friends.';
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Fetch friend recommendations
export const fetchRecommendations = createAsyncThunk(
  "friends/fetchRecommendations",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/recommendations");  // Ensure the endpoint is correct
      return response.data;
    } catch (error) {
      // Improved error handling
      const errorMsg = error.response ? error.response.data.message : 'An error occurred while fetching recommendations.';
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Fetch pending friend requests
export const fetchPendingRequests = createAsyncThunk(
  "friends/fetchPendingRequests",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/getPendingRequests");  // Adjust endpoint as needed
      return response.data;  // Return the pending requests data
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : 'An error occurred while fetching pending requests.';
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend: (state, action) => {
      // Adds a new friend to the state
      state.friends.push(action.payload);
    },
    removeFriend: (state, action) => {
      // Removes a friend by id
      state.friends = state.friends.filter(friend => friend.id !== action.payload);
    },
    // Action to accept a friend request
    acceptRequest: (state, action) => {
      // Remove from pending and add to friends
      const acceptedRequest = state.pendingRequests.find(request => request.id === action.payload);
      if (acceptedRequest) {
        state.friends.push(acceptedRequest);
        state.pendingRequests = state.pendingRequests.filter(request => request.id !== action.payload);
      }
    },
    // Action to reject a friend request
    rejectRequest: (state, action) => {
      // Remove the request from pending
      state.pendingRequests = state.pendingRequests.filter(request => request.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending, fulfilled, and rejected states for fetchFriends
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;  // Store the friends in the state
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Store the error message in the state
      })
      // Handle the pending, fulfilled, and rejected states for fetchRecommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;  // Store the recommendations in the state
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Store the error message in the state
      })
      // Handle the pending, fulfilled, and rejected states for fetchPendingRequests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;  // Store the pending requests in the state
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Store the error message in the state
      });
  },
});

export const { addFriend, removeFriend, acceptRequest, rejectRequest } = friendsSlice.actions;
export default friendsSlice.reducer;
