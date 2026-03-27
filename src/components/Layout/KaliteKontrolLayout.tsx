import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, Space, Avatar, Grid } from 'antd';
import { LogoutOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

const { Header, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const KaliteKontrolLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f5ff' }}>
      <Header style={{
        background: 'linear-gradient(135deg, #003a8c 0%, #0050b3 100%)',
        padding: screens.sm ? '0 24px' : '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <Space size={screens.sm ? 12 : 8}>
          <div style={{
            width: screens.sm ? 44 : 36, height: screens.sm ? 44 : 36,
            borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SafetyOutlined style={{ color: 'white', fontSize: screens.sm ? 22 : 16 }} />
          </div>
          <div>
            <Text style={{ color: 'white', fontWeight: 700, fontSize: screens.sm ? 18 : 14, display: 'block', lineHeight: 1.2 }}>
              {screens.sm ? 'Bahadır Makina' : 'Bahadır'}
            </Text>
            {screens.sm && (
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                Kalite Kontrol Paneli
              </Text>
            )}
          </div>
        </Space>

        <Space size={screens.sm ? 16 : 8}>
          {screens.md && (
            <Space>
              <Avatar
                style={{ background: 'rgba(255,255,255,0.2)' }}
                icon={<UserOutlined />}
                size={36}
              />
              <div>
                <Text style={{ color: 'white', fontWeight: 600, display: 'block', lineHeight: 1.2, fontSize: 13 }}>
                  {user?.adSoyad || user?.kullaniciAdi}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                  Kalite Kontrol
                </Text>
              </div>
            </Space>
          )}
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            size={screens.sm ? 'middle' : 'small'}
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
            }}
          >
            {screens.sm ? 'Çıkış' : ''}
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: screens.sm ? 24 : 12 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default KaliteKontrolLayout;
