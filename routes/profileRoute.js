const express = require('express');
const router = express.Router();
const { userInfo } = require('../database/schema');
const sendOtpEmail = require('../utils/otp');
const bcrypt = require('bcrypt');



router.get('/', (req, res)=>{
  res.render('profile');
});





module.exports = router;
