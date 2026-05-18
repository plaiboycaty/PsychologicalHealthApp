// ==========================================
// 1. DỮ LIỆU ONBOARDING (Màn hình giới thiệu)
// ==========================================
export const MOCK_ONBOARDING = [
  {
    id: '1',
    title: 'Đánh Giá Tâm Lý',
    description: 'Thực hiện các bài kiểm tra tâm lý chuẩn y khoa (ZUNG, BECK, YOUNG) để hệ thống hiểu rõ tình trạng sức khỏe tinh thần của bạn.',
    image: require('../../assets/images/onboard/onboard1.png'),
    color: '#2F80ED'
  },
  {
    id: '2',
    title: 'Lộ Trình 52Hz',
    description: 'Nhận phác đồ điều trị 4 tuần được cá nhân hóa, giúp bạn từng bước vượt qua áp lực và tìm lại sự bình yên trong tâm hồn.',
    image: require('../../assets/images/onboard/onboard2.png'),
    color: '#6C5CE7'
  },
  {
    id: '3',
    title: 'Nhật Ký & Cảnh Báo',
    description: 'Ghi lại cảm xúc mỗi ngày. Tự động gửi thông báo khẩn cấp đến Bác sĩ nếu hệ thống phát hiện dấu hiệu rủi ro cao.',
    image: require('../../assets/images/onboard/onboard3.png'),
    color: '#FF7675'
  }
];

// ==========================================
// 2. DỮ LIỆU NHẬT KÝ & CẢM XÚC (Diaries)
// ==========================================
export const MOCK_EMOTIONS = [
  { id: 1, name: 'Mệt mỏi', icon: require('../../assets/images/emotions/tired.png'), color: '#27AE60' },
  { id: 2, name: 'Tức giận', icon: require('../../assets/images/emotions/angry.png'), color: '#2F80ED' },
  { id: 3, name: 'Ngạc nhiên', icon: require('../../assets/images/emotions/surspise.png'), color: '#F2C94C' },
  { id: 4, name: 'Hạnh phúc', icon: require('../../assets/images/emotions/happy.png'), color: '#828282' },
  { id: 5, name: 'Trống rỗng', icon: require('../../assets/images/emotions/empty.png'), color: '#EB5757' },
  { id: 6, name: 'Buồn bã', icon: require('../../assets/images/emotions/sad.png'), color: '#88D498' },
];

export const MOCK_DIARIES = [
  {
    id: 1,
    title: 'Một ngày năng suất',
    content: 'Hôm nay mình đã hoàn thành được 3 task lớn, cảm thấy rất vui và nhẹ nhõm. Hy vọng ngày mai cũng sẽ như vậy.',
    emotion_id: 1,
    emotion_name: 'Hạnh phúc',
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=60',
    created_at: '2026-05-18T10:00:00Z',
  },
  {
    id: 2,
    title: 'Áp lực công việc',
    content: 'Deadline sắp đến gần làm mình không thể tập trung. Cảm thấy đau đầu và hơi khó thở.',
    emotion_id: 5,
    emotion_name: 'Tức giận',
    image_url: null,
    created_at: '2026-05-19T15:30:00Z',
  }
];

// ==========================================
// 3. DỮ LIỆU BÀI TEST TÂM LÝ
// ==========================================
export const MOCK_TESTS = [
  {
    id: 1,
    title: 'Thang đo Lo âu Zung (SAS)',
    description: 'Bài kiểm tra 20 câu hỏi giúp đánh giá mức độ lo âu của bạn trong 1-2 tuần qua.',
    question_count: 20,
    duration: '5-10 phút'
  },
  {
    id: 2,
    title: 'Thang đo Trầm cảm Beck (BDI)',
    description: 'Đánh giá chi tiết các triệu chứng trầm cảm và mức độ nghiêm trọng.',
    question_count: 21,
    duration: '10-15 phút'
  }
];

// Chi tiết 1 bài test (Ví dụ vài câu của bài Zung)
export const MOCK_TEST_DETAILS = {
  id: 1,
  title: 'Thang đo Lo âu Zung (SAS)',
  questions: [
    {
      id: 101,
      content: 'Tôi cảm thấy lo lắng và bồn chồn vô cớ',
      options: [
        { id: 1, content: 'Không bao giờ', score: 1 },
        { id: 2, content: 'Đôi khi', score: 2 },
        { id: 3, content: 'Thường xuyên', score: 3 },
        { id: 4, content: 'Hầu như luôn luôn', score: 4 }
      ]
    },
    {
      id: 102,
      content: 'Tôi dễ bị run rẩy tay chân',
      options: [
        { id: 5, content: 'Không bao giờ', score: 1 },
        { id: 6, content: 'Đôi khi', score: 2 },
        { id: 7, content: 'Thường xuyên', score: 3 },
        { id: 8, content: 'Hầu như luôn luôn', score: 4 }
      ]
    },
    {
      id: 103,
      content: 'Tôi cảm thấy tim đập nhanh hoặc đánh trống ngực',
      options: [
        { id: 9, content: 'Không bao giờ', score: 1 },
        { id: 10, content: 'Đôi khi', score: 2 },
        { id: 11, content: 'Thường xuyên', score: 3 },
        { id: 12, content: 'Hầu như luôn luôn', score: 4 }
      ]
    }
  ]
};

// ==========================================
// 5. DỮ LIỆU THỐNG KÊ (Biểu đồ)
// ==========================================
// Dữ liệu cho react-native-gifted-charts (Biểu đồ đường)
export const MOCK_STATISTICS_LINE = [
  { value: 45, label: 'T1' },
  { value: 50, label: 'T2' },
  { value: 65, label: 'T3' },
  { value: 55, label: 'T4' },
  { value: 40, label: 'T5' },
];

// Dữ liệu cho react-native-gifted-charts (Biểu đồ tròn)
export const MOCK_STATISTICS_PIE = [
  { value: 40, color: '#27AE60', text: 'Vui' },
  { value: 30, color: '#2F80ED', text: 'Bình thường' },
  { value: 20, color: '#F2C94C', text: 'Mệt mỏi' },
  { value: 10, color: '#EB5757', text: 'Căng thẳng' },
];
