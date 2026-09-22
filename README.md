# Sistem Pelaporan Kondisi Fasilitas Perusahaan

Aplikasi berbasis web untuk membantu karyawan melaporkan kondisi atau kerusakan fasilitas perusahaan serta membantu admin memantau dan memproses laporan sampai selesai.

Project ini dikembangkan sebagai **Capstone Project** dengan arsitektur frontend dan backend yang terpisah.

## Live Demo

Aplikasi telah dideploy dan dapat diakses melalui:

### Frontend

https://capstone-facility-report.vercel.app

### Backend API

https://backend-production-da394.up.railway.app

### Health Check Backend

https://backend-production-da394.up.railway.app/up

---

## Fitur Utama

### Karyawan

- Login ke sistem
- Melihat daftar fasilitas aktif
- Membuat laporan kondisi fasilitas
- Memilih tingkat prioritas laporan
- Mengunggah foto kerusakan
- Melihat daftar laporan milik sendiri
- Melihat detail laporan
- Melihat riwayat perubahan status laporan
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
- Melihat riwayat perubahan status laporan
- Menambah fasilitas
- Mengedit fasilitas
- Mengaktifkan fasilitas
- Menonaktifkan fasilitas

---

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
```

Keterangan:

- `reported` — laporan baru dibuat oleh karyawan
- `processing` — laporan sedang diproses oleh admin
- `repaired` — fasilitas telah diperbaiki
- `completed` — laporan telah selesai

Perubahan status harus dilakukan secara berurutan dan setiap perubahan akan disimpan pada riwayat laporan.

---

## Alur Sistem

1. Karyawan login ke aplikasi.
2. Karyawan melihat fasilitas perusahaan yang masih aktif.
3. Karyawan membuat laporan kondisi fasilitas.
4. Laporan pertama kali dibuat dengan status `reported`.
5. Admin melihat laporan yang masuk.
6. Admin memproses laporan secara berurutan.
7. Admin dapat memberikan catatan pada setiap proses perubahan status.
8. Setiap perubahan status disimpan pada riwayat laporan.
9. Laporan yang sudah diproses tidak dapat diedit atau dihapus oleh karyawan.
10. Laporan berakhir dengan status `completed`.

---

## Teknologi yang Digunakan

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend

- Laravel
- PHP
- Laravel Sanctum
- REST API

### Database

- MySQL

### Deployment

- Vercel — Frontend
- Railway — Backend
- Railway MySQL — Database
- Railway Persistent Volume — Penyimpanan file upload

### Version Control

- Git
- GitHub

---

## Arsitektur Aplikasi

```text
User / Browser
      |
      v
React + Vite
Frontend
      |
      | HTTPS REST API
      v
Laravel
Backend API
      |
      +--------------------+
      |                    |
      v                    v
    MySQL            File Upload
   Database                 |
                            v
                   Persistent Storage
```

---

## Arsitektur Deployment

```text
User / Browser
      |
      v
React + Vite
Vercel
      |
      | HTTPS API
      v
Laravel REST API
Railway
      |
      +--------------------+
      |                    |
      v                    v
MySQL Railway       Railway Volume
                    File Upload
```

---

## Struktur Project

```text
capstone-facility-report/
│
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   ├── .env.example
│   ├── .env.production.example
│   ├── artisan
│   ├── composer.json
│   └── composer.lock
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── start-app.bat
```

---

## Persyaratan Development

Pastikan perangkat sudah memiliki:

- PHP 8.4 atau lebih baru
- Composer
- Node.js
- NPM
- MySQL
- Git

---

## Instalasi Project

### 1. Clone Repository

```bash
git clone https://github.com/dindaatun/capstone-facility-report.git
cd capstone-facility-report
```

---

## Setup Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency Laravel:

```bash
composer install
```

Salin file environment.

Windows:

```powershell
copy .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Atur konfigurasi database pada file `.env`.

