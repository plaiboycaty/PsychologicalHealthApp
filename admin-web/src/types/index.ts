// Định nghĩa các kiểu dữ liệu dùng chung cho hệ thống Psychological Health Admin

// 1. Quản trị viên (Admin User)
export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  treatment_status?: string;
}

// 2. Người dùng thường (User)
export interface User {
  id: number;
  full_name: string;
  email: string;
  gender: 'male' | 'female' | 'other' | null;
  dob: string | null;
  avatar_url: string | null;
  role: 'user';
  status: 'active' | 'locked';
  created_at: string;
}

// 3. Bài đánh giá (Test)
export interface Test {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

// 4. Lựa chọn đáp án (Option)
export interface Option {
  id: number;
  question_id: number;
  content: string;
  score: number;
}

// 5. Câu hỏi (Question)
export interface Question {
  id: number;
  test_id: number;
  content: string;
  question_order: number;
  options?: Option[];
}
