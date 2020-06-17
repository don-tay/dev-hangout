const jwt = require('jsonwebtoken');
const config = require('config');

exports.auth = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  //   console.log(`token: ${token}`.cyan);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'Not authroised to access this route' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // console.log(`decoded jwt token: ${JSON.stringify(decoded, null, 2)}`.cyan);

    req.user = decoded.user;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ msg: 'Invalid token, not authorised to access this route' });
  }
};
