const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: "*", // The frontend URL
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  preflightContinue: false, // Ensures that OPTIONS request is handled automatically
  optionsSuccessStatus: 204, // Some legacy browsers (IE11) choke on 204
};

// Enable CORS middleware with the options
app.use(cors(corsOptions));

// API routes
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("API is running...");
});
