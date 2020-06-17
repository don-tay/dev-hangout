const express = require('express');
const router = express.Router();

// Import specific api routes
const auth = require('./auth');
const posts = require('./posts');
const profile = require('./profile');
const users = require('./users');

router.use('/auth', auth);
router.use('/posts', posts);
router.use('/profile', profile);
router.use('/users', users);

module.exports = router;
