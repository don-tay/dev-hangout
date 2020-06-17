const User = require('../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error`);
  }
};
