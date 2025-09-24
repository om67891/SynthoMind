const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./database/db");
const session = require("express-session");
const MongoStore = require("connect-mongo"); 
const { OpenAI } = require('openai');

// Initialize Express app first
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Session setup
app.use(session({
  secret: process.env.session_secret_key,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, 
    collectionName: "sessions",      
    ttl: 5 * 24 * 60 * 60            
  }),
  cookie: {
    secure: false, 
    maxAge: 5 * 24 * 60 * 60 * 1000  
  }
}));

// Routes
app.get('/', (req, res) => {
  res.render('langingPage');
});

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);



const classificationRoutes = require("./routes/clasificationAgentRoute");
app.use("/classification", classificationRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
