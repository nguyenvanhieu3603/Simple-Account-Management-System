const User = require('../models/User'); // Import model User để thao tác với MongoDB
const bcrypt = require('bcrypt'); // Thư viện mã hóa mật khẩu

// Lấy danh sách tài khoản (Chỉ admin)
exports.getUsers = async (req, res) => {
    try {
        // Kiểm tra quyền truy cập (chỉ admin mới có quyền)
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' }); // 403: Forbidden
        }

        // Lấy các query từ URL: page (trang), limit (số lượng mỗi trang), search (tìm kiếm)
        let { page, limit, search } = req.query;
        page = parseInt(page) || 1; // Mặc định page = 1 nếu không có
        limit = parseInt(limit) || 10; // Mặc định limit = 10 nếu không có
        const skip = (page - 1) * limit; // Tính số lượng bỏ qua để phân trang

        let filter = {};
        if (search) {
            filter.username = { $regex: search, $options: 'i' }; // Tìm kiếm theo username không phân biệt hoa thường
        }

        // Đếm tổng số user thỏa mãn điều kiện tìm kiếm
        const totalUsers = await User.countDocuments(filter);

        // Tìm user theo điều kiện, loại bỏ password để không trả về
        const users = await User.find(filter, '-password')
            .skip(skip)
            .limit(limit);

        // Trả về danh sách user kèm thông tin phân trang
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
        // Kiểm tra quyền truy cập
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
        }
        
        // Mã hóa mật khẩu trước khi lưu
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
        // Kiểm tra quyền truy cập
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { username, role } = req.body;
        if (!username || !role) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }

        // Cập nhật thông tin user theo ID (req.params.id)
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
        // Kiểm tra quyền truy cập
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        // Xóa user theo ID (req.params.id)
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
