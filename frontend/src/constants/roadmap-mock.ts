// ==========================================
// MOCK DATA: Lộ trình 52Hz (4 Tuần)
// Tương ứng với bảng `treatments` trong Database
// ==========================================

export type TaskItem = {
  taskId: string;
  taskTitle: string;
  taskDesc: string;
};

export type WeekStatus = 'completed' | 'in_progress' | 'locked';

export type WeekData = {
  id: number;
  week_number: number;
  category: string;
  title: string;
  status: WeekStatus;
  tasks: TaskItem[];
};

export const MOCK_ROADMAP_DATA: WeekData[] = [
  {
    id: 1,
    week_number: 1,
    category: 'Lo âu mức độ nhẹ',
    title: 'Khởi động & Nhận thức',
    status: 'completed',
    tasks: [
      {
        taskId: '1-1',
        taskTitle: 'Viết nhật ký cảm xúc 3 lần /tuần',
        taskDesc: 'Ghi lại những cảm xúc và suy nghĩ của bạn mỗi ngày trong ít nhất 5 phút.',
      },
      {
        taskId: '1-2',
        taskTitle: 'Thực hành hít thở sâu 4-7-8',
        taskDesc: 'Hít vào 4 giây, nín 7 giây, thở ra 8 giây. Lặp lại 3 lần mỗi buổi tối.',
      },
      {
        taskId: '1-3',
        taskTitle: 'Nhận diện cảm xúc tiêu cực',
        taskDesc: 'Khi cảm thấy lo âu, dừng lại và đặt tên cho cảm xúc đó thay vì né tránh.',
      },
    ],
  },
  {
    id: 2,
    week_number: 2,
    category: 'Lo âu mức độ nhẹ',
    title: 'Quản lý căng thẳng',
    status: 'in_progress',
    tasks: [
      {
        taskId: '2-1',
        taskTitle: 'Nghe nhạc thiền định',
        taskDesc: 'Dành 15 phút mỗi ngày nghe nhạc tần số 432Hz hoặc nhạc thiền tự nhiên.',
      },
      {
        taskId: '2-2',
        taskTitle: 'Tập Yoga nhẹ nhàng',
        taskDesc: 'Thực hành ít nhất 2 buổi Yoga hoặc đi bộ 20 phút để giải phóng căng thẳng.',
      },
      {
        taskId: '2-3',
        taskTitle: 'Thiết lập ranh giới cá nhân',
        taskDesc: 'Tập nói "không" với những yêu cầu vượt quá khả năng và sức lực của bạn.',
      },
    ],
  },
  {
    id: 3,
    week_number: 3,
    category: 'Lo âu mức độ nhẹ',
    title: 'Tái cấu trúc tư duy',
    status: 'locked',
    tasks: [
      {
        taskId: '3-1',
        taskTitle: 'Thách thức suy nghĩ tiêu cực',
        taskDesc: 'Mỗi khi có suy nghĩ tiêu cực, hãy tìm 3 bằng chứng ngược lại để phản bác nó.',
      },
      {
        taskId: '3-2',
        taskTitle: 'Viết 3 điều biết ơn',
        taskDesc: 'Mỗi buổi sáng, ghi xuống 3 điều dù nhỏ nhoi mà bạn biết ơn trong cuộc sống.',
      },
      {
        taskId: '3-3',
        taskTitle: 'Đọc bài viết về tư duy tích cực',
        taskDesc: 'Đọc ít nhất 1 bài viết hoặc chương sách về tâm lý học tích cực trong tuần này.',
      },
    ],
  },
  {
    id: 4,
    week_number: 4,
    category: 'Lo âu mức độ nhẹ',
    title: 'Duy trì & Phát triển',
    status: 'locked',
    tasks: [
      {
        taskId: '4-1',
        taskTitle: 'Đánh giá lại bài Test tâm lý',
        taskDesc: 'Làm lại bài Test Zung để so sánh kết quả với tuần đầu, ghi nhận sự tiến bộ.',
      },
      {
        taskId: '4-2',
        taskTitle: 'Lập kế hoạch tự chăm sóc',
        taskDesc: 'Thiết kế thói quen "Self-care" cá nhân hóa để duy trì sau khi kết thúc chương trình.',
      },
      {
        taskId: '4-3',
        taskTitle: 'Chia sẻ hành trình của bạn',
        taskDesc: 'Viết một đoạn ngắn về những gì bạn đã học được và thay đổi sau 4 tuần này.',
      },
    ],
  },
];
