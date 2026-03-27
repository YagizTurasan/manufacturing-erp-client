import axiosInstance from './axiosInstance';
import { ResultDto } from '@/types/common.types';
import {
  UrunDto,
  CreateUrunDto,
  UpdateUrunDto,
  UrunDetayDto,
  CreateUrunAgaciAdimDto,
  CreateGerekliBilesenDto,
  UrunAgaciAdimDto,
  GerekliBilesenDetayDto,
} from '@/types/urun.types';

export const urunApi = {
  // ==================== ÜRÜN CRUD ====================

  // Tüm ürünleri listele
  getAll: async (): Promise<ResultDto<UrunDto[]>> => {
    const response = await axiosInstance.get('/Urun');
    return response.data;
  },

  // ID'ye göre ürün getir
  getById: async (id: number): Promise<ResultDto<UrunDto>> => {
    const response = await axiosInstance.get(`/Urun/${id}`);
    return response.data;
  },

  // Ürün detayı (tam bilgi)
  getDetay: async (id: number): Promise<ResultDto<UrunDetayDto>> => {
    const response = await axiosInstance.get(`/Urun/${id}/detay`);
    return response.data;
  },

  // Tipe göre ürünleri getir
  getByTip: async (tip: string): Promise<ResultDto<UrunDto[]>> => {
    const response = await axiosInstance.get(`/Urun/tip/${tip}`);
    return response.data;
  },

  // Düşük stoklu ürünler
  getDusukStok: async (): Promise<ResultDto<UrunDto[]>> => {
    const response = await axiosInstance.get('/Urun/dusuk-stok');
    return response.data;
  },

  // Yeni ürün oluştur
  create: async (dto: CreateUrunDto): Promise<ResultDto<UrunDto>> => {
    const response = await axiosInstance.post('/Urun', dto);
    return response.data;
  },

  // Ürün güncelle
  update: async (dto: UpdateUrunDto): Promise<ResultDto<UrunDto>> => {
    const response = await axiosInstance.put('/Urun', dto);
    return response.data;
  },

  // Ürün sil
  delete: async (id: number): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.delete(`/Urun/${id}`);
    return response.data;
  },

  // ==================== ÜRÜN AĞACI ADIMLARI ====================

  // Ürüne üretim adımı ekle
  createAdim: async (dto: CreateUrunAgaciAdimDto): Promise<ResultDto<number>> => {
    const response = await axiosInstance.post('/Urun/adim', dto);
    return response.data;
  },

  // Ürünün tüm üretim adımlarını getir
  getAdimlar: async (urunId: number): Promise<ResultDto<UrunAgaciAdimDto[]>> => {
    const response = await axiosInstance.get(`/Urun/${urunId}/adimlar`);
    return response.data;
  },

  // Üretim adımını sil
  deleteAdim: async (adimId: number): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.delete(`/Urun/adim/${adimId}`);
    return response.data;
  },

  // ==================== GEREKLİ BİLEŞENLER ====================

  // Ürüne gerekli bileşen ekle
  createBilesen: async (dto: CreateGerekliBilesenDto): Promise<ResultDto<number>> => {
    const response = await axiosInstance.post('/Urun/bilesen', dto);
    return response.data;
  },

  // Ürünün gerekli bileşenlerini getir
  getBilesenler: async (urunId: number): Promise<ResultDto<GerekliBilesenDetayDto[]>> => {
    const response = await axiosInstance.get(`/Urun/${urunId}/bilesenler`);
    return response.data;
  },

  // Gerekli bileşeni sil
  deleteBilesen: async (bilesenId: number): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.delete(`/Urun/bilesen/${bilesenId}`);
    return response.data;
  },
};