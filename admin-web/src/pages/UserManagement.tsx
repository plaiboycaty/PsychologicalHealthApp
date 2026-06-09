import React from 'react';
import { Table, Tag, Space, Button, Input, Select, Typography, Card } from 'antd';
import { Eye, Lock, Unlock, Search, Filter } from 'lucide-react';

const { Title } = Typography;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <span style={{ fontWeight: 600, color: '#2D2D2D' }}>{text}</span>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Ngày tham gia',
    dataIndex: 'joinDate',
    key: 'joinDate',
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: (status: string) => {
      const isActive = status === 'Hoạt động';
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
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record: any) => (
      <Space size="middle">
        <Button 
          type="text" 
          icon={<Eye size={18} color="#4ABEB2" />} 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F6FA', borderRadius: 8, width: 34, height: 34 }}
        />
        {record.status === 'Hoạt động' ? (
          <Button 
            type="text" 
            danger 
            icon={<Lock size={16} />} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F0', borderRadius: 8, width: 34, height: 34 }}
          />
        ) : (
          <Button 
            type="text" 
            icon={<Unlock size={16} color="#27AE60" />} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6FFED', borderRadius: 8, width: 34, height: 34 }}
          />
        )}
      </Space>
    ),
  },
];

const data = [
  {
    id: '1001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    joinDate: '10/05/2026',
    status: 'Hoạt động',
  },
  {
    id: '1002',
    name: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    joinDate: '12/05/2026',
    status: 'Bị khóa',
  },
  {
    id: '1003',
    name: 'Lê Minh C',
    email: 'leminhc@gmail.com',
    joinDate: '15/05/2026',
    status: 'Hoạt động',
  },
];

const UserManagement: React.FC = () => {
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
            style={{ width: 300, borderRadius: 8, height: 38 }}
          />
          <Select 
            defaultValue="all" 
            style={{ width: 180, height: 38 }}
            suffixIcon={<Filter size={14} />}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'active', label: 'Hoạt động' },
              { value: 'banned', label: 'Bị khóa' },
            ]}
          />
        </div>
        
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 8 }} rowKey="id" />
      </Card>
    </div>
  );
};

export default UserManagement;
