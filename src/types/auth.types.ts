export interface LoginDto {
  kullaniciAdi: string;
  sifre: string;
}

export interface KullaniciDto {
  id: number;
  kullaniciAdi: string;
  adSoyad?: string;
  rol: string;
  aktif: boolean;
  createdAt: string;
}

export interface LoginResponseDto {
  token: string;
  kullanici: KullaniciDto;
  expiresAt: string;
}