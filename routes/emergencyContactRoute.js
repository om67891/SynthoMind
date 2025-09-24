const express = require('express');
const router = express.Router();
const { userInfo } = require('../database/schema');

// Update emergency contacts
router.post('/update-contacts', async (req, res) => {
    try {
        const userEmail = req.session?.user?.email;
        if (!userEmail) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const { contacts } = req.body;
        
        // Validate contacts array
        if (!Array.isArray(contacts)) {
            return res.status(400).json({ success: false, error: 'Invalid contacts format' });
        }

        // Validate each contact
        for (const contact of contacts) {
            if (!contact.name || !contact.phone || !contact.relation || !contact.email) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Each contact must have name, phone, relation, and email' 
                });
            }
        }

        // Update user's emergency contacts
        const result = await userInfo.findOneAndUpdate(
            { email: userEmail },
            { $set: { userParentInfo: contacts } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ 
            success: true, 
            message: 'Emergency contacts updated successfully',
            contacts: result.userParentInfo 
        });
    } catch (error) {
        console.error('Error updating emergency contacts:', error);
        res.status(500).json({ success: false, error: 'Failed to update emergency contacts' });
    }
});

// Get emergency contacts
router.get('/contacts', async (req, res) => {
    try {
        const userEmail = req.session?.user?.email;
        if (!userEmail) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const user = await userInfo.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ 
            success: true, 
            contacts: user.userParentInfo || [] 
        });
    } catch (error) {
        console.error('Error fetching emergency contacts:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch emergency contacts' });
    }
});

module.exports = router;