import axiosInstance from './axiosInstance';
import { ResultDto } from '@/types/common.types';
import type { IsEmriDto, IsEmriDetayDto, CreateIsEmriDto } from '@/types/isEmri.types';

export const isEmriApi = {
  // Tüm iş emirlerini listele
  getAll: async (): Promise<ResultDto<IsEmriDto[]>> => {
    const response = await axiosInstance.get('/IsEmri');
    return response.data;
  },

  // ID'ye göre iş emri getir
  getById: async (id: number): Promise<ResultDto<IsEmriDto>> => {
    const response = await axiosInstance.get(`/IsEmri/${id}`);
    return response.data;
  },

  // Duruma göre iş emirlerini getir
  getByDurum: async (durum: string): Promise<ResultDto<IsEmriDto[]>> => {
    const response = await axiosInstance.get(`/IsEmri/durum/${durum}`);
    return response.data;
  },

  // Yeni iş emri oluştur
  create: async (dto: CreateIsEmriDto): Promise<ResultDto<IsEmriDto>> => {
    const user = JSON.parse(localStorage.getItem("user")!);
    const userId = user.id;

    const response = await axiosInstance.post(`/IsEmri?olusturanKullaniciId=${userId}`, dto);
    return response.data;
  },

  // İş emrini iptal et
  iptal: async (id: number, iptalNedeni: string): Promise<ResultDto<boolean>> => {
    const response = await axiosInstance.post(`/IsEmri/${id}/iptal`, { iptalNedeni });
    return response.data;
  },

  getDetay: async (id: number): Promise<ResultDto<IsEmriDetayDto>> => {
    const response = await axiosInstance.get(`/IsEmri/${id}`);
    return response.data;
  },
};