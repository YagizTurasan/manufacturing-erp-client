import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, ToolOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginDto } from '@/types/auth.types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      redirectByRole(user.rol);
    }
  }, [user]);

  const redirectByRole = (rol: string) => {
    if (rol === 'KaliteKontrol') {
      navigate('/kalite-kontrol', { replace: true });
    } else if (rol === 'Admin') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/kiosk', { replace: true });
    }
  };

  const handleSubmit = async (values: LoginDto) => {
    setLoading(true);
    try {
      await login(values);
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        redirectByRole(u.rol);
      }
    } catch {
      message.error('Kullanıcı adı veya şifre hatalı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: 'none',
        }}
        bodyStyle={{ padding: '40px 40px 32px' }}
      >
        {/* Logo */}
        <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(102,126,234,0.4)',
            }}
          >
            <ToolOutlined style={{ color: 'white', fontSize: 30 }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#1a1a2e' }}>
              Bahadır Makina
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Üretim Yönetim Sistemi
            </Text>
          </div>
        </Space>

        <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
          <Form.Item
            name="kullaniciAdi"
            rules={[{ required: true, message: 'Kullanıcı adı giriniz' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Kullanıcı Adı"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="sifre"
            rules={[{ required: true, message: 'Şifre giriniz' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Şifre"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: 10,
              }}
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>

        <Text
          type="secondary"
          style={{ display: 'block', textAlign: 'center', marginTop: 24, fontSize: 12 }}
        >
          © 2025 Bahadır Makina — Tüm hakları saklıdır
        </Text>
      </Card>
    </div>
  );
};

export default Login;
