// İş Emri DTO
export interface IsEmriDto {
  id: number;
  isEmriNo: string;
  urunId: number;
  urunAdi: string;
  hedefMiktar: number;
  tamamlananMiktar: number;
  hurdaMiktar: number;
  durum: string;
  baslangicTarihi?: string;
  bitisTarihi?: string;
  olusturanKullanici: string;
  notlar?: string;
  isAdimlari?: IsAdimiDto[];
  createdAt: string;
}

export interface IsAdimiDto {
  id: number;
  sira: number;
  istasyonAdi: string;
  tanim: string;
  durum: string;
  hedefMiktar: number;
  tamamlananMiktar: number;
  baslangicTarihi?: string;
  bitisTarihi?: string;
}

// İş Emri Detay DTO
export interface IsEmriDetayDto extends IsEmriDto {
  isAdimlari: IsEmriAdimDetayDto[];
  depoHareketleri: DepoHareketDto[];
}

export interface IsEmriAdimDetayDto {
  id: number;
  sira: number;
  istasyonAdi: string;
  tanim: string;
  durum: string;
  hedefMiktar: number;
  tamamlananMiktar: number;
  baslangicTarihi?: string;
  bitisTarihi?: string;
  sorumluKullanici?: string;
  kaliteKontrolGerekli: boolean;
  kaliteKontrolTarihi?: string;
}

export interface DepoHareketDto {
  id: number;
  tip: string;
  miktar: number;
  depoAdi: string;
  urunAdi: string;
  tarih: string;
  aciklama?: string;
}

export interface IsEmriIstatistikDto {
  tamamlanmaYuzdesi: number;
  gecenSure: number;
  kalanSure: number;
  aktifAdimSayisi: number;
  tamamlananAdimSayisi: number;
}

// Yeni İş Emri DTO
export interface CreateIsEmriDto {
  urunId: number;
  hedefMiktar: number;
  notlar?: string;
}

// İş Emri Durumları
export enum IsEmriDurum {
  Beklemede = 'Beklemede',
  DevamEdiyor = 'DevamEdiyor',
  Tamamlandi = 'Tamamlandi',
  Iptal = 'Iptal',
}