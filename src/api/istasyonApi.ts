import axiosInstance from './axiosInstance';
import { ResultDto } from '@/types/common.types';
import {
  IstasyonDto,
  IstasyonDetayDto,
  UpdateIstasyonDurumDto,
} from '@/types/istasyon.types';

export const istasyonApi = {
  // Tüm istasyonları listele
  getAll: async (): Promise<ResultDto<IstasyonDto[]>> => {
    const response = await axiosInstance.get('/Istasyon');
    return response.data;
  },

  // ID'ye göre istasyon getir
  getById: async (id: number): Promise<ResultDto<IstasyonDto>> => {
    const response = await axiosInstance.get(`/Istasyon/${id}`);
    return response.data;
  },

  // İstasyon detayı (Kiosk için)
  getDetay: async (id: number): Promise<ResultDto<IstasyonDetayDto>> => {
    const response = await axiosInstance.get(`/Istasyon/${id}/detay`);
    return response.data;
  },

  // Tipe göre istasyonları getir
  getByTip: async (tip: string): Promise<ResultDto<IstasyonDto[]>> => {
    const response = await axiosInstance.get(`/Istasyon/tip/${tip}`);
    return response.data;
  },

  // Duruma göre istasyonları getir
  getByDurum: async (durum: string): Promise<ResultDto<IstasyonDto[]>> => {
    const response = await axiosInstance.get(`/Istasyon/durum/${durum}`);
    return response.data;
  },

  // Dashboard özeti
  getDashboardOzet: async (): Promise<ResultDto<IstasyonDto[]>> => {
    const response = await axiosInstance.get('/Istasyon/dashboard-ozet');
    return response.data;
  },

  // İstasyon durumunu güncelle
  updateDurum: async (
    dto: UpdateIstasyonDurumDto
  ): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.post('/Istasyon/durum-guncelle', dto);
    return response.data;
  },
};