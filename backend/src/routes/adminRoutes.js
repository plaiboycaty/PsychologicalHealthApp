const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminMiddleware);

// [POST] Thêm bộ câu hỏi mới (Hỗ trợ nhập tay và Import Excel)
router.post('/tests', adminController.createTest);

// [PUT] Cập nhật bộ câu hỏi
router.put('/tests/:id', adminController.updateTest);

// [DELETE] Xóa bộ câu hỏi
router.delete('/tests/:id', adminController.deleteTest);

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
