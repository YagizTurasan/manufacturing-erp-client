import React, { useEffect, useState } from 'react';
import {
  Card, Table, Tag, Button, Typography, Space, Modal, Form,
  InputNumber, Input, Spin, message, Row, Col, Statistic, Alert
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { kaliteKontrolApi } from '@/api/kaliteKontrolApi';
import { useAuth } from '@/contexts/AuthContext';
import type { BekleyenKaliteKontrolDto, CreateKaliteKontrolDto } from '@/types/kalitekontrol.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const KaliteKontrolHome: React.FC = () => {
  const { user } = useAuth();
  const [bekleyenler, setBekleyenler] = useState<BekleyenKaliteKontrolDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<BekleyenKaliteKontrolDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await kaliteKontrolApi.getBekleyenler();
      if (res.success && res.data) setBekleyenler(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleKontrolEt = (item: BekleyenKaliteKontrolDto) => {
    setSelected(item);
    form.resetFields();
    form.setFieldsValue({
      kontrolEdilenMiktar: item.miktar,
      onaylananMiktar: item.miktar,
      redMiktar: 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (values: {
    kontrolEdilenMiktar: number;
    onaylananMiktar: number;
    redMiktar: number;
    redSebebi: string;
    notlar: string;
  }) => {
    if (!selected || !user) return;
    setSaving(true);
    try {
      const dto: CreateKaliteKontrolDto = {
        isAdimiId: selected.isAdimiId,
        kontrolEdenKullaniciId: user.id,
        kontrolEdilenMiktar: values.kontrolEdilenMiktar,
        onaylananMiktar: values.onaylananMiktar,
        redMiktar: values.redMiktar,
        redSebebi: values.redSebebi || '',
        notlar: values.notlar || '',
      };
      const res = await kaliteKontrolApi.create(dto);
      if (res.success) {
        message.success('Kalite kontrol kaydedildi');
        setModalOpen(false);
        await fetchData();
      } else {
        message.error(res.message || 'Kayıt başarısız');
      }
    } catch {
      message.error('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<BekleyenKaliteKontrolDto> = [
    {
      title: 'İş Emri',
      dataIndex: 'isEmriNo',
      key: 'isEmriNo',
      render: (v: string) => <Tag color="purple">{v}</Tag>,
    },
    {
      title: 'Ürün',
      dataIndex: 'urunAdi',
      key: 'urunAdi',
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: 'İstasyon',
      dataIndex: 'istasyonAdi',
      key: 'istasyonAdi',
    },
    {
      title: 'Depo',
      dataIndex: 'depoAdi',
      key: 'depoAdi',
    },
    {
      title: 'Miktar',
      dataIndex: 'miktar',
      key: 'miktar',
      render: (v: number) => <Tag color="blue">{v} adet</Tag>,
    },
    {
      title: 'Operatör',
      dataIndex: 'sorumluOperator',
      key: 'sorumluOperator',
    },
    {
      title: 'Bitiş',
      dataIndex: 'bitisTarihi',
      key: 'bitisTarihi',
      render: (v: string) => dayjs(v).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'İşlem',
      key: 'action',
      render: (_: unknown, record: BekleyenKaliteKontrolDto) => (
        <Button
          type="primary"
          size="small"
          icon={<SafetyOutlined />}
          onClick={() => handleKontrolEt(record)}
          style={{ background: '#003a8c', border: 'none' }}
        >
          Kontrol Et
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>Bekleyen Kalite Kontroller</Title>
          <Text type="secondary">
            Hoşgeldiniz, {user?.adSoyad || user?.kullaniciAdi}
          </Text>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
            Yenile
          </Button>
        </Col>
      </Row>

      {/* Özet Kartlar */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#fff7e6', border: '1px solid #ffd591' }}>
            <Statistic
              title="Bekleyen Kontrol"
              value={bekleyenler.length}
              prefix={<SafetyOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Statistic
              title="Onaylanan (Bugün)"
              value={0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, background: '#fff1f0', border: '1px solid #ffa39e' }}>
            <Statistic
              title="Reddedilen (Bugün)"
              value={0}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tablo */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : bekleyenler.length === 0 ? (
          <Alert message="Bekleyen kalite kontrol bulunmuyor" type="success" showIcon />
        ) : (
          <Table
            columns={columns}
            dataSource={bekleyenler}
            rowKey="isAdimiId"
            scroll={{ x: 900 }}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
          />
        )}
      </Card>

      {/* Kontrol Modalı */}
      <Modal
        title={
          <Space>
            <SafetyOutlined />
            <span>Kalite Kontrol — {selected?.urunAdi}</span>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Kaydet"
        cancelText="İptal"
        confirmLoading={saving}
        width="min(540px, 95vw)"
      >
        {selected && (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Card size="small" style={{ background: '#f5f5f5', borderRadius: 8 }}>
              <Row gutter={8}>
                <Col span={12}>
                  <Text type="secondary">İş Emri:</Text>
                  <br />
                  <Text strong>{selected.isEmriNo}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">İstasyon:</Text>
                  <br />
                  <Text strong>{selected.istasyonAdi}</Text>
                </Col>
              </Row>
            </Card>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Kontrol Edilen"
                    name="kontrolEdilenMiktar"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Onaylanan"
                    name="onaylananMiktar"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Reddedilen"
                    name="redMiktar"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Red Sebebi" name="redSebebi">
                <Input placeholder="Varsa red sebebini girin" />
              </Form.Item>

              <Form.Item label="Notlar" name="notlar" style={{ marginBottom: 0 }}>
                <TextArea rows={3} placeholder="Ek notlar..." />
              </Form.Item>
            </Form>
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default KaliteKontrolHome;
