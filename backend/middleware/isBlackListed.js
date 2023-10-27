let blacklistedTokens = [];

const isBlacklisted = (req, res, next) => {
    const token = req.headers['authorization-token'];
    
    if (blacklistedTokens.includes(token)) {
      return res.status(401).json({ message: 'Token is blacklisted'});
    }
  
    next();
  };

  module.exports = { blacklistedTokens, isBlacklisted };