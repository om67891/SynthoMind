const express = require('express');
const router = express.Router();

// GET /policy
router.get('/', (req, res) => {
    res.render('Policy');
});

module.exports = router;
