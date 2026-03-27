// Temel Ürün DTO
export interface UrunDto {
  id: number;
  ad: string;
  kod: string;
  tip: string;
  birim: string;
  minimumStok?: number;
  toplamStok: number;
  adimSayisi: number;
  createdAt: string;
}

// Ürün Oluştur DTO
export interface CreateUrunDto {
  ad: string;
  kod: string;
  tip: string; // Hammadde, YariMamul, Mamul
  birim: string;
  minimumStok?: number;
}

// Ürün Güncelle DTO
export interface UpdateUrunDto {
  id: number;
  ad?: string;
  kod?: string;
  birim?: string;
  minimumStok?: number;
}

// Ürün Detay DTO
export interface UrunDetayDto {
  id: number;
  ad: string;
  kod: string;
  tip: string;
  birim: string;
  minimumStok?: number;
  stoklar: StokDetayDto[];
  uretimAdimlari: UrunAgaciAdimDto[];
  gerekliBilesenler: GerekliBilesenDetayDto[];
  istatistikler: UretimIstatistikDto;
}

export interface StokDetayDto {
  depoAdi: string;
  miktar: number;
  durum: string;
}

export interface UrunAgaciAdimDto {
  id: number;
  sira: number;
  istasyonTipi: string;
  tanim: string;
  ciktiUrunAdi?: string;
  kaliteKontrolGerekli: boolean;
  hedefDepoAdi?: string;
}

export interface GerekliBilesenDetayDto {
  id: number;
  bilesenAdi: string;
  bilesenKodu: string;
  miktar: number;
  mevcutStok: number;
}

export interface UretimIstatistikDto {
  toplamUretilenAdet: number;
  toplamHurdaAdet: number;
  hurdaOrani: number;
  aktifIsEmriSayisi: number;
}

// Ürün Ağacı Adım DTO
export interface CreateUrunAgaciAdimDto {
  urunId: number;
  sira: number;
  istasyonTipi: string;
  tanim: string;
  ciktiUrunId?: number;
  kaliteKontrolGerekli: boolean;
  hedefDepoId: number;
}

// Gerekli Bileşen DTO
export interface CreateGerekliBilesenDto {
  urunId: number;
  bilesenUrunId: number;
  miktar: number;
}

// Ürün Tipleri Enum
export enum UrunTip {
  Hammadde = 'Hammadde',
  YariMamul = 'YariMamul',
  Mamul = 'Mamul',
}

// İstasyon Tipleri Enum (Backend'den)
export enum IstasyonTip {
  Torna = 'Torna',
  Lazer = 'Lazer',
  Abkant = 'Abkant',
  Kumlama = 'Kumlama',
  GazaltiKaynak = 'GazaltiKaynak',
  RobotKaynak = 'RobotKaynak',
  HidrolikPres = 'HidrolikPres',
  DikIslem = 'DikIslem',
  Dogrultma = 'Dogrultma',
  Taslama = 'Taslama',
  KaliteKontrol = 'KaliteKontrol',
  Sevkiyat = 'Sevkiyat'
}