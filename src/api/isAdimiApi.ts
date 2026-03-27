import axiosInstance from './axiosInstance';
import {
  BekleyenIsDto,
  AktifIsDetayDto,
} from '@/types/isAdimi.types';
import { ResultDto } from '@/types/common.types';

export const isAdimiApi = {
  // Bekleyen işler (kullanıcının rolüne göre)
  getBekleyenIsler: async (kullaniciId: number): Promise<ResultDto<BekleyenIsDto[]>> => {
    const response = await axiosInstance.get(`/IsAdimi/kullanici/${kullaniciId}/bekleyen-isler`);
    return response.data;
  },

  // Aktif iş detayı
  getAktifIs: async (kullaniciId: number): Promise<ResultDto<AktifIsDetayDto>> => {
    const response = await axiosInstance.get(`/IsAdimi/kullanici/${kullaniciId}/aktif-is`);
    return response.data;
  },

  // İş başlat
  basla: async (isAdimiId: number, kullaniciId: number, istasyonId: number): Promise<ResultDto<any>> => {
    const response = await axiosInstance.post('/IsAdimi/baslat', {
      isAdimiId,
      kullaniciId,
      istasyonId,
    });
    return response.data;
  },

  // İşlem ilerlet (miktar gir)
  parcaTamamla: async (data: {
    isAdimiId: number;
    kullaniciId: number;
    miktar: number;
  }): Promise<ResultDto<any>> => {
    const response = await axiosInstance.post('/IsAdimi/parca-tamamla', data);
    return response.data;
  },

  // İşlemi bitir
  bitir: async (isAdimiId: number, kullaniciId: number): Promise<ResultDto<any>> => {
  const response = await axiosInstance.post(`/IsAdimi/${isAdimiId}/bitir?kullaniciId=${kullaniciId}`);
  return response.data;
}
};