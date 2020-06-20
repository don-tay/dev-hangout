const { validationResult } = require('express-validator');

const config = require('config');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET api/profile/me
// @desc    Get logged in user profile
// @access  Public
exports.getLoggedInProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/profile
// @desc    Create user profile
// @access  Private
exports.createProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // If user profile exist, cannot create another profile
    if (profile) {
      return res.status(400).json('User profile already exists.');
    }

    // Create
    req.body.user = req.user.id;
    profile = await Profile.create(req.body);
    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
