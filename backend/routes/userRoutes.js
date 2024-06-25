const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update/:id', verifyToken, userController.updateUser);
router.delete('/delete/:id', verifyToken, userController.deleteUser);
router.get('/getAllUsers', verifyToken, userController.getAllUsers);
router.get('/getUserById/:id', verifyToken, userController.getUserById);

module.exports = router;
