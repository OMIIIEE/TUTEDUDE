
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
const registerUser = async (req, res) => {
  const { fullname, username, email, password, gender } = req.body;

  try {
    // Check if email or username already exists
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const user = await User.create({
      fullname,
      username,
      email,
      password,
      gender,
    });

    res.status(201).json({
      _id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      gender: user.gender,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      _id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      gender: user.gender,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send Friend Request
const sendFriendRequest = async (req, res) => {
  const { toUserId } = req.body;

  try {
    const fromUser = await User.findById(req.user.id);
    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends or request exists
    if (toUser.friends.includes(fromUser.id)) {
      return res.status(400).json({ message: "Already friends" });
    }
    if (toUser.friendRequests.includes(fromUser.id)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    toUser.friendRequests.push(fromUser.id);
    await toUser.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept/Reject Friend Request

const handleFriendRequest = async (req, res) => {
  const { fromUserId, action } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const fromUser = await User.findById(fromUserId);

    if (!fromUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ message: "No such friend request" });
    }

    // Accept Request
    if (action === "accept") {
      user.friends.push(fromUserId);  // Add fromUser to user.friends
      fromUser.friends.push(user.id);  // Add user to fromUser.friends
    }

    // Remove Request
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== fromUserId
    );

    await user.save(); // Save user with updated friends and friendRequests
    await fromUser.save(); // Save fromUser with updated friends

    res.status(200).json({ message: `Friend request ${action}ed` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Friends List
const getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "fullname username"
    );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Users
const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      $or: [
        { "fullname.firstname": { $regex: query, $options: "i" } },
        { "fullname.lastname": { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("fullname username email");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recommendFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends");
    const allUsers = await User.find({ _id: { $ne: req.user.id } });

    // Filter users who are not already friends
    const recommendations = allUsers.filter(
      (u) => !user.friends.includes(u.id) && !user.friendRequests.includes(u.id)
    );

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("fullname username email gender");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Pending Friend Requests
const getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Find the logged-in user

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find users who have sent friend requests to the logged-in user
    const pendingRequests = await User.find({
      _id: { $in: user.friendRequests }, // Only find users who are in the friendRequests array of the logged-in user
    }).select("fullname username email gender");

    if (pendingRequests.length === 0) {
      return res.status(200).json({ message: "No pending requests" });
    }

    res.status(200).json(pendingRequests); // Return the list of users who have pending requests
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendFriendRequest,
  handleFriendRequest,
  getFriendsList,
  searchUsers,
  recommendFriends,
  getAllUsers,
  getPendingRequests,
};
