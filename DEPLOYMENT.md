# Pengembangan Lokal dan Deployment Image

## Model Kerja

```text
Laptop: edit -> uji -> commit/push
							|
							v
GitHub Actions: validasi -> build image -> publish ke GHCR
													  |
VM: pull image -> recreate backend/frontend
```

GitHub Actions tidak masuk ke VM dan tidak mengubah konfigurasi server. Workflow memeriksa pull request ke `main`; setelah commit masuk ke `main`, ia memvalidasi backend/frontend lalu menerbitkan dua image ke GitHub Container Registry (GHCR). VM mengambil image saat Anda menjalankan perintah deploy. Tidak ada `git pull` source code pada setiap rilis.

Panduan Gemini yang dilampirkan menyarankan build backend di VM memakai `--network host` dan memeriksa IP VM di source. Itu untuk alur build-source-di-server. Di alur image ini, dependency diunduh saat GitHub Actions membangun image dan frontend memakai URL relatif, jadi VM tidak perlu build dengan host networking atau menyisipkan IP VM ke source.

## File yang Terlibat

- `.github/workflows/publish-images.yml`: validasi PR/push, build, dan publish image.
- `docker-compose.yml`: Compose lama yang sudah ada di VM; file ini sengaja tidak diubah oleh workflow.
- `docker-compose.images.yml`: overlay baru untuk memilih image GHCR dan menyimpan uploads. Pasang overlay satu kali di VM, berdampingan dengan Compose VM yang benar.
- `backend/.env`, Compose override, dan data uploads: tetap berada di VM/lokal, tidak masuk ke image maupun Git.

## Prasyarat Laptop

- Git, Node.js 18 untuk backend dan Node.js 22 untuk frontend.
- Docker Desktop aktif bila ingin menguji Docker Compose lokal.
- `backend/.env` lokal dibuat dari `backend/.env.example`; isi nilai database lokal dan `JWT_SECRET` lokal. Jangan salin secret production ke laptop atau commit file `.env`.
- `backend/.env` diabaikan Git. `.env*`, file Compose override mesin, `backend/uploads`, dan frontend environment dikecualikan dari Docker build context yang sesuai.

## Menjalankan dan Menguji Lokal

1. Buka PowerShell di direktori repo.
2. Siapkan `backend/.env` dari `backend/.env.example` dan pastikan database lokal dapat digunakan.
3. Jalankan database dan backend lokal:

	```powershell
	docker compose up -d --build db backend
	```

4. Di terminal lain, jalankan frontend:

	```powershell
	npm --prefix titik-jeda ci
	npm --prefix titik-jeda run dev
	```

5. Buka `http://localhost:5173`. Vite meneruskan `/api` dan `/uploads` ke backend `localhost:5000`. Uji alur yang disentuh, termasuk login, API, dan pemutaran media.
6. Jalankan checks yang sama dengan CI:

	```powershell
	npm --prefix backend ci
	Get-ChildItem backend -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
	npm --prefix titik-jeda run lint
	npm --prefix titik-jeda run build
	git diff --check
	```

	Skrip `backend` belum memiliki automated test suite, sehingga CI memeriksa clean install dan sintaks backend, bukan mengklaim telah menjalankan tes integrasi.

7. Build lokal frontend mengubah file ter-track di `titik-jeda/dist` karena artefak lama masih ada di Git. Periksa `git status`; jangan ikutkan perubahan `dist` hasil lokal ke commit. Image Docker membangun frontend dari source dan tidak memakai folder `dist` lokal.

## Mengirim Perubahan ke GitHub

1. Tinjau file sebelum staging:

	```powershell
	git status --short
	git diff --check
	git diff
	```

2. Stage hanya file source/config/panduan yang memang menjadi bagian perubahan. Jangan stage `.env`, `backup.txt`, PDF panduan pribadi, uploads, `node_modules`, atau `dist` hasil build lokal.
3. Commit dan push ke branch kerja/PR. Pull request ke `main` menjalankan backend checks, frontend lint, dan frontend build; belum menerbitkan image.
4. Setelah PR di-merge/push ke `main`, job `publish` berjalan hanya jika semua checks lolos. Untuk setiap service, workflow menerbitkan tag `main` dan `sha-<commit>`.
5. Buka tab **Actions** di GitHub dan pastikan workflow hijau. Lihat **Packages** pada repository/owner untuk memastikan package `backend` dan `frontend` tersedia.

Jika workflow ditolak karena permission, buka **Repository Settings > Actions > General > Workflow permissions** dan izinkan workflow memberi package write permission sesuai kebijakan repository. Jangan membuat secret untuk `GITHUB_TOKEN`; GitHub menyediakannya otomatis.

## Menyiapkan VM Satu Kali

Lakukan di direktori deployment yang sedang menjalankan aplikasi. Jangan mengganti atau meng-clone ulang direktori yang ada.

