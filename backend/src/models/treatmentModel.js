const db = require('../config/db');

const treatmentModel = {
  // 1. Lấy toàn bộ thông tin bài test gần nhất của người dùng
  getLatestTestResult: async (userId) => {
    const [rows] = await db.query(
      'SELECT id, category, created_at, is_roadmap_completed FROM test_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  },

  // 2. Lấy Tiến độ Lộ trình của 1 bài test cụ thể (JOIN 2 bảng)
  getRoadmapProgress: async (testResultId) => {
    const query = `
      SELECT 
        t.id AS treatment_id, 
        t.week_number, 
        t.category,
        t.title, 
        t.content,
        utp.id AS progress_id,
        utp.completed_tasks
      FROM user_treatment_progress utp
      JOIN treatments t ON utp.treatment_id = t.id
      WHERE utp.test_result_id = ?
      ORDER BY t.week_number ASC
    `;
    const [rows] = await db.query(query, [testResultId]);
    return rows;
  },

  // 3. Bật/Tắt trạng thái hoàn thành của 1 task trong 1 tuần
  toggleTask: async (progressId, taskId, currentTasks) => {
    let newTasks = [...currentTasks];
    let status = '';

    if (newTasks.includes(taskId)) {
      // Đã có -> Xóa đi
      newTasks = newTasks.filter(id => id !== taskId);
      status = 'uncompleted';
    } else {
      // Chưa có -> Thêm vào
      newTasks.push(taskId);
      status = 'completed';
    }

    await db.query(
      'UPDATE user_treatment_progress SET completed_tasks = ? WHERE id = ?',
      [JSON.stringify(newTasks), progressId]
    );

    return { status, taskId, newTasks };
  },

  // 4. Cập nhật trạng thái Khóa lộ trình
  updateRoadmapStatus: async (testResultId, isCompleted) => {
    await db.query(
      'UPDATE test_results SET is_roadmap_completed = ? WHERE id = ?',
      [isCompleted, testResultId]
    );
  }
};

module.exports = treatmentModel;
