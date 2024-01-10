const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../config/token');

// logic for registration
exports.register = async (req, res, next) => {
    try {
        const {name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Create a new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        logger.info(`User registered: ${email}`);
        res.status(201).json({ message: 'Registration successful',
    user:{
        user_id: newUser._id,
        fullname: newUser.name,
        email: newUser.email 
    } });
    } catch (error) {
        logger.error(`Error registering user: ${error.message}`);
        next(error);
    }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.error(`Invalid login attempt for email: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.error(`Invalid login attempt for email: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens and validity periods
    const access_token_validity = Date.now() + 86400 * 1000; // 1 day
    const refresh_token_validity = Date.now() + 604800 * 1000; // 1 week

    const access_token = generateAccessToken({ id: user.id, email: user.email });
    const refresh_token = generateRefreshToken({ id: user.id, email: user.email });

    const options = {
      access_token,
      access_token_validity,
      refresh_token,
      refresh_token_validity,
    };

    // Update or insert the tokens in the Token model
    const updatedToken = await Token.findOneAndUpdate(
      { user_id: user._id },
      options,
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: true,
      message: 'Logged in successfully',
      user_id: user.id,
      ...options,
    });
  } catch (error) {
    logger.error(`Error logging in: ${error.message}`);
    next(error);
  }
};

  

exports.refresh_token = async (req, res) => {
  try {
    const refresh_token = req.body.token;
    if (!refresh_token)
      return res
        .status(400)
        .send({ status: false, message: 'Refresh token is required!' });
    Token.findOne({ refresh_token: refresh_token }).exec((err, token) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({
            status: false,
            message: 'An error occured generating token!',
          });
      }

      if (!token)
        return res
          .status(403)
          .send({ status: false, message: 'Invalid token!' });

      //Check if refresh token is still valid
      if (token.refresh_token_validity < new Date().getTime()) {
        return res
          .status(400)
          .send({
            status: false,
            message: 'Refresh token has expired, please login',
          });
      }

      let access_token = generateAccessToken({ id: token.user_id });

      let access_token_validity = parseInt(new Date().getTime()) + 86400 * 1000;

      const options = {
        access_token,
        access_token_validity,
      };
      //Update with new
      Token.findByIdAndUpdate(
        token._id,
        options,
        { new: true, upsert: true },
        (err, token) => {
          if (err) return res.status(500).send({ status: false, message: err });

          return res.status(200).send({
            status: true,
            message: 'Token Generated Successfully!',
            ...options,
          });
        },
      );
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, message: 'An error occurred' });
  }
};