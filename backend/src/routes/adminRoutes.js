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

module.exports = router;
