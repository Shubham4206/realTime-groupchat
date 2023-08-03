const express = require('express');
const router = express.Router();

// const userController = require('../controllers/user');
const chatController = require('../controllers/chat');
const authenticator = require('../middleware/auth');

router.post('/addParticipant', authenticator.authenticate, chatController.addParticipant);
router.post('/nameTheGroup', authenticator.authenticate, chatController.setGroupName);
router.get('/getGroups', authenticator.authenticate, chatController.getGroups);
router.get('/getMembers', authenticator.authenticate, chatController.getMembers);

module.exports = router;