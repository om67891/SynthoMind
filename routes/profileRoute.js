const express = require('express');
const router = express.Router();
const { userInfo } = require('../database/schema');
const sendOtpEmail = require('../utils/otp');
const bcrypt = require('bcrypt');



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
