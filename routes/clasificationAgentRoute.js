const express = require('express');
const router = express.Router();
// const { chatHistory } = require('./database'); // your MongoDB schema
const { classifyJournalEntry, getFollowUpQuestion } = require('../aiAgents/clasificationAgent');

router.post('/api/journal', async (req, res) => {
  try {
    const { userEmail, journalEntry } = req.body;
    // const { journalEntry } = req.body;
    console.log("journalEntry: ", journalEntry);
    // // Step 1: Check session for existing chatId
    // let chat;
    // if (req.session.chatId) {
    //   chat = await chatHistory.findById(req.session.chatId);
    // }

    // // Step 2: If no chat in session, create new chat
    // if (!chat) {
    //   chat = new chatHistory({
    //     userEmail,
    //     userChat: [],
    //     levelWisePossiblity: [],
    //     isLevleDetect: false
    //   });
    //   await chat.save();
    //   // Store chatId in session
    //   req.session.chatId = chat._id;
    // }

    // Step 3: Call OpenAI classification
    const probabilities = await classifyJournalEntry(journalEntry);
    console.log(probabilities);

    // chat.userChat.push({ userRequest: journalEntry, modelResponse: "Analyzing..." });
    // chat.levelWisePossiblity.push(probabilities);

    // // Step 4: Check threshold
    // const maxProb = Math.max(...Object.values(probabilities));
    // const threshold = 85;
    // let followUp = null;

    // if (maxProb < threshold) {
    //   followUp = await getFollowUpQuestion(chat.userChat);
    // } else {
    //   chat.isLevleDetect = true;
    //   const detectedLevel = Object.keys(probabilities).reduce((a, b) => probabilities[a] > probabilities[b] ? a : b);
    //   chat.detectLevel = detectedLevel;
    //   chat.userChat.push({ userRequest: "Threshold reached", modelResponse: `Detected most likely level: ${detectedLevel}` });
    // }

    // await chat.save();

    // // Step 5: Send response
    // res.json({
    //   chatId: chat._id,
    //   probabilities,
    //   followUpQuestion: followUp,
    //   thresholdReached: maxProb >= threshold
    // });
    // res.json({})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
