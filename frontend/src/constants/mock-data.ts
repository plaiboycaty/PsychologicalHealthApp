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
  { id: 1, name: 'Mệt mỏi', icon: require('../../assets/images/emotions/tired.png'), color: '#aeaefcff' },
  { id: 2, name: 'Tức giận', icon: require('../../assets/images/emotions/angry.png'), color: '#EB5757' },
  { id: 3, name: 'Ngạc nhiên', icon: require('../../assets/images/emotions/surspise.png'), color: '#F2C94C' },
  { id: 4, name: 'Hạnh phúc', icon: require('../../assets/images/emotions/happy.png'), color: '#27AE60' },
  { id: 5, name: 'Trống rỗng', icon: require('../../assets/images/emotions/empty.png'), color: '#5F5F5F' },
  { id: 6, name: 'Buồn bã', icon: require('../../assets/images/emotions/sad.png'), color: '#2F80ED' },
];

export const MOCK_DIARIES = [
  {
    id: 4,
    title: 'Một ngày năng suất',
    content: 'Hôm nay mình đã hoàn thành được 3 task lớn, cảm thấy rất vui và nhẹ nhõm. Hy vọng ngày mai cũng sẽ như vậy.',
    emotion_id: 4,
    emotion_name: 'Hạnh phúc',
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=60',
    created_at: '2026-05-18T10:00:00+07:00',
  },
  {
    id: 2,
    title: 'Áp lực công việc',
    content: 'Deadline sắp đến gần làm mình không thể tập trung. Cảm thấy đau đầu và hơi khó thở.',
    emotion_id: 5,
    emotion_name: 'Trống rỗng',
    image_url: null,
    created_at: '2026-05-19T15:30:00+07:00',
  }
];

// ==========================================
// 3. DỮ LIỆU BÀI TEST TÂM LÝ
// ==========================================
export const MOCK_TESTS = {
  test_id: 1,
  name: "Bậc thang đánh giá lo âu ZUNG (SAS)",
  total_questions: 5,
  questions: [
    {
      question_id: 1,
      question_order: 1,
      content: "Tôi cảm thấy nóng nảy và lo âu hơn thường lệ.",
      options: [
        { option_id: 101, content: "Không có", score: 1 },
        { option_id: 102, content: "Đôi khi", score: 2 },
        { option_id: 103, content: "Thường xuyên", score: 3 },
        { option_id: 104, content: "Luôn luôn", score: 4 }
      ]
    },
    {
      question_id: 2,
      question_order: 2,
      content: "Câu 16: Chọn phát biểu đúng nhất về giấc ngủ",
      // Ví dụ mô phỏng bài BECK có nhiều đáp án và chữ rất dài
      options: [
        { option_id: 201, content: "Không thấy có chút thay đổi gì trong giấc ngủ của tôi.", score: 0 },
        { option_id: 202, content: "Tôi ngủ hơi nhiều hơn trước.", score: 1 },
        { option_id: 203, content: "Tôi ngủ hơi ít hơn trước.", score: 1 },
        { option_id: 204, content: "Tôi thức dậy 1-2 giờ sớm hơn trước và không thể ngủ lại được.", score: 3 }
      ]
    },
    {
      question_id: 3,
      question_order: 3,
      content: "Tôi cảm thấy dễ khóc hoặc muốn khóc.",
      options: [
        { option_id: 301, content: "Không có", score: 1 },
        { option_id: 302, content: "Đôi khi", score: 2 },
        { option_id: 303, content: "Thường xuyên", score: 3 },
        { option_id: 304, content: "Luôn luôn", score: 4 }
      ]
    },
    {
      question_id: 4,
      question_order: 4,
      content: "Tôi cảm thấy tim mình đập nhanh hoặc đập mạnh hơn bình thường.",
      options: [
        { option_id: 401, content: "Không có", score: 1 },
        { option_id: 402, content: "Đôi khi", score: 2 },
        { option_id: 403, content: "Thường xuyên", score: 3 },
        { option_id: 404, content: "Luôn luôn", score: 4 }
      ]
    },
    {
      question_id: 5,
      question_order: 5,
      content: "Tôi cảm thấy lo sợ không có lý do rõ ràng.",
      options: [
        { option_id: 501, content: "Không có", score: 1 },
        { option_id: 502, content: "Đôi khi", score: 2 },
        { option_id: 503, content: "Thường xuyên", score: 3 },
        { option_id: 504, content: "Luôn luôn", score: 4 }
      ]
    }
  ]
};

