export interface DashboardOzetDto {
  isEmirleri: IsEmriOzetDto;
  istasyonlar: IstasyonOzetDto;
  uretim: UretimOzetDto;
  hurda: HurdaOzetDto;
  aktifIsler: AktifIsDto[];
  dusukStokUyarilari: DusukStokUyariDto[];
}

export interface IsEmriOzetDto {
  toplamAktif: number;
  beklemede: number;
  devamEdiyor: number;
  bugunkuTamamlanan: number;
  buHaftaTamamlanan: number;
  buAyTamamlanan: number;
}

export interface IstasyonOzetDto {
  toplamIstasyon: number;
  musait: number;
  mesgul: number;
  arizali: number;
  kullanimOrani: number;
}

export interface UretimOzetDto {
  bugunkuUretim: number;
  buHaftaUretim: number;
  buAyUretim: number;
  bugunkuHedefTutturmaOrani: number;
  bekleyenKaliteKontrol: number;
}

export interface HurdaOzetDto {
  bugunkuHurdaAdet: number;
  buHaftaHurdaAdet: number;
  buAyHurdaAdet: number;
  bugunkuHurdaOrani: number;
  buAyHurdaOrani: number;
  tahminiMaliyetKaybi: number;
}

export interface AktifIsDto {
  isEmriNo: string;
  urunAdi: string;
  istasyonAdi: string;
  operatorAdi: string;
  tamamlanmaYuzdesi: number;
  kalanSure: number;
  baslangicTarihi: string;
}

export interface DusukStokUyariDto {
  urunAdi: string;
  urunKodu: string;
  mevcutStok: number;
  minimumStok: number;
  eksikMiktar: number;
}

export interface PerformansDto {
  tarih: string;
  verimlilik: number;
  uretilenAdet: number;
  hedefAdet: number;
  hurdaAdet: number;
  hurdaOrani: number;
  ortalamaCevrimeZamani: number;
}

export interface CanliTakipDto {
  istasyonDurumlari: IstasyonDurumDto[];
  sonHareketler: SonHareketDto[];
  sonGuncelleme: string;
}

export interface IstasyonDurumDto {
  istasyonId: number;
  istasyonAdi: string;
  istasyonTipi: string;
  durum: string;
  isEmriNo?: string;
  urunAdi?: string;
  tamamlanmaYuzdesi?: number;
  operatorAdi?: string;
}

export interface SonHareketDto {
  tip: string;
  mesaj: string;
  zaman: string;
  kullaniciAdi?: string;
}