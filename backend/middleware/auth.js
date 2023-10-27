const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authenticateJWT(req, res, next) {
    const token = req.headers['authorization-token'];

    if(!token) {
        return res.status(401).json({
            message: 'Unauthorized, please login.'
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        
        if(err) {
            return res.status(403).json({
                message: 'Authorization failed, please login again.'
            });
        }

        req.user = user;
        next();
    })
};

module.exports = { authenticateJWT };