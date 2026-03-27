import axiosInstance from './axiosInstance';
import { LoginDto, LoginResponseDto, KullaniciDto } from '@/types/auth.types';
import { ResultDto } from '@/types/common.types';

export const authApi = {
  login: async (data: LoginDto): Promise<ResultDto<LoginResponseDto>> => {
    const response = await axiosInstance.post('/Kullanici/login', data);
    return response.data;
  },

  getMe: async (): Promise<ResultDto<KullaniciDto>> => {
    const response = await axiosInstance.get('/Kullanici/me');
    return response.data;
  },

  changePassword: async (data: {
    kullaniciId: number;
    eskiSifre: string;
    yeniSifre: string;
    yeniSifreTekrar: string;
  }): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.post('/Kullanici/change-password', data);
    return response.data;
  },
};