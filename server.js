const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./database/db");

const session = require("express-session");
const MongoStore = require("connect-mongo"); 

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const classificationRoutes = require("./routes/clasificationAgentRoute");
app.use("/classification", classificationRoutes);


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

// Middleware
app.use(cors());
app.use(express.json());



// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});