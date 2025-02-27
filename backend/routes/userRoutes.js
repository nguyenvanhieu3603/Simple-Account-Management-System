const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// API lấy danh sách tài khoản (Chỉ admin)
router.get('/', auth, userController.getUsers);

// API thêm user (Chỉ admin)
router.post('/', auth, userController.addUser);

// API cập nhật user (Chỉ admin)
router.put('/:id', auth, userController.updateUser);

// API xóa user (Chỉ admin)
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
