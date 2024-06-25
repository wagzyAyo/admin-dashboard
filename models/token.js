const jwt = require('jsonwebtoken');
const user = require('../models/user');

const authenticate = async (req, res, next) => {
    const token = req.cookies.jwt

    if (!token){
        res.status(401).json({message: "Access denied. You need authorization"})
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRETE);
        req.user = await user.findById(decoded.userId).select('-password');
        next()
    } catch(err){
        res.status(400).json({message: "invalid token"})
    }
}


module.exports = authenticate;