// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./database/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { OpenAI } = require("openai");
const axios = require("axios");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Session setup
app.use(
  session({
    secret: process.env.session_secret_key,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 5 * 24 * 60 * 60, // 5 days
    }),
    cookie: {
      secure: false, // set true if using HTTPS
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    },
  })
);

// Auth middleware
const { isAuthenticated, isNotAuthenticated } = require("./middleware/auth");

// Routes
app.get("/", isNotAuthenticated, (req, res) => {
  res.render("langingPage");
});

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Home routes
const homeRoutes = require("./routes/homeRoute");
app.use("/home", isAuthenticated, homeRoutes);

<<<<<<< HEAD
// Profile routes
=======





>>>>>>> 77071b212d946c5a43ef14725392e39817381006
const profileRoutes = require("./routes/profileRoute");
const emergencyContactRoutes = require("./routes/emergencyContactRoute");
app.use("/profile", profileRoutes);
app.use("/profile", emergencyContactRoutes);

<<<<<<< HEAD
// Report routes
=======
const policyRoutes = require("./routes/policyRoute");
app.use("/policy", policyRoutes);


>>>>>>> 77071b212d946c5a43ef14725392e39817381006
const reportsRoutes = require("./routes/reportRoute");
app.use("/report", reportsRoutes);

// Classification routes
const classificationRoutes = require("./routes/clasificationAgentRoute");
app.use("/classification", isAuthenticated, classificationRoutes);

// Chat routes
const chatRoutes = require("./routes/chatRoute");
app.use("/api/chat", isAuthenticated, chatRoutes);

// Set Colab URL from environment variable
process.env.COLAB_URL = "https://noncorrupt-peddlingly-mayson.ngrok-free.dev/chat";

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
