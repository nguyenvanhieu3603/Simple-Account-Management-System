const express = require('express');
const auth = require('../middleware/auth'); // Import middleware để kiểm tra token JWT
const userController = require('../controllers/userController'); // Import controller xử lý logic CRUD

const router = express.Router(); // Tạo đối tượng Router từ Express

// 📌 API lấy danh sách tài khoản (Chỉ admin)
// Method: GET
// Endpoint: /users
// Middleware: auth (Kiểm tra JWT + role admin)
// Controller: getUsers
router.get('/', auth, userController.getUsers);

// 🔥 API thêm user (Chỉ admin)
// Method: POST
// Endpoint: /users
// Middleware: auth (Kiểm tra JWT + role admin)
// Controller: addUser
router.post('/', auth, userController.addUser);

// ✏️ API cập nhật user (Chỉ admin)
// Method: PUT
// Endpoint: /users/:id
// Middleware: auth (Kiểm tra JWT + role admin)
// Controller: updateUser
router.put('/:id', auth, userController.updateUser);

// 🗑️ API xóa user (Chỉ admin)
// Method: DELETE
// Endpoint: /users/:id
// Middleware: auth (Kiểm tra JWT + role admin)
// Controller: deleteUser
router.delete('/:id', auth, userController.deleteUser);

module.exports = router; // Xuất module router để sử dụng ở file app.js
