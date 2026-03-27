import React, { useEffect, useState } from 'react';
import {
  Card, Table, Tag, Button, Typography, Space, Modal, Form,
  Select, Input, message, Row, Col, Popconfirm, Badge, Tooltip
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { kullaniciApi } from '@/api/kullaniciApi';
import type { CreateKullaniciDto, UpdateKullaniciDto } from '@/api/kullaniciApi';
import type { KullaniciDto } from '@/types/auth.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ROLLER = [
  'Admin', 'Tornaci', 'Kaynakci', 'Kumlamaci', 'Presci',
  'KaliteKontrol', 'Abkantci', 'Lazerci', 'Taslamaci',
  'DogrultmaOperatoru', 'DikIslemci',
];

const rolRenk: Record<string, string> = {
  Admin: 'red',
  KaliteKontrol: 'blue',
  Tornaci: 'green',
  Kaynakci: 'orange',
  Kumlamaci: 'purple',
  Presci: 'cyan',
  Abkantci: 'geekblue',
  Lazerci: 'volcano',
  Taslamaci: 'lime',
  DogrultmaOperatoru: 'gold',
  DikIslemci: 'magenta',
};

type ModalMode = 'create' | 'edit' | 'password' | null;

const KullaniciListesi: React.FC = () => {
  const [kullanicilar, setKullanicilar] = useState<KullaniciDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<KullaniciDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [rolFilter, setRolFilter] = useState<string>('Tümü');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await kullaniciApi.getAll();
      if (res.success && res.data) setKullanicilar(res.data);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelected(null);
    form.resetFields();
    setModalMode('create');
  };

  const openEdit = (u: KullaniciDto) => {
    setSelected(u);
    form.setFieldsValue({ adSoyad: u.adSoyad, rol: u.rol, aktif: u.aktif });
    setModalMode('edit');
  };

  const openPassword = (u: KullaniciDto) => {
    setSelected(u);
    form.resetFields();
    setModalMode('password');
  };

  const handleCreate = async (values: CreateKullaniciDto) => {
    setSaving(true);
    try {
      const res = await kullaniciApi.create(values);
      if (res.success) {
        message.success('Kullanıcı oluşturuldu');
        setModalMode(null);
        await fetchData();
      } else {
        message.error(res.message || 'Oluşturma başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (values: Omit<UpdateKullaniciDto, 'id'>) => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await kullaniciApi.update({ id: selected.id, ...values });
      if (res.success) {
        message.success('Kullanıcı güncellendi');
        setModalMode(null);
        await fetchData();
      } else {
        message.error(res.message || 'Güncelleme başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (values: { yeniSifre: string }) => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await kullaniciApi.resetPassword({ kullaniciId: selected.id, yeniSifre: values.yeniSifre });
      if (res.success) {
        message.success('Şifre sıfırlandı');
        setModalMode(null);
      } else {
        message.error(res.message || 'Sıfırlama başarısız');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await kullaniciApi.delete(id);
    if (res.success) {
      message.success('Kullanıcı silindi');
      await fetchData();
    } else {
      message.error(res.message || 'Silme başarısız');
    }
  };

  const filtered = rolFilter === 'Tümü'
    ? kullanicilar
    : kullanicilar.filter((u) => u.rol === rolFilter);

  const columns: ColumnsType<KullaniciDto> = [
    {
      title: 'Ad Soyad',
      key: 'adSoyad',
      render: (_: unknown, r: KullaniciDto) => (
        <Space direction="vertical" size={0}>
          <Text strong>{r.adSoyad || '—'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.kullaniciAdi}</Text>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (v: string) => <Tag color={rolRenk[v] ?? 'default'}>{v}</Tag>,
    },
    {
      title: 'Durum',
      dataIndex: 'aktif',
      key: 'aktif',
      render: (v: boolean) => (
        <Badge status={v ? 'success' : 'error'} text={v ? 'Aktif' : 'Pasif'} />
      ),
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => dayjs(v).format('DD.MM.YYYY'),
    },
    {
      title: 'İşlem',
      key: 'action',
      width: 130,
      render: (_: unknown, record: KullaniciDto) => (
        <Space>
          <Tooltip title="Düzenle">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ color: '#667eea' }} />
          </Tooltip>
          <Tooltip title="Şifre Sıfırla">
            <Button type="text" icon={<KeyOutlined />} onClick={() => openPassword(record)} style={{ color: '#fa8c16' }} />
          </Tooltip>
          <Popconfirm
            title="Bu kullanıcıyı silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sil"
            cancelText="İptal"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Sil">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const modalTitle = modalMode === 'create' ? 'Yeni Kullanıcı'
    : modalMode === 'edit' ? `Düzenle — ${selected?.kullaniciAdi}`
    : `Şifre Sıfırla — ${selected?.kullaniciAdi}`;

  const handleFinish = (values: Record<string, unknown>) => {
    if (modalMode === 'create') handleCreate(values as unknown as CreateKullaniciDto);
    else if (modalMode === 'edit') handleEdit(values as unknown as Omit<UpdateKullaniciDto, 'id'>);
    else if (modalMode === 'password') handleResetPassword(values as unknown as { yeniSifre: string });
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0 }}>Kullanıcılar</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreate}
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
            >
              Yeni Kullanıcı
            </Button>
          </Space>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            value={rolFilter}
            onChange={setRolFilter}
            style={{ width: 200 }}
            options={[
              { value: 'Tümü', label: 'Tüm Roller' },
              ...ROLLER.map((r) => ({ value: r, label: r })),
            ]}
          />
          <Text type="secondary">{filtered.length} kullanıcı</Text>
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          scroll={{ x: 700 }}
          pagination={{ pageSize: 20 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={modalTitle}
        open={modalMode !== null}
        onCancel={() => setModalMode(null)}
        onOk={() => form.submit()}
        okText="Kaydet"
        cancelText="İptal"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
          {modalMode === 'create' && (
            <>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Kullanıcı Adı" name="kullaniciAdi" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ad Soyad" name="adSoyad" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Şifre" name="sifre" rules={[{ required: true, min: 6, message: 'En az 6 karakter' }]}>
                <Input.Password />
              </Form.Item>
            </>
          )}

          {modalMode === 'edit' && (
            <Form.Item label="Ad Soyad" name="adSoyad" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )}

          {(modalMode === 'create' || modalMode === 'edit') && (
            <>
              <Form.Item label="Rol" name="rol" rules={[{ required: true }]}>
                <Select options={ROLLER.map((r) => ({ value: r, label: r }))} />
              </Form.Item>
              {modalMode === 'edit' && (
                <Form.Item label="Durum" name="aktif" style={{ marginBottom: 0 }}>
                  <Select options={[{ value: true, label: 'Aktif' }, { value: false, label: 'Pasif' }]} />
                </Form.Item>
              )}
            </>
          )}

          {modalMode === 'password' && (
            <>
              <Form.Item label="Yeni Şifre" name="yeniSifre" rules={[{ required: true, min: 6, message: 'En az 6 karakter' }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Şifre Tekrar"
                name="yeniSifreTekrar"
                dependencies={['yeniSifre']}
                style={{ marginBottom: 0 }}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('yeniSifre') === value) return Promise.resolve();
                      return Promise.reject(new Error('Şifreler eşleşmiyor'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Space>
  );
};

export default KullaniciListesi;
