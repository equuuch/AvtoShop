const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register-admin', userController.registerAdmin);
router.post('/login', userController.login);

module.exports = router;
