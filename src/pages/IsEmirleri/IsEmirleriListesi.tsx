import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Table, Tag, Button, Typography, Space, Modal, Form,
  Select, InputNumber, Input, Tooltip, message, Row, Col, Statistic, Alert
} from 'antd';
import {
  PlusOutlined, EyeOutlined, StopOutlined, ReloadOutlined, FileTextOutlined,
  CheckCircleOutlined, WarningOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { isEmriApi } from '@/api/isEmriApi';
import { urunApi } from '@/api/urunApi';
import type { IsEmriDto, CreateIsEmriDto } from '@/types/isEmri.types';
import type { UrunDto, GerekliBilesenDetayDto } from '@/types/urun.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const durumTag: Record<string, { color: string; label: string }> = {
  Beklemede: { color: 'warning', label: 'Beklemede' },
  DevamEdiyor: { color: 'processing', label: 'Devam Ediyor' },
  Tamamlandi: { color: 'success', label: 'Tamamlandı' },
  IptalEdildi: { color: 'error', label: 'İptal Edildi' },
  KaliteKontrolde: { color: 'purple', label: 'Kal. Kontrolde' },
};

const IsEmirleriListesi: React.FC = () => {
  const navigate = useNavigate();
  const [isEmirleri, setIsEmirleri] = useState<IsEmriDto[]>([]);
  const [urunler, setUrunler] = useState<UrunDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [iptalModal, setIptalModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [iptalNeden, setIptalNeden] = useState('');
  const [saving, setSaving] = useState(false);
  const [durumFilter, setDurumFilter] = useState<string>('Tümü');
  const [selectedUrunBilesenler, setSelectedUrunBilesenler] = useState<GerekliBilesenDetayDto[]>([]);
  const [bilesenLoading, setBilesenLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [isRes, urunRes] = await Promise.all([
        isEmriApi.getAll(),
        urunApi.getAll(),
      ]);
      if (isRes.success && isRes.data) setIsEmirleri(isRes.data);
      if (urunRes.success && urunRes.data) setUrunler(urunRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUrunSec = async (urunId: number) => {
    setSelectedUrunBilesenler([]);
    setBilesenLoading(true);
    try {
      const res = await urunApi.getBilesenler(urunId);
      if (res.success && res.data) setSelectedUrunBilesenler(res.data);
    } finally {
      setBilesenLoading(false);
    }
  };

  const handleCreate = async (values: CreateIsEmriDto) => {
    setSaving(true);
    try {
      const res = await isEmriApi.create(values);
      if (res.success) {
        message.success('İş emri oluşturuldu');
        setCreateModal(false);
        form.resetFields();
        await fetchData();
      } else {
        const detay = res.errors && res.errors.length > 0
          ? res.errors.join('\n')
          : res.message || 'Oluşturma başarısız';
        Modal.error({
          title: 'İş Emri Oluşturulamadı',
          content: (
            <div style={{ whiteSpace: 'pre-line', marginTop: 8 }}>
              {detay}
            </div>
          ),
          width: 480,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleIptal = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await isEmriApi.iptal(selectedId, iptalNeden);
      if (res.success) {
        message.success('İş emri iptal edildi');
        setIptalModal(false);
        setIptalNeden('');
        await fetchData();
      } else {
        message.error(res.message || 'İptal başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = durumFilter === 'Tümü'
    ? isEmirleri
    : isEmirleri.filter((ie) => ie.durum === durumFilter);

  const ozet = {
    beklemede: isEmirleri.filter((i) => i.durum === 'Beklemede').length,
    devam: isEmirleri.filter((i) => i.durum === 'DevamEdiyor').length,
    tamamlandi: isEmirleri.filter((i) => i.durum === 'Tamamlandi').length,
  };

  const columns: ColumnsType<IsEmriDto> = [
    {
      title: 'İş Emri No',
      dataIndex: 'isEmriNo',
      key: 'isEmriNo',
      render: (v: string) => (
        <Text strong style={{ color: '#667eea' }}>{v}</Text>
      ),
    },
    {
      title: 'Ürün',
      dataIndex: 'urunAdi',
      key: 'urunAdi',
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: 'Hedef / Tamamlanan',
      key: 'miktar',
      render: (_: unknown, r: IsEmriDto) => (
        <Space direction="vertical" size={0}>
          <Text>{r.tamamlananMiktar} / {r.hedefMiktar} adet</Text>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>
            Hurda: {r.hurdaMiktar}
          </div>
        </Space>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'durum',
      key: 'durum',
      render: (v: string) => {
        const cfg = durumTag[v] ?? { color: 'default', label: v };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Başlangıç',
      dataIndex: 'baslangicTarihi',
      key: 'baslangicTarihi',
      render: (v?: string) => v ? dayjs(v).format('DD.MM.YYYY') : '—',
    },
    {
      title: 'Oluşturan',
      dataIndex: 'olusturanKullanici',
      key: 'olusturanKullanici',
    },
    {
      title: 'İşlem',
      key: 'action',
      width: 120,
      render: (_: unknown, record: IsEmriDto) => (
        <Space>
          <Tooltip title="Detay">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/is-emirleri/${record.id}`)}
              style={{ color: '#667eea' }}
            />
          </Tooltip>
          {(record.durum === 'Beklemede' || record.durum === 'DevamEdiyor') && (
            <Tooltip title="İptal Et">
              <Button
                type="text"
                icon={<StopOutlined />}
                danger
                onClick={() => { setSelectedId(record.id); setIptalModal(true); }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>İş Emirleri</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => { form.resetFields(); setSelectedUrunBilesenler([]); setCreateModal(true); }}
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
            >
              Yeni İş Emri
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Özet */}
      <Row gutter={[12, 12]}>
        {[
          { label: 'Beklemede', value: ozet.beklemede, color: '#fa8c16', bg: '#fff7e6', border: '#ffd591' },
          { label: 'Devam Ediyor', value: ozet.devam, color: '#1890ff', bg: '#e6f7ff', border: '#91d5ff' },
          { label: 'Tamamlandı', value: ozet.tamamlandi, color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' },
          { label: 'Toplam', value: isEmirleri.length, color: '#667eea', bg: '#f0f0ff', border: '#c5b8f8' },
        ].map((item) => (
          <Col key={item.label} xs={12} sm={6}>
            <Card size="small" bordered={false} style={{ borderRadius: 10, background: item.bg, border: `1px solid ${item.border}` }}>
              <Statistic
                title={item.label}
                value={item.value}
                prefix={<FileTextOutlined style={{ color: item.color }} />}
                valueStyle={{ color: item.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filtre + Tablo */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }}>
          <Select
            value={durumFilter}
            onChange={setDurumFilter}
            style={{ width: 180 }}
            options={[
              { value: 'Tümü', label: 'Tüm Durumlar' },
              ...Object.entries(durumTag).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          <Text type="secondary">{filtered.length} kayıt</Text>
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{ pageSize: 15, showSizeChanger: true }}
          onRow={(record) => ({
            onClick: () => navigate(`/is-emirleri/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {/* Yeni İş Emri Modalı */}
      <Modal
        title="Yeni İş Emri Oluştur"
        open={createModal}
        onCancel={() => setCreateModal(false)}
        onOk={() => form.submit()}
        okText="Oluştur"
        cancelText="İptal"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} requiredMark={false}>
          <Form.Item
            label="Ürün"
            name="urunId"
            rules={[{ required: true, message: 'Ürün seçiniz' }]}
          >
            <Select
              showSearch
              placeholder="Ürün seçin"
              filterOption={(input, opt) =>
                (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleUrunSec}
              options={urunler
                .filter((u) => u.tip === 'Mamul' || u.tip === 'YariMamul')
                .map((u) => ({ value: u.id, label: `${u.ad} (${u.kod})` }))
              }
            />
          </Form.Item>

          {/* Bileşen Stok Durumu */}
          {bilesenLoading && <Alert message="Bileşenler kontrol ediliyor..." type="info" showIcon style={{ marginBottom: 12 }} />}
          {!bilesenLoading && selectedUrunBilesenler.length > 0 && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
              <Text strong style={{ fontSize: 13 }}>Gerekli Bileşenler (Stok Durumu)</Text>
              <Space direction="vertical" size={6} style={{ width: '100%', marginTop: 8 }}>
                {selectedUrunBilesenler.map((b) => {
                  const yeterli = b.mevcutStok >= b.miktar;
                  return (
                    <Row key={b.id} justify="space-between" align="middle">
                      <Col>
                        <Space size={6}>
                          {yeterli
                            ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            : <WarningOutlined style={{ color: '#ff4d4f' }} />}
                          <Text style={{ fontSize: 13 }}>{b.bilesenAdi}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>({b.bilesenKodu})</Text>
                        </Space>
                      </Col>
                      <Col>
                        <Space size={4}>
                          <Tag color={yeterli ? 'success' : 'error'}>Stok: {b.mevcutStok}</Tag>
                          <Tag color="default">Gerekli: {b.miktar}</Tag>
                        </Space>
                      </Col>
                    </Row>
                  );
                })}
              </Space>
              {selectedUrunBilesenler.some((b) => b.mevcutStok < b.miktar) && (
                <Alert
                  style={{ marginTop: 10 }}
                  type="warning"
                  showIcon
                  message="Yetersiz stok tespit edildi. Önce eksik bileşenlerin iş emrini oluşturun."
                />
              )}
            </div>
          )}

          <Form.Item
            label="Hedef Miktar"
            name="hedefMiktar"
            rules={[{ required: true, message: 'Miktar giriniz' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Adet" />
          </Form.Item>

          <Form.Item label="Notlar" name="notlar" style={{ marginBottom: 0 }}>
            <TextArea rows={3} placeholder="Ek notlar..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* İptal Modalı */}
      <Modal
        title="İş Emrini İptal Et"
        open={iptalModal}
        onCancel={() => { setIptalModal(false); setIptalNeden(''); }}
        onOk={handleIptal}
        okText="İptal Et"
        cancelText="Vazgeç"
        okButtonProps={{ danger: true }}
        confirmLoading={saving}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Text>Bu iş emrini iptal etmek istediğinizden emin misiniz?</Text>
          <Input
            placeholder="İptal nedeni (isteğe bağlı)"
            value={iptalNeden}
            onChange={(e) => setIptalNeden(e.target.value)}
          />
        </Space>
      </Modal>
    </Space>
  );
};

export default IsEmirleriListesi;
