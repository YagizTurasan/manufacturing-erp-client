import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, List, Tag, Button, Typography, Space, Spin,
  Empty, Modal, Select, message, Badge, Row, Col
} from 'antd';
import {
  PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined,
  ReloadOutlined, ApartmentOutlined
} from '@ant-design/icons';
import { isAdimiApi } from '@/api/isAdimiApi';
import { istasyonApi } from '@/api/istasyonApi';
import { useAuth } from '@/contexts/AuthContext';
import type { BekleyenIsDto } from '@/types/isAdimi.types';
import type { IstasyonDto } from '@/types/istasyon.types';

const { Title, Text } = Typography;

const KioskHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bekleyenler, setBekleyenler] = useState<BekleyenIsDto[]>([]);
  const [istasyonlar, setIstasyonlar] = useState<IstasyonDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [startModal, setStartModal] = useState(false);
  const [selectedIs, setSelectedIs] = useState<BekleyenIsDto | null>(null);
  const [selectedIstasyon, setSelectedIstasyon] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [isRes, istRes] = await Promise.all([
        isAdimiApi.getBekleyenIsler(user.id),
        istasyonApi.getAll(),
      ]);
      if (isRes.success && isRes.data) setBekleyenler(isRes.data);
      if (istRes.success && istRes.data) setIstasyonlar(istRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleBasla = (is: BekleyenIsDto) => {
    setSelectedIs(is);
    setSelectedIstasyon(is.istasyonId || null);
    setStartModal(true);
  };

  const handleConfirmBasla = async () => {
    if (!selectedIs || !selectedIstasyon || !user) return;
    setStarting(true);
    try {
      const res = await isAdimiApi.basla(selectedIs.isAdimiId, user.id, selectedIstasyon);
      if (res.success) {
        message.success('İş başlatıldı!');
        setStartModal(false);
        navigate('/kiosk/aktif-is');
      } else {
        message.error(res.message || 'Başlatma başarısız');
      }
    } catch {
      message.error('Bir hata oluştu');
    } finally {
      setStarting(false);
    }
  };

  const musaitIstasyonlar = istasyonlar.filter(
    (i) => i.tip === selectedIs?.istasyonTipi && i.durum === 'Musait'
  );

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {/* Başlık */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            Bekleyen İşler
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
            Hoşgeldiniz, {user?.adSoyad || user?.kullaniciAdi}
          </Text>
        </Col>
        <Col>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
            loading={loading}
            style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'transparent', color: 'white' }}
          >
            Yenile
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : bekleyenler.length === 0 ? (
        <Card
          style={{ borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Text style={{ color: 'rgba(255,255,255,0.5)' }}>Bekleyen iş bulunamadı</Text>}
          />
        </Card>
      ) : (
        <List
          dataSource={bekleyenler}
          renderItem={(is) => (
            <List.Item style={{ padding: 0, marginBottom: 12 }}>
              <Card
                style={{
                  width: '100%',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'default',
                }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <Row justify="space-between" align="middle" gutter={[16, 12]}>
                  <Col xs={24} md={16}>
                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                      <Space wrap>
                        <Tag
                          icon={<FileTextOutlined />}
                          color="purple"
                          style={{ fontSize: 13, padding: '2px 10px' }}
                        >
                          {is.isEmriNo}
                        </Tag>
                        <Tag
                          icon={<ApartmentOutlined />}
                          color="blue"
                        >
                          {is.istasyonTipi}
                        </Tag>
                        <Tag
                          icon={<ClockCircleOutlined />}
                          color={is.oncelik === 'Yüksek' ? 'red' : 'default'}
                        >
                          {is.oncelik}
                        </Tag>
                      </Space>

                      <Title level={4} style={{ margin: 0, color: 'white' }}>
                        {is.urunAdi}
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginLeft: 8 }}>
                          ({is.urunKodu})
                        </Text>
                      </Title>

                      <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {is.tanim}
                      </Text>

                      <Space>
                        <Badge
                          color="#667eea"
                          text={
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                              Hedef: <strong style={{ color: 'white' }}>{is.hedefMiktar} adet</strong>
                            </Text>
                          }
                        />
                        <Text style={{ color: 'rgba(255,255,255,0.4)' }}>•</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                          Adım: <strong style={{ color: 'white' }}>#{is.sira}</strong>
                        </Text>
                      </Space>

                      {is.gerekliBilesenler && is.gerekliBilesenler.length > 0 && (
                        <Space wrap>
                          {is.gerekliBilesenler.map((b, idx) => (
                            <Tag
                              key={idx}
                              color={b.stokYeterli ? 'success' : 'error'}
                              style={{ fontSize: 12 }}
                            >
                              {b.urunAdi}: {b.miktar} {b.stokYeterli ? '✓' : '✗'}
                            </Tag>
                          ))}
                        </Space>
                      )}
                    </Space>
                  </Col>

                  <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleBasla(is)}
                      style={{
                        background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                        border: 'none',
                        borderRadius: 10,
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600,
                        minWidth: 140,
                      }}
                    >
                      İşe Başla
                    </Button>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Başlatma Modalı */}
      <Modal
        title="İş Başlat"
        open={startModal}
        onCancel={() => setStartModal(false)}
        onOk={handleConfirmBasla}
        okText="Başlat"
        cancelText="İptal"
        confirmLoading={starting}
        okButtonProps={{
          style: { background: 'linear-gradient(135deg, #52c41a, #389e0d)', border: 'none' },
          disabled: !selectedIstasyon,
        }}
      >
        {selectedIs && (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Card size="small" style={{ background: '#f5f5f5', borderRadius: 8 }}>
              <Text strong>{selectedIs.urunAdi}</Text>
              <br />
              <Text type="secondary">{selectedIs.isEmriNo} — {selectedIs.tanim}</Text>
            </Card>

            <div>
              <Text strong>İstasyon Seç:</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Müsait istasyon seçin"
                value={selectedIstasyon}
                onChange={setSelectedIstasyon}
                options={musaitIstasyonlar.map((i) => ({
                  value: i.id,
                  label: `${i.ad} (${i.tip})`,
                }))}
                notFoundContent="Müsait istasyon bulunamadı"
              />
            </div>
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default KioskHome;
