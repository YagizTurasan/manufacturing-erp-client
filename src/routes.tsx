import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import KioskLayout from '@/components/Layout/KioskLayout';
import KaliteKontrolLayout from '@/components/Layout/KaliteKontrolLayout';
import StokYonetimi from './pages/StokYonetimi/StokYonetimi';

// Lazy load pages
const Login = React.lazy(() => import('@/pages/Auth/Login'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard/Dashboard'));
const KioskHome = React.lazy(() => import('@/pages/Kiosk/KioskHome'));
const AktifIs = React.lazy(() => import('@/pages/Kiosk/AktifIs'));
const KaliteKontrolHome = React.lazy(() => import('@/pages/KaliteKontrol/KaliteKontrolHome'));
const IstasyonListesi = React.lazy(() => import('@/pages/Istasyonlar/IstasyonListesi'));
const IsEmirleriListesi = React.lazy(() => import('@/pages/IsEmirleri/IsEmirleriListesi'));
const IsEmriDetay = React.lazy(() => import('@/pages/IsEmirleri/IsEmriDetay'));
const UrunListesi = React.lazy(() => import('@/pages/Urunler/UrunListesi'));
const UrunDetay = React.lazy(() => import('@/pages/Urunler/UrunDetay'));
const KullaniciListesi = React.lazy(() => import('@/pages/Kullanicilar/KullaniciListesi'));

const ADMIN_ROLES = ['Admin'];
const OPERATOR_ROLES = [
  'Admin', 'Tornaci', 'DikIslemci', 'Kaynakci', 'Kumlamaci',
  'Presci', 'Abkantci', 'Lazerci', 'Taslamaci', 'DogrultmaOperatoru',
];

const ErrorPage: React.FC<{
  code: number; title: string; desc: string; href: string; linkText: string;
}> = ({ code, title, desc, href, linkText }) => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', flexDirection: 'column',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }}>
    <div style={{
      background: 'white', padding: 48, borderRadius: 12,
      textAlign: 'center', maxWidth: 400,
    }}>
      <h1 style={{ fontSize: 48, margin: 0, color: code === 403 ? '#ff4d4f' : '#1890ff' }}>{code}</h1>
      <h2 style={{ marginTop: 16 }}>{title}</h2>
      <p style={{ color: '#8c8c8c' }}>{desc}</p>
      <a href={href} style={{
        display: 'inline-block', marginTop: 24, padding: '10px 24px',
        background: '#667eea', color: 'white', textDecoration: 'none', borderRadius: 6,
      }}>
        {linkText}
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  // Admin / Yönetici Routes
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={ADMIN_ROLES}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'is-emirleri', element: <IsEmirleriListesi /> },
      { path: 'is-emirleri/:id', element: <IsEmriDetay /> },
      { path: 'istasyonlar', element: <IstasyonListesi /> },
      { path: 'urunler', element: <UrunListesi /> },
      { path: 'urunler/:id', element: <UrunDetay /> },
      { path: 'kalite-kontrol', element: <KaliteKontrolHome /> },
      { path: 'stoklar', element: <StokYonetimi /> },
      { path: 'kullanicilar', element: <KullaniciListesi /> },
    ],
  },

  // Kiosk Routes (Operatörler)
  {
    path: '/kiosk',
    element: (
      <ProtectedRoute allowedRoles={OPERATOR_ROLES}>
        <KioskLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <KioskHome /> },
      { path: 'aktif-is', element: <AktifIs /> },
    ],
  },

  // Kalite Kontrol Routes
  {
    path: '/kalite-kontrol',
    element: (
      <ProtectedRoute allowedRoles={['KaliteKontrol']}>
        <KaliteKontrolLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <KaliteKontrolHome /> },
    ],
  },

  // Hata Sayfaları
  {
    path: '/unauthorized',
    element: (
      <ErrorPage
        code={403}
        title="Yetkisiz Erişim"
        desc="Bu sayfaya erişim yetkiniz bulunmamaktadır."
        href="/login"
        linkText="Giriş Sayfasına Dön"
      />
    ),
  },
  {
    path: '*',
    element: (
      <ErrorPage
        code={404}
        title="Sayfa Bulunamadı"
        desc="Aradığınız sayfa mevcut değil veya taşınmış olabilir."
        href="/dashboard"
        linkText="Ana Sayfaya Dön"
      />
    ),
  },
]);
