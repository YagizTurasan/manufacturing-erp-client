import axiosInstance from './axiosInstance';
import { ResultDto } from '@/types/common.types';

export interface DepoDto {
  id: number;
  ad: string;
  kod: string;
  tip: string; 
  aciklama?: string;
}

export const depoApi = {
  // Tüm depoları listele
  getAll: async (): Promise<ResultDto<DepoDto[]>> => {
    const response = await axiosInstance.get('/Depo');
    return response.data;
  },

  // Depoya göre stokları listele
  getStoklarByDepo: async (depoId: number): Promise<ResultDto<any[]>> => {
    const response = await axiosInstance.get(`/Depo/${depoId}/stoklar`);
    return response.data;
  },

  // Ürüne göre stokları listele
  getStoklarByUrun: async (urunId: number): Promise<ResultDto<any>> => {
    const response = await axiosInstance.get(`/Depo/urun/${urunId}/stoklar`);
    return response.data;
  },

  // Tüm stoklar (özet)
  getAllStoklar: async (): Promise<ResultDto<any[]>> => {
    const response = await axiosInstance.get('/Depo/stoklar');
    return response.data;
  },

  // Depo hareketleri
  getHareketler: async (params?: {
    depoId?: number;
    isEmriId?: number;
    limit?: number;
  }): Promise<ResultDto<any[]>> => {
    const response = await axiosInstance.get('/Depo/hareketler', { params });
    return response.data;
  },

  // Hurda deposu
  getHurdalar: async (): Promise<ResultDto<any>> => {
    const response = await axiosInstance.get('/Depo/hurda');
    return response.data;
  },

  // İstasyon tipine göre varsayılan depo
  getVarsayilanDepoByIstasyonTipi: async (istasyonTipi: string): Promise<ResultDto<any>> => {
    const response = await axiosInstance.get(
      `/Depo/istasyon-tipi/${istasyonTipi}/varsayilan-depo`
    );
    return response.data;
  },
};