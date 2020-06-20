const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { auth } = require('../../middleware/auth');
const {
  getProfile,
  getProfiles,
  getLoggedInProfile,
  createProfile,
  updateProfile
} = require('../../controllers/profile');

router
  .route('/')
  .get(getProfiles)
  .post(
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty()
    ],
    createProfile
  );

router
  .route('/:id')
  .get(getProfile)
  .put(
    auth,
    [
      check('status', 'Status is required').optional().not().isEmpty(),
      check('skills', 'Skills is required').optional().not().isEmpty()
    ],
    updateProfile
  );

router.get('/me', auth, getLoggedInProfile);

module.exports = router;
