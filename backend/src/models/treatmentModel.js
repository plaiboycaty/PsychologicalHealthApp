const db = require('../config/db');

const treatmentModel = {
  // 1. Lấy kết quả bài test gần nhất của người dùng
  getLatestTestCategory: async (userId) => {
    const [rows] = await db.query(
      'SELECT category FROM test_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows[0] ? rows[0].category : null;
  },

  // 2. Lấy 4 tuần lộ trình tương ứng với hạng mục bệnh đó
  getRoadmapByCategory: async (category) => {
    const [rows] = await db.query(
      'SELECT id, week_number, title, content FROM treatments WHERE category = ? ORDER BY week_number ASC',
      [category]
    );
    return rows;
  },

  // 3. Lấy danh sách các task đã hoàn thành của người dùng
  getCompletedTasks: async (userId) => {
    const [rows] = await db.query(
      'SELECT task_id FROM user_completed_tasks WHERE user_id = ?',
      [userId]
    );
    return rows.map(row => row.task_id);
  },

  // 4. Bật/Tắt trạng thái hoàn thành của 1 task
  toggleTask: async (userId, taskId) => {
    // Kiểm tra xem đã hoàn thành chưa
    const [rows] = await db.query(
      'SELECT * FROM user_completed_tasks WHERE user_id = ? AND task_id = ?',
      [userId, taskId]
    );
    
    if (rows.length > 0) {
      // Đã hoàn thành -> Bỏ hoàn thành (Xóa)
      await db.query(
        'DELETE FROM user_completed_tasks WHERE user_id = ? AND task_id = ?',
        [userId, taskId]
      );
      return { status: 'uncompleted', taskId };
    } else {
      // Chưa hoàn thành -> Đánh dấu hoàn thành (Thêm)
      await db.query(
        'INSERT INTO user_completed_tasks (user_id, task_id) VALUES (?, ?)',
        [userId, taskId]
      );
      return { status: 'completed', taskId };
    }
  }
};

module.exports = treatmentModel;
