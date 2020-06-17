const express = require('express');
const router = express.Router();

const { auth } = require('../../middleware/auth');
const { getLoggedInUser } = require('../../controllers/auth');

router.get('/', auth, getLoggedInUser);

module.exports = router;
