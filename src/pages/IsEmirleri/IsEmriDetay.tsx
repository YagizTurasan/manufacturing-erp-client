import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Typography, Space, Button, Tag, Row, Col,
  Steps, Table, Descriptions, Progress, Spin, Alert
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { isEmriApi } from '@/api/isEmriApi';
import type { IsEmriDetayDto, IsEmriAdimDetayDto, DepoHareketDto } from '@/types/isEmri.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const durumTag: Record<string, { color: string; label: string }> = {
  Beklemede: { color: 'default', label: 'Beklemede' },
  Hazir: { color: 'cyan', label: 'Hazır' },
  DevamEdiyor: { color: 'processing', label: 'Devam Ediyor' },
  KaliteKontrolde: { color: 'purple', label: 'Kal. Kontrolde' },
  Tamamlandi: { color: 'success', label: 'Tamamlandı' },
  Reddedildi: { color: 'error', label: 'Reddedildi' },
};

const stepStatus: Record<string, 'wait' | 'process' | 'finish' | 'error'> = {
  Beklemede: 'wait',
  Hazir: 'wait',
  DevamEdiyor: 'process',
  KaliteKontrolde: 'process',
  Tamamlandi: 'finish',
  Reddedildi: 'error',
};

const IsEmriDetay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detay, setDetay] = useState<IsEmriDetayDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetay(Number(id));
  }, [id]);

  const fetchDetay = async (isEmriId: number) => {
    setLoading(true);
    try {
      const res = await isEmriApi.getDetay(isEmriId);
      if (res.success && res.data) {
        setDetay(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const hareketColumns: ColumnsType<DepoHareketDto> = [
    {
      title: 'Tarih',
      dataIndex: 'tarih',
      key: 'tarih',
      render: (v: string) => dayjs(v).format('DD.MM.YYYY HH:mm'),
    },
    { title: 'Tip', dataIndex: 'tip', key: 'tip', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Ürün', dataIndex: 'urunAdi', key: 'urunAdi' },
    { title: 'Depo', dataIndex: 'depoAdi', key: 'depoAdi' },
    {
      title: 'Miktar',
      dataIndex: 'miktar',
      key: 'miktar',
      render: (v: number) => <Tag color="blue">{v} adet</Tag>,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!detay) {
    return (
      <Alert
        message="İş emri bulunamadı"
        type="error"
        showIcon
        action={<Button onClick={() => navigate('/is-emirleri')}>Geri Dön</Button>}
      />
    );
  }

  const d = detay;

  const tamamlanmaYuzdesi = d.hedefMiktar > 0
    ? Math.round((d.tamamlananMiktar / d.hedefMiktar) * 100)
    : 0;

  const durumCfg = durumTag[d.durum] ?? { color: 'default', label: d.durum };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {/* Başlık */}
      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/is-emirleri')} />
            <div>
              <Title level={4} style={{ margin: 0 }}>{d.isEmriNo}</Title>
              <Text type="secondary">İş Emri Detayı</Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Tag color={durumCfg.color} style={{ fontSize: 14, padding: '4px 12px' }}>
            {durumCfg.label}
          </Tag>
        </Col>
      </Row>

      {/* Üst Bilgi Kartları */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Ürün">
                <Text strong>{d.urunAdi}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Hedef Miktar">
                <Tag color="blue">{d.hedefMiktar} adet</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tamamlanan">
                <Tag color="success">{d.tamamlananMiktar} adet</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Hurda">
                <Tag color={d.hurdaMiktar > 0 ? 'error' : 'default'}>{d.hurdaMiktar} adet</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Oluşturan">{d.olusturanKullanici}</Descriptions.Item>
              <Descriptions.Item label="Başlangıç">
                {d.baslangicTarihi ? dayjs(d.baslangicTarihi).format('DD.MM.YYYY HH:mm') : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Bitiş">
                {d.bitisTarihi ? dayjs(d.bitisTarihi).format('DD.MM.YYYY HH:mm') : '—'}
              </Descriptions.Item>
              {d.notlar && (
                <Descriptions.Item label="Notlar" span={2}>{d.notlar}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ borderRadius: 12, height: '100%' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Text strong>Tamamlanma Durumu</Text>
              <Progress
                type="circle"
                percent={tamamlanmaYuzdesi}
                strokeColor={{ '0%': '#667eea', '100%': '#52c41a' }}
                style={{ display: 'block', textAlign: 'center' }}
              />
              <Row gutter={8} style={{ marginTop: 8 }}>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: 700, color: '#52c41a' }}>{d.tamamlananMiktar}</Text>
                  <br /><Text type="secondary" style={{ fontSize: 11 }}>Tamamlanan</Text>
                </Col>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: 700, color: '#faad14' }}>
                    {d.hedefMiktar - d.tamamlananMiktar}
                  </Text>
                  <br /><Text type="secondary" style={{ fontSize: 11 }}>Kalan</Text>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* İş Adımları */}
      {d.isAdimlari && d.isAdimlari.length > 0 && (
        <Card title="İş Adımları" bordered={false} style={{ borderRadius: 12 }}>
          <Steps
            direction="vertical"
            size="small"
            items={d.isAdimlari.map((adim: IsEmriAdimDetayDto) => ({
              title: (
                <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                  <Col>
                    <Space>
                      <Text strong>#{adim.sira} — {adim.tanim}</Text>
                      <Tag color={durumTag[adim.durum]?.color ?? 'default'}>
                        {durumTag[adim.durum]?.label ?? adim.durum}
                      </Tag>
                    </Space>
                  </Col>
                </Row>
              ),
              description: (
                <Space wrap style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    İstasyon: {adim.istasyonAdi || '—'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {adim.tamamlananMiktar}/{adim.hedefMiktar} adet
                  </Text>
                  {adim.sorumluKullanici && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Operatör: {adim.sorumluKullanici}
                    </Text>
                  )}
                  {adim.kaliteKontrolGerekli && (
                    <Tag color="warning" style={{ fontSize: 11 }}>KK Gerekli</Tag>
                  )}
                </Space>
              ),
              status: stepStatus[adim.durum] ?? 'wait',
            }))}
          />
        </Card>
      )}

      {/* Depo Hareketleri */}
      {d.depoHareketleri && d.depoHareketleri.length > 0 && (
        <Card title="Depo Hareketleri" bordered={false} style={{ borderRadius: 12 }}>
          <Table
            columns={hareketColumns}
            dataSource={d.depoHareketleri}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
          />
        </Card>
      )}
    </Space>
  );
};

export default IsEmriDetay;
