const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { auth } = require('../../middleware/auth');
const { getLoggedInUser, authUser } = require('../../controllers/auth');

router.get('/', auth, getLoggedInUser);

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password').exists(),
  ],
  authUser
);

module.exports = router;
