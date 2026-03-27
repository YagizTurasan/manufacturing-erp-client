import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Typography, Space, Button, Tag, Row, Col, Table,
  Descriptions, Statistic, Spin, Alert, Modal, Form, Select,
  Input, InputNumber, Popconfirm, message, Progress
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { urunApi } from '@/api/urunApi';
import { depoApi } from '@/api/depoApi';
import type {
  UrunDetayDto, UrunAgaciAdimDto, GerekliBilesenDetayDto,
  CreateUrunAgaciAdimDto, CreateGerekliBilesenDto
} from '@/types/urun.types';
import type { DepoDto } from '@/api/depoApi';

const { Title, Text } = Typography;

const UrunDetay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detay, setDetay] = useState<UrunDetayDto | null>(null);
  const [bilesenler, setBilesenler] = useState<GerekliBilesenDetayDto[]>([]);
  const [depolar, setDepolar] = useState<DepoDto[]>([]);
  const [tumUrunler, setTumUrunler] = useState<{ id: number; ad: string; kod: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [adimModal, setAdimModal] = useState(false);
  const [bilesenModal, setBilesenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adimForm] = Form.useForm();
  const [bilesenForm] = Form.useForm();

  const urunId = Number(id);

  useEffect(() => {
    if (id) fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [detayRes, bilesenRes, depoRes, urunRes] = await Promise.all([
        urunApi.getDetay(urunId),
        urunApi.getBilesenler(urunId),
        depoApi.getAll(),
        urunApi.getAll(),
      ]);
      if (detayRes.success && detayRes.data) setDetay(detayRes.data);
      if (bilesenRes.success && bilesenRes.data) setBilesenler(bilesenRes.data);
      if (depoRes.success && depoRes.data) setDepolar(depoRes.data);
      if (urunRes.success && urunRes.data) setTumUrunler(urunRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAdimEkle = async (values: Omit<CreateUrunAgaciAdimDto, 'urunId'>) => {
    setSaving(true);
    try {
      const res = await urunApi.createAdim({ ...values, urunId });
      if (res.success) {
        message.success('Adım eklendi');
        setAdimModal(false);
        adimForm.resetFields();
        await fetchAll();
      } else {
        message.error(res.message || 'Ekleme başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAdimSil = async (adimId: number) => {
    const res = await urunApi.deleteAdim(adimId);
    if (res.success) {
      message.success('Adım silindi');
      await fetchAll();
    } else {
      message.error(res.message || 'Silme başarısız');
    }
  };

  const handleBilesenEkle = async (values: Omit<CreateGerekliBilesenDto, 'urunId'>) => {
    setSaving(true);
    try {
      const res = await urunApi.createBilesen({ ...values, urunId });
      if (res.success) {
        message.success('Bileşen eklendi');
        setBilesenModal(false);
        bilesenForm.resetFields();
        await fetchAll();
      } else {
        message.error(res.message || 'Ekleme başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBilesenSil = async (bilesenId: number) => {
    const res = await urunApi.deleteBilesen(bilesenId);
    if (res.success) {
      message.success('Bileşen silindi');
      await fetchAll();
    }
  };

  const adimColumns: ColumnsType<UrunAgaciAdimDto> = [
    { title: '#', dataIndex: 'sira', key: 'sira', width: 50 },
    { title: 'İstasyon Tipi', dataIndex: 'istasyonTipi', key: 'istasyonTipi', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: 'Tanım', dataIndex: 'tanim', key: 'tanim' },
    { title: 'Çıktı Ürün', dataIndex: 'ciktiUrunAdi', key: 'ciktiUrunAdi', render: (v?: string) => v ?? '—' },
    { title: 'Hedef Depo', dataIndex: 'hedefDepoAdi', key: 'hedefDepoAdi', render: (v?: string) => v ?? '—' },
    {
      title: 'KK',
      dataIndex: 'kaliteKontrolGerekli',
      key: 'kaliteKontrolGerekli',
      render: (v: boolean) => <Tag color={v ? 'warning' : 'default'}>{v ? 'Gerekli' : 'Yok'}</Tag>,
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_: unknown, r: UrunAgaciAdimDto) => (
        <Popconfirm title="Adımı silmek istediğinizden emin misiniz?" onConfirm={() => handleAdimSil(r.id)} okText="Sil" cancelText="İptal" okButtonProps={{ danger: true }}>
          <Button type="text" icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    },
  ];

  const bilesenColumns: ColumnsType<GerekliBilesenDetayDto> = [
    {
      title: 'Bileşen',
      key: 'bilesen',
      render: (_: unknown, r: GerekliBilesenDetayDto) => (
        <Space direction="vertical" size={0}>
          <Text strong>{r.bilesenAdi}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.bilesenKodu}</Text>
        </Space>
      ),
    },
    { title: 'Gerekli Miktar', dataIndex: 'miktar', key: 'miktar', render: (v: number) => <Tag color="blue">{v}</Tag> },
    {
      title: 'Mevcut Stok',
      dataIndex: 'mevcutStok',
      key: 'mevcutStok',
      render: (v: number, r: GerekliBilesenDetayDto) => (
        <Tag color={v >= r.miktar ? 'success' : 'error'}>{v}</Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_: unknown, r: GerekliBilesenDetayDto) => (
        <Popconfirm title="Bileşeni silmek istediğinizden emin misiniz?" onConfirm={() => handleBilesenSil(r.id)} okText="Sil" cancelText="İptal" okButtonProps={{ danger: true }}>
          <Button type="text" icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>;
  }

  if (!detay) {
    return <Alert message="Ürün bulunamadı" type="error" showIcon action={<Button onClick={() => navigate('/urunler')}>Geri Dön</Button>} />;
  }

  const tipRenk: Record<string, string> = { Hammadde: 'green', YariMamul: 'orange', Mamul: 'blue' };
  const hurdaOrani = detay.istatistikler?.hurdaOrani ?? 0;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {/* Başlık */}
      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/urunler')} />
            <div>
              <Title level={4} style={{ margin: 0 }}>{detay.ad}</Title>
              <Space>
                <Text code>{detay.kod}</Text>
                <Tag color={tipRenk[detay.tip] ?? 'default'}>{detay.tip}</Tag>
              </Space>
            </div>
          </Space>
        </Col>
      </Row>

      {/* Üst Bilgi */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Birim">{detay.birim}</Descriptions.Item>
              <Descriptions.Item label="Min. Stok">{detay.minimumStok ?? '—'}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 16 }}>Stok Durumu</Title>
            {detay.stoklar.length === 0 ? (
              <Text type="secondary">Stok kaydı bulunmuyor</Text>
            ) : (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {detay.stoklar.map((s, i) => (
                  <Row key={i} justify="space-between" align="middle">
                    <Col>
                      <Text>{s.depoAdi}</Text>
                      <Tag style={{ marginLeft: 8 }} color="default">{s.durum}</Tag>
                    </Col>
                    <Col>
                      <Tag color="blue">{s.miktar} {detay.birim}</Tag>
                    </Col>
                  </Row>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Statistic title="Toplam Üretilen" value={detay.istatistikler?.toplamUretilenAdet ?? 0} suffix="adet" valueStyle={{ color: '#52c41a' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Aktif İş Emri" value={detay.istatistikler?.aktifIsEmriSayisi ?? 0} valueStyle={{ color: '#1890ff' }} />
              </Col>
              <Col span={24}>
                <Text type="secondary">Hurda Oranı</Text>
                <Progress
                  percent={Math.round(hurdaOrani * 100)}
                  strokeColor={hurdaOrani > 0.05 ? '#ff4d4f' : '#52c41a'}
                  size="small"
                  style={{ marginTop: 4 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Üretim Adımları */}
      <Card
        title="Üretim Adımları"
        bordered={false}
        style={{ borderRadius: 12 }}
        extra={
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => { adimForm.resetFields(); setAdimModal(true); }}>
            Adım Ekle
          </Button>
        }
      >
        <Table
          columns={adimColumns}
          dataSource={detay.uretimAdimlari}
          rowKey="id"
          size="small"
          pagination={false}
          locale={{ emptyText: 'Üretim adımı tanımlanmamış' }}
        />
      </Card>

      {/* Gerekli Bileşenler */}
      <Card
        title="Gerekli Bileşenler"
        bordered={false}
        style={{ borderRadius: 12 }}
        extra={
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => { bilesenForm.resetFields(); setBilesenModal(true); }}>
            Bileşen Ekle
          </Button>
        }
      >
        <Table
          columns={bilesenColumns}
          dataSource={bilesenler}
          rowKey="id"
          size="small"
          pagination={false}
          locale={{ emptyText: 'Gerekli bileşen tanımlanmamış' }}
        />
      </Card>

      {/* Adım Ekleme Modalı */}
      <Modal title="Üretim Adımı Ekle" open={adimModal} onCancel={() => setAdimModal(false)} onOk={() => adimForm.submit()} okText="Ekle" cancelText="İptal" confirmLoading={saving}>
        <Form form={adimForm} layout="vertical" onFinish={handleAdimEkle} requiredMark={false}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Sıra" name="sira" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="İstasyon Tipi" name="istasyonTipi" rules={[{ required: true }]}>
                <Select options={['Torna','Lazer','Abkant','Kumlama','GazaltiKaynak','RobotKaynak','HidrolikPres','DikIslem','Dogrultma','Taslama','KaliteKontrol','Sevkiyat'].map((v) => ({ value: v, label: v }))} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Tanım" name="tanim" rules={[{ required: true }]}>
            <Input placeholder="Adım açıklaması" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Çıktı Ürün" name="ciktiUrunId">
                <Select allowClear showSearch placeholder="Opsiyonel" options={tumUrunler.map((u) => ({ value: u.id, label: `${u.ad} (${u.kod})` }))} filterOption={(i, o) => (o?.label as string)?.toLowerCase().includes(i.toLowerCase())} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hedef Depo" name="hedefDepoId" rules={[{ required: true }]}>
                <Select options={depolar.map((d) => ({ value: d.id, label: d.ad }))} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Kalite Kontrol" name="kaliteKontrolGerekli" initialValue={false} style={{ marginBottom: 0 }}>
            <Select options={[{ value: false, label: 'Gerekmez' }, { value: true, label: 'Gerekli' }]} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Bileşen Ekleme Modalı */}
      <Modal title="Bileşen Ekle" open={bilesenModal} onCancel={() => setBilesenModal(false)} onOk={() => bilesenForm.submit()} okText="Ekle" cancelText="İptal" confirmLoading={saving}>
        <Form form={bilesenForm} layout="vertical" onFinish={handleBilesenEkle} requiredMark={false}>
          <Form.Item label="Bileşen Ürün" name="bilesenUrunId" rules={[{ required: true }]}>
            <Select showSearch placeholder="Ürün seç" options={tumUrunler.filter((u) => u.id !== urunId).map((u) => ({ value: u.id, label: `${u.ad} (${u.kod})` }))} filterOption={(i, o) => (o?.label as string)?.toLowerCase().includes(i.toLowerCase())} />
          </Form.Item>
          <Form.Item label="Miktar" name="miktar" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default UrunDetay;
