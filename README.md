# URL Shortener

Aplikasi pemendek URL yang dibangun dengan Express.js, MongoDB, dan Tailwind CSS v4.

## Fitur

- Buat URL pendek dari URL panjang
- Statistik klik untuk setiap URL
- Sistem login untuk manajemen link
- Dashboard pengguna

## Instalasi

1. Clone repositori ini
2. Install dependencies: `npm install`
3. Buat file `.env` dan konfigurasi variabel lingkungan
4. Jalankan aplikasi: `npm run dev`

## Konfigurasi Environment

Buat file `.env` dengan konten:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=your_jwt_secret_here
BASE_URL=http://localhost:3000


## Penggunaan

1. Buka browser dan akses `http://localhost:3000`
2. Daftar akun baru atau login
3. Buat URL pendek dari dashboard
4. Pantau statistik klik untuk setiap URL