const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// 🔐 API Đăng ký tài khoản
router.post('/register', async (req, res) => {
  const { username, password } = req.body; // Lấy thông tin username và password từ body request
  try {
    // 📌 Kiểm tra username đã tồn tại hay chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // 🔑 Mã hóa mật khẩu bằng bcrypt (10 là số vòng hash)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword }); // Tạo user mới với mật khẩu đã mã hóa
    await newUser.save(); // Lưu user vào database

    res.status(201).json({ message: "Đăng ký thành công" }); // Trả về kết quả nếu thành công
  } catch (error) {
    res.status(500).json({ message: "Server error" }); // Xử lý lỗi nếu có
  }
});

// 🔑 API Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Lấy thông tin đăng nhập từ request
  const user = await User.findOne({ username }); // Tìm user trong database

  if (!user) {
    return res.status(400).json({ message: 'Tài khoản không tồn tại' }); // Nếu không tìm thấy user
  }

  // ✅ Kiểm tra mật khẩu có đúng không
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Mật khẩu không đúng' });
  }

  // 🔑 Tạo JWT token chứa thông tin user và role (token có thời hạn 1 giờ)
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role }); // Trả về token và role của user
});

module.exports = router; // Xuất module router để dùng trong file app.js
