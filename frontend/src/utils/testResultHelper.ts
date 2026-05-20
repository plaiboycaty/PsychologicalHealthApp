export interface UIResultConfig {
  color: string;
  message: string;
  catImage: any;
}

export const getResultUIConfig = (category: string): UIResultConfig => {
  switch (category) {
    case 'Bình thường':
      return {
        color: '#A7F3D0', // Xanh lá nhạt (Mint/Emerald 100-200)
        message: 'Tâm lý của bạn đang rất ổn định. Hãy tiếp tục duy trì nhé!',
        catImage: require('../../assets/images/cat/normal.png')
      };
    case 'Nhẹ':
      return {
        color: '#86E7FF', // Xanh dương (Sky 300)
        message: 'Bạn có dấu hiệu lo âu mức độ nhẹ đến trung bình. Hãy chú ý chăm sóc sức khỏe tinh thần.',
        catImage: require('../../assets/images/cat/mild.png')
      };
    case 'Vừa':
      return {
        color: '#FFEBD9', // Vàng cam (Yellow 300)
        message: 'Bạn có dấu hiệu lo âu trung bình. Hãy chú ý chăm sóc sức khỏe tinh thần.',
        catImage: require('../../assets/images/cat/moderate.png')
      };
    case 'Nặng':
      return {
        color: '#FF8686', // Đỏ nhạt (Red 400)
        message: 'Bạn có dấu hiệu lo âu nặng. Cần nghỉ ngơi và chia sẻ nhiều hơn.',
        catImage: require('../../assets/images/cat/severe.png')
      };
    case 'Rất nặng':
      return {
        color: '#FF8686', // Đỏ hồng nhạt 
        message: 'Bạn có dấu hiệu lo âu rất nặng. Hãy liên hệ đến các đường dây nóng khẩn cấp để được nhận sự hỗ trợ kịp thời.',
        catImage: require('../../assets/images/cat/severe.png')
      };
    default:
      return {
        color: '#E5E7EB', // Gray 200
        message: 'Đã có lỗi xảy ra hoặc kết quả không xác định.',
        catImage: require('../../assets/images/cat/normal.png')
      };
  }
};
