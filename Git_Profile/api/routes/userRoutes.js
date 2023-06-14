const express = require('express');
const multer = require('multer');
const UserController = require('../controllers/userController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST route to create a user
router.post('/', upload.single('profileImage'), UserController.createUser);

module.exports = router;
