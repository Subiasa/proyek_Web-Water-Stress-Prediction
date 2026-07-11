# SWAG - Agri-Intelligence: Water Stress Prediction System

**SWAG** (Agri-Intelligence) adalah platform cerdas berbasis web yang dirancang untuk mendeteksi tingkat cekaman air (*water stress*) pada tanaman pertanian. Dengan menggabungkan data sensor lingkungan (IoT) dan sensor optikal, sistem ini menggunakan model **Random Forest Classifier** dan **K-Means Clustering** untuk memberikan prediksi kondisi hidrasi tanaman secara presisi beserta rekomendasi tindakan irigasi.

---

## 📁 Struktur Proyek

Proyek ini menggunakan arsitektur microservice terpisah yang terdiri dari tiga komponen utama:

```
swag-web-app/
├── swag-frontend/     # Aplikasi SPA Client (React, Vite, Tailwind CSS, Recharts)
├── swag-backend/      # API Gateway & Database Controller (Laravel 11, Sanctum Auth)
├── ml-services/       # Microservice Prediksi ML (FastAPI, Scikit-Learn, Pandas)
└── notebooks/         # Eksperimen Model (Jupyter Notebook, K-Means & Random Forest)
```

---

## 🚀 Fitur Utama

1. **Dashboard Monitoring**: Menampilkan data statistik total dataset, riwayat prediksi, karakteristik distribusi klaster tanaman, serta grafik tren sensor lingkungan.
2. **Dataset Management**: CRUD data metrik sensor dengan dukungan impor dan ekspor file CSV.
3. **Prediksi Water Stress**: Form input 10 fitur sensor lingkungan & optikal untuk memprediksi tingkat cekaman tanaman secara dinamis dengan visualisasi faktor pengaruh teratas (*feature importances*).
4. **Sistem Rekomendasi Dinamis**: Menyajikan rekomendasi tindakan penyiraman berdasarkan klasifikasi hasil prediksi yang disinkronkan langsung dengan aturan di database (*database recommendation rules*).
5. **Log Riwayat Pengujian**: Riwayat pengujian prediksi terperinci yang tersimpan secara terpusat untuk kebutuhan analisis lanjutan.

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi, pastikan komputer Anda telah terinstal:
* **PHP** (>= 8.2) & **Composer**
* **Node.js** (>= 18) & **npm**
* **Python** (>= 3.10) & **pip**
* **MySQL Database Server** (XAMPP / Laragon / Native)

---

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi

Ikuti panduan berikut untuk menjalankan masing-masing service di komputer lokal Anda:

### 1. Konfigurasi Database MySQL
1. Aktifkan server MySQL Anda (misal via XAMPP).
2. Buat database kosong baru dengan nama `swag_db`.

---

### 2. Jalankan Backend (Laravel API)
1. Buka terminal baru dan masuk ke folder backend:
   ```bash
   cd swag-backend
   ```
2. Instal pustaka dependensi PHP:
   ```bash
   composer install
   ```
3. Salin file konfigurasi lingkungan:
   ```bash
   cp .env.example .env
   ```
4. Sesuaikan konfigurasi database Anda di dalam file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=swag_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Buat kunci aplikasi baru (*app key*):
   ```bash
   php artisan key:generate
   ```
6. Jalankan migrasi tabel database beserta seeder data awal (dilengkapi dengan *fallback dummy generator* jika file CSV tidak ditemukan):
   ```bash
   php artisan migrate --seed
   ```
7. Jalankan server backend lokal Laravel:
   ```bash
   php artisan serve --port=8000
   ```
   *Laravel API akan berjalan pada alamat `http://127.0.0.1:8000`.*

---

### 3. Jalankan ML Microservice (FastAPI)
1. Buka terminal baru dan masuk ke folder microservice ML:
   ```bash
   cd ml-services
   ```
2. Buat dan aktifkan virtual environment Python:
   ```bash
   # Di Windows
   python -m venv .venv
   .venv\Scripts\activate

   # Di macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Instal semua pustaka Python yang diperlukan:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan server FastAPI uvicorn:
   ```bash
   python app.py
   ```
   *FastAPI Microservice akan berjalan pada alamat `http://127.0.0.1:8001`.*

---

### 4. Jalankan Frontend (React SPA)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd swag-frontend
   ```
2. Instal semua dependensi Node.js:
   ```bash
   npm install
   ```
3. Buat file `.env` di folder ini dan isi dengan alamat API backend Laravel Anda:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```
4. Jalankan aplikasi frontend di mode pengembangan:
   ```bash
   npm run dev
   ```
   *Buka browser Anda dan akses aplikasi di alamat `http://localhost:5173`.*

---

## 🔑 Kredensial Login Pengujian

Anda dapat menggunakan akun uji bawaan dari seeder untuk login ke aplikasi:
* **Email**: `test@example.com`
* **Password**: `password`

---

## 📊 Detail Model Machine Learning

Sistem ini memprediksi water stress menggunakan model **Random Forest Classifier** yang dilatih menggunakan 10 fitur sensor masukan:
1. `temp_mean` (Rata-rata Suhu Udara - °C)
2. `rh_mean` (Rata-rata Kelembapan Udara - %)
3. `pd1_mean` (Rata-rata Sensor Optik PD1)
4. `pd2_mean` (Rata-rata Sensor Optik PD2)
5. `spectral_mean` (Rata-rata Spectral)
6. `spectral_std` (Standar Deviasi Spectral)
7. `pla_difference` (Selisih Luas Area Daun / PLA)
8. `temp_rh_index` (Indeks Suhu × Kelembapan)
9. `temp_range` (Rentang Suhu)
10. `rh_range` (Rentang Kelembapan)

Model menghasilkan 3 kelas keluaran:
* **`Healthy Environment`** (Kondisi Hidrasi Normal/Sehat)
* **`Optimal Growth`** (Kondisi Tumbuh Optimal)
* **`Potential Water Stress`** (Potensi Cekaman Air/Kekeringan)
