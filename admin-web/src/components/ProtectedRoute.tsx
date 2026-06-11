import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const isAdmin = token && user && user.role === 'admin';

  if (!isAdmin) {
    // Chuyển hướng về trang login nếu chưa đăng nhập hoặc không phải admin
    return <Navigate to="/login" replace />;
  }

  // Cho phép truy cập vào các trang con nếu là admin
  return <Outlet />;
};

export default ProtectedRoute;
