import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Typography, Space, Button, InputNumber, Progress,
  Statistic, Row, Col, Tag, Modal, message, Spin, Alert, Divider
} from 'antd';
import {
  CheckOutlined, StopOutlined, ReloadOutlined,
  ClockCircleOutlined, ToolOutlined
} from '@ant-design/icons';
import { isAdimiApi } from '@/api/isAdimiApi';
import { useAuth } from '@/contexts/AuthContext';
import type { AktifIsDetayDto } from '@/types/isAdimi.types';

const { Title, Text } = Typography;

const AktifIs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aktifIs, setAktifIs] = useState<AktifIsDetayDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [miktar, setMiktar] = useState<number>(1);
  const [parcaLoading, setParcaLoading] = useState(false);
  const [bitirLoading, setBitirLoading] = useState(false);
  const [bitirModal, setBitirModal] = useState(false);

  useEffect(() => {
    if (user) fetchAktifIs();
    const interval = setInterval(() => { if (user) fetchAktifIs(); }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchAktifIs = async () => {
    if (!user) return;
    try {
      const res = await isAdimiApi.getAktifIs(user.id);
      if (res.success && res.data) {
        setAktifIs(res.data);
      } else {
        setAktifIs(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleParcaTamamla = async () => {
    if (!aktifIs || !user || miktar <= 0) return;
    setParcaLoading(true);
    try {
      const res = await isAdimiApi.parcaTamamla({
        isAdimiId: aktifIs.isAdimiId,
        kullaniciId: user.id,
        miktar,
      });
      if (res.success) {
        message.success(`${miktar} adet kaydedildi`);
        setMiktar(1);
        await fetchAktifIs();
      } else {
        message.error(res.message || 'İşlem başarısız');
      }
    } catch {
      message.error('Bir hata oluştu');
    } finally {
      setParcaLoading(false);
    }
  };

  const handleBitir = async () => {
    if (!aktifIs || !user) return;
    setBitirLoading(true);
    try {
      const res = await isAdimiApi.bitir(aktifIs.isAdimiId, user.id);
      if (res.success) {
        message.success('İş adımı tamamlandı!');
        setBitirModal(false);
        navigate('/kiosk');
      } else {
        message.error(res.message || 'İşlem başarısız');
      }
    } catch {
      message.error('Bir hata oluştu');
    } finally {
      setBitirLoading(false);
    }
  };

  const formatSure = (dk: number) => {
    const saat = Math.floor(dk / 60);
    const dakika = dk % 60;
    return saat > 0 ? `${saat}s ${dakika}dk` : `${dakika}dk`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!aktifIs) {
    return (
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Alert
          message="Aktif iş bulunamadı"
          description="Şu anda üzerinde çalıştığınız bir iş bulunmuyor."
          type="info"
          showIcon
          action={
            <Button onClick={() => navigate('/kiosk')} type="primary">
              İş Listesine Dön
            </Button>
          }
        />
      </Space>
    );
  }

  const tamamlanmaYuzdesi = aktifIs.hedefMiktar > 0
    ? Math.round((aktifIs.kumulatifTamamlanan / aktifIs.hedefMiktar) * 100)
    : 0;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {/* Başlık */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, color: 'white' }}>Aktif İş</Title>
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
            Üzerinde çalıştığınız iş adımı
          </Text>
        </Col>
        <Col>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAktifIs}
            style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'transparent', color: 'white' }}
          >
            Yenile
          </Button>
        </Col>
      </Row>

      {/* Ana Kart */}
      <Card
        style={{
          borderRadius: 16,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        bodyStyle={{ padding: 28 }}
      >
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          {/* Üst Bilgi */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Space wrap>
                <Tag color="purple" style={{ fontSize: 14, padding: '3px 12px' }}>
                  {aktifIs.isEmriNo}
                </Tag>
                <Tag icon={<ToolOutlined />} color="blue">
                  {aktifIs.istasyonAdi}
                </Tag>
                {aktifIs.kaliteKontrolGerekli && (
                  <Tag color="warning">Kalite Kontrol Gerekli</Tag>
                )}
              </Space>
              <Title level={3} style={{ margin: '12px 0 4px', color: 'white' }}>
                {aktifIs.urunAdi}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
                {aktifIs.tanim}
              </Text>
            </Col>
            <Col xs={24} md={8}>
              <Card
                size="small"
                style={{
                  background: 'rgba(102,126,234,0.15)',
                  border: '1px solid rgba(102,126,234,0.3)',
                  borderRadius: 10,
                  textAlign: 'center',
                }}
              >
                <Statistic
                  title={<Text style={{ color: 'rgba(255,255,255,0.6)' }}>Geçen Süre</Text>}
                  value={formatSure(aktifIs.gecenSure)}
                  prefix={<ClockCircleOutlined style={{ color: '#667eea' }} />}
                  valueStyle={{ color: 'white', fontSize: 22 }}
                />
              </Card>
            </Col>
          </Row>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

          {/* İlerleme */}
          <div>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Tamamlanma Durumu</Text>
              <Text style={{ color: 'white', fontWeight: 600 }}>
                {aktifIs.kumulatifTamamlanan} / {aktifIs.hedefMiktar} adet
              </Text>
            </Row>
            <Progress
              percent={tamamlanmaYuzdesi}
              strokeColor={{ '0%': '#667eea', '100%': '#52c41a' }}
              trailColor="rgba(255,255,255,0.1)"
              strokeWidth={14}
              format={(p) => (
                <Text style={{ color: 'white', fontWeight: 700 }}>{p}%</Text>
              )}
            />
          </div>

          {/* İstatistikler */}
          <Row gutter={[16, 16]}>
            {[
              { label: 'Bu Adımda', value: aktifIs.tamamlananMiktar, color: '#52c41a', suffix: 'adet' },
              { label: 'Toplam', value: aktifIs.kumulatifTamamlanan, color: '#1890ff', suffix: 'adet' },
              { label: 'Kalan', value: aktifIs.kalanMiktar, color: '#faad14', suffix: 'adet' },
              { label: 'Hurda', value: aktifIs.hurdaMiktari, color: '#ff4d4f', suffix: 'adet' },
            ].map((item) => (
              <Col key={item.label} xs={12} sm={6}>
                <Card
                  size="small"
                  style={{
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}40`,
                    borderRadius: 10,
                    textAlign: 'center',
                  }}
                >
                  <Text style={{ fontSize: 28, fontWeight: 700, color: item.color }}>
                    {item.value}
                  </Text>
                  <br />
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{item.label}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </Card>

      {/* İşlem Kartları */}
      <Row gutter={[16, 16]}>
        {/* Parça Tamamla */}
        <Col xs={24} md={12}>
          <Card
            title={<Text style={{ color: 'white', fontSize: 16 }}>Parça Tamamla</Text>}
            style={{
              borderRadius: 16,
              background: 'rgba(82,196,26,0.1)',
              border: '1px solid rgba(82,196,26,0.3)',
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                Tamamlanan adet miktarını girin
              </Text>
              <InputNumber
                min={1}
                max={aktifIs.kalanMiktar}
                value={miktar}
                onChange={(v) => setMiktar(v ?? 1)}
                size="large"
                style={{ width: '100%' }}
              />
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                onClick={handleParcaTamamla}
                loading={parcaLoading}
                block
                style={{
                  background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                  border: 'none',
                  borderRadius: 10,
                  height: 52,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {miktar} Adet Kaydet
              </Button>
            </Space>
          </Card>
        </Col>

        {/* İşi Bitir */}
        <Col xs={24} md={12}>
          <Card
            title={<Text style={{ color: 'white', fontSize: 16 }}>İş Adımını Bitir</Text>}
            style={{
              borderRadius: 16,
              background: 'rgba(255,77,79,0.1)',
              border: '1px solid rgba(255,77,79,0.3)',
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                Bu adımı tamamlayıp bir sonrakine geçmek için tıklayın.
                {aktifIs.kaliteKontrolGerekli && (
                  <Text style={{ color: '#faad14' }}> Kalite kontrole gönderilecek.</Text>
                )}
              </Text>
              <div style={{ flex: 1 }} />
              <Button
                size="large"
                icon={<StopOutlined />}
                onClick={() => setBitirModal(true)}
                block
                style={{
                  background: 'linear-gradient(135deg, #ff4d4f, #cf1322)',
                  border: 'none',
                  borderRadius: 10,
                  height: 52,
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'white',
                  marginTop: 8,
                }}
              >
                İşi Bitir
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Bitirme Onay Modalı */}
      <Modal
        title="İşi Bitir"
        open={bitirModal}
        onCancel={() => setBitirModal(false)}
        onOk={handleBitir}
        okText="Evet, Bitir"
        cancelText="Vazgeç"
        confirmLoading={bitirLoading}
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" size={12}>
          <Text>
            <strong>{aktifIs.isEmriNo}</strong> iş emrinin bu adımını bitirmek istediğinizden emin misiniz?
          </Text>
          <Text type="secondary">
            Tamamlanan: <strong>{aktifIs.kumulatifTamamlanan} / {aktifIs.hedefMiktar} adet</strong>
          </Text>
          {aktifIs.kaliteKontrolGerekli && (
            <Alert
              message="Bu adım kalite kontrole gönderilecek"
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Modal>
    </Space>
  );
};

export default AktifIs;