Contoh:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=facility_report
DB_USERNAME=root
DB_PASSWORD=
```

Buat database MySQL dengan nama:

```text
facility_report
```

Jalankan migration dan seeder:

```bash
php artisan migrate --seed
```

Buat symbolic link untuk file upload:

```bash
php artisan storage:link
```

Jalankan backend:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Backend development dapat diakses melalui:

```text
http://127.0.0.1:8000
```

---

## Setup Frontend

Buka terminal baru, kemudian masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Salin file environment.

Windows:

```powershell
copy .env.example .env
```

Pastikan file `.env` frontend berisi:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Jalankan frontend:

```bash
npm run dev
```

Frontend development dapat diakses melalui:

```text
http://localhost:5173
```

---

## Menjalankan Aplikasi di Windows

Project menyediakan file:

```text
start-app.bat
```

File tersebut dapat digunakan untuk menjalankan backend Laravel dan frontend React secara otomatis pada environment development Windows.

Aplikasi lokal kemudian dapat diakses melalui:

```text
Frontend : http://localhost:5173
Backend  : http://127.0.0.1:8000
```

---

## Akun Demo

Setelah menjalankan:

```bash
php artisan migrate --seed
```

akun demo berikut akan tersedia.

### Admin

```text
Email    : admin.test@example.com
Password : password123
Role     : admin
```

### Karyawan

```text
Email    : karyawan.test@example.com
Password : password123
Role     : employee
```

### Karyawan Kedua

```text
Email    : karyawan2.test@example.com
Password : password123
Role     : employee
```

Akun tersebut digunakan untuk development dan demonstrasi aplikasi.

---

## Data Demo

Seeder menyediakan beberapa data contoh agar aplikasi dapat langsung digunakan untuk demonstrasi.

Data demo meliputi:

- 3 akun pengguna
- 3 fasilitas aktif
- 4 laporan fasilitas
- Data laporan dengan tingkat prioritas berbeda
- Riwayat perubahan status laporan

Status laporan demo terdiri dari:

```text
reported
processing
repaired
completed
```

Dengan data tersebut, seluruh workflow sistem dapat didemonstrasikan tanpa harus membuat seluruh data secara manual.

---

## Prioritas Laporan

Laporan memiliki tiga tingkat prioritas:

```text
low
medium
high
```

Pada antarmuka aplikasi ditampilkan sebagai:

```text
Rendah
Sedang
Tinggi
```

---

## Upload Foto

Karyawan dapat mengunggah foto kondisi atau kerusakan fasilitas ketika membuat laporan.

Ketentuan upload:

- File harus berupa gambar
- Ukuran maksimal 8 MB
- Foto dapat diganti selama laporan masih berstatus `reported`
- File disimpan menggunakan Laravel public storage
- Pada production, file disimpan menggunakan Railway Persistent Volume

---

## Keamanan dan Hak Akses

Aplikasi menggunakan **Laravel Sanctum** untuk autentikasi API.

Hak akses dibedakan berdasarkan role:

### Employee

Karyawan hanya dapat:

- Melihat fasilitas aktif
- Membuat laporan
- Melihat laporan miliknya sendiri
- Mengedit laporan miliknya selama masih `reported`
- Menghapus laporan miliknya selama masih `reported`

### Admin

Admin dapat:

- Melihat seluruh laporan
- Melihat dashboard statistik
- Mengubah status laporan
- Memberikan catatan
- Mengelola fasilitas

Endpoint admin dilindungi menggunakan middleware role admin.

---

## REST API

Beberapa endpoint utama yang digunakan:

### Authentication

```text
POST /api/register
POST /api/login
POST /api/logout
GET  /api/user
```

### Facilities

```text
GET    /api/facilities
GET    /api/facilities/{facility}
POST   /api/facilities
PATCH  /api/facilities/{facility}
DELETE /api/facilities/{facility}
```

### Employee Reports

```text
GET    /api/reports
POST   /api/reports
GET    /api/reports/{report}
PATCH  /api/reports/{report}
DELETE /api/reports/{report}
```

### Admin

```text
GET   /api/admin/dashboard
GET   /api/admin/reports
GET   /api/admin/reports/{report}
PATCH /api/admin/reports/{report}/status
GET   /api/admin/facilities
```

---

## Production Build Frontend

Untuk membuat build production frontend:

```bash
cd frontend
npm run build
```

Hasil build akan dibuat pada folder:

```text
frontend/dist
```

Pada production, frontend menggunakan environment variable:

```env
VITE_API_URL=https://backend-production-da394.up.railway.app
```

---

## Deployment

### Frontend

Frontend React + Vite dideploy menggunakan **Vercel**.

URL:

```text
https://capstone-facility-report.vercel.app
```

### Backend

Backend Laravel dideploy menggunakan **Railway**.

URL:

```text
https://backend-production-da394.up.railway.app
```

### Database

Database MySQL berjalan sebagai service MySQL di Railway.

### File Storage

File upload menggunakan Railway Persistent Volume agar file tetap tersedia setelah deployment atau restart service.

---

## Status Project

Project telah selesai dan mencakup:

- Authentication menggunakan Laravel Sanctum
- Role karyawan dan admin
- Manajemen fasilitas
- Pelaporan kondisi fasilitas
- Upload dan penggantian foto
- Prioritas laporan
- Workflow status laporan
- Riwayat perubahan status
- Catatan admin
- Dashboard statistik admin
- Proteksi data berdasarkan pengguna
- REST API Laravel
- Frontend React + Vite
- Database MySQL
- Persistent file storage
- Demo database seeder
- Production frontend build
- Deployment frontend di Vercel
- Deployment backend di Railway
- Deployment database MySQL di Railway

---

## Repository

GitHub:

https://github.com/dindaatun/capstone-facility-report

---

## Author

Capstone Project — Sistem Pelaporan Kondisi Fasilitas Perusahaan