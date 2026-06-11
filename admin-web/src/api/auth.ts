import apiClient from './client';

/**
 * Gửi yêu cầu đăng nhập tài khoản admin tới backend
 * @param email Email đăng nhập
 * @param password Mật khẩu
 */
export const loginRequest = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};
