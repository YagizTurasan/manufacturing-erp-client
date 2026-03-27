import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Table, Tag, Button, Typography, Space, Modal, Form,
  Select, InputNumber, Input, Tooltip, message, Row, Col, Popconfirm
} from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { urunApi } from '@/api/urunApi';
import type { UrunDto, CreateUrunDto } from '@/types/urun.types';

const { Title, Text } = Typography;

const tipRenk: Record<string, string> = {
  Hammadde: 'green',
  YariMamul: 'orange',
  Mamul: 'blue',
};

const UrunListesi: React.FC = () => {
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState<UrunDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tipFilter, setTipFilter] = useState<string>('Tümü');
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await urunApi.getAll();
      if (res.success && res.data) setUrunler(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: CreateUrunDto) => {
    setSaving(true);
    try {
      const res = await urunApi.create(values);
      if (res.success) {
        message.success('Ürün oluşturuldu');
        setCreateModal(false);
        form.resetFields();
        await fetchData();
      } else {
        message.error(res.message || 'Oluşturma başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await urunApi.delete(id);
      if (res.success) {
        message.success('Ürün silindi');
        await fetchData();
      } else {
        message.error(res.message || 'Silme başarısız');
      }
    } catch {
      message.error('Bir hata oluştu');
    }
  };

  const filtered = urunler
    .filter((u) => tipFilter === 'Tümü' || u.tip === tipFilter)
    .filter((u) =>
      search === '' ||
      u.ad.toLowerCase().includes(search.toLowerCase()) ||
      u.kod.toLowerCase().includes(search.toLowerCase())
    );

  const columns: ColumnsType<UrunDto> = [
    {
      title: 'Kod',
      dataIndex: 'kod',
      key: 'kod',
      width: 120,
      render: (v: string) => <Text code>{v}</Text>,
    },
    {
      title: 'Ürün Adı',
      dataIndex: 'ad',
      key: 'ad',
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: 'Tip',
      dataIndex: 'tip',
      key: 'tip',
      render: (v: string) => <Tag color={tipRenk[v] ?? 'default'}>{v}</Tag>,
    },
    {
      title: 'Birim',
      dataIndex: 'birim',
      key: 'birim',
      width: 90,
    },
    {
      title: 'Toplam Stok',
      dataIndex: 'toplamStok',
      key: 'toplamStok',
      render: (v: number, r: UrunDto) => (
        <Tag color={r.minimumStok && v < r.minimumStok ? 'error' : 'success'}>
          {v} {r.birim}
        </Tag>
      ),
    },
    {
      title: 'Min. Stok',
      dataIndex: 'minimumStok',
      key: 'minimumStok',
      render: (v?: number) => v ?? '—',
    },
    {
      title: 'Adım Sayısı',
      dataIndex: 'adimSayisi',
      key: 'adimSayisi',
      render: (v: number) => <Tag color="purple">{v} adım</Tag>,
    },
    {
      title: 'İşlem',
      key: 'action',
      width: 100,
      render: (_: unknown, record: UrunDto) => (
        <Space>
          <Tooltip title="Detay">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={(e) => { e.stopPropagation(); navigate(`/urunler/${record.id}`); }}
              style={{ color: '#667eea' }}
            />
          </Tooltip>
          <Popconfirm
            title="Bu ürünü silmek istediğinizden emin misiniz?"
            onConfirm={(e) => { e?.stopPropagation(); handleDelete(record.id); }}
            okText="Sil"
            cancelText="İptal"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Sil">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>Ürünler</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => { form.resetFields(); setCreateModal(true); }}
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
            >
              Yeni Ürün
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Özet */}
      <Row gutter={[12, 12]}>
        {['Hammadde', 'YariMamul', 'Mamul'].map((tip) => (
          <Col key={tip} xs={8}>
            <Card
              size="small"
              bordered={false}
              style={{ borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}
              onClick={() => setTipFilter(tipFilter === tip ? 'Tümü' : tip)}
              styles={{ body: { padding: '12px 16px' } }}
            >
              <Text style={{ fontSize: 24, fontWeight: 700, color: tipRenk[tip] }}>
                {urunler.filter((u) => u.tip === tip).length}
              </Text>
              <br />
              <Tag color={tipRenk[tip]}>{tip}</Tag>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            placeholder="Ürün adı veya kodu ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            value={tipFilter}
            onChange={setTipFilter}
            style={{ width: 150 }}
            options={[
              { value: 'Tümü', label: 'Tüm Tipler' },
              { value: 'Hammadde', label: 'Hammadde' },
              { value: 'YariMamul', label: 'Yarı Mamul' },
              { value: 'Mamul', label: 'Mamul' },
            ]}
          />
          <Text type="secondary">{filtered.length} ürün</Text>
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          onRow={(record) => ({
            onClick: () => navigate(`/urunler/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {/* Yeni Ürün Modalı */}
      <Modal
        title="Yeni Ürün Oluştur"
        open={createModal}
        onCancel={() => setCreateModal(false)}
        onOk={() => form.submit()}
        okText="Oluştur"
        cancelText="İptal"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} requiredMark={false}>
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item
                label="Ürün Adı"
                name="ad"
                rules={[{ required: true, message: 'Ad giriniz' }]}
              >
                <Input placeholder="Ürün adı" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Kod"
                name="kod"
                rules={[{ required: true, message: 'Kod giriniz' }]}
              >
                <Input placeholder="Ürün kodu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Tip"
                name="tip"
                rules={[{ required: true, message: 'Tip seçiniz' }]}
              >
                <Select
                  options={[
                    { value: 'Hammadde', label: 'Hammadde' },
                    { value: 'YariMamul', label: 'Yarı Mamul' },
                    { value: 'Mamul', label: 'Mamul' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Birim"
                name="birim"
                initialValue="Adet"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'Adet', label: 'Adet' },
                    { value: 'Kg', label: 'Kg' },
                    { value: 'Metre', label: 'Metre' },
                    { value: 'Litre', label: 'Litre' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Minimum Stok" name="minimumStok" style={{ marginBottom: 0 }}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Opsiyonel" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default UrunListesi;
