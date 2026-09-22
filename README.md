# Sistem Pelaporan Kondisi Fasilitas Perusahaan

Aplikasi berbasis web untuk membantu karyawan melaporkan kondisi atau kerusakan fasilitas perusahaan dan membantu admin memantau serta memproses laporan tersebut sampai selesai.

Project ini dikembangkan sebagai Capstone Project dengan arsitektur frontend dan backend yang terpisah.

## Fitur Utama

### Karyawan

- Login ke sistem
- Melihat daftar fasilitas aktif
- Membuat laporan kondisi fasilitas
- Memilih tingkat prioritas laporan
- Mengunggah foto kerusakan
- Melihat daftar laporan milik sendiri
- Melihat detail dan riwayat status laporan
- Mengedit laporan selama masih berstatus `reported`
- Mengganti foto laporan
- Menghapus laporan selama belum diproses admin

### Admin

- Login sebagai admin
- Melihat dashboard statistik
- Melihat seluruh laporan karyawan
- Melihat detail laporan
- Memproses laporan berdasarkan alur status
- Memberikan catatan pada perubahan status
- Melihat riwayat status laporan
- Menambah fasilitas
- Mengedit fasilitas
- Mengaktifkan dan menonaktifkan fasilitas

## Workflow Laporan

Status laporan mengikuti alur berikut:

```text
reported
   ↓
processing
   ↓
repaired
   ↓
completed