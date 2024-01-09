const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const {
    generateAccessToken,
    generateRefreshToken,
  } = require('../helpers/index');


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
  
      // Generate JWT token
      const access_token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
      const refresh_token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
      // Save the refresh token in the database
      await Token.findOneAndUpdate(
        { userId: user._id },
        { access_token: access_token, refresh_token: refresh_token },
        { upsert: true }
      );
  
      // Update token with new values
      const access_token_validity = parseInt(new Date().getTime()) + 86400 * 1000;
      const refresh_token_validity = parseInt(new Date().getTime()) + 604800 * 1000;
  
      const options = {
        access_token,
        access_token_validity,
        refresh_token,
        refresh_token_validity,
      };
  
      // Log the user in
      await Token.findOneAndUpdate(
        { userId: user._id },
        options,
        { new: true, upsert: true }
      );
  
      logger.info(`User logged in: ${email}`);
      res.status(200).json({ access_Token: access_token, refresh_token: refresh_token });
    } catch (error) {
      logger.error(`Error logging in: ${error.message}`);
      next(error);
    }
  };
  