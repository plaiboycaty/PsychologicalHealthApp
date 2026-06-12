const db = require('../config/db');

const adminModel = {
  // --- 1. QUẢN LÝ VỎ BÀI TEST ---

  getAllTests: async () => {
    const [rows] = await db.query('SELECT * FROM tests ORDER BY created_at DESC');
    return rows;
  },

  createTestMetadata: async (name, description) => {
    const [result] = await db.query(
      'INSERT INTO tests (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    return result.insertId;
  },

  updateTestMetadata: async (testId, name, description) => {
    const [result] = await db.query(
      'UPDATE tests SET name = ?, description = ? WHERE id = ?',
      [name, description || null, testId]
    );
    return result.affectedRows > 0;
  },

  deleteTest: async (testId) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const [questions] = await connection.query('SELECT id FROM questions WHERE test_id = ?', [testId]);
      
      if (questions.length > 0) {
        const questionIds = questions.map(q => q.id);
        const placeholders = questionIds.map(() => '?').join(',');
        
        await connection.query(`DELETE FROM options WHERE question_id IN (${placeholders})`, questionIds);
        await connection.query('DELETE FROM questions WHERE test_id = ?', [testId]);
      }
      
      await connection.query('DELETE FROM test_results WHERE test_id = ?', [testId]);
      
      const [result] = await connection.query('DELETE FROM tests WHERE id = ?', [testId]);
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // --- 2. QUẢN LÝ CHI TIẾT CÂU HỎI ---

  getQuestionsByTest: async (testId) => {
    // Truy vấn kết hợp (JOIN) câu hỏi và đáp án, sau đó nhóm bằng JavaScript (tránh lỗi trên các bản MySQL/MariaDB cũ không hỗ trợ JSON_ARRAYAGG)
    const query = `
      SELECT 
        q.id AS question_id, q.test_id, q.content AS question_content, q.question_order,
        o.id AS option_id, o.content AS option_content, o.score
      FROM questions q
      LEFT JOIN options o ON q.id = o.question_id
      WHERE q.test_id = ?
      ORDER BY q.question_order ASC, o.score ASC
    `;
    const [rows] = await db.query(query, [testId]);
    
    // Nhóm các options vào từng câu hỏi
    const questionsMap = {};
    
    rows.forEach(row => {
      if (!questionsMap[row.question_id]) {
        questionsMap[row.question_id] = {
          id: row.question_id,
          test_id: row.test_id,
          content: row.question_content,
          question_order: row.question_order,
          options: []
        };
      }
      
      if (row.option_id) {
        questionsMap[row.question_id].options.push({
          id: row.option_id,
          content: row.option_content,
          score: row.score
        });
      }
    });

    // Chuyển object thành mảng và sắp xếp lại theo question_order
    return Object.values(questionsMap).sort((a, b) => a.question_order - b.question_order);
  },

  createQuestion: async (testId, content, questionOrder, options) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [qResult] = await connection.query(
        'INSERT INTO questions (test_id, content, question_order) VALUES (?, ?, ?)',
        [testId, content, questionOrder || 1]
      );
      const questionId = qResult.insertId;

      for (const option of options) {
        await connection.query(
          'INSERT INTO options (question_id, content, score) VALUES (?, ?, ?)',
          [questionId, option.content, option.score]
        );
      }

      await connection.commit();
      return questionId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  updateQuestion: async (questionId, content, questionOrder, options) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Cập nhật câu hỏi
      await connection.query(
        'UPDATE questions SET content = ?, question_order = ? WHERE id = ?',
        [content, questionOrder || 1, questionId]
      );

      // Xóa các lựa chọn cũ
      await connection.query('DELETE FROM options WHERE question_id = ?', [questionId]);

      // Thêm lại các lựa chọn mới
      for (const option of options) {
        await connection.query(
          'INSERT INTO options (question_id, content, score) VALUES (?, ?, ?)',
          [questionId, option.content, option.score]
        );
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

  deleteQuestion: async (questionId) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Xóa options
      await connection.query('DELETE FROM options WHERE question_id = ?', [questionId]);
      
      // Xóa question
      const [result] = await connection.query('DELETE FROM questions WHERE id = ?', [questionId]);
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
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

  getAllUsers: async () => {
    const [rows] = await db.query(
      `SELECT id, full_name, email, gender, dob, avatar_url, role, status, created_at 
       FROM users 
       WHERE role = 'user' 
       ORDER BY created_at DESC`
    );
    return rows;
  },

  updateUserStatus: async (userId, status) => {
    const [result] = await db.query(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, userId]
    );
    return result.affectedRows > 0;
  },

  getReportData: async (startDate, endDate) => {
    // Nếu có tham số thời gian, truy vấn theo thời gian
    const dateQuery = startDate && endDate ? 'AND created_at BETWEEN ? AND ?' : '';
    const params = startDate && endDate ? [startDate, endDate] : [];

    // Tổng user trong khoảng thời gian
    const [userRows] = await db.query(
      `SELECT COUNT(*) AS new_users FROM users WHERE role = "user" ${dateQuery}`,
      params
    );

    // Tổng số lượt làm bài test trong khoảng thời gian
    const [testRows] = await db.query(
      `SELECT COUNT(*) AS new_tests FROM test_results WHERE 1=1 ${dateQuery}`,
      params
    );

    // Dữ liệu biểu đồ (Nhóm theo ngày)
    const [userChartData] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM users 
       WHERE role = "user" ${dateQuery} 
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`,
       params
    );

    // Tổng số all-time để tham chiếu
    const [allTimeUsers] = await db.query('SELECT COUNT(*) AS total FROM users WHERE role = "user"');
    const [allTimeTests] = await db.query('SELECT COUNT(*) AS total FROM test_results');

    return {
      all_time_users: allTimeUsers[0].total,
      all_time_tests: allTimeTests[0].total,
      new_users: userRows[0].new_users,
      new_tests: testRows[0].new_tests,
      user_chart: userChartData
    };
  }
};

module.exports = adminModel;
