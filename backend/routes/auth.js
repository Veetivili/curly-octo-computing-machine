const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// Import Middleware
const { blacklistedTokens } = require('../middleware/isBlackListed');

// Import User model
const User = require('../models/user');

// Login route

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Check if user exists in database
    const user = await User.findOne({ username });

    if(!user) {
        return res.status(401).json({
            message: 'Invalid username or password.'
        });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if(!passwordIsValid) {
        return res.status(401).json({
            message: 'Invalid username or password.'
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: 3600 // 24 hours
    });

    console.log('User logged in:', user.username, 'Token:', token);

    res.status(200).json({data:{
        username: user.username,
        token: token
    }});
});

// Logout route

router.post('/logout', (req, res) => {
    const token = req.headers['authorization-token'];
  
  if (!token) {
    return res.status(401).json({ 
        data: {
            message: 'No active session to logout.',
        }
    });
  }

  blacklistedTokens.push(token);
  // Dev only comment
  console.log('Successfully logged out');
  res.status(200).json({ 
    data: {
    message: 'Logged out', 
    }
});
});

module.exports = router;