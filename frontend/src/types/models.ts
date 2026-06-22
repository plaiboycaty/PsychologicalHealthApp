export interface User {
  id: number;
  email: string;
  full_name: string;
  gender?: string;
  dob?: string;
  avatar_url?: string;
  status: string;
  role: string;
  treatment_status?: string;
}

export interface Emotion {
  id: number;
  name: string;
  icon_url: string;
}

export interface Diary {
  id: number;
  user_id: number;
  emotion_id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  emotion_name?: string;
  icon_url?: string;
}

export interface TestOption {
  option_id: number;
  option_content: string;
  score: number;
}

export interface TestQuestion {
  question_id: number;
  question_content: string;
  question_order: number;
  options: TestOption[];
}

export interface Test {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

export interface TestResult {
  id: number;
  test_id: number;
  name: string; // Tên bài test
  total_score: number;
  category: string;
  created_at: string;
}

export interface RoadmapTask {
  taskId: string;
  title: string;
  duration?: string;
}

export interface RoadmapWeek {
  id: number;
  week_number: number;
  category: string;
  title: string;
  status: 'locked' | 'in_progress' | 'completed';
  tasks: RoadmapTask[];
}
