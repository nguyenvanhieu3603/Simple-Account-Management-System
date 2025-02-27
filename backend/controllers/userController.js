const User = require('../models/User');
const bcrypt = require('bcrypt');

// Lấy danh sách tài khoản (Chỉ admin)
exports.getUsers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        let { page, limit, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        let filter = {};
        if (search) {
            filter.username = { $regex: search, $options: 'i' }; // 🔍 Tìm kiếm username (không phân biệt hoa/thường)
        }

        const totalUsers = await User.countDocuments(filter);
        const users = await User.find(filter, '-password')
            .skip(skip)
            .limit(limit);

        res.json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Thêm user (Chỉ admin)
exports.addUser = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'Tạo user thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật user (Chỉ admin)
exports.updateUser = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { username, role } = req.body;
        if (!username || !role) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }
        await User.findByIdAndUpdate(req.params.id, { username, role });
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa user (Chỉ admin)
exports.deleteUser = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
