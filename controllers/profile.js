const { validationResult } = require('express-validator');

const config = require('config');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET api/profile
// @desc    Get all user profile
// @access  Public
exports.getProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/profile/me
// @desc    Get logged in user profile
// @access  Private
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
    console.error(err.message.red);
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
      return res.status(400).json({ msg: 'User profile already exists' });
    }

    req.body.user = req.user.id;
    profile = await Profile.create(req.body);
    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/:id
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let profile = await Profile.findById(req.params.id);

    // If profile with profile id does not exist, cannot update profile
    if (!profile) {
      return res.status(404).json({ msg: 'User profile does not exists' });
    }

    // Check profile found must belong to the user
    if (profile.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'Not authorised to update this user profile' });
    }

    profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
