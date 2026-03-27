// ==================== STOK ====================

export interface StokDto {
  id: number;
  urunAdi: string;
  urunKodu: string;
  depoAdi: string;
  miktar: number;
  birim: string;
  durum: string;
  minimumStok?: number;
  dusukStok: boolean;
}

// ==================== STOK İŞLEM DTO'LARI ====================

export interface StokGirisiDto {
  urunId: number;
  depoId: number;
  miktar: number;
  aciklama?: string;
  kullaniciId: number;
}

export interface StokCikisiDto {
  urunId: number;
  depoId: number;
  miktar: number;
  aciklama?: string;
  kullaniciId: number;
}

export interface StokTransferDto {
  urunId: number;
  kaynakDepoId: number;
  hedefDepoId: number;
  miktar: number;
  aciklama?: string;
  kullaniciId: number;
}

export interface StokSayimDto {
  urunId: number;
  depoId: number;
  yeniMiktar: number;
  aciklama?: string;
  kullaniciId: number;
}

// ==================== HELPER TYPES ====================

export type ModalType = 'giris' | 'cikis' | 'transfer' | 'sayim' | null;