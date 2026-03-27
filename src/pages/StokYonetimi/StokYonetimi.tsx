import React, { useEffect, useState } from 'react';
import {
  Card, Table, Tag, Button, Typography, Space, Modal, Form,
  Select, InputNumber, Input, message, Row, Col, Tabs, Statistic
} from 'antd';
import {
  PlusOutlined, MinusOutlined, SwapOutlined, CalculatorOutlined,
  ReloadOutlined, WarningOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { stokApi } from '@/api/stokApi';
import { depoApi } from '@/api/depoApi';
import { urunApi } from '@/api/urunApi';
import type { StokDto, ModalType } from '@/types/stok.types';
import type { DepoDto } from '@/api/depoApi';
import type { UrunDto } from '@/types/urun.types';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Text } = Typography;

const durumTag: Record<string, string> = {
  Hazir: 'success',
  IslemBekliyor: 'warning',
  Rezerve: 'processing',
  Hurda: 'error',
};

const StokYonetimi: React.FC = () => {
  const { user } = useAuth();
  const [stoklar, setStoklar] = useState<StokDto[]>([]);
  const [depolar, setDepolar] = useState<DepoDto[]>([]);
  const [urunler, setUrunler] = useState<UrunDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [saving, setSaving] = useState(false);
  const [depoFilter, setDepoFilter] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [stokRes, depoRes, urunRes] = await Promise.all([
        stokApi.getAll(),
        depoApi.getAll(),
        urunApi.getAll(),
      ]);
      if (stokRes.success && stokRes.data) setStoklar(stokRes.data);
      if (depoRes.success && depoRes.data) setDepolar(depoRes.data);
      if (urunRes.success && urunRes.data) setUrunler(urunRes.data);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: ModalType) => {
    form.resetFields();
    setModalType(type);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = { ...values, kullaniciId: user.id };
      let res;
      switch (modalType) {
        case 'giris':
          res = await stokApi.stokGirisi(payload as Parameters<typeof stokApi.stokGirisi>[0]);
          break;
        case 'cikis':
          res = await stokApi.stokCikisi(payload as Parameters<typeof stokApi.stokCikisi>[0]);
          break;
        case 'transfer':
          res = await stokApi.stokTransfer(payload as Parameters<typeof stokApi.stokTransfer>[0]);
          break;
        case 'sayim':
          res = await stokApi.stokSayim(payload as Parameters<typeof stokApi.stokSayim>[0]);
          break;
        default:
          return;
      }
      if (res.success) {
        message.success('İşlem başarılı');
        setModalType(null);
        await fetchAll();
      } else {
        message.error(res.message || 'İşlem başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredStoklar = stoklar
    .filter((s) => depoFilter === null || s.depoAdi === depolar.find((d) => d.id === depoFilter)?.ad)
    .filter((s) =>
      search === '' ||
      s.urunAdi.toLowerCase().includes(search.toLowerCase()) ||
      s.urunKodu.toLowerCase().includes(search.toLowerCase())
    );

  const dusukStok = stoklar.filter((s) => s.dusukStok).length;

  const columns: ColumnsType<StokDto> = [
    {
      title: 'Ürün',
      key: 'urun',
      render: (_: unknown, r: StokDto) => (
        <Space direction="vertical" size={0}>
          <Text strong>{r.urunAdi}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.urunKodu}</Text>
        </Space>
      ),
    },
    { title: 'Depo', dataIndex: 'depoAdi', key: 'depoAdi' },
    {
      title: 'Miktar',
      key: 'miktar',
      render: (_: unknown, r: StokDto) => (
        <Space>
          <Tag color={r.dusukStok ? 'error' : 'success'}>
            {r.miktar} {r.birim}
          </Tag>
          {r.dusukStok && <WarningOutlined style={{ color: '#ff4d4f' }} />}
        </Space>
      ),
    },
    {
      title: 'Min. Stok',
      dataIndex: 'minimumStok',
      key: 'minimumStok',
      render: (v?: number) => v ? <Tag color="default">{v}</Tag> : '—',
    },
    {
      title: 'Durum',
      dataIndex: 'durum',
      key: 'durum',
      render: (v: string) => <Tag color={durumTag[v] ?? 'default'}>{v}</Tag>,
    },
  ];

  const modalConfig: Record<NonNullable<ModalType>, { title: string; icon: React.ReactNode; color: string }> = {
    giris: { title: 'Stok Girişi', icon: <PlusOutlined />, color: '#52c41a' },
    cikis: { title: 'Stok Çıkışı', icon: <MinusOutlined />, color: '#ff4d4f' },
    transfer: { title: 'Stok Transferi', icon: <SwapOutlined />, color: '#1890ff' },
    sayim: { title: 'Stok Sayımı', icon: <CalculatorOutlined />, color: '#fa8c16' },
  };

  const urunOptions = urunler.map((u) => ({ value: u.id, label: `${u.ad} (${u.kod})` }));
  const depoOptions = depolar.map((d) => ({ value: d.id, label: d.ad }));

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>Stok Yönetimi</Title>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading} />
        </Col>
      </Row>

      {/* Özet */}
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false} style={{ borderRadius: 10, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Statistic title="Toplam Kalem" value={stoklar.length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false} style={{ borderRadius: 10, background: '#fff1f0', border: '1px solid #ffa39e' }}>
            <Statistic title="Düşük Stok" value={dusukStok} prefix={<WarningOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false} style={{ borderRadius: 10, background: '#e6f7ff', border: '1px solid #91d5ff' }}>
            <Statistic title="Depo Sayısı" value={depolar.length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false} style={{ borderRadius: 10, background: '#fff7e6', border: '1px solid #ffd591' }}>
            <Statistic title="Ürün Çeşidi" value={urunler.length} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
      </Row>

      {/* İşlem Butonları */}
      <Space wrap>
        {(['giris', 'cikis', 'transfer', 'sayim'] as NonNullable<ModalType>[]).map((type) => {
          const cfg = modalConfig[type];
          return (
            <Button
              key={type}
              icon={cfg.icon}
              onClick={() => openModal(type)}
              style={{ borderColor: cfg.color, color: cfg.color }}
            >
              {cfg.title}
            </Button>
          );
        })}
      </Space>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Tabs
          items={[
            {
              key: 'stoklar',
              label: 'Stok Listesi',
              children: (
                <>
                  <Space style={{ marginBottom: 16 }} wrap>
                    <Input.Search
                      placeholder="Ürün ara..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: 240 }}
                      allowClear
                    />
                    <Select
                      placeholder="Depoya göre filtrele"
                      allowClear
                      value={depoFilter}
                      onChange={(v) => setDepoFilter(v ?? null)}
                      style={{ width: 200 }}
                      options={depoOptions}
                    />
                    <Text type="secondary">{filteredStoklar.length} kayıt</Text>
                  </Space>
                  <Table
                    columns={columns}
                    dataSource={filteredStoklar}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 700 }}
                    pagination={{ pageSize: 20 }}
                    rowClassName={(r) => (r.dusukStok ? 'ant-table-row-danger' : '')}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* İşlem Modalı */}
      <Modal
        title={modalType ? modalConfig[modalType].title : ''}
        open={modalType !== null}
        onCancel={() => setModalType(null)}
        onOk={() => form.submit()}
        okText="Kaydet"
        cancelText="İptal"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item label="Ürün" name="urunId" rules={[{ required: true }]}>
            <Select showSearch placeholder="Ürün seçin" options={urunOptions} filterOption={(i, o) => (o?.label as string)?.toLowerCase().includes(i.toLowerCase())} />
          </Form.Item>

          {modalType === 'transfer' ? (
            <>
              <Form.Item label="Kaynak Depo" name="kaynakDepoId" rules={[{ required: true }]}>
                <Select options={depoOptions} placeholder="Kaynak depo" />
              </Form.Item>
              <Form.Item label="Hedef Depo" name="hedefDepoId" rules={[{ required: true }]}>
                <Select options={depoOptions} placeholder="Hedef depo" />
              </Form.Item>
            </>
          ) : (
            <Form.Item label="Depo" name="depoId" rules={[{ required: true }]}>
              <Select options={depoOptions} placeholder="Depo seçin" />
            </Form.Item>
          )}

          <Form.Item
            label={modalType === 'sayim' ? 'Yeni Miktar' : 'Miktar'}
            name={modalType === 'sayim' ? 'yeniMiktar' : 'miktar'}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Açıklama" name="aciklama" style={{ marginBottom: 0 }}>
            <Input placeholder="Opsiyonel" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default StokYonetimi;
