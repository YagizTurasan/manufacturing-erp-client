import axiosInstance from './axiosInstance';
import { DashboardOzetDto, PerformansDto, CanliTakipDto } from '@/types/dashboard.types';
import { ResultDto } from '@/types/common.types';

export const dashboardApi = {
  getOzet: async (): Promise<ResultDto<DashboardOzetDto>> => {
    const response = await axiosInstance.get('/Dashboard/ozet');
    return response.data;
  },

  getPerformans: async (
    baslangic?: string,
    bitis?: string
  ): Promise<ResultDto<PerformansDto[]>> => {
    const response = await axiosInstance.get('/Dashboard/performans', {
      params: { baslangic, bitis },
    });
    return response.data;
  },

  getCanliTakip: async (): Promise<ResultDto<CanliTakipDto>> => {
    const response = await axiosInstance.get('/Dashboard/canli-takip');
    return response.data;
  },
};