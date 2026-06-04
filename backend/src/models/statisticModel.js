const db = require('../config/db');

const statisticModel = {
  // Lấy lịch sử làm bài test (Dành cho Line Chart)
  getTestProgression: async (userId, period) => {
    let query = 'SELECT test_id, total_score, category, created_at FROM test_results WHERE user_id = ?';

    // Kỹ thuật Dynamic Query (Truy vấn động) dựa trên bộ lọc
    if (period === 'week') {
      query += ' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (period === 'month') {
      query += ' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    }

    query += ' ORDER BY created_at ASC';
    const [rows] = await db.query(query, [userId]);
    return rows;
  },

  // Đếm tỷ lệ cảm xúc (Dành cho Pie Chart)
  getEmotionCounts: async (userId, period) => {
    let query = `
      SELECT e.name, e.icon_url, COUNT(d.id) as count 
      FROM diaries d 
      JOIN emotions e ON d.emotion_id = e.id 
      WHERE d.user_id = ?
    `;

    if (period === 'week') {
      query += ' AND d.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (period === 'month') {
      query += ' AND d.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    }

    query += ' GROUP BY e.id, e.name, e.icon_url';
    const [rows] = await db.query(query, [userId]);
    return rows;
  }
};

module.exports = statisticModel;
