const config = require("./secret");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m', // 1 year
  });
}
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_ACCESS_TOKEN, {
    expiresIn: '7d', 
  });
}



module.exports = {generateAccessToken, generateRefreshToken}