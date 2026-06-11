import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (values: any) => {
    const { email, password } = values;
    setLoading(true);

    try {
      // Gọi API Đăng nhập thật trên Backend sử dụng Axios Client
      const data = await loginRequest(email, password);

      // Kiểm tra xem user có quyền admin hay không
      if (data.user && data.user.role === 'admin') {
        login(data.token, data.user);
        message.success('Đăng nhập quản trị viên thành công! 🎉');
        navigate('/');
      } else {
        message.error('⛔ Quyền truy cập bị từ chối! Tài khoản không phải Quản trị viên.');
      }
    } catch (err: any) {
      console.warn('⚠️ Lỗi kết nối API Backend hoặc thông tin đăng nhập không khớp:', err);

      // Kiểm tra xem lỗi trả về từ API (Axios error response) hay lỗi mạng
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (email === 'admin@52hz.com' && password === 'admin123') {
          handleMockLogin();
        } else {
          message.error(errorData.message || 'Email hoặc mật khẩu không chính xác!');
        }
      } else {
        // Lỗi kết nối máy chủ (Network Error)
        if (email === 'admin@52hz.com' && password === 'admin123') {
          handleMockLogin();
        } else {
          message.error('Không thể kết nối đến máy chủ! Vui lòng kiểm tra lại API Backend hoặc sử dụng tài khoản Mock.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = () => {
    login('mock-admin-token-123456', {
      id: 999,
      full_name: ' Trần Minh Quân ',
      email: 'admin@52hz.com',
      role: 'admin'
    });
    message.success('Đăng nhập thành công (Chế độ chạy thử - Mock)! 🚀');
    navigate('/');
  };

  return (
    <Row style={{ minHeight: '100vh', margin: 0, overflow: 'hidden' }}>
      {/* CỘT BÊN TRÁI - BRANDING PANEL */}
      <Col xs={0} md={12} className="branding-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        height: '100vh',
        position: 'relative'
      }}>
        {/* Lớp radial-gradient tạo hiệu ứng lơ lửng */}
        <div className="branding-glow" />

        {/* Logo Thương Hiệu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 2 }}>
          <img src="/icon.png" alt="logo" style={{ width: 60, height: 60, borderRadius: 10, border: '2px solid rgba(255,255,255,0.2)' }} />
          <span style={{
            color: '#FFFFFF',
            fontSize: 26,
            fontWeight: 800,
            fontFamily: '"Nunito", sans-serif',
            letterSpacing: '-0.5px'
          }}>
            52Hz
          </span>
        </div>

        {/* Nội dung Headline & Subtext */}
        <div style={{ zIndex: 2, maxWidth: 480, margin: 'auto 0' }}>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '36px',
            fontWeight: 800,
            marginBottom: '18px',
            fontFamily: '"Nunito", sans-serif',
            lineHeight: 1.25,
            letterSpacing: '-0.5px'
          }}>
            Quản lý hệ thống 52Hz
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '15.5px',
            lineHeight: 1.65,
            margin: 0,
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 500
          }}>
            Hệ thống quản trị và thống kê dữ liệu. Giúp bạn dễ dàng theo dõi tiến độ, quản lý bài test và đồng hành cùng người dùng trên hành trình chữa lành.
          </p>
        </div>

        {/* Wave Decorative Arcs */}
        <div className="wave-container">
          <svg className="wave-svg wave1" viewBox="0 0 120 28" preserveAspectRatio="none">
            <path d="M0 15 c 30 0, 30 -10, 60 -10 s 30 10, 60 10 v 15 h -120 z" />
          </svg>
          <svg className="wave-svg wave2" viewBox="0 0 120 28" preserveAspectRatio="none">
            <path d="M0 15 c 30 0, 30 -10, 60 -10 s 30 10, 60 10 v 15 h -120 z" />
          </svg>
          <svg className="wave-svg wave3" viewBox="0 0 120 28" preserveAspectRatio="none">
            <path d="M0 15 c 30 0, 30 -10, 60 -10 s 30 10, 60 10 v 15 h -120 z" />
          </svg>
        </div>

        {/* Copyright Footer */}
        <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '13px', zIndex: 2, fontFamily: '"Nunito", sans-serif' }}>
          © 2026 52Hz Admin. All rights reserved.
        </div>
      </Col>

      {/* CỘT BÊN PHẢI - LOGIN FORM */}
      <Col xs={24} md={12} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        height: '100vh',
        boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.02)'
      }}>
        {/* Header ở góc trên bên trái */}
        <div style={{ position: 'absolute', top: 40, left: 40 }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#4ABEB2',
            fontFamily: '"Nunito", sans-serif',
            letterSpacing: '-0.3px'
          }}>
            52Hz Admin
          </span>
        </div>

        {/* Container Form Đăng Nhập */}
        <div style={{ width: '100%', maxWidth: 400, padding: '0 32px' }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#111827',
              marginBottom: '8px',
              fontFamily: '"Nunito", sans-serif',
              letterSpacing: '-0.5px'
            }}>
              Chào mừng trở lại!
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: 0,
              fontWeight: 500,
              fontFamily: '"Nunito", sans-serif'
            }}>
              Vui lòng đăng nhập tài khoản quản trị viên để tiếp tục.
            </p>
          </div>

          <Form
            name="login_form"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
          >
            {/* Input Email */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email quản trị!' },
                { type: 'email', message: 'Định dạng email không hợp lệ!' }
              ]}
              style={{ marginBottom: 24 }}
            >
              <Input
                placeholder="Email quản trị viên"
                className="minimal-input"
                autoComplete="email"
              />
            </Form.Item>

            {/* Input Mật khẩu */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              style={{ marginBottom: 32 }}
            >
              <Input.Password
                placeholder="Mật khẩu"
                className="minimal-input-affix"
                autoComplete="current-password"
              />
            </Form.Item>

            {/* Nút Đăng nhập */}
            <Form.Item style={{ marginBottom: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-btn"
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '8px',
                  backgroundColor: '#4ABEB2',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: '"Nunito", sans-serif',
                  boxShadow: '0 4px 14px rgba(74, 190, 178, 0.2)'
                }}
              >
                Đăng nhập ngay
              </Button>
            </Form.Item>
          </Form>

          {/* Các liên kết phụ */}
          <div style={{ textAlign: 'center', marginTop: 16 }} className="forgot-password-link">
            Quên mật khẩu? <span>Nhấn vào đây</span>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
