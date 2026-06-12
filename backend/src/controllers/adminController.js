const adminModel = require('../models/adminModel');

const adminController = {
  // --- 1. QUẢN LÝ VỎ BÀI TEST ---

  getAllTests: async (req, res) => {
    try {
      const tests = await adminModel.getAllTests();
      res.status(200).json({
        message: 'Lấy danh sách bài test thành công',
        data: tests
      });
    } catch (error) {
      console.error('❌ Lỗi Controller khi lấy danh sách test:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  createTestMetadata: async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ message: 'Tên bài test không được để trống' });
      
      const testId = await adminModel.createTestMetadata(name, description);
      res.status(201).json({ message: 'Tạo vỏ bài test thành công!', data: { id: testId } });
    } catch (error) {
      console.error('❌ Lỗi Controller khi tạo bài test:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateTestMetadata: async (req, res) => {
    try {
      const testId = req.params.id;
      const { name, description } = req.body;
      
      await adminModel.updateTestMetadata(testId, name, description);
      res.status(200).json({ message: `Đã cập nhật vỏ bài test ID ${testId} thành công!` });
    } catch (error) {
      console.error(`❌ Lỗi cập nhật bài test ${req.params.id}:`, error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  deleteTest: async (req, res) => {
    try {
      const testId = req.params.id;
      const isDeleted = await adminModel.deleteTest(testId);
      
      if (!isDeleted) return res.status(404).json({ message: 'Không tìm thấy bài test để xóa' });
      res.status(200).json({ message: `Đã xóa bài test ID ${testId} thành công!` });
    } catch (error) {
      console.error(`❌ Lỗi xóa bài test ${req.params.id}:`, error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // --- 2. QUẢN LÝ CÂU HỎI CHI TIẾT ---

  getQuestionsByTest: async (req, res) => {
    try {
      const testId = req.params.testId;
      const questions = await adminModel.getQuestionsByTest(testId);
      res.status(200).json({ message: 'Thành công', data: questions });
    } catch (error) {
      console.error('❌ Lỗi lấy câu hỏi:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const { test_id, content, question_order, options } = req.body;
      if (!test_id || !content || !options || options.length < 2) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ (Cần test_id, content và ít nhất 2 options)' });
      }

      const questionId = await adminModel.createQuestion(test_id, content, question_order, options);
      res.status(201).json({ message: 'Thêm câu hỏi thành công!', data: { id: questionId } });
    } catch (error) {
      console.error('❌ Lỗi tạo câu hỏi:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const questionId = req.params.id;
      const { content, question_order, options } = req.body;
      
      if (!content || !options || options.length < 2) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
      }

      await adminModel.updateQuestion(questionId, content, question_order, options);
      res.status(200).json({ message: 'Cập nhật câu hỏi thành công!' });
    } catch (error) {
      console.error('❌ Lỗi cập nhật câu hỏi:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const questionId = req.params.id;
      const isDeleted = await adminModel.deleteQuestion(questionId);
      
      if (!isDeleted) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
      res.status(200).json({ message: 'Đã xóa câu hỏi thành công!' });
    } catch (error) {
      console.error('❌ Lỗi xóa câu hỏi:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getDashboardStats: async (req, res) => {
    try {
      const stats = await adminModel.getDashboardStats();
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
