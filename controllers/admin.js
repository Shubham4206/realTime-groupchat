const User = require('../models/user');
const Group = require('../models/group');
const GroupUser = require('../models/groupuser');
const { Op } = require('sequelize');

exports.addUser = async (req, res, next) => {
    try {
        const groupId = req.body.groupId;
        const email = req.body.email;
        console.log(email);
        const userToBeAdded = await User.findOne({where: {email: email}});
        if(!userToBeAdded) {
            return res.status(400).json({message: 'member to be added is not registered'});
        }
        const verifiedAdmin = await GroupUser.findOne({where: {[Op.and]: [{userId: req.user.id}, {isAdmin: true}, {groupId: groupId}]}});
        if(!verifiedAdmin){
            return res.status(403).json({message: 'you dont have permissions'});
        };
        const group = await Group.findByPk(groupId);
        await group.addUser(userToBeAdded, {
            through: {isAdmin: false}
        });
        res.status(200).json({message: 'new member added'});
    } catch (error) {
        console.log(error);
        res.status(500).json('something went wrong');
    }
};

exports.makeAdmin = async (req, res, next) => {
    try {
        const userIdToBeMadeAdmin = req.body.userId;
        const groupId = req.body.groupId;
        const user = await User.findByPk(userIdToBeMadeAdmin);
        if(!user) {
            return res.status(400).json({message: 'member to be added is no more registered'});
        }
        const verifiedAdmin = await GroupUser.findOne({where: {[Op.and]: [{userId: req.user.id}, {isAdmin: true}, {groupId: groupId}]}});
        if(!verifiedAdmin){
            return res.status(403).json({message: 'you dont have permissions'});
        };
        let memberToBeUpdated = await GroupUser.findOne({where: {[Op.and]: [{userId: userIdToBeMadeAdmin}, {groupId: groupId}]}});
        await memberToBeUpdated.update({isAdmin: true});
        res.status(200).json({message: 'user set as admin'});  
    } catch (error) {
        console.log(error);
        res.status(500).json('something went wrong');
    }
};

exports.removeUserFromGroup = async (req, res, next) => {
    try {
        const userIdToBeRemoved = req.body.userId;
        const groupId = req.body.groupId;
        const user = await User.findByPk(userIdToBeRemoved);
        if(!user) {
            return res.status(400).json({message: 'user to be removed is no more registered'});
        }
        const verifiedAdmin = await GroupUser.findOne({where: {[Op.and]: [{userId: req.user.id}, {isAdmin: true}, {groupId: groupId}]}});
        if(!verifiedAdmin){
            return res.status(403).json({message: 'you dont have permissions'});
        };
        let memberToBeRemoved = await GroupUser.findOne({where: {[Op.and]: [{userId: userIdToBeRemoved}, {groupId: groupId}]}});
        await memberToBeRemoved.destroy();
        res.status(200).json({message: 'user removed from group'});  
    } catch (error) {
        console.log(error);
        res.status(500).json('something went wrong');
    }
};

exports.removeAdminPermission = async (req, res, next) => {
    try {
        const userIdToBeUpdated = req.body.userId;
        const groupId = req.body.groupId;
        const user = await User.findByPk(userIdToBeUpdated);
        if(!user) {
            return res.status(400).json({message: 'member to be removed as admin is no more registered'});
        }
        const verifiedAdmin = await GroupUser.findOne({where: {[Op.and]: [{userId: req.user.id}, {isAdmin: true}, {groupId: groupId}]}});
        if(!verifiedAdmin){
            return res.status(403).json({message: 'you dont have permissions'});
        };
        let memberToBeUpdated = await GroupUser.findOne({where: {[Op.and]: [{userId: userIdToBeUpdated}, {groupId: groupId}]}});
        await memberToBeUpdated.update({isAdmin: false});
        res.status(200).json({message: 'user removed as admin'});  
    } catch (error) {
        console.log(error);
        res.status(500).json('something went wrong');
    }
};