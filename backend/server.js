// Nạp các biến môi trường từ file .env
require('dotenv').config();

const express = require('express'); // Framework giúp tạo API dễ dàng
const mongoose = require('mongoose'); // Thư viện kết nối MongoDB
const cors = require('cors'); // Cho phép giao tiếp giữa các server khác nhau (CORS)

const app = express(); // Khởi tạo ứng dụng Express

// Middleware
app.use(express.json()); // Cho phép backend đọc dữ liệu JSON từ request body
app.use(cors()); // Kích hoạt CORS để frontend có thể gọi API từ một domain khác

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,        // Sử dụng cú pháp URL mới của MongoDB
  useUnifiedTopology: true      // Chế độ kết nối mới, giúp tối ưu hiệu suất
}).then(() => console.log("✅ MongoDB connected")) // Thông báo khi kết nối thành công
  .catch(err => console.log(err)); // Hiển thị lỗi nếu kết nối thất bại

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // Tuyến đường cho chức năng đăng ký và đăng nhập
app.use('/api/users', require('./routes/userRoutes')); // Tuyến đường cho chức năng quản lý user (chỉ admin)

// Lấy cổng từ biến môi trường hoặc mặc định là 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
