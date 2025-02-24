const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const router = express.Router();

// API lấy danh sách tài khoản (Chỉ admin)
router.get('/', auth, async (req, res) => {
  try {
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      }
      const users = await User.find({}, '-password'); // Ẩn password
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// API thêm user (Chỉ admin)
router.post('/', auth, async (req, res) => {
  try {
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
      }
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, role });
      await newUser.save();
      res.status(201).json({ message: "Tạo user thành công" });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// API cập nhật user (Chỉ admin)
router.put('/:id', auth, async (req, res) => {
  try {
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
      }
      await User.findByIdAndUpdate(req.params.id, req.body);
      res.json({ message: "Cập nhật thành công" });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// API xóa user (Chỉ admin)
router.delete('/:id', auth, async (req, res) => {
  try {
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "Xóa thành công" });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
