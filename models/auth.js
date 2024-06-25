const jwt = require('jsonwebtoken');

const genToken = async (res, id) => {
    const token = jwt.sign({id}, process.env.SECRETE, {expiresIn: '30d'});

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
}

module.exports = genToken;