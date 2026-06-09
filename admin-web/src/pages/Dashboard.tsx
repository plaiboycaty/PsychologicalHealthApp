import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { Users, FileText, CheckCircle, Activity, BarChart2, TrendingUp } from 'lucide-react';

const { Title } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  growth: string;
  icon: React.ReactNode;
  bgPastel: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon, bgPastel }) => {
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
          <span style={{ fontSize: 32, fontWeight: 800, color: '#2D2D2D', marginTop: 4, lineHeight: 1.1 }}>
            {value}
          </span>
        </div>
        <div style={{ 
          width: 52, 
          height: 52, 
          borderRadius: 12, 
          backgroundColor: bgPastel,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#4ABEB2', // Mint color for the icon
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

const Dashboard: React.FC = () => {
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
            value={1254} 
            growth="+12.8%" 
            icon={<Users size={22} />} 
            bgPastel="#EEF8F7" 
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Bài test đã thực hiện" 
            value={8342} 
            growth="+8.4%" 
            icon={<FileText size={22} />} 
            bgPastel="#E6F7FF" 
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Mục tiêu hoàn thành" 
            value="92%" 
            growth="+3.1%" 
            icon={<CheckCircle size={22} />} 
            bgPastel="#F6FFED" 
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Tương tác hôm nay" 
            value={423} 
            growth="+15.2%" 
            icon={<Activity size={22} />} 
            bgPastel="#FFFBE6" 
          />
        </Col>
      </Row>

      {/* Grid khoảng trống biểu đồ */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', fontFamily: '"Nunito", sans-serif' }}>
                Biểu đồ Cột (Người dùng mới)
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
            <div style={{ 
              height: 280, 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              border: '2px dashed #EAEAEA',
              borderRadius: 12,
              background: '#FAFAFA',
              color: '#8C8C8C',
              padding: 24,
              textAlign: 'center'
            }}>
              <BarChart2 size={40} style={{ color: '#4ABEB2', marginBottom: 12, opacity: 0.7 }} />
              <span style={{ fontWeight: 700, color: '#434343', marginBottom: 4, fontSize: 15 }}>Khu vực tích hợp Biểu đồ Cột</span>
              <span style={{ fontSize: 13, maxWidth: 320, lineHeight: 1.4 }}>
                Bạn có thể tích hợp biểu đồ thể hiện lượng người dùng đăng ký mới bằng Recharts hoặc Chart.js tại đây.
              </span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', fontFamily: '"Nunito", sans-serif' }}>
                Biểu đồ Đường (Lượt truy cập)
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
            <div style={{ 
              height: 280, 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              border: '2px dashed #EAEAEA',
              borderRadius: 12,
              background: '#FAFAFA',
              color: '#8C8C8C',
              padding: 24,
              textAlign: 'center'
            }}>
              <TrendingUp size={40} style={{ color: '#4ABEB2', marginBottom: 12, opacity: 0.7 }} />
              <span style={{ fontWeight: 700, color: '#434343', marginBottom: 4, fontSize: 15 }}>Khu vực tích hợp Biểu đồ Đường</span>
              <span style={{ fontSize: 13, maxWidth: 320, lineHeight: 1.4 }}>
                Bạn có thể vẽ đường biểu diễn tần suất tương tác, lượt truy cập hàng ngày hoặc hàng tuần tại đây.
              </span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
