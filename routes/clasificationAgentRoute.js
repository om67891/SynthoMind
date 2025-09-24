const express = require('express');
const router = express.Router();
// const { chatHistory } = require('./database'); // your MongoDB schema
const { classifyJournalEntry, getFollowUpQuestion } = require('../aiAgents/clasificationAgent');



router.post('/api/journal', async (req, res) => {
  try {
    const { userEmail, journalEntry } = req.body;
    console.log("journalEntry: ", journalEntry);

    // Call Gemini classification
    const probabilities = await classifyJournalEntry(journalEntry);

    if (!probabilities) {
      return res.status(500).json({ error: "Classification failed" });
    }

    // ✅ Send simple response for now
    res.json({
      userEmail,
      journalEntry,
      probabilities
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
