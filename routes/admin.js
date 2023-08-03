const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const authenticator = require('../middleware/auth');

router.post('/addUser', authenticator.authenticate, adminController.addUser);
router.put('/makeAdmin', authenticator.authenticate, adminController.makeAdmin);
router.put('/removeAdmin', authenticator.authenticate, adminController.removeAdminPermission);
router.delete('/removeFromGroup', authenticator.authenticate, adminController.removeUserFromGroup);

module.exports = router;