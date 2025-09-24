const express = require('express');
const router = express.Router();
const { userInfo } = require('../database/schema');
const sendOtpEmail = require('../utils/otp');
const bcrypt = require('bcrypt');

// Function to generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, gender, password, phone, email, userParentInfo } = req.body;

        // Check if user already exists
        const existingUser = await userInfo.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new userInfo({
            name,
            gender,
            password: hashedPassword,
            phone,
            email,
            userParentInfo,
            otp,
            otpExpiry,
            isVerified: false
        });

        await user.save();

        // Send OTP email
        await sendOtpEmail(email, otp);

        res.status(201).json({ message: 'Registration successful. Please verify your email with OTP.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user
        const user = await userInfo.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if OTP is expired
        if (Date.now() > user.otpExpiry) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Update user verification status
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: 'Registration completed successfully!' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'OTP verification failed' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userInfo.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ error: 'Please verify your email first' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Create session or JWT token here if needed
        
        res.json({ message: 'Login successful', user: { 
            name: user.name, 
            email: user.email,
            gender: user.gender,
            phone: user.phone
        }});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Resend OTP route
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await userInfo.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        // Update user with new OTP
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send new OTP email
        await sendOtpEmail(email, otp);

        res.json({ message: 'New OTP sent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});

module.exports = router;
