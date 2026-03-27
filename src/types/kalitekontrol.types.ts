export interface CreateKaliteKontrolDto{
    isAdimiId: number;
    kontrolEdenKullaniciId: number;
    kontrolEdilenMiktar: number;
    onaylananMiktar: number;
    redMiktar: number;
    redSebebi: string;
    notlar: string;
}
export interface BekleyenKaliteKontrolDto{
    isAdimiId: number;
    isEmriNo: string;
    urunAdi: string;
    depoAdi: string;
    miktar: number;
    istasyonAdi: string;
    sorumluOperator: string;
    bitisTarihi: string;
}

export interface KaliteKontrolDto {
  id: number;
  isAdimiId: number;
  isEmriNo: string;
  urunAdi: string;
  depoAdi: string;
  kontrolEdilenMiktar: number;
  onaylananMiktar: number;
  redMiktar: number;
  sonuc: string;
  redSebebi?: string | null;
  kontrolEdenKullanici: string;
  kontrolTarihi: string; 
}
