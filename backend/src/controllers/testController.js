const testModel = require('../models/testModel');
const scoring = require('../utils/scoring');

const testController = {
  // GET /api/tests
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

  // GET /api/tests/:id
  getTestDetail: async (req, res, next) => {
    try {
      const testId = parseInt(req.params.id);

      // 1. Lấy thông tin bài test
      const testInfo = await testModel.getTestById(testId);
      if (!testInfo) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin bộ câu hỏi này' });
      }

      // 2. Lấy danh sách câu hỏi và đáp án (Dữ liệu phẳng)
      const rawData = await testModel.getQuestionsAndOptions(testId);

      // 3. THUẬT TOÁN GỘP CÂY DỮ LIỆU (NEST OBJECT)
      // Chuyển hàng chục dòng query thành dạng cấu trúc cha - con để FE gọi map() vẽ UI
      const questionsMap = {};
      rawData.forEach(row => {
        // Nếu câu hỏi này chưa có trong bộ chứa, thì khởi tạo nó
        if (!questionsMap[row.question_id]) {
          questionsMap[row.question_id] = {
            id: row.question_id,
            content: row.question_content,
            order: row.question_order,
            options: [] // Khởi tạo mảng rỗng để nhét đáp án vào sau
          };
        }
        // Sau đó đẩy đáp án vào trong options của câu hỏi đó
        questionsMap[row.question_id].options.push({
          id: row.option_id,
          content: row.option_content,
          score: row.score
        });
      });

      // Chuyển cái bộ chứa (Map) về lại thành Mảng (Array) chuẩn JSON
      const questionsArray = Object.values(questionsMap);

      // 4. Trả về kết quả cho Client
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

  // POST /api/tests/submit
  submitTest: async (req, res, next) => {
    try {
      // 1. Kiểm tra xem là Khách hay User có tài khoản
      const userId = req.user ? req.user.user_id : null;
      const isGuest = !userId;

      const { test_id, option_ids } = req.body;

      if (!test_id || !option_ids || !Array.isArray(option_ids) || option_ids.length === 0) {
        return res.status(400).json({ message: 'Dữ liệu nộp bài không hợp lệ, mảng đáp án không được trống' });
      }

      // 2. Đưa mảng option_ids qua Model để cộng tổng điểm
      const numericOptionIds = option_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      const totalScore = await testModel.getOptionsScore(numericOptionIds);

      // 3. Chấm điểm (File utils/scoring.js) 
      let category = '';
      if (test_id === 1) {
        category = scoring.evaluateZungAnxiety(totalScore);
      } else {
        category = 'Chưa xác định mức độ';
      }

      // 4. XÁC ĐỊNH MỨC ĐỘ ĐIỀU TRỊ (Treatment Status)
      let treatment_status = 'healthy';
      if (category.includes('nhẹ') || category.includes('vừa')) {
        treatment_status = 'treatment'; // Cần Modal Lộ trình
      } else if (category.includes('nặng')) {
        treatment_status = 'emergency'; // Cần Modal Cấp cứu
      }

      // 5. LƯU KẾT QUẢ VÀO DATABASE (CHỈ DÀNH CHO USER ĐÃ ĐĂNG KÝ)
      let resultId = null;
      if (!isGuest) {
        resultId = await testModel.saveTestResult(userId, test_id, totalScore, category);
      }

      // 6. Trả kết quả 
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

  // POST /api/tests/emergency-email
  sendEmergencyEmail: async (req, res, next) => {
    try {
      // 1. Lấy thông tin bệnh nhân từ Database để đảm bảo chính xác 100%
      const userId = req.user.user_id;
      const userModel = require('../models/userModel');
      const userInfo = await userModel.getUserById(userId);
      
      const userEmail = userInfo.email;
      const userName = userInfo.full_name || 'Một bệnh nhân';

      // 2. Lấy điểm số từ Body (Frontend gửi lên điểm số hoặc kết quả bài test gần nhất)
      const { category, score } = req.body;

      if (!category) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tình trạng bệnh (category)' });
      }

      // 3. Chuẩn bị nội dung Email
      const doctorEmail = 'mquan8912@gmail.com'; // Email của Bệnh viện/Bác sĩ tiếp nhận
      const subject = `[CẤP CỨU] Yêu cầu hỗ trợ y tế khẩn cấp từ bệnh nhân ${userName}`;
      const content = `Chào Bác sĩ,\n\nBệnh nhân ${userName} (Email liên hệ: ${userEmail}) vừa thực hiện bài đánh giá tâm lý trên hệ thống và ghi nhận kết quả ở mức báo động.\n\n- Loại bệnh chẩn đoán: ${category}
      \n- Điểm số: ${score || 'Không xác định'}\n
      \nKính mong Bệnh viện/Bác sĩ ưu tiên liên hệ và hỗ trợ bệnh nhân này trong thời gian sớm nhất.
      \n\nTrân trọng,\nHệ thống Cảnh báo - Psychological Health App`;

      // 4. Gửi Email thông qua Nodemailer
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

  // GET /api/tests/latest
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
  }
};

module.exports = testController;
