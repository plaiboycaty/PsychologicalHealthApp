/**
 * File chứa các thuật toán Y tế / Nghiệp vụ.
 * Tách file này ra giúp Database không bị ảnh hưởng khi mình chỉnh sửa thang điểm.
 */

const evaluateZungAnxiety = (score) => {
  // Thang điểm Zung SAS (Dựa trên tài liệu y khoa bạn cung cấp)
  if (score <= 40) return 'Không lo âu';
  if (score >= 41 && score <= 50) return 'Lo âu mức độ nhẹ';
  if (score >= 51 && score <= 60) return 'Lo âu mức độ vừa';
  if (score >= 61 && score <= 70) return 'Lo âu mức độ nặng';

  return 'Lo âu mức độ rất nặng';
};

const evaluateBeckDepression = (score) => {
  if (score >= 0 && score <= 13) return 'Không có trầm cảm';
  if (score >= 14 && score <= 19) return 'Trầm cảm mức độ nhẹ';
  if (score >= 20 && score <= 29) return 'Trầm cảm mức độ vừa';
  if (score >= 30) return 'Trầm cảm mức độ nặng';
}

const evaluateYMRS = (score) => {
  if (score >= 0 && score <= 11) return 'Không có biểu hiện hưng cảm';
  if (score >= 12 && score <= 20) return 'Hưng cảm mức độ nhẹ';
  if (score >= 21 && score <= 30) return 'Hưng cảm mức độ vừa';
  if (score >= 31) return 'Hưng cảm mức độ nặng';
}


module.exports = {
  evaluateZungAnxiety,
  evaluateBeckDepression,
  evaluateYMRS,
};
