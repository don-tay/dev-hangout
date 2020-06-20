const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { auth } = require('../../middleware/auth');
const {
  getLoggedInProfile,
  createProfile
} = require('../../controllers/profile');

router.get('/me', auth, getLoggedInProfile);

router.post(
  '/',
  auth,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ],
  createProfile
);

module.exports = router;
