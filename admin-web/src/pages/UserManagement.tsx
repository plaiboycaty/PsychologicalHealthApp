import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Input, Select, Typography, Card, message } from 'antd';
import { Eye, Lock, Unlock, Search, Filter } from 'lucide-react';
import apiClient from '../api/client';
import type { User } from '../types';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Lỗi khi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'locked' : 'active';
    try {
      await apiClient.put(`/users/${userId}/status`, { status: newStatus });
      message.success(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công!`);
      fetchUsers(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      message.error('Lỗi khi cập nhật trạng thái người dùng!');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchNameOrEmail = user.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchNameOrEmail && matchStatus;
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#2D2D2D' }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => {
        const isActive = status === 'active';
        return (
          <Tag style={{
            borderRadius: 20,
            padding: '4px 12px',
            margin: 0,
            backgroundColor: isActive ? '#EEF8F7' : '#FFF1F0',
            color: isActive ? '#4ABEB2' : '#FF4D4F',
            border: `1px solid ${isActive ? '#B5E7E2' : '#FFA39E'}`,
            fontWeight: 600
          }}>
            {isActive ? 'Hoạt động' : 'Bị khóa'}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Eye size={18} color="#4ABEB2" />}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F6FA', borderRadius: 8, width: 34, height: 34 }}
          />
          {record.status === 'active' ? (
            <Button
              type="text"
              danger
              icon={<Lock size={16} />}
              onClick={() => handleToggleStatus(record.id, record.status)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F0', borderRadius: 8, width: 34, height: 34 }}
            />
          ) : (
            <Button
              type="text"
              icon={<Unlock size={16} color="#27AE60" />}
              onClick={() => handleToggleStatus(record.id, record.status)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6FFED', borderRadius: 8, width: 34, height: 34 }}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#2D2D2D', fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
          Quản lý Người dùng
        </Title>
      </div>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ marginBottom: 20, display: 'flex', gap: 16 }}>
          <Input
            prefix={<Search size={16} color="#BFBFBF" />}
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, borderRadius: 8, height: 38 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180, height: 38 }}
            suffixIcon={<Filter size={14} />}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'active', label: 'Hoạt động' },
              { value: 'locked', label: 'Bị khóa' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          pagination={{ pageSize: 8 }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default UserManagement;

