const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const tokenUser = jwt.verify(token, process.env.JWT_KEY);
        // console.log(tokenUser);
        User.findByPk(tokenUser.userId)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(error => {
                throw new Error(error);
            });
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
};