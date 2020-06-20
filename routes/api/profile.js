const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { auth } = require('../../middleware/auth');
const {
  getProfile,
  getLoggedInProfile,
  createProfile,
  updateProfile
} = require('../../controllers/profile');

router.get('/', getProfile);
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

router.put(
  '/:id',
  auth,
  [
    check('status', 'Status is required').optional().not().isEmpty(),
    check('skills', 'Skills is required').optional().not().isEmpty()
  ],
  updateProfile
);
module.exports = router;
