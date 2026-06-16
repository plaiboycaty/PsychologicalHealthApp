const treatmentModel = require('../models/treatmentModel');

const treatmentController = {
  // Lấy Lộ trình điều trị dựa trên bài Test gần nhất
  getMyRoadmap: async (req, res, next) => {
    try {
      const userId = req.user.user_id;

      // 1. Lấy kết quả bài test gần nhất
      const testResult = await treatmentModel.getLatestTestResult(userId);

      // 2. Các trạng thái chặn sớm
      if (!testResult) {
        return res.status(404).json({
          status: 'no_test',
          message: 'Bạn chưa làm bài đánh giá tâm lý nào. Vui lòng làm bài test để nhận lộ trình.'
        });
      }

      if (testResult.is_roadmap_completed) {
        return res.status(200).json({
          status: 'roadmap_completed_need_test',
          message: 'Chúc mừng bạn đã hoàn thành lộ trình! Hãy làm bài test mới để đánh giá lại tâm lý.'
        });
      }

      const category = testResult.category;
      const healthyCategories = ['Không lo âu', 'Không có trầm cảm', 'Không có biểu hiện hưng cảm', 'Khỏe mạnh'];
      
      if (healthyCategories.includes(category)) {
        return res.status(200).json({
          status: 'healthy',
          message: 'Sức khỏe tâm lý của bạn rất tốt! Bạn không cần lộ trình điều trị.'
        });
      }

      // 3. Lấy dữ liệu lộ trình từ bảng tiến độ (JOIN với treatments)
      const roadmapProgress = await treatmentModel.getRoadmapProgress(testResult.id);
      if (roadmapProgress.length === 0) {
        return res.status(404).json({
          status: 'missing_data',
          message: `Hệ thống chưa tạo tiến trình cho lộ trình này.`
        });
      }

      // 4. Tính toán Khóa Thời Gian và Trạng thái các Tuần
      const createdAtDate = new Date(testResult.created_at);
      const now = new Date();
      // Tính số ngày đã trôi qua
      const daysElapsed = Math.floor((now - createdAtDate) / (1000 * 60 * 60 * 24));

      let previousWeekCompleted = true; // Cờ theo dõi tuần trước đã xong chưa
      let allCompletedTasks = []; // Dồn tất cả các task đã xong của các tuần lại để gửi về Frontend

      const formattedRoadmap = roadmapProgress.map(week => {
        let parsedTasks = [];
        try {
          parsedTasks = JSON.parse(week.content || '[]');
        } catch (e) {
          console.error(`Lỗi parse tasks từ DB cho tuần ${week.week_number}:`, e);
        }

        let weekCompletedTasks = [];
        try {
          weekCompletedTasks = typeof week.completed_tasks === 'string'
            ? JSON.parse(week.completed_tasks)
            : (week.completed_tasks || []);
        } catch(e) {}
        
        allCompletedTasks.push(...weekCompletedTasks);

        let weekStatus = 'locked';
        const requiredDays = (week.week_number - 1) * 7;

        // Nếu ĐỦ NGÀY và TUẦN TRƯỚC ĐÃ XONG -> Mở khóa
        if (daysElapsed >= requiredDays && previousWeekCompleted) {
          const isWeekDone = parsedTasks.length > 0 && parsedTasks.every(t => weekCompletedTasks.includes(t.taskId));
          if (isWeekDone) {
            weekStatus = 'completed';
          } else {
            weekStatus = 'in_progress';
            previousWeekCompleted = false; // Chưa xong tuần này thì tuần sau bị khóa
          }
        } else {
          weekStatus = 'locked';
          previousWeekCompleted = false; // Cắt đứt chuỗi mở khóa
        }

        return {
          id: week.treatment_id,
          week_number: week.week_number,
          category: week.category,
          title: week.title,
          status: weekStatus,
          tasks: parsedTasks
        };
      });

      let isEmergency = category.includes('nặng');

      res.status(200).json({
        status: isEmergency ? 'emergency' : 'treatment',
        category: category,
        is_emergency: isEmergency,
        completed_tasks: allCompletedTasks, // Trả về dạng mảng gộp như trước đây để Frontend không đổi code
        days_elapsed: daysElapsed,
        data: formattedRoadmap
      });

    } catch (error) {
      next(error);
    }
  },

  // Đánh dấu hoàn thành / Bỏ hoàn thành một Task
  toggleTaskProgress: async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { task_id } = req.body;

      if (!task_id) {
        return res.status(400).json({ message: 'Thiếu task_id' });
      }

      // 1. Kiểm tra session hiện tại
      const testResult = await treatmentModel.getLatestTestResult(userId);
      if (!testResult) return res.status(404).json({ message: 'Chưa có bài test' });
      if (testResult.is_roadmap_completed) return res.status(400).json({ message: 'Lộ trình này đã kết thúc' });

      // 2. Validate Time-Gating và tìm Tuần chứa Task này
      const roadmapProgress = await treatmentModel.getRoadmapProgress(testResult.id);
      let targetWeek = null;
      let totalTasksCount = 0;
      let totalCompletedCount = 0;

      for (const week of roadmapProgress) {
        const tasks = JSON.parse(week.content || '[]');
        totalTasksCount += tasks.length;
        
        const weekCompletedTasks = typeof week.completed_tasks === 'string'
            ? JSON.parse(week.completed_tasks)
            : (week.completed_tasks || []);
        totalCompletedCount += weekCompletedTasks.length;

        if (tasks.some(t => t.taskId === task_id)) {
          targetWeek = week;
        }
      }

      if (!targetWeek) return res.status(404).json({ message: 'Task không tồn tại trong lộ trình' });

      // Tính thời gian
      const daysElapsed = Math.floor((new Date() - new Date(testResult.created_at)) / (1000 * 60 * 60 * 24));
      const requiredDays = (targetWeek.week_number - 1) * 7;

      if (daysElapsed < requiredDays) {
        return res.status(403).json({
          message: `Cơ thể cần thời gian nghỉ ngơi. Hãy quay lại sau ${requiredDays - daysElapsed} ngày nữa nhé!`
        });
      }

      // 3. Thực hiện Toggle
      const weekCompletedTasks = typeof targetWeek.completed_tasks === 'string'
        ? JSON.parse(targetWeek.completed_tasks)
        : (targetWeek.completed_tasks || []);

      const result = await treatmentModel.toggleTask(targetWeek.progress_id, task_id, weekCompletedTasks);

      // 4. Kiểm tra xem có phải là Task cuối cùng của toàn bộ lộ trình không
      let isFinishedAll = false;
      if (result.status === 'completed') {
        // Nếu vừa check xong 1 task, cộng thêm 1 vào tổng số task đã hoàn thành để so sánh
        if ((totalCompletedCount + 1) >= totalTasksCount) {
          isFinishedAll = true;
          await treatmentModel.updateRoadmapStatus(testResult.id, true);
        }
      }

      res.status(200).json({
        message: 'Cập nhật tiến trình thành công',
        data: result,
        is_finished_all: isFinishedAll
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = treatmentController;
