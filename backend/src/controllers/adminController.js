const adminModel = require('../models/adminModel');

const adminController = {
  // Logic xử lý API Thêm bộ câu hỏi
  createTest: async (req, res) => {
    try {
      const { name, description, category, questions } = req.body;

      // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào (Validation)
      if (!name) {
        return res.status(400).json({ message: 'Tên bài test không được để trống' });
      }
      
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Bài test phải có ít nhất 1 câu hỏi' });
      }

      // 2. Gọi Model để thực hiện Transaction lưu vào Database
      const testId = await adminModel.createTest({ name, description, category, questions });

      // 3. Phản hồi thành công
      res.status(201).json({ 
        message: 'Tạo bộ câu hỏi tâm lý thành công!',
        test_id: testId
      });

    } catch (error) {
      console.error('❌ Lỗi Controller khi tạo bài test:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi trên Server khi lưu bài test vào hệ thống', 
        error: error.message 
      });
    }
  },

  // Logic xử lý API Lấy thống kê
  getDashboardStats: async (req, res) => {
    try {
      // Gọi Model để Query Database
      const stats = await adminModel.getDashboardStats();
      
      // Phản hồi kết quả
      res.status(200).json({
        status: 200,
        message: 'Lấy dữ liệu thống kê thành công',
        data: stats
      });
    } catch (error) {
      console.error('❌ Lỗi Controller khi lấy thống kê:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu thống kê' });
    }
  },

  updateTest: async (req, res) => {
    try {
      const testId = req.params.id;
      const testData = req.body;
      
      if (!testData.name && !testData.questions) {
        return res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ' });
      }

      await adminModel.updateTest(testId, testData);
      
      res.status(200).json({ message: `Đã cập nhật bài test ID ${testId} thành công!` });
    } catch (error) {
      console.error(`❌ Lỗi cập nhật bài test ${req.params.id}:`, error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật bài test', error: error.message });
    }
  },

  deleteTest: async (req, res) => {
    try {
      const testId = req.params.id;
      
      const isDeleted = await adminModel.deleteTest(testId);
      
      if (!isDeleted) {
        return res.status(404).json({ message: 'Không tìm thấy bài test để xóa' });
      }

      res.status(200).json({ message: `Đã xóa hoàn toàn bài test ID ${testId} khỏi hệ thống!` });
    } catch (error) {
      console.error(`❌ Lỗi xóa bài test ${req.params.id}:`, error);
      res.status(500).json({ message: 'Lỗi server khi xóa bài test', error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await adminModel.getAllUsers();
      res.status(200).json({
        message: 'Lấy danh sách người dùng thành công',
        data: users
      });
    } catch (error) {
      console.error('❌ Lỗi Controller khi lấy danh sách user:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng', error: error.message });
    }
  },

  toggleUserStatus: async (req, res) => {
    try {
      const userId = req.params.id;
      const { status } = req.body;

      if (!['active', 'locked'].includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }

      const isUpdated = await adminModel.updateUserStatus(userId, status);

      if (!isUpdated) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      res.status(200).json({ message: `Cập nhật trạng thái người dùng thành ${status} thành công!` });
    } catch (error) {
      console.error(`❌ Lỗi cập nhật trạng thái user ${req.params.id}:`, error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái', error: error.message });
    }
  },

  generateReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const reportData = await adminModel.getReportData(startDate, endDate);
      
      res.status(200).json({
        message: 'Tạo dữ liệu báo cáo thành công',
        data: reportData
      });
    } catch (error) {
      console.error('❌ Lỗi Controller khi tạo báo cáo:', error);
      res.status(500).json({ message: 'Lỗi server khi sinh dữ liệu báo cáo', error: error.message });
    }
  }
};

module.exports = adminController;
