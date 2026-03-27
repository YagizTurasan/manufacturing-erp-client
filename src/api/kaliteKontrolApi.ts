import axiosInstance from "./axiosInstance";
import { ResultDto } from "@/types/common.types";
import { BekleyenKaliteKontrolDto, CreateKaliteKontrolDto, KaliteKontrolDto } from "@/types/kalitekontrol.types";

export const kaliteKontrolApi = {
    create: async (dto: CreateKaliteKontrolDto): Promise<ResultDto<number>> => {
    const response = await axiosInstance.post<ResultDto<number>>(
      "/KaliteKontrol",
      dto
    );
    return response.data;
  },

    getBekleyenler: async (): Promise<ResultDto<BekleyenKaliteKontrolDto[]>> => {
    const response = await axiosInstance.get("/KaliteKontrol/bekleyen");
    return response.data;
  },
    getById: async (id: number): Promise<ResultDto<KaliteKontrolDto>> => {
    const response = await axiosInstance.get(`/KaliteKontrol/${id}`);
    return response.data;
  },
    getByIsAdimiId: async (isAdimiId: number): Promise<ResultDto<KaliteKontrolDto>> => {
    const response = await axiosInstance.get(`/KaliteKontrol/is-adimi/${isAdimiId}`);
    return response.data;
  },
}