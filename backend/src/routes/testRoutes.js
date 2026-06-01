const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');

// Lấy danh sách bài Test (Public)
router.get('/', testController.getAllTests);

// Lấy ngày làm bài test gần nhất (Protected - Bắt buộc phải đăng nhập)
router.get('/latest', authMiddleware, testController.getLatestTest);

// Lấy lịch sử làm bài test (Protected - Bắt buộc phải đăng nhập)
router.get('/history', authMiddleware, testController.getHistory);

// Lấy thông tin chi tiết một bộ câu hỏi (Public cho Khách xem)
router.get('/:id', testController.getTestDetail);

// Nộp bài và chấm điểm (Hỗ trợ cả User có Token và Guest không Token)
router.post('/submit', optionalAuthMiddleware, testController.submitTest);

// Gửi Email khẩn cấp cho bác sĩ (Protected - Bắt buộc phải đăng nhập)
router.post('/emergency-email', authMiddleware, testController.sendEmergencyEmail);

module.exports = router;