// Dữ liệu mock chi tiết cho từng loại bài test
export const MOCK_TESTS_MAP: { [key: string]: typeof MOCK_TESTS } = {
  zung: {
    test_id: 1,
    name: "Bậc thang đánh giá lo âu ZUNG (SAS)",
    total_questions: 5,
    questions: [
      {
        question_id: 1,
        question_order: 1,
        content: "Tôi cảm thấy nóng nảy và lo âu hơn thường lệ.",
        options: [
          { option_id: 101, content: "Không có", score: 1 },
          { option_id: 102, content: "Đôi khi", score: 2 },
          { option_id: 103, content: "Thường xuyên", score: 3 },
          { option_id: 104, content: "Luôn luôn", score: 4 }
        ]
      },
      {
        question_id: 2,
        question_order: 2,
        content: "Tôi cảm thấy dễ khóc hoặc muốn khóc.",
        options: [
          { option_id: 201, content: "Không có", score: 1 },
          { option_id: 202, content: "Đôi khi", score: 2 },
          { option_id: 203, content: "Thường xuyên", score: 3 },
          { option_id: 204, content: "Luôn luôn", score: 4 }
        ]
      },
      {
        question_id: 3,
        question_order: 3,
        content: "Tôi cảm thấy tim mình đập nhanh hoặc đập mạnh hơn bình thường.",
        options: [
          { option_id: 301, content: "Không có", score: 1 },
          { option_id: 302, content: "Đôi khi", score: 2 },
          { option_id: 303, content: "Thường xuyên", score: 3 },
          { option_id: 304, content: "Luôn luôn", score: 4 }
        ]
      },
      {
        question_id: 4,
        question_order: 4,
        content: "Tôi cảm thấy lo sợ không có lý do rõ ràng.",
        options: [
          { option_id: 401, content: "Không có", score: 1 },
          { option_id: 402, content: "Đôi khi", score: 2 },
          { option_id: 403, content: "Thường xuyên", score: 3 },
          { option_id: 404, content: "Luôn luôn", score: 4 }
        ]
      },
      {
        question_id: 5,
        question_order: 5,
        content: "Tôi dễ bị bực mình hoặc cảm thấy hoảng sợ.",
        options: [
          { option_id: 501, content: "Không có", score: 1 },
          { option_id: 502, content: "Đôi khi", score: 2 },
          { option_id: 503, content: "Thường xuyên", score: 3 },
          { option_id: 504, content: "Luôn luôn", score: 4 }
        ]
      }
    ]
  },
  beck: {
    test_id: 3,
    name: "Thang đánh giá trầm cảm BECK (BDI)",
    total_questions: 4,
    questions: [
      {
        question_id: 1,
        question_order: 1,
        content: "Đánh giá về cảm giác buồn bã hoặc thất vọng:",
        options: [
          { option_id: 101, content: "Tôi không cảm thấy buồn.", score: 0 },
          { option_id: 102, content: "Nhiều lúc tôi cảm thấy buồn hoặc nản lòng.", score: 1 },
          { option_id: 103, content: "Tôi luôn cảm thấy buồn và không thể thoát khỏi cảm giác đó.", score: 2 },
          { option_id: 104, content: "Tôi quá buồn hoặc bất hạnh đến mức không thể chịu đựng nổi.", score: 3 }
        ]
      },
      {
        question_id: 2,
        question_order: 2,
        content: "Chọn phát biểu đúng nhất về giấc ngủ của bạn:",
        options: [
          { option_id: 201, content: "Không thấy có chút thay đổi gì trong giấc ngủ của tôi.", score: 0 },
          { option_id: 202, content: "Tôi ngủ hơi nhiều hoặc hơi ít hơn trước một chút.", score: 1 },
          { option_id: 203, content: "Tôi thức dậy sớm hơn trước 1-2 tiếng và thấy khó ngủ lại.", score: 2 },
          { option_id: 204, content: "Tôi thức dậy quá sớm mỗi ngày và không thể ngủ lại được chút nào.", score: 3 }
        ]
      },
      {
        question_id: 3,
        question_order: 3,
        content: "Đánh giá mức độ tự ti hoặc tự trách bản thân:",
        options: [
          { option_id: 301, content: "Tôi không cảm thấy mình thất bại hơn người khác.", score: 0 },
          { option_id: 302, content: "Tôi thấy mình đã thất bại nhiều hơn một người bình thường nên có chút thất vọng.", score: 1 },
          { option_id: 303, content: "Nhìn lại cuộc đời, tôi thấy mình chỉ toàn là thất bại và sai lầm chồng chất.", score: 2 },
          { option_id: 304, content: "Tôi cảm thấy mình hoàn toàn thất bại trong vai trò làm người.", score: 3 }
        ]
      },
      {
        question_id: 4,
        question_order: 4,
        content: "Ý nghĩ tự hại hoặc chán ghét cuộc sống hiện tại:",
        options: [
          { option_id: 401, content: "Tôi không có ý nghĩ tự gây tổn hại cho bản thân mình.", score: 0 },
          { option_id: 402, content: "Tôi đôi khi có ý nghĩ tự hại nhưng tôi chắc chắn sẽ không bao giờ thực hiện.", score: 1 },
          { option_id: 403, content: "Tôi muốn tự tử hoặc muốn chấm dứt mọi áp lực ngay lập tức.", score: 2 },
          { option_id: 404, content: "Tôi sẽ tự tử nếu tôi có cơ hội hoặc điều kiện thuận lợi.", score: 3 }
        ]
      }
    ]
  },
  young: {
    test_id: 2,
    name: "Thang đánh giá hưng cảm YOUNG (YMRS)",
    total_questions: 4,
    questions: [
      {
        question_id: 1,
        question_order: 1,
        content: "Tâm trạng vui vẻ hoặc phấn khích bất thường:",
        options: [
          { option_id: 101, content: "Tâm trạng bình thường, không quá phấn khích.", score: 0 },
          { option_id: 102, content: "Hơi phấn khích, lạc quan thái quá khi nói chuyện.", score: 1 },
          { option_id: 103, content: "Phấn khích rõ rệt, tràn đầy năng lượng một cách khác thường.", score: 2 },
          { option_id: 104, content: "Cực kỳ phấn khích, cười nói liên tục, mất kiểm soát cảm xúc.", score: 4 }
        ]
      },
      {
        question_id: 2,
        question_order: 2,
        content: "Hoạt động thể chất hoặc tăng động lực hành động:",
        options: [
          { option_id: 201, content: "Hoạt động bình thường, không tăng năng suất bất thường.", score: 0 },
          { option_id: 202, content: "Hơi năng động, có nhiều ý tưởng sáng tạo muốn làm.", score: 1 },
          { option_id: 203, content: "Tăng hoạt động rõ rệt, chân tay bồn chồn không yên.", score: 2 },
          { option_id: 204, content: "Tăng động cực độ, liên tục làm việc không nghỉ ngơi dù mệt.", score: 4 }
        ]
      },
      {
        question_id: 3,
        question_order: 3,
        content: "Nhu cầu ngủ và nghỉ ngơi:",
        options: [
          { option_id: 301, content: "Ngủ đủ giấc, bình thường không có vấn đề gì.", score: 0 },
          { option_id: 302, content: "Giảm nhu cầu ngủ khoảng 1 tiếng nhưng vẫn thấy khỏe.", score: 1 },
          { option_id: 303, content: "Giảm nhu cầu ngủ rõ rệt (chỉ ngủ 3-4 tiếng) nhưng tràn đầy sinh lực.", score: 2 },
          { option_id: 304, content: "Hầu như không ngủ hoặc không cần ngủ mà không thấy mệt mỏi chút nào.", score: 4 }
        ]
      },
      {
        question_id: 4,
        question_order: 4,
        content: "Khả năng tập trung và tốc độ suy nghĩ:",
        options: [
          { option_id: 401, content: "Suy nghĩ bình thường, tập trung tốt vào công việc.", score: 0 },
          { option_id: 402, content: "Suy nghĩ hơi nhanh, thỉnh thoảng hơi phân tâm nhẹ.", score: 1 },
          { option_id: 403, content: "Suy nghĩ dồn dập, liên tục chuyển đổi ý tưởng.", score: 2 },
          { option_id: 404, content: "Mất tập trung hoàn toàn, ý nghĩ hỗn loạn nhảy cóc liên tục.", score: 4 }
        ]
      }
    ]
  }
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
