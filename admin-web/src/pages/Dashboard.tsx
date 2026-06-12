import React from 'react';
import { Row, Col, Card, Typography, Skeleton } from 'antd';
import { Users, FileText, CheckCircle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

const { Title } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  growth: string;
  icon: React.ReactNode;
  bgPastel: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon, bgPastel, loading }) => {
  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
        background: '#FFFFFF',
        height: '100%'
      }}
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 13, color: '#8C8C8C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </span>
          {loading ? (
            <Skeleton.Button active size="small" style={{ marginTop: 8 }} />
          ) : (
            <span style={{ fontSize: 32, fontWeight: 800, color: '#2D2D2D', marginTop: 4, lineHeight: 1.1 }}>
              {value}
            </span>
          )}
        </div>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          backgroundColor: bgPastel,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4ABEB2',
          flexShrink: 0
        }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#27AE60' }}>
          {growth}
        </span>
        <span style={{ fontSize: 13, color: '#8C8C8C', fontWeight: 500 }}>
          so với tháng trước
        </span>
      </div>
    </Card>
  );
};

// Dữ liệu Mock cho Biểu đồ do API hiện tại chưa hỗ trợ chuỗi thời gian
const mockBarData = [
  { name: 'Tháng 1', users: 120 },
  { name: 'Tháng 2', users: 200 },
  { name: 'Tháng 3', users: 150 },
  { name: 'Tháng 4', users: 280 },
  { name: 'Tháng 5', users: 220 },
  { name: 'Tháng 6', users: 340 },
];

const mockLineData = [
  { name: 'T2', visits: 1200 },
  { name: 'T3', visits: 1398 },
  { name: 'T4', visits: 1800 },
  { name: 'T5', visits: 1508 },
  { name: 'T6', visits: 2400 },
  { name: 'T7', visits: 2800 },
  { name: 'CN', visits: 3100 },
];

const Dashboard: React.FC = () => {
  const { stats, loading } = useDashboard();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#2D2D2D', fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
          Tổng quan hệ thống
        </Title>
      </div>

      {/* Grid thẻ thống kê */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số người dùng"
            value={stats.total_users}
            growth="+12.8%"
            icon={<Users size={22} />}
            bgPastel="#EEF8F7"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Bài test đã thực hiện"
            value={stats.total_tests_taken}
            growth="+8.4%"
            icon={<FileText size={22} />}
            bgPastel="#E6F7FF"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Mục tiêu hoàn thành"
            value="92%"
            growth="+3.1%"
            icon={<CheckCircle size={22} />}
            bgPastel="#F6FFED"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tương tác hôm nay"
            value={423}
            growth="+15.2%"
            icon={<Activity size={22} />}
            bgPastel="#FFFBE6"
            loading={loading}
          />
        </Col>
      </Row>

      {/* Grid biểu đồ bằng Recharts */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', fontFamily: '"Nunito", sans-serif' }}>
                Người dùng đăng ký mới
              </span>
            }
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
              height: '100%'
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#F5F6FA' }} 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="users" fill="#4ABEB2" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', fontFamily: '"Nunito", sans-serif' }}>
                Lượt truy cập hệ thống (Tuần)
              </span>
            }
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
              height: '100%'
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#27AE60" strokeWidth={3} dot={{ r: 4, fill: '#27AE60', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
