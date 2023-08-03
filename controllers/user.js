const { error } = require('console');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res, next) => {
    try {
        const {name, email, phone, password} = req.body;
        // console.log(name, email, phone, password);
        if(name.length > 0 && email.length > 0 && password.length > 0){
            const user = await User.findOne({where: {email: email}});
            if(user){
                return res.status(403).json({message: 'user already exists'});
            }
            bcrypt.hash(password, 10, async (error, hash) => {
                if(error) throw new Error(error);
                
                await User.create({name: name, email: email, phone: phone, password: hash});   
            })
            res.status(200).json({message: 'sign up successfull'});
        }else {
            res.status(400).json({message: 'bad parameters'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
};

exports.logUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(email.length > 0 && password.length > 0) {
            const user = await User.findOne({where: {email: email}});
            if(!user) {
                return res.status(404).json({message: 'user does not exist'});
            }
            bcrypt.compare(password, user.password, function(error, result) {
                if(error) {
                    return res.status(500).json({success: false, message: err});
                }
                if(result === true) {
                    const token = jwt.sign({userId: user.id, name: user.name}, process.env.JWT_KEY);
                    res.status(200).json({
                        success: true, 
                        message: 'user found',
                        token: token
                    });
                } else {
                    res.status(401).json({success: false, message: 'password is incorrect'});
                }
            });
        }else {
            res.status(400).json({message: 'bad parameters'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
};