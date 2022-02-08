const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

router.post('/users' , userController.getAllUsers);
router.post('/users/add' , userController.addUser);

module.exports = router;