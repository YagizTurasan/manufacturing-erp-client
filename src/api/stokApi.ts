import { ResultDto } from '@/types/common.types';
import axiosInstance from './axiosInstance';
import {
  StokGirisiDto,
  StokCikisiDto,
  StokTransferDto,
  StokSayimDto,
  StokDto,
} from '@/types/stok.types';

export const stokApi = {
  // ==================== STOK LİSTELEME ====================

  // Tüm stokları listele
  getAll: async (): Promise<ResultDto<StokDto[]>> => {
    const response = await axiosInstance.get('/Stok');
    return response.data; // Backend zaten ResultDto döner
  },

  // Düşük stokları listele
  getDusukStoklar: async (): Promise<ResultDto<StokDto[]>> => {
    const response = await axiosInstance.get('/Stok/dusuk-stok'); // ✅ Endpoint düzeltildi
    return response.data;
  },

  // Depoya göre stokları listele
  getByDepoId: async (depoId: number): Promise<ResultDto<StokDto[]>> => {
    const response = await axiosInstance.get(`/Stok/depo/${depoId}`);
    return response.data;
  },

  // Ürüne göre stokları listele
  getByUrunId: async (urunId: number): Promise<ResultDto<StokDto[]>> => {
    const response = await axiosInstance.get(`/Stok/urun/${urunId}`);
    return response.data;
  },

  // ==================== STOK İŞLEMLERİ ====================

  // Stok girişi
  stokGirisi: async (data: StokGirisiDto): Promise<ResultDto<StokDto>> => {
    const response = await axiosInstance.post('/Stok/giris', data);
    return response.data;
  },

  // Stok çıkışı
  stokCikisi: async (data: StokCikisiDto): Promise<ResultDto<StokDto>> => {
    const response = await axiosInstance.post('/Stok/cikis', data);
    return response.data;
  },

  // Stok transferi
  stokTransfer: async (data: StokTransferDto): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.post('/Stok/transfer', data);
    return response.data;
  },

  // Stok sayımı
  stokSayim: async (data: StokSayimDto): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.post('/Stok/sayim', data);
    return response.data;
  },
};