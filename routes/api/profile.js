const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { auth } = require('../../middleware/auth');
const {
  getProfile,
  getProfiles,
  getLoggedInProfile,
  getGithubRepo,
  createProfile,
  addLoggedInUserExp,
  addLoggedInUserEdu,
  updateProfile,
  updateLoggedInUserExp,
  updateLoggedInUserEdu,
  deleteLoggedInProfile,
  deleteLoggedInUserExp,
  deleteLoggedInUserEdu
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
  .route('/experience')
  .post(
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is requried').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty()
    ],
    addLoggedInUserExp
  );

router
  .route('/education')
  .post(
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is requried').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty()
    ],
    addLoggedInUserEdu
  );

router
  .route('/experience/:exp_id')
  .put(
    auth,
    [
      check('title', 'Title is required').optional().not().isEmpty(),
      check('company', 'Company is required').optional().not().isEmpty(),
      check('from', 'From is required').optional().not().isEmpty(),
      check('location', 'Location is required').optional().not().isEmpty()
    ],
    updateLoggedInUserExp
  )
  .delete(auth, deleteLoggedInUserExp);

router
  .route('/education/:edu_id')
  .put(
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is requried').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty()
    ],
    updateLoggedInUserEdu
  )
  .delete(auth, deleteLoggedInUserEdu);

router
  .route('/me')
  .get(auth, getLoggedInProfile)
  .put(
    auth,
    [
      check('status', 'Status is required').optional().not().isEmpty(),
      check('skills', 'Skills is required').optional().not().isEmpty()
    ],
    updateProfile
  )
  .delete(auth, deleteLoggedInProfile);

router.route('/github/:username').get(getGithubRepo);

router.route('/:id').get(getProfile);

module.exports = router;
