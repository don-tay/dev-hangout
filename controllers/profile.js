const request = require('request');
const { validationResult } = require('express-validator');

const config = require('config');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET api/profile
// @desc    Get all user profile
// @access  Public
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/profile/:id
// @desc    Get individual user profile (identified by profile id)
// @access  Public
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', [
      'name',
      'avatar'
    ]);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: `Profile id ${req.params.id} not found` });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message.red);
    if (err.kind === 'ObjectId') {
      return res
        .status(400)
        .json({ msg: `Profile id ${req.params.id} not found` });
    }
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
// @desc    Create user profile (incl. education and experience)
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
    res.status(201).json(profile);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/profile/github/:username
// @desc    Get individual user github repo (identified by github username)
// @access  Public
exports.getGithubRepo = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: `GET`,
      headers: { 'user-agent': 'node.js' }
    };

    // TODO: refactor to axios as request is deprecated.
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found' });
      }
      res.status(200).json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/profile/experience
// @desc    Add experience for logged in user (with existing profile)
// @access  Private (user's own profile only)
exports.addLoggedInUserExp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let profile = await Profile.findOne({ user: req.user.id });

    // Add to start of experience array
    profile.experience.unshift(req.body);

    profile = await profile.save();

    res.status(201).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/profile/education
// @desc    Add education for logged in user (with existing profile)
// @access  Private (user's own profile only)
exports.addLoggedInUserEdu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let profile = await Profile.findOne({ user: req.user.id });

    // Add to start of education array
    profile.education.unshift(req.body);

    profile = await profile.save();

    res.status(201).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/me
// @desc    Update user profile (except education and experience)
// @access  Private (user's own profile only)
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // If profile belonging to user does not exist, cannot update profile
    if (!profile) {
      return res.status(400).json({ msg: 'User profile does not exists' });
    }

    // Check profile found must belong to the user
    if (profile.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'Not authorised to update this user profile' });
    }

    profile = await Profile.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/experience/:exp_id
// @desc    Update logged in user's existing experience (identified by experience id)
// @access  Private (user's own profile only)
exports.updateLoggedInUserExp = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // If profile belonging to user does not exist, cannot update profile
    if (!profile) {
      return res.status(400).json({ msg: 'User profile does not exists' });
    }

    const filter = {
      user: req.user.id,
      experience: { $elemMatch: { _id: req.params.exp_id } }
    };

    profile = await Profile.findOne(filter);

    // If experience with experience id belonging to user does not exist, cannot update this experience entry
    if (!profile) {
      return res.status(400).json({ msg: 'Experience entry does not exists' });
    }

    // TODO: Implement updating of user profile's experience array (currently, req.body keys must be "experience.$.<key>")
    profile = await Profile.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    // console.log(JSON.stringify(profile, null, 2).magenta);

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/profile/education/:edu_id
// @desc    Update logged in user's existing education (identified by education id)
// @access  Private (user's own profile only)
exports.updateLoggedInUserEdu = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // If profile belonging to user does not exist, cannot update profile
    if (!profile) {
      return res.status(400).json({ msg: 'User profile does not exists' });
    }

    const filter = {
      user: req.user.id,
      education: { $elemMatch: { _id: req.params.edu_id } }
    };

    profile = await Profile.findOne(filter);

    // If education with education id belonging to user does not exist, cannot update this education entry
    if (!profile) {
      return res.status(400).json({ msg: 'Education entry does not exists' });
    }

    // TODO: Implement updating of user profile's education array (currently, req.body keys must be "experience.$.<key>")
    profile = await Profile.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    // console.log(JSON.stringify(profile, null, 2).magenta);

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/profile/me
// @desc    Delete logged in user profile
// @access  Private
exports.deleteLoggedInProfile = async (req, res) => {
  try {
    // Delete profile
    await Profile.findOneAndRemove({ user: req.user.id });
    res.status(200).json({ msg: 'Profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete logged in user's single experience (identified by experience id)
// @access  Private (user's own profile only)
exports.deleteLoggedInUserExp = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // If profile belonging to user does not exist, cannot delete experience entry
    if (!profile) {
      return res.status(400).json({ msg: 'User profile does not exists' });
    }

    // Get remove index of experience in experience array
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete logged in user's single education (identified by education id)
// @access  Private (user's own profile only)
exports.deleteLoggedInUserEdu = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // If profile belonging to user does not exist, cannot delete education entry
    if (!profile) {
      return res.status(400).json({ msg: 'User profile does not exists' });
    }

    // Get remove index of experience in experience array
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
};
