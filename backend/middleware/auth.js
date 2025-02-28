// Middleware xác thực JWT
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Lấy header Authorization từ request
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // Nếu không có header -> Trả về lỗi 401 (Unauthorized)
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Tách token từ header (dạng: Bearer <token>)
    const token = authHeader.split(' ')[1];
    if (!token) {
        // Nếu không có token -> Trả về lỗi 401 (Unauthorized)
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Giải mã token và kiểm tra với secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào request để dùng trong các route tiếp theo
        next(); // Cho phép request tiếp tục
    } catch (error) {
        // Token không hợp lệ -> Trả về lỗi 403 (Forbidden)
        return res.status(403).json({ message: "Invalid token" });
    }
};
