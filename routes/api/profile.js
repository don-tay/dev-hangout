const express = require('express');
const router = express.Router();

const { auth } = require('../../middleware/auth');
const { getLoggedInProfile } = require('../../controllers/profile');

router.get('/me', auth, getLoggedInProfile);

module.exports = router;
