import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Tag, Typography, Space, Button, Select,
  Modal, Badge, Tooltip, Spin, message
} from 'antd';
import {
  ReloadOutlined, ToolOutlined, CheckCircleOutlined,
  ClockCircleOutlined, WarningOutlined
} from '@ant-design/icons';
import { istasyonApi } from '@/api/istasyonApi';
import type { IstasyonDto, UpdateIstasyonDurumDto } from '@/types/istasyon.types';

const { Title, Text } = Typography;

const durumConfig: Record<string, { color: string; badge: 'success' | 'processing' | 'error' | 'warning'; icon: React.ReactNode; label: string }> = {
  Musait: { color: '#52c41a', badge: 'success', icon: <CheckCircleOutlined />, label: 'Müsait' },
  Mesgul: { color: '#1890ff', badge: 'processing', icon: <ClockCircleOutlined />, label: 'Meşgul' },
  Arizali: { color: '#ff4d4f', badge: 'error', icon: <WarningOutlined />, label: 'Arızalı' },
};

const IstasyonListesi: React.FC = () => {
  const [istasyonlar, setIstasyonlar] = useState<IstasyonDto[]>([]);
  const [filtered, setFiltered] = useState<IstasyonDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipFilter, setTipFilter] = useState<string>('Tümü');
  const [durumFilter, setDurumFilter] = useState<string>('Tümü');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<IstasyonDto | null>(null);
  const [yeniDurum, setYeniDurum] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let list = [...istasyonlar];
    if (tipFilter !== 'Tümü') list = list.filter((i) => i.tip === tipFilter);
    if (durumFilter !== 'Tümü') list = list.filter((i) => i.durum === durumFilter);
    setFiltered(list);
  }, [istasyonlar, tipFilter, durumFilter]);

  const fetchData = async () => {
    try {
      const res = await istasyonApi.getAll();
      if (res.success && res.data) setIstasyonlar(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDurumGuncelle = (ist: IstasyonDto) => {
    setSelected(ist);
    setYeniDurum(ist.durum);
    setModalOpen(true);
  };

  const confirmDurumGuncelle = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const dto: UpdateIstasyonDurumDto = { istasyonId: selected.id, durum: yeniDurum };
      const res = await istasyonApi.updateDurum(dto);
      if (res.success) {
        message.success('Durum güncellendi');
        setModalOpen(false);
        await fetchData();
      } else {
        message.error(res.message || 'Güncelleme başarısız');
      }
    } finally {
      setUpdating(false);
    }
  };

  const tipOptions = ['Tümü', ...Array.from(new Set(istasyonlar.map((i) => i.tip)))];
  const durumOptions = ['Tümü', 'Musait', 'Mesgul', 'Arizali'];

  const ozet = {
    musait: istasyonlar.filter((i) => i.durum === 'Musait').length,
    mesgul: istasyonlar.filter((i) => i.durum === 'Mesgul').length,
    arizali: istasyonlar.filter((i) => i.durum === 'Arizali').length,
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>İstasyonlar</Title>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
            Yenile
          </Button>
        </Col>
      </Row>

      {/* Özet Satırı */}
      <Row gutter={[12, 12]}>
        {[
          { label: 'Müsait', value: ozet.musait, color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' },
          { label: 'Meşgul', value: ozet.mesgul, color: '#1890ff', bg: '#e6f7ff', border: '#91d5ff' },
          { label: 'Arızalı', value: ozet.arizali, color: '#ff4d4f', bg: '#fff1f0', border: '#ffa39e' },
          { label: 'Toplam', value: istasyonlar.length, color: '#667eea', bg: '#f0f0ff', border: '#c5b8f8' },
        ].map((item) => (
          <Col key={item.label} xs={12} sm={6}>
            <Card
              size="small"
              bordered={false}
              style={{ borderRadius: 10, background: item.bg, border: `1px solid ${item.border}` }}
            >
              <Text style={{ fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</Text>
              <br />
              <Text type="secondary">{item.label}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filtreler */}
      <Space wrap>
        <Select
          value={tipFilter}
          onChange={setTipFilter}
          style={{ width: 180 }}
          options={tipOptions.map((t) => ({ value: t, label: t }))}
          placeholder="Tip filtrele"
        />
        <Select
          value={durumFilter}
          onChange={setDurumFilter}
          style={{ width: 150 }}
          options={durumOptions.map((d) => ({ value: d, label: d === 'Tümü' ? 'Tüm Durumlar' : durumConfig[d]?.label ?? d }))}
          placeholder="Durum filtrele"
        />
        <Text type="secondary">{filtered.length} istasyon gösteriliyor</Text>
      </Space>

      {/* İstasyon Kartları */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((ist) => {
            const cfg = durumConfig[ist.durum] ?? durumConfig['Musait'];
            return (
              <Col key={ist.id} xs={24} sm={12} lg={8} xl={6}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 14,
                    border: `2px solid ${cfg.color}33`,
                    boxShadow: `0 4px 12px ${cfg.color}22`,
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Row justify="space-between" align="top">
                      <Col>
                        <Badge status={cfg.badge} />
                        <Tag color={cfg.color} style={{ marginLeft: 4 }}>
                          {cfg.label}
                        </Tag>
                      </Col>
                      <Col>
                        <Tag color="default" style={{ fontSize: 11 }}>{ist.tip}</Tag>
                      </Col>
                    </Row>

                    <div>
                      <Title level={5} style={{ margin: 0, lineHeight: 1.3 }}>{ist.ad}</Title>
                      <Text type="secondary" style={{ fontSize: 11 }}>{ist.kod}</Text>
                    </div>

                    <Space size={4}>
                      {ist.aktifIsVar ? (
                        <Tag color="blue" icon={<ToolOutlined />}>Aktif iş var</Tag>
                      ) : (
                        <Tag color="default">Aktif iş yok</Tag>
                      )}
                      {ist.bekleyenIsSayisi > 0 && (
                        <Tooltip title="Bekleyen iş adımı sayısı">
                          <Tag color="warning">{ist.bekleyenIsSayisi} bekleyen</Tag>
                        </Tooltip>
                      )}
                    </Space>

                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ToolOutlined /> {ist.depoAdi}
                    </Text>

                    <Button
                      size="small"
                      block
                      onClick={() => handleDurumGuncelle(ist)}
                      style={{ borderRadius: 8 }}
                    >
                      Durum Güncelle
                    </Button>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Durum Güncelleme Modalı */}
      <Modal
        title={`Durum Güncelle — ${selected?.ad}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={confirmDurumGuncelle}
        okText="Güncelle"
        cancelText="İptal"
        confirmLoading={updating}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Text>Mevcut durum: <Tag color={durumConfig[selected?.durum ?? 'Musait']?.color}>{selected?.durum}</Tag></Text>
          <div>
            <Text strong>Yeni Durum:</Text>
            <Select
              value={yeniDurum}
              onChange={setYeniDurum}
              style={{ width: '100%', marginTop: 8 }}
              options={[
                { value: 'Musait', label: 'Müsait' },
                { value: 'Mesgul', label: 'Meşgul' },
                { value: 'Arizali', label: 'Arızalı' },
              ]}
            />
          </div>
        </Space>
      </Modal>
    </Space>
  );
};

export default IstasyonListesi;
