import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout, Menu, Button, Avatar, Dropdown, Typography,
  Space, theme, Drawer, Grid,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined, FileTextOutlined, AppstoreOutlined,
  ToolOutlined, InboxOutlined, CheckCircleOutlined, TeamOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, KeyOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const MENU_ITEMS: MenuProps['items'] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/is-emirleri', icon: <FileTextOutlined />, label: 'İş Emirleri' },
  { key: '/urunler', icon: <AppstoreOutlined />, label: 'Ürünler' },
  { key: '/istasyonlar', icon: <ToolOutlined />, label: 'İstasyonlar' },
  { key: '/stoklar', icon: <InboxOutlined />, label: 'Stok Yönetimi' },
  { key: '/kalite-kontrol', icon: <CheckCircleOutlined />, label: 'Kalite Kontrol' },
  { key: '/kullanicilar', icon: <TeamOutlined />, label: 'Kullanıcılar' },
];

const SIDER_STYLE: React.CSSProperties = {
  background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
};

const LogoArea: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div style={{
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: collapsed ? 0 : '0 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <ToolOutlined style={{ color: 'white', fontSize: 18 }} />
    </div>
    {!collapsed && (
      <div style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 700, fontSize: 14, display: 'block', lineHeight: 1.2 }}>
          Bahadır
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
          Makina ERP
        </Text>
      </div>
    )}
  </div>
);

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { token } = theme.useToken();
  const screens = useBreakpoint();

  const isMobile = !screens.lg;
  const selectedKey = '/' + location.pathname.split('/')[1];

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: user?.adSoyad || user?.kullaniciAdi, disabled: true },
    { type: 'divider' },
    { key: 'change-password', icon: <KeyOutlined />, label: 'Şifre Değiştir' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Çıkış Yap', danger: true },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') { logout(); navigate('/login'); }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) setDrawerOpen(false);
  };

  const menuContent = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={MENU_ITEMS}
      onClick={handleMenuClick}
      style={{ background: 'transparent', border: 'none', marginTop: 8 }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={SIDER_STYLE}
        >
          <LogoArea collapsed={collapsed} />
          {menuContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          width={220}
          styles={{ body: { padding: 0, background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }, header: { display: 'none' } }}
        >
          <LogoArea collapsed={false} />
          {menuContent}
        </Drawer>
      )}

      <Layout>
        <Header style={{
          background: token.colorBgContainer,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          zIndex: 1,
        }}>
          <Button
            type="text"
            icon={isMobile
              ? <MenuUnfoldOutlined />
              : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)
            }
            onClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 40, height: 40 }}
          />

          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                icon={<UserOutlined />}
              />
              {screens.sm && (
                <div style={{ lineHeight: 1.2 }}>
                  <Text style={{ display: 'block', fontWeight: 600, fontSize: 13 }}>
                    {user?.adSoyad || user?.kullaniciAdi}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#8c8c8c' }}>{user?.rol}</Text>
                </div>
              )}
            </Space>
          </Dropdown>
        </Header>

        <Content style={{
          margin: isMobile ? 12 : 24,
          padding: 0,
          minHeight: 'calc(100vh - 112px)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
