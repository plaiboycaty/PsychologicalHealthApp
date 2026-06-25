const testModel = require('../models/testModel');
const scoring = require('../utils/scoring');

const testController = {
  getAllTests: async (req, res, next) => {
    try {
      const tests = await testModel.getAllTests();
      res.status(200).json({
        message: 'Lấy danh sách bài test thành công',
        tests: tests
      });
    } catch (error) {
      next(error);
    }
  },

  getTestDetail: async (req, res, next) => {
    try {
      const testId = parseInt(req.params.id);

      const testInfo = await testModel.getTestById(testId);
      if (!testInfo) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin bộ câu hỏi này' });
      }

      const rawData = await testModel.getQuestionsAndOptions(testId);

      const questionsMap = {};
      rawData.forEach(row => {
        if (!questionsMap[row.question_id]) {
          questionsMap[row.question_id] = {
            id: row.question_id,
            content: row.question_content,
            order: row.question_order,
            options: []
          };
        }
        questionsMap[row.question_id].options.push({
          id: row.option_id,
          content: row.option_content,
          score: row.score
        });
      });

      const questionsArray = Object.values(questionsMap);

      res.status(200).json({
        message: 'Lấy dữ liệu bài test thành công',
        test: {
          id: testInfo.id,
          name: testInfo.name,
          description: testInfo.description,
          questions: questionsArray
        }
      });
    } catch (error) {
      next(error);
    }
  },

  submitTest: async (req, res, next) => {
    try {
      const userId = req.user ? req.user.user_id : null;
      const isGuest = !userId;

      const { test_id, option_ids } = req.body;

      if (!test_id || !option_ids || !Array.isArray(option_ids) || option_ids.length === 0) {
        return res.status(400).json({ message: 'Dữ liệu nộp bài không hợp lệ, mảng đáp án không được trống' });
      }

      const numericOptionIds = option_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      const totalScore = await testModel.getOptionsScore(numericOptionIds);

      let category = '';
      if (test_id === 1) {
        category = scoring.evaluateZungAnxiety(totalScore);
      } else if (test_id === 2) {
        category = scoring.evaluateYMRS(totalScore);
      } else if (test_id === 3) {
        category = scoring.evaluateBeckDepression(totalScore);
      } else {
        category = 'Chưa xác định mức độ';
      }

      let treatment_status = 'healthy';
      if (category.includes('nhẹ') || category.includes('vừa')) {
        treatment_status = 'treatment';
      } else if (category.includes('nặng')) {
        treatment_status = 'emergency';
      }

      let resultId = null;
      if (!isGuest) {
        resultId = await testModel.saveTestResult(userId, test_id, totalScore, category);
      }

      res.status(isGuest ? 200 : 201).json({
        message: isGuest ? 'Chấm điểm thành công (Chế độ Khách)' : 'Nộp bài test thành công',
        treatment_status: treatment_status,
        result: {
          id: resultId,
          test_id,
          total_score: totalScore,
          category: category,
          is_guest: isGuest
        }
      });

    } catch (error) {
      next(error);
    }
  },

  sendEmergencyEmail: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const userModel = require('../models/userModel');
      const userInfo = await userModel.getUserById(userId);

      const userEmail = userInfo.email;
      const userName = userInfo.full_name || 'Một bệnh nhân';

      const testModel = require('../models/testModel');
      const latestTest = await testModel.getLatestTestResultByUserId(userId);

      if (!latestTest) {
        return res.status(404).json({ message: 'Không tìm thấy kết quả bài test của người dùng này' });
      }

      const category = latestTest.category;
      const score = latestTest.total_score;

      const doctorEmail = 'mquan8912@gmail.com';
      const subject = `[CẤP CỨU] Yêu cầu hỗ trợ y tế khẩn cấp từ bệnh nhân ${userName}`;
      const content = `Chào Bác sĩ,\n\nBệnh nhân ${userName} (Email liên hệ: ${userEmail}) vừa thực hiện bài đánh giá tâm lý trên hệ thống và ghi nhận kết quả ở mức báo động.\n
      \n- Loại bệnh chẩn đoán: ${category}\n- Điểm số: ${score || 'Không xác định'}\n
      \nKính mong Bệnh viện/Bác sĩ ưu tiên liên hệ và hỗ trợ bệnh nhân này trong thời gian sớm nhất.\n
      \nTrân trọng,\nHệ thống Cảnh báo - Psychological Health App`;

      const mailer = require('../utils/mailer');
      const isSent = await mailer.sendMail(doctorEmail, subject, content);

      if (isSent) {
        res.status(200).json({ message: 'Email cấp cứu đã được gửi thành công tới Bệnh viện!' });
      } else {
        res.status(500).json({ message: 'Lỗi hệ thống: Không thể gửi Email lúc này.' });
      }

    } catch (error) {
      next(error);
    }
  },

  getLatestTest: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const latestTest = await testModel.getLatestTestResultByUserId(userId);

      if (!latestTest) {
        return res.status(200).json({
          message: 'Người dùng chưa làm bài test nào',
          data: null
        });
      }

      res.status(200).json({
        message: 'Lấy ngày làm bài test gần nhất thành công',
        data: latestTest
      });
    } catch (error) {
      next(error);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const history = await testModel.getUserTestHistory(userId);

      res.status(200).json({
        message: 'Lấy lịch sử làm bài test thành công',
        data: history
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = testController;
