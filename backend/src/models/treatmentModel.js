const db = require('../config/db');

const treatmentModel = {
  // 1. Lấy toàn bộ thông tin bài test gần nhất của người dùng
  getLatestTestResult: async (userId) => {
    const [rows] = await db.query(
      'SELECT id, category, created_at, completed_tasks, is_roadmap_completed FROM test_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (!rows[0]) return null;
    
    let completed = [];
    try {
      completed = typeof rows[0].completed_tasks === 'string' 
        ? JSON.parse(rows[0].completed_tasks) 
        : (rows[0].completed_tasks || []);
    } catch (e) {
      console.error('Lỗi parse completed_tasks từ DB:', e);
    }
    
    return {
      ...rows[0],
      completed_tasks: completed
    };
  },

  // 2. Lấy 4 tuần lộ trình tương ứng với hạng mục bệnh đó
  getRoadmapByCategory: async (category) => {
    const [rows] = await db.query(
      'SELECT id, week_number, title, content FROM treatments WHERE category = ? ORDER BY week_number ASC',
      [category]
    );
    return rows;
  },

  // 3. Bật/Tắt trạng thái hoàn thành của 1 task
  toggleTask: async (testResultId, taskId, currentTasks) => {
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
      'UPDATE test_results SET completed_tasks = ? WHERE id = ?',
      [JSON.stringify(newTasks), testResultId]
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
