export interface BekleyenIsDto {
  isAdimiId: number;
  isEmriNo: string;
  urunAdi: string;
  urunKodu: string;
  hedefMiktar: number;
  sira: number;
  istasyonTipi: string;
  istasyonId: number;
  tanim: string;
  oncelik: string;
  createdAt: string;
  gerekliBilesenler?: GerekliBilesenDto[];
}

export interface GerekliBilesenDto {
  urunAdi: string;
  miktar: number;
  stokYeterli: boolean;
}

export interface AktifIsDetayDto {
  isAdimiId: number;
  isEmriNo: string;
  urunAdi: string;
  sira: number;
  istasyonAdi: string;
  istasyonTipi: string;
  tanim: string;
  hedefMiktar: number;
  tamamlananMiktar: number;
  kumulatifTamamlanan: number;
  kalanMiktar: number;
  hurdaMiktari: number;
  durum: string;
  baslangicTarihi: string;
  gecenSure: number;
  kaliteKontrolGerekli: boolean;
  sorumluKullaniciId?: number;
  sorumluKullaniciAdi?: string;
}

export interface ParcaTamamlaDto {
  isAdimiId: number;
  kullaniciId: number;
  miktar: number;
}

export interface BaslatIsAdimiDto{
  isAdimiId: number;
  kullaniciId: number;
  istasyonId: number;
}
