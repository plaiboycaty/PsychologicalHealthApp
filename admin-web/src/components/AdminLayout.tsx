import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Input, Dropdown, Avatar } from 'antd';
import {
  LayoutDashboard,
  FileText,
  Users,
  Menu as MenuIcon,
  Bell,
  Settings,
  Search,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <LayoutDashboard size={18} />,
      label: 'Tổng quan',
    },
    {
      key: '/tests',
      icon: <FileText size={18} />,
      label: 'Quản lý Câu hỏi',
    },
    {
      key: '/users',
      icon: <Users size={18} />,
      label: 'Quản lý Người dùng',
    },
  ];

  const profileMenu = [
    {
      key: 'profile',
      icon: <UserIcon size={16} />,
      label: 'Hồ sơ cá nhân',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: colorBgLayout }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={350}
        style={{
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.02)',
          borderRight: '1px solid #F0F2F5',
          zIndex: 10,
          background: '#FFFFFF'
        }}
      >
        <div style={{
          height: 72,
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-start',
          alignItems: 'center',
          paddingLeft: collapsed ? 0 : 20,
          fontWeight: 800,
          fontSize: collapsed ? 18 : 18,
          color: '#4ABEB2',
          borderBottom: '1px solid #F5F6FA',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          gap: 10,
          fontFamily: '"Nunito", sans-serif'
        }}>
          <img src="/icon.png" alt="logo" style={{ width: 70, height: 70, borderRadius: 8, flexShrink: 0 }} />
          {!collapsed && <span style={{ letterSpacing: '-0.3px', fontWeight: 800, fontSize: 20 }}>Psychological Health</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 16, padding: '0 8px' }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
          borderBottom: '1px solid #F0F2F5',
          height: 72,
          zIndex: 9
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Button
              type="text"
              icon={<MenuIcon size={20} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F6FA'
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>Xin chào, Quản trị viên</span>
              <span style={{ fontSize: 11, color: '#8C8C8C', fontWeight: 500 }}>Chúc bạn một ngày làm việc tràn đầy năng lượng!</span>
            </div>

            <Input
              prefix={<Search size={16} style={{ color: '#BFBFBF' }} />}
              placeholder="Tìm kiếm nhanh..."
              style={{
                width: 240,
                borderRadius: 20,
                backgroundColor: '#F5F6FA',
                border: '1px solid #F0F2F5',
                marginLeft: 12,
                height: 38
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              type="text"
              icon={<Bell size={20} style={{ color: '#595959' }} />}
              shape="circle"
              style={{ width: 40, height: 40, backgroundColor: '#F5F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
            <Button
              type="text"
              icon={<Settings size={20} style={{ color: '#595959' }} />}
              shape="circle"
              style={{ width: 40, height: 40, backgroundColor: '#F5F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
            <Dropdown menu={{ items: profileMenu }} placement="bottomRight" arrow>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 20,
                backgroundColor: '#F5F6FA',
                border: '1px solid #F0F2F5',
                marginLeft: 8,
                transition: 'all 0.3s'
              }}>
                <Avatar style={{ backgroundColor: '#4ABEB2', fontWeight: 'bold' }}>AQ</Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#2D2D2D' }}>Admin Trần Minh Quân</span>
                  <span style={{ fontSize: 11, color: '#8C8C8C' }}>Quản trị viên</span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
