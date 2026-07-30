# Titik Jeda - Mental Health & Psychology Education Platform

Platform edukasi psikologi, tes DASS-21 (Depression, Anxiety, Stress Scale), dan pemutar fitur relaksasi (meditasi audio, pernapasan, dll). Proyek ini dibangun menggunakan **Node.js (Express)** untuk backend dan **React (Vite)** untuk frontend.

---

## 🏗️ Arsitektur Proyek

Aplikasi ini menggunakan pola arsitektur **Client-Server** dalam format Monorepo, di mana file statis React yang sudah di-build disajikan (*served*) langsung oleh backend Node.js. 

* **Frontend (`/titik-jeda`)**: Dibangun dengan React 19, TailwindCSS v4, Vite, dan React Router. Berfungsi menangani antarmuka User (anonim) dan halaman Admin (CMS).
* **Backend (`/backend`)**: API berbasis Express.js yang terkoneksi dengan MySQL. Mengurus logika bisnis, JWT Authentication untuk Admin, pengelolaan upload media (Multer), dan penyajian frontend statis (`index.html`).

---

## 🐳 Panduan Docker (Local & Production)

Proyek ini telah dikonfigurasi penuh dengan **Docker** (menggunakan *Multi-stage Build*) untuk memudahkan *deployment* baik di laptop (local development) maupun VPS.

### 1. Struktur Docker
- **`Dockerfile` (Multi-stage)**:
  - **Stage 1**: Mem-build aplikasi React (Vite).
  - **Stage 2**: Menjalankan Express Backend dan meng-copy hasil build React (folder `dist`) dari Stage 1. Hal ini membuat aplikasi berjalan sangat efisien di dalam 1 kontainer Node.
- **`docker-compose.yml`**: Mengorkestrasi 2 *services*:
  1. `app`: Aplikasi Node.js di atas (terekspos di port `5000`).
  2. `db`: Database MySQL (terekspos di port `3307` di host, port `3306` internal).
- **Auto-Migrate**: Saat MySQL container pertama kali menyala, sistem akan otomatis membaca `database.sql` dan meng-import tabel+data di dalamnya!

### 2. Cara Menggunakan (Untuk Rekan Tim & Deploy)

**Prasyarat:** Anda hanya perlu menginstal **Docker Desktop** (atau Docker Engine di server). *Tidak perlu Node.js, tidak perlu XAMPP.*

#### Langkah-langkah:
1. **Siapkan Environment Variables**
   Salin file template `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Secara default, nilainya sudah disesuaikan untuk berjalan mulus di Docker).*

2. **Jalankan Aplikasi**
   Buka terminal di dalam folder proyek ini (sejajar dengan file `docker-compose.yml`), lalu jalankan:
   ```bash
   docker-compose up -d --build
   ```
   *Note: Proses build untuk pertama kali akan memakan waktu 1-3 menit untuk mengunduh Image dan dependensi.*

3. **Akses Aplikasi**
   Setelah selesai, aplikasi akan berjalan terpadu (API + Frontend) di:
   👉 **http://localhost:5000**

4. **Mematikan Aplikasi**
   Jika ingin mematikan kontainer:
   ```bash
   docker-compose down
   ```

### 3. Persisten Data (Volume)
Data penting Anda **tidak akan hilang** jika kontainer dimatikan atau di-restart, karena telah diamankan dengan Docker Volumes:
- `db_data`: Mengamankan isi database MySQL.
- `app_uploads`: Mengamankan file gambar/audio meditasi yang diunggah Admin.

---

## 🛠️ Pengembangan Secara Manual (Tanpa Docker)

Jika Anda ingin melakukan proses *coding* atau *editing* kode secara cepat (Hot Reloading), Anda bisa menjalankan aplikasinya tanpa Docker:

1. Pastikan Anda punya **XAMPP/Laragon** dan **Node.js** terinstal.
2. Buat database kosong di MySQL bernama `sql_titikjeda_online`, lalu import manual file `database.sql`.
3. Buka **Terminal 1 (Backend)**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. Buka **Terminal 2 (Frontend)**:
   ```bash
   cd titik-jeda
   npm install
   npm run dev
   ```
5. Buka `http://localhost:3000` di browser.

*(Perhatikan bahwa jika ada bentrok cache di `localhost:5173`, gunakan Hard Reload `Ctrl+Shift+R`).*