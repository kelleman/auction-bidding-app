const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
  return accessToken;
};

exports.generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return refreshToken;
};
