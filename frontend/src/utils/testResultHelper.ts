export interface UIResultConfig {
  color: string;
  message: string;
  catImage: any;
}

export const getResultUIConfig = (category: string, testName?: string): UIResultConfig => {
  const lowerCategory = category.toLowerCase();
  const diseaseName = testName ? testName.toLowerCase() : 'bất ổn';

  if (lowerCategory.includes('rất nặng')) {
    return {
      color: '#FF8686',
      message: `Bạn có dấu hiệu ${diseaseName} rất nặng. Hãy liên hệ đến các đường dây nóng khẩn cấp để được nhận sự hỗ trợ kịp thời.`,
      catImage: require('../../assets/images/cat/severe.png')
    };
  } else if (lowerCategory.includes('nặng')) {
    return {
      color: '#FF8686',
      message: `Bạn có dấu hiệu ${diseaseName} nặng. Cần nghỉ ngơi và chia sẻ nhiều hơn với chuyên gia hoặc người thân.`,
      catImage: require('../../assets/images/cat/severe.png')
    };
  } else if (lowerCategory.includes('vừa')) {
    return {
      color: '#FFEBD9',
      message: `Bạn có dấu hiệu ${diseaseName} vừa. Hãy chú ý chăm sóc sức khỏe tinh thần và tham khảo các lộ trình phù hợp.`,
      catImage: require('../../assets/images/cat/moderate.png')
    };
  } else if (lowerCategory.includes('nhẹ')) {
    return {
      color: '#86E7FF',
      message: `Bạn có dấu hiệu ${diseaseName} mức độ nhẹ. Hãy cố gắng duy trì lối sống lành mạnh nhé.`,
      catImage: require('../../assets/images/cat/mild.png')
    };
  } else {
    return {
      color: '#A7F3D0',
      message: 'Tâm lý của bạn đang rất ổn định. Hãy tiếp tục duy trì trạng thái tuyệt vời này nhé!',
      catImage: require('../../assets/images/cat/normal.png')
    };
  }
};
