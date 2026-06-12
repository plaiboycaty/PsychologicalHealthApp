const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminMiddleware);

// --- 1. QUẢN LÝ BÀI TEST ---
// Lấy danh sách các bài test
router.get('/tests', adminController.getAllTests);

// Thêm mới một bài test (chỉ tạo tên và mô tả)
router.post('/tests', adminController.createTestMetadata);

// Cập nhật tên và mô tả bài test
router.put('/tests/:id', adminController.updateTestMetadata);

// Xóa bài test
router.delete('/tests/:id', adminController.deleteTest);

// --- 1.B QUẢN LÝ CHI TIẾT CÂU HỎI ---
// Lấy danh sách câu hỏi của 1 bài test
router.get('/tests/:testId/questions', adminController.getQuestionsByTest);

// Thêm 1 câu hỏi mới (kèm đáp án) vào bài test
router.post('/questions', adminController.createQuestion);

// Cập nhật 1 câu hỏi và các đáp án của nó
router.put('/questions/:id', adminController.updateQuestion);

// Xóa 1 câu hỏi
router.delete('/questions/:id', adminController.deleteQuestion);

// --- 2. THỐNG KÊ (DASHBOARD) ---

// [GET] Lấy dữ liệu thống kê tổng quan cho trang chủ Admin
router.get('/dashboard/stats', adminController.getDashboardStats);

// --- 3. QUẢN LÝ NGƯỜI DÙNG ---

// [GET] Lấy danh sách tất cả người dùng
router.get('/users', adminController.getAllUsers);

// [PUT] Khóa/Mở khóa người dùng
router.put('/users/:id/status', adminController.toggleUserStatus);

// --- 4. BÁO CÁO THỐNG KÊ ---

// [GET] Tạo báo cáo theo khoảng thời gian
router.get('/reports/generate', adminController.generateReport);

module.exports = router;
