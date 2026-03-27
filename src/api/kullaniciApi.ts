import axiosInstance from './axiosInstance';
import { ResultDto } from '@/types/common.types';
import { KullaniciDto } from '@/types/auth.types';

export interface CreateKullaniciDto {
  kullaniciAdi: string;
  adSoyad: string;
  sifre: string;
  rol: string;
}

export interface UpdateKullaniciDto {
  id: number;
  adSoyad: string;
  rol: string;
  aktif: boolean;
}

export interface ResetPasswordDto {
  kullaniciId: number;
  yeniSifre: string;
}

export const kullaniciApi = {
  getAll: async (): Promise<ResultDto<KullaniciDto[]>> => {
    const response = await axiosInstance.get('/Kullanici');
    return response.data;
  },

  getById: async (id: number): Promise<ResultDto<KullaniciDto>> => {
    const response = await axiosInstance.get(`/Kullanici/${id}`);
    return response.data;
  },

  create: async (dto: CreateKullaniciDto): Promise<ResultDto<KullaniciDto>> => {
    const response = await axiosInstance.post('/Kullanici', dto);
    return response.data;
  },

  update: async (dto: UpdateKullaniciDto): Promise<ResultDto<KullaniciDto>> => {
    const response = await axiosInstance.put('/Kullanici', dto);
    return response.data;
  },

  delete: async (id: number): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.delete(`/Kullanici/${id}`);
    return response.data;
  },

  resetPassword: async (dto: ResetPasswordDto): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.post('/Kullanici/reset-password', dto);
    return response.data;
  },
};
