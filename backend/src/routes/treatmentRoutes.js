const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Chỉ có người dùng đăng nhập mới xem được Lộ trình của mình
router.get('/my-roadmap', authMiddleware, treatmentController.getMyRoadmap);

// Đánh dấu hoàn thành / bỏ hoàn thành task
router.post('/tasks/toggle', authMiddleware, treatmentController.toggleTaskProgress);

module.exports = router;
