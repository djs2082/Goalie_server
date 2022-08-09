const jwt = require('jsonwebtoken');

exports.generateToken = (id, userName, email) => {
    return jwt.sign({
        _id: id,
        username: userName,
        email: email,
    },process.env.JWT_SECRET_KEY);
}