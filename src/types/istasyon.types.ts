// İstasyon DTO
export interface IstasyonDto {
  id: number;
  ad: string;
  kod: string;
  tip: string;
  durum: string;
  depoAdi: string;
  aktifIsVar: boolean;
  bekleyenIsSayisi: number;
}

// İstasyon Detay DTO (Kiosk için)
export interface IstasyonDetayDto {
  id: number;
  ad: string;
  tip: string;
  durum: string;
  aktifIsAdimi?: {
    id: number;
    isEmriNo: string;
    urunAdi: string;
    sira: number;
    tanim: string;
    hedefMiktar: number;
    tamamlananMiktar: number;
  };
  istatistikler: IstasyonIstatistikDto;
}

export interface IstasyonIstatistikDto {
  bugunUretilenAdet: number;
  haftalikUretilenAdet: number;
  aylikUretilenAdet: number;
  toplamCalismaYuzdesi: number;
  ortalamaCevrimSuresi: number;
}

// İstasyon Durumu Güncelleme DTO
export interface UpdateIstasyonDurumDto {
  istasyonId: number;
  durum: string;
  aciklama?: string;
}

// İstasyon Tipleri
export enum IstasyonTip {
  Torna = 'Torna',
  GazaltiKaynak = 'GazaltiKaynak',
  RobotKaynak = 'RobotKaynak',
  Kumlama = 'Kumlama',
  Taslama = 'Taslama',
  Abkant = 'Abkant',
  Lazer = 'Lazer',
}

// İstasyon Durumları
export enum IstasyonDurum {
  Musait = 'Musait',
  Mesgul = 'Mesgul',
  Arizali = 'Arizali',
  Bakimda = 'Bakimda',
}