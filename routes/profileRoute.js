const express = require('express');
const router = express.Router();
const { userInfo } = require('../database/schema');
const sendOtpEmail = require('../utils/otp');
const bcrypt = require('bcrypt');

// Update emergency contacts
router.post('/update-emergency-contacts', async (req, res) => {
    try {
        const userEmail = req.session?.user?.email;
        if (!userEmail) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const { contacts } = req.body;
        
        // Validate contacts
        if (!Array.isArray(contacts)) {
            return res.status(400).json({ success: false, error: 'Invalid contacts format' });
        }

        // Validate and format each contact
        const formattedContacts = contacts.map(contact => ({
            name: String(contact.name).trim(),
            phone: String(contact.phone).trim(),
            relation: String(contact.relation).trim(),
            email: String(contact.email).trim().toLowerCase(),
            lastUpdated: new Date()
        }));

        // Validate required fields
        const invalidContact = formattedContacts.find(contact => 
            !contact.name || !contact.phone || !contact.relation || !contact.email
        );

        if (invalidContact) {
            return res.status(400).json({
                success: false,
                error: 'Each contact must have name, phone, relation, and email'
            });
        }

        // Update in database
        const updatedUser = await userInfo.findOneAndUpdate(
            { email: userEmail },
            { 
                $set: { 
                    userParentInfo: formattedContacts,
                    lastUpdated: new Date()
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Send email notifications to emergency contacts
        for (const contact of formattedContacts) {
            try {
                await sendOtpEmail(contact.email, 'Emergency Contact Update', `
                    You have been added/updated as an emergency contact for ${updatedUser.name}.
                    Your details:
                    - Relation: ${contact.relation}
                    - Phone: ${contact.phone}
                    
                    If you believe this was done in error, please contact the user.
                `);
            } catch (error) {
                console.error('Failed to send email to emergency contact:', error);
            }
        }

        res.json({
            success: true,
            message: 'Emergency contacts updated successfully',
            contacts: updatedUser.userParentInfo
        });

    } catch (error) {
        console.error('Error updating emergency contacts:', error);
        res.status(500).json({ success: false, error: 'Failed to update emergency contacts' });
    }
});

// Get emergency contacts
router.get('/emergency-contacts', async (req, res) => {
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

router.get('/', async (req, res) => {
  try {
    // You should have user info in session after login, e.g. req.session.user.email
    const userEmail = req.session?.user?.email;
    if (!userEmail) {
      return res.redirect('/auth/login');
    }
    const user = await userInfo.findOne({ email: userEmail });
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render('Profile', { user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).send('Server error');
  }
});





module.exports = router;
