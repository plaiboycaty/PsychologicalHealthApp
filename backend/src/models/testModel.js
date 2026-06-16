const db = require('../config/db');

const testModel = {
  // Lấy danh sách tất cả bài test
  getAllTests: async () => {
    const [rows] = await db.query('SELECT * FROM tests');
    return rows;
  },

  // Lấy thông tin miêu tả cơ bản của bài test
  getTestById: async (testId) => {
    const [rows] = await db.query('SELECT * FROM tests WHERE id = ?', [testId]);
    return rows[0];
  },

  // JOIN bảng câu hỏi và đáp án lại với nhau
  getQuestionsAndOptions: async (testId) => {
    const query = `
      SELECT 
        q.id AS question_id, q.content AS question_content, q.question_order,
        o.id AS option_id, o.content AS option_content, o.score 
      FROM questions q
      JOIN options o ON q.id = o.question_id
      WHERE q.test_id = ?
      ORDER BY q.question_order ASC, o.score ASC
    `;
    const [rows] = await db.query(query, [testId]);
    return rows;
  },

  // Truy vấn tính tổng điểm của các lựa chọn
  getOptionsScore: async (optionIds) => {
    if (!optionIds || optionIds.length === 0) return 0;

    // Tự động tạo mảng chuỗi '?,?,?' tương ứng độ dài của optionIds để truy vấn an toàn
    const placeholders = optionIds.map(() => '?').join(',');
    const [rows] = await db.query(
      `SELECT SUM(score) AS total_score FROM options WHERE id IN (${placeholders})`,
      optionIds
    );
    return Number(rows[0].total_score) || 0;
  },

  saveTestResult: async (userId, testId, totalScore, category) => {
    const [result] = await db.query(
      'INSERT INTO test_results (user_id, test_id, total_score, category) VALUES (?, ?, ?, ?)',
      [userId, testId, totalScore, category]
    );
    const testResultId = result.insertId;

    // Map category để tìm đúng lộ trình
    let mappedCategory = category;
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('nhẹ')) mappedCategory = 'Mức độ nhẹ';
    else if (lowerCategory.includes('vừa')) mappedCategory = 'Mức độ vừa';
    else if (lowerCategory.includes('rất nặng')) mappedCategory = 'Mức độ rất nặng';
    else if (lowerCategory.includes('nặng')) mappedCategory = 'Mức độ nặng';

    // Lấy danh sách các tuần của lộ trình này từ bảng treatments
    const [treatments] = await db.query('SELECT id FROM treatments WHERE category = ? ORDER BY week_number ASC', [mappedCategory]);
    
    // Nếu có lộ trình (không phải Khỏe mạnh), tiến hành tạo 4 dòng tiến độ
    if (treatments.length > 0) {
      const values = treatments.map(t => [userId, testResultId, t.id, JSON.stringify([])]);
      await db.query(
        'INSERT INTO user_treatment_progress (user_id, test_result_id, treatment_id, completed_tasks) VALUES ?',
        [values]
      );
    }

    return testResultId;
  },

  // Lấy bài test gần nhất của một User
  getLatestTestResultByUserId: async (userId) => {
    const [rows] = await db.query(
      'SELECT created_at, category, total_score FROM test_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  },

  // Lấy toàn bộ lịch sử bài test của User
  getUserTestHistory: async (userId) => {
    const query = `
      SELECT 
        tr.id, tr.test_id, t.name, tr.total_score, tr.category, tr.created_at
      FROM test_results tr
      JOIN tests t ON tr.test_id = t.id
      WHERE tr.user_id = ?
      ORDER BY tr.created_at DESC
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
  }
};

module.exports = testModel;
