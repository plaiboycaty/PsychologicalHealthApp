const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); // Khởi tạo kết nối DB ngay khi chạy server

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Dùng để parse JSON body
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const testRoutes = require('./routes/testRoutes');
const userRoutes = require('./routes/userRoutes');
const statisticRoutes = require('./routes/statisticRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', diaryRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/statistics', statisticRoutes);
app.use('/api/roadmap', treatmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng đến với Backend API của Ứng dụng Sức Khỏe Tâm Lý' });
});

// Error handling middleware cơ bản
app.use((err, req, res, next) => {
  console.error('❌ Error Log:', err.message);
  res.status(500).json({ status: 500, message: 'Đã xảy ra lỗi trên Server', error: err.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT} `);
});