1. Catat lokasi dan cek status repo/config VM. Jangan melanjutkan bila ada perubahan lokal pada file tracked yang belum dipahami. Simpan backup di luar repo bila diperlukan.
2. Pastikan file Compose yang benar dan `backend/.env` tetap berada di tempatnya. Overlay deployment harus berada di direktori kerja Compose yang sama. Salin hanya file `docker-compose.images.yml` dari laptop ke direktori itu, misalnya dengan `scp`; jangan salin menimpa `docker-compose.yml`.
3. Package GHCR yang baru diterbitkan biasanya private. Buat token GitHub dengan izin `read:packages`, lalu login di VM satu kali. Ketik token secara langsung saat menyiapkan variabel shell; jangan masukkan token ke command history, repo, atau file Compose:

	```sh
	read -s GHCR_TOKEN
	echo "$GHCR_TOKEN" | docker login ghcr.io -u USER_GITHUB --password-stdin
	unset GHCR_TOKEN
	```

	Jika package diubah menjadi public, login mungkin tidak dibutuhkan. Uji akses dahulu dengan `docker pull` sebelum jadwal deployment.

4. Periksa hasil gabungan konfigurasi tanpa menjalankan container:

	```sh
	docker compose -f docker-compose.yml -f docker-compose.images.yml config --quiet
	```

	Bila file Compose VM bernama lain atau menggunakan override lokal, gunakan file aktual dan urutkan overlay image sebelum override VM, supaya nilai mesin tetap menang. Jangan gunakan contoh nama file secara membuta.

5. Sebelum rollout pertama, buat backup uploads dari container backend lama. Konfigurasi lama tidak memasang volume uploads, jadi mengganti container sebelum backup dapat menghilangkan file media:

	```sh
	mkdir -p uploads-backup
	docker cp express_backend:/app/uploads/. ./uploads-backup/
	```

	Verifikasi isi backup. Sesuaikan nama container bila berbeda. Simpan backup di luar Git dan jangan hapus sampai media sudah dapat dibuka dari aplikasi setelah rollout.

6. Pull image dan isi volume persisten uploads baru, lalu recreate aplikasi:

	```sh
	IMAGE_TAG=main docker compose -f docker-compose.yml -f docker-compose.images.yml pull backend frontend
	IMAGE_TAG=main docker compose -f docker-compose.yml -f docker-compose.images.yml run --rm --no-deps --no-build -v "$PWD/uploads-backup:/backup:ro" backend sh -c 'cp -a /backup/. /app/uploads/'
	IMAGE_TAG=main docker compose -f docker-compose.yml -f docker-compose.images.yml up -d --no-build backend frontend
	```

	Ini tidak meminta Compose membangun source dan tidak memilih service database. **Jangan tambahkan `-v`, `down`, `--remove-orphans`, atau perintah reset volume**; perintah seperti itu tidak diperlukan untuk rollout ini dan berisiko pada data.

7. Verifikasi service dan log:

	```sh
	docker compose -f docker-compose.yml -f docker-compose.images.yml ps
	docker compose -f docker-compose.yml -f docker-compose.images.yml logs --tail=100 backend frontend
	```

	Buka situs, uji login/API, dan pastikan media lama dapat diputar. Compose utama masih menentukan port, environment, network, dan database seperti sebelumnya.

## Deployment Rutin

Sesudah persiapan satu kali selesai, setelah workflow `main` hijau jalankan hanya:

```sh
IMAGE_TAG=main docker compose -f docker-compose.yml -f docker-compose.images.yml pull backend frontend
IMAGE_TAG=main docker compose -f docker-compose.yml -f docker-compose.images.yml up -d --no-build backend frontend
docker compose -f docker-compose.yml -f docker-compose.images.yml ps
```

Tidak perlu `git pull`, `docker compose build`, atau `--network host` di VM. Jika VM menggunakan Compose override sendiri, tambahkan file itu sebelum menjalankan perintah dan pertahankan urutan yang sudah diuji.

## Rollback

Setiap workflow sukses menerbitkan tag berdasarkan commit. Ganti `main` dengan SHA image yang sebelumnya diketahui baik:

```sh
IMAGE_TAG=sha-<commit> docker compose -f docker-compose.yml -f docker-compose.images.yml pull backend frontend
IMAGE_TAG=sha-<commit> docker compose -f docker-compose.yml -f docker-compose.images.yml up -d --no-build backend frontend
```

Gunakan SHA yang sama untuk kedua service dari satu run. Rollback image tidak me-rollback perubahan skema database; perubahan skema harus punya prosedur kompatibilitas/migrasi terpisah.

## Batas dan Troubleshooting

- **Workflow hijau tetapi `pull` ditolak:** pastikan package GHCR terlihat dan VM sudah login dengan izin baca package yang benar.
- **Image tidak ditemukan:** pastikan workflow `main` selesai sukses; tag `main` hanya diterbitkan dari branch default/main.
- **Frontend menampilkan error API:** cek frontend dan nginx container serta `/api` proxy; aplikasi tidak lagi seharusnya menunjuk IP VM langsung.
- **Backend gagal konek DB:** image tidak mengubah konfigurasi DB; periksa environment dan network yang sudah digunakan Compose VM. Jangan mengganti kredensial/volume sebagai langkah coba-coba.
- **Jangan mengandalkan `skip-worktree`:** flag itu tidak memisahkan konfigurasi VM dengan aman. Pada model ini VM tidak menarik source untuk rilis aplikasi; konfigurasi server tetap lokal.
- PDF panduan lama menjelaskan build source di VM. Gunakan panduan ini untuk rilis image GHCR; dua alur tersebut jangan dicampur dalam satu deployment.
