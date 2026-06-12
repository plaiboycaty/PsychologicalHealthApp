import React from 'react';
import { Table, Tag, Space, Button, Input, Select, Typography, Card } from 'antd';
import { Eye, Lock, Unlock, Search, Filter } from 'lucide-react';
import type { User } from '../types';
import { useUserManagement } from '../hooks/useUserManagement';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    searchText,
    statusFilter,
    setSearchText,
    setStatusFilter,
    handleToggleStatus
  } = useUserManagement();

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
      render: (text: string) => <span style={{ fontWeight: 700, color: '#2D2D2D' }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: string) => {
        const mapping: Record<string, string> = { Male: 'Nam', Female: 'Nữ', Other: 'Khác' };
        return mapping[text] || text;
      },
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      render: (text: string) => {
        if (!text) return '-';
        const date = new Date(text);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const isActive = status === 'active';
        return (
          <Tag style={{
            borderRadius: 20,
            padding: '4px 12px',
            margin: 0,
            backgroundColor: isActive ? '#EEF8F7' : '#FFF1F0',
            color: isActive ? '#4ABEB2' : '#FF4D4F',
            border: 'none',
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
      align: 'right' as const,
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
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 8 }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default UserManagement;

