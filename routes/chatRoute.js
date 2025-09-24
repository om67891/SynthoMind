const express = require('express');
const router = express.Router();
const axios = require('axios');
const { sendEmail } = require('../utils/mail');

// Store automated questions from Colab
let automatedQuestions = [];

// Handle incoming chat messages
router.post('/send', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.session.userId;

        // Send message to Colab API
        const response = await axios.post(process.env.COLAB_URL, {
            message,
            userId
        });

        // Extract answer from Colab response
        const { ans } = response.data;

        // Send email notification with the chat interaction
        await sendEmail(
            req.session.email,
            'Chat Interaction Summary',
            `Your message: ${message}\nAI Response: ${ans}`
        );

        res.json({ success: true, answer: ans });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process chat message' 
        });
    }
});

// Endpoint for Colab to send automated questions
router.post('/automated-question', async (req, res) => {
    try {
        const { question } = req.body;
        
        // Store the question
        automatedQuestions.push({
            question,
            timestamp: new Date()
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Automated Question Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to store automated question' 
        });
    }
});

// Endpoint for frontend to fetch automated questions
router.get('/automated-questions', (req, res) => {
    // Return and clear the questions
    const questions = [...automatedQuestions];
    automatedQuestions = [];
    res.json({ success: true, questions });
});

module.exports = router;