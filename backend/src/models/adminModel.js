const db = require('../config/db');

const adminModel = {
  createTest: async (testData) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Bước 1: Lưu thông tin chung của bài test vào bảng `tests`
      const [testResult] = await connection.query(
        'INSERT INTO tests (name) VALUES (?)',
        [testData.name]
      );
      const testId = testResult.insertId;

      if (testData.questions && testData.questions.length > 0) {
        for (const question of testData.questions) {
          const [qResult] = await connection.query(
            'INSERT INTO questions (test_id, content, question_order) VALUES (?, ?, ?)',
            [testId, question.content, question.question_order]
          );
          const questionId = qResult.insertId;

          // Bước 3: Duyệt qua mảng options của câu hỏi này và lưu vào bảng `options`
          if (question.options && question.options.length > 0) {
            for (const option of question.options) {
              await connection.query(
                'INSERT INTO options (question_id, content, score) VALUES (?, ?, ?)',
                [questionId, option.content, option.score]
              );
            }
          }
        }
      }

      // NẾU TẤT CẢ ĐỀU THÀNH CÔNG -> COMMIT ĐỂ LƯU XUỐNG Ổ CỨNG
      await connection.commit();
      return testId;

    } catch (error) {
      // NẾU CÓ BẤT KỲ LỖI NÀO (ví dụ: sai kiểu dữ liệu) -> ROLLBACK (HỦY TOÀN BỘ)
      await connection.rollback();
      throw error;
    } finally {
      // Luôn luôn phải trả lại connection cho Pool dù thành công hay thất bại
      connection.release();
    }
  },

  getDashboardStats: async () => {
    // Đếm tổng số người dùng (chỉ tính User thường, không tính Admin)
    const [userRows] = await db.query('SELECT COUNT(*) AS total_users FROM users WHERE role = "user"');

    // Đếm tổng số lượt làm bài test của tất cả mọi người
    const [testRows] = await db.query('SELECT COUNT(*) AS total_tests_taken FROM test_results');

    return {
      total_users: userRows[0].total_users,
      total_tests_taken: testRows[0].total_tests_taken
    };
  },

  updateTest: async (testId, testData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // 1. Cập nhật thông tin chung (tên bài test)
      if (testData.name) {
        await connection.query('UPDATE tests SET name = ? WHERE id = ?', [testData.name, testId]);
      }

      // 2. Cập nhật danh sách câu hỏi
      // Chiến thuật an toàn nhất: Xóa toàn bộ câu hỏi cũ và Thêm lại câu hỏi mới từ request
      if (testData.questions && testData.questions.length > 0) {
        // -- XÓA CÂU HỎI CŨ --
        const [oldQuestions] = await connection.query('SELECT id FROM questions WHERE test_id = ?', [testId]);
        if (oldQuestions.length > 0) {
          const oldQuestionIds = oldQuestions.map(q => q.id);
          const placeholders = oldQuestionIds.map(() => '?').join(',');
          
          // Xóa các options thuộc về câu hỏi cũ
          await connection.query(`DELETE FROM options WHERE question_id IN (${placeholders})`, oldQuestionIds);
          // Xóa các câu hỏi cũ
          await connection.query('DELETE FROM questions WHERE test_id = ?', [testId]);
        }

        // -- THÊM CÂU HỎI MỚI --
        for (const question of testData.questions) {
          const [qResult] = await connection.query(
            'INSERT INTO questions (test_id, content, question_order) VALUES (?, ?, ?)',
            [testId, question.content, question.question_order]
          );
          const questionId = qResult.insertId;

          if (question.options && question.options.length > 0) {
            for (const option of question.options) {
              await connection.query(
                'INSERT INTO options (question_id, content, score) VALUES (?, ?, ?)',
                [questionId, option.content, option.score]
              );
            }
          }
        }
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  deleteTest: async (testId) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // 1. Lấy tất cả câu hỏi của bài test này
      const [questions] = await connection.query('SELECT id FROM questions WHERE test_id = ?', [testId]);
      
      if (questions.length > 0) {
        const questionIds = questions.map(q => q.id);
        const placeholders = questionIds.map(() => '?').join(',');
        
        // 2. Xóa các lựa chọn (options) của câu hỏi
        await connection.query(`DELETE FROM options WHERE question_id IN (${placeholders})`, questionIds);
        
        // 3. Xóa câu hỏi (questions)
        await connection.query('DELETE FROM questions WHERE test_id = ?', [testId]);
      }
      
      // 4. Xóa luôn dữ liệu lịch sử làm bài test này (để tránh lỗi khóa ngoại ForeignKey)
      await connection.query('DELETE FROM test_results WHERE test_id = ?', [testId]);
      
      // 5. Xóa bài test
      const [result] = await connection.query('DELETE FROM tests WHERE id = ?', [testId]);
      
      await connection.commit();
      return result.affectedRows > 0; // Trả về true nếu xóa thành công
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = adminModel;
