const express = require("express");
const {
  registerUser,
  loginUser,
  sendFriendRequest,
  handleFriendRequest,
  getFriendsList,
  searchUsers,
  recommendFriends,
  getAllUsers,
  getPendingRequests,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getAllUsers);

// Friend functionality
router.post("/send-request", authMiddleware, sendFriendRequest);
router.post("/handle-request", authMiddleware, handleFriendRequest);
router.get("/friends", authMiddleware, getFriendsList);
router.get("/search", authMiddleware, searchUsers);
router.get('/getPendingRequests', authMiddleware, getPendingRequests);

// Recommendations
router.get("/recommendations", authMiddleware, recommendFriends);

module.exports = router;
