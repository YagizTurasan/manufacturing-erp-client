import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Statistic, Table, Tag, Progress, Alert,
  Typography, Space, Spin, Badge
} from 'antd';
import {
  FileTextOutlined, ToolOutlined, RiseOutlined, WarningOutlined,
  CheckCircleOutlined, ClockCircleOutlined, StopOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { dashboardApi } from '@/api/dashboardApi';
import type { DashboardOzetDto, AktifIsDto, DusukStokUyariDto } from '@/types/dashboard.types';

const { Title, Text } = Typography;

const durumRenk: Record<string, string> = {
  Musait: 'success',
  Mesgul: 'processing',
  Arizali: 'error',
};

const Dashboard: React.FC = () => {
  const [ozet, setOzet] = useState<DashboardOzetDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await dashboardApi.getOzet();
      if (res.success && res.data) setOzet(res.data);
    } finally {
      setLoading(false);
    }
  };

  const aktifIsColumns: ColumnsType<AktifIsDto> = [
    {
      title: 'İş Emri',
      dataIndex: 'isEmriNo',
      key: 'isEmriNo',
      render: (v: string) => <Text strong style={{ color: '#667eea' }}>{v}</Text>,
    },
    { title: 'Ürün', dataIndex: 'urunAdi', key: 'urunAdi' },
    { title: 'İstasyon', dataIndex: 'istasyonAdi', key: 'istasyonAdi' },
    { title: 'Operatör', dataIndex: 'operatorAdi', key: 'operatorAdi' },
    {
      title: 'İlerleme',
      dataIndex: 'tamamlanmaYuzdesi',
      key: 'tamamlanmaYuzdesi',
      width: 160,
      render: (v: number) => (
        <Progress percent={v} size="small" strokeColor="#667eea" />
      ),
    },
  ];

  const dusukStokColumns: ColumnsType<DusukStokUyariDto> = [
    {
      title: 'Ürün',
      dataIndex: 'urunAdi',
      key: 'urunAdi',
      render: (v: string, row: DusukStokUyariDto) => (
        <Space direction="vertical" size={0}>
          <Text strong>{v}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{row.urunKodu}</Text>
        </Space>
      ),
    },
    {
      title: 'Mevcut',
      dataIndex: 'mevcutStok',
      key: 'mevcutStok',
      render: (v: number) => <Tag color="error">{v}</Tag>,
    },
    {
      title: 'Minimum',
      dataIndex: 'minimumStok',
      key: 'minimumStok',
      render: (v: number) => <Tag color="default">{v}</Tag>,
    },
    {
      title: 'Eksik',
      dataIndex: 'eksikMiktar',
      key: 'eksikMiktar',
      render: (v: number) => <Tag color="warning">{v} adet</Tag>,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  const ie = ozet?.isEmirleri;
  const ist = ozet?.istasyonlar;
  const uretim = ozet?.uretim;
  const hurda = ozet?.hurda;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Title level={4} style={{ margin: 0 }}>Dashboard</Title>

      {/* Üst Kart Satırı */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="Aktif İş Emirleri"
              value={ie?.toplamAktif ?? 0}
              prefix={<FileTextOutlined style={{ color: '#667eea' }} />}
              valueStyle={{ color: '#667eea' }}
            />
            <Space size={4} style={{ marginTop: 8 }}>
              <Tag icon={<ClockCircleOutlined />} color="warning">{ie?.beklemede ?? 0} Beklemede</Tag>
              <Tag icon={<RiseOutlined />} color="processing">{ie?.devamEdiyor ?? 0} Devam</Tag>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="İstasyon Durumu"
              value={ist?.musait ?? 0}
              suffix={`/ ${ist?.toplamIstasyon ?? 0}`}
              prefix={<ToolOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Space size={4} style={{ marginTop: 8 }}>
              <Badge status="processing" text={`${ist?.mesgul ?? 0} Meşgul`} />
              <Badge status="error" text={`${ist?.arizali ?? 0} Arızalı`} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="Bugünkü Üretim"
              value={uretim?.bugunkuUretim ?? 0}
              suffix="adet"
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Space size={4} style={{ marginTop: 8 }}>
              <Tag color="blue">{uretim?.buHaftaUretim ?? 0} Bu Hafta</Tag>
              {(uretim?.bekleyenKaliteKontrol ?? 0) > 0 && (
                <Tag color="warning">{uretim?.bekleyenKaliteKontrol} KK Bekliyor</Tag>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Statistic
              title="Bugünkü Hurda"
              value={hurda?.bugunkuHurdaAdet ?? 0}
              suffix="adet"
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Space size={4} style={{ marginTop: 8 }}>
              <Tag color="error">
                %{((hurda?.bugunkuHurdaOrani ?? 0) * 100).toFixed(1)} Hurda Oranı
              </Tag>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* İstasyon Kullanım Oranı */}
      {ist && (
        <Card
          title="İstasyon Kullanım Oranı"
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <Progress
            percent={Math.round((ist.kullanimOrani ?? 0) * 100)}
            strokeColor={{ '0%': '#667eea', '100%': '#764ba2' }}
            format={(p) => `%${p} Kullanımda`}
          />
          <Row gutter={16} style={{ marginTop: 16 }}>
            {[
              { label: 'Müsait', value: ist.musait, color: '#52c41a' },
              { label: 'Meşgul', value: ist.mesgul, color: '#1890ff' },
              { label: 'Arızalı', value: ist.arizali, color: '#ff4d4f' },
            ].map((item) => (
              <Col key={item.label} span={8} style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: 700, color: item.color }}>
                  {item.value}
                </Text>
                <br />
                <Text type="secondary">{item.label}</Text>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      <Row gutter={[16, 16]}>
        {/* Aktif İşler */}
        <Col xs={24} xl={14}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: '#667eea' }} />
                <span>Aktif İşler</span>
                <Tag color="purple">{ozet?.aktifIsler?.length ?? 0}</Tag>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Table
              columns={aktifIsColumns}
              dataSource={ozet?.aktifIsler ?? []}
              rowKey="isEmriNo"
              pagination={{ pageSize: 5, hideOnSinglePage: true }}
              size="small"
              locale={{ emptyText: 'Aktif iş bulunmuyor' }}
            />
          </Card>
        </Col>

        {/* Düşük Stok Uyarıları */}
        <Col xs={24} xl={10}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: '#faad14' }} />
                <span>Düşük Stok Uyarıları</span>
                {(ozet?.dusukStokUyarilari?.length ?? 0) > 0 && (
                  <Tag color="warning">{ozet!.dusukStokUyarilari.length}</Tag>
                )}
              </Space>
            }
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            {(ozet?.dusukStokUyarilari?.length ?? 0) === 0 ? (
              <Alert
                message="Tüm stok seviyeleri yeterli"
                type="success"
                showIcon
              />
            ) : (
              <Table
                columns={dusukStokColumns}
                dataSource={ozet?.dusukStokUyarilari ?? []}
                rowKey="urunKodu"
                pagination={{ pageSize: 5, hideOnSinglePage: true }}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* İstasyon Durum Özeti */}
      {ozet?.istasyonlar && (
        <Card
          title="Üretim Özeti"
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <Row gutter={[16, 16]}>
            {[
              { label: 'Bugün Tamamlanan', value: ie?.bugunkuTamamlanan ?? 0, color: '#52c41a', suffix: 'iş emri' },
              { label: 'Bu Hafta', value: ie?.buHaftaTamamlanan ?? 0, color: '#1890ff', suffix: 'iş emri' },
              { label: 'Bu Ay', value: ie?.buAyTamamlanan ?? 0, color: '#667eea', suffix: 'iş emri' },
              { label: 'Bu Ay Üretim', value: uretim?.buAyUretim ?? 0, color: '#faad14', suffix: 'adet' },
            ].map((item) => (
              <Col key={item.label} xs={12} sm={6}>
                <Card
                  size="small"
                  style={{
                    textAlign: 'center',
                    borderRadius: 10,
                    background: `${item.color}11`,
                    border: `1px solid ${item.color}33`,
                  }}
                >
                  <Text style={{ fontSize: 28, fontWeight: 700, color: item.color }}>
                    {item.value}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text>
                  <br />
                  <Text style={{ fontSize: 11, color: item.color }}>{item.suffix}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Durum Renk Açıklaması */}
      <div style={{ display: 'none' }}>{JSON.stringify(durumRenk)}</div>
    </Space>
  );
};

export default Dashboard;
