import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { userService } from '../services/userService';
import type { User } from '../types';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Lỗi khi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = useCallback(async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'locked' : 'active';
    try {
      await userService.updateUserStatus(userId, newStatus);
      message.success(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công!`);
      fetchUsers(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      message.error('Lỗi khi cập nhật trạng thái người dùng!');
    }
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchNameOrEmail = user.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchNameOrEmail && matchStatus;
  });

  return {
    users: filteredUsers,
    loading,
    searchText,
    statusFilter,
    setSearchText,
    setStatusFilter,
    handleToggleStatus,
    fetchUsers
  };
};
