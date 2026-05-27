import axiosClient from '../api/axiosClient';

export interface RoadmapResponse {
  status: 'no_test' | 'healthy' | 'emergency' | 'roadmap_completed_need_test' | 'treatment' | 'missing_data';
  message?: string;
  category?: string;
  is_emergency?: boolean;
  completed_tasks?: string[];
  days_elapsed?: number;
  data?: any[];
}

export const treatmentApi = {
  // Lấy dữ liệu lộ trình
  getMyRoadmap: async (): Promise<RoadmapResponse> => {
    try {
      const response: any = await axiosClient.get('/roadmap/my-roadmap');
      return response; // AxiosClient đã tự động lấy response.data rồi
    } catch (error: any) {
      // Backend của chúng ta trả về HTTP 404 kèm body { status: 'no_test', ... }
      if (error.response && error.response.data && error.response.data.status) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Tick hoàn thành 1 task
  toggleTask: async (taskId: string) => {
    try {
      const response: any = await axiosClient.post('/roadmap/tasks/toggle', { task_id: taskId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gửi email khẩn cấp
  sendEmergencyEmail: async () => {
    try {
      const response: any = await axiosClient.post('/tests/emergency-email');
      return response;
    } catch (error) {
      throw error;
    }
  }
};
