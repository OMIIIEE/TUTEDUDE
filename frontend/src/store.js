import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import friendsReducer from './features/friends/friendsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
  },
});

export default store;
