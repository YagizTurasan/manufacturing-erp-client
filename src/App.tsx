import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import trTR from 'antd/locale/tr_TR';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from './routes';
import './App.css';

// Ant Design tema özelleştirmeleri
const theme = {
  token: {
    colorPrimary: '#667eea',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={trTR} theme={theme}>
      <AuthProvider>
        <Suspense
          fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh' 
            }}>
              <Spin size="large" tip="Yükleniyor..." />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;