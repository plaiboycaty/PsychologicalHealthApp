import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import QuestionManagement from './pages/QuestionManagement';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4ABEB2',
          colorBgBase: '#FAFAFA',
          colorBgContainer: '#FFFFFF',
          colorBgLayout: '#F5F6FA',
          colorTextBase: '#2D2D2D',
          borderRadius: 12,
          fontFamily: '"Nunito", "Inter", "Roboto", sans-serif',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
        },
        components: {
          Menu: {
            itemSelectedBg: '#4ABEB2',
            itemSelectedColor: '#FFFFFF',
            itemHoverBg: '#EEF8F7',
            itemHoverColor: '#4ABEB2',
            itemBorderRadius: 12,
            itemMarginInline: 12,
          },
          Card: {
            borderRadiusLG: 16,
            boxShadowSecondary: '0px 4px 20px rgba(0, 0, 0, 0.04)',
          },
          Table: {
            headerBg: '#FAFAFA',
            borderRadiusLG: 16,
          }
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tests" element={<QuestionManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
