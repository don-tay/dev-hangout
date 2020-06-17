const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Require controller methods to do route-mapping
const { registerUser } = require('../../controllers/users');

// @route   POST api/users
// @desc    Test route
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  registerUser
);

module.exports = router;
