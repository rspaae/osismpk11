# Folder Foto Anggota OSIS & MPK

Simpan foto anggota di folder ini dengan format:
- Nama file bebas, contoh: `ketua-osis.jpg`, `anggota-sekbid1-1.jpg`
- Format yang didukung: `.jpg`, `.jpeg`, `.png`, `.webp`
- Ukuran rekomendasi: **300×300px** hingga **500×500px** (rasio 1:1)
- Foto akan ditampilkan dalam frame persegi dengan cropping otomatis (object-cover)

## Cara Mengisi Foto ke Halaman Struktur

1. Upload foto ke folder ini (contoh: `public/images/members/ketua-osis.jpg`)
2. Buka file `src/app/structure/page.tsx`
3. Cari data member yang ingin diberi foto, tambahkan field `photo`:

```typescript
// Sebelum:
{ name: "Nama Ketua OSIS", role: "Ketua Umum OSIS", kelas: "XII RPL 1" }

// Sesudah:
{ name: "Nama Ketua OSIS", role: "Ketua Umum OSIS", kelas: "XII RPL 1", photo: "/images/members/ketua-osis.jpg" }
```

4. Simpan file → foto langsung tampil, menggantikan avatar inisial.
