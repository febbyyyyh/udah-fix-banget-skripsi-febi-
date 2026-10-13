# Deployment VM Titik Jeda

Dokumen ini menjelaskan cara aplikasi berjalan di VM produksi dan bagaimana
rilis dilakukan. Ditulis setelah setup di VM `llm-lokal` (172.16.222.8).

## Ringkasan alur

```text
Laptop (Febi): git pull -> ngoding -> git push ke main
                                          |
                                          v
GitHub Actions: validasi -> build image -> publish ke GHCR
                                          |
                                          v
VM (cron, tiap 2 menit): sync config dari git -> pull image -> recreate
                                          |
                                          v
                               Refresh halaman = sudah berubah
```

Tidak perlu akses SSH ke VM lagi untuk rilis kode maupun konfigurasi.

## Peran tiap file

| File | Peran | Dipakai siapa |
| --- | --- | --- |
| `docker-compose.yml` | Dev lokal (build source) | Laptop Febi |
| `docker-compose.prod.yml` | Produksi (image GHCR + volume uploads) | VM |
| `deploy/nginx/default.conf` | Konfigurasi nginx produksi (di-mount ke container frontend) | VM |
| `scripts/titikjeda-autodeploy.sh` | Auto-deploy: sync config + pull image | VM (cron) |
| `.github/workflows/publish-images.yml` | Build & publish image ke GHCR | GitHub Actions |

`docker-compose.yml` sengaja tidak diubah supaya alur dev di laptop tetap jalan.

## Detail komponen produksi

### Image

- `ghcr.io/febbyyyyh/titik-jeda-backend:main`
- `ghcr.io/febbyyyyh/titik-jeda-frontend:main`

Dipublish oleh GitHub Actions saat push ke `main` (juga tag `sha-<pendek>`).
Frontend di-build multi-stage (Vite build di `node:22` lalu disalin ke `nginx:alpine`).

### Port

| Port host | Container | Layanan |
| --- | --- | --- |
| 3001 | `react_frontend` | nginx (SPA + proxy `/api` dan `/uploads`) |
| 5000 | `express_backend` | Express API |
| 3307 | `mysql_db` | MySQL 8.0 |

### Volume & mount

- `mysql_data` -> `/var/lib/mysql` (data DB)
- `./backend/uploads` -> `/app/uploads` (media audio/video; **persisten**, tidak
  ikut terhapus saat container di-recreate)
- `./deploy/nginx/default.conf` -> `/etc/nginx/conf.d/default.conf:ro` (override
  conf bawaan image)

### Secrets (tidak masuk Git)

- `.env` (root) -> `DB_ROOT_PASSWORD`, `JWT_SECRET`, nama image
- `backend/.env.production` -> environment backend di container

Keduanya di-`chmod 600` dan sudah masuk `.gitignore`.

## Cara auto-deploy bekerja

`scripts/titikjeda-autodeploy.sh` dijalankan cron tiap 2 menit:

1. `git fetch` lalu bandingkan `origin/main` dengan penanda `backups/.last-synced`.
   Kalau beda, `git checkout` **hanya** `docker-compose.prod.yml` dan
   `deploy/nginx/default.conf` dari commit itu.
2. Bandingkan digest image lokal vs GHCR (`docker buildx imagetools inspect`).
3. Kalau ada perubahan: `docker compose pull` lalu `up -d`.
   Kalau isi conf nginx berubah, frontend di-`--force-recreate` (bind mount
   mengikat inode, jadi recreate diperlukan).

Sifat aman:

- Scope dikunci ke project `titikjeda` + `docker-compose.prod.yml` saja.
  Aplikasi lain di VM tidak mungkin tersentuh.
- `flock` mencegah dua proses berjalan bersamaan.
- Kalau registry tidak terjangkau, hanya dicatat di log; yang berjalan tidak diutak-atik.
- Log: `backups/autodeploy.log` (dipotong otomatis).

Cron (user `aldo`):

```
*/2 * * * * /home/aldo/titikjeda/scripts/titikjeda-autodeploy.sh >/dev/null 2>&1
```

## Langkah rilis (dari laptop)

1. `git pull origin main`
2. Edit kode, uji lokal (`docker compose up -d --build db backend`, lalu `npm --prefix titik-jeda run dev`)
3. Commit & push ke `main`
4. Tunggu 2-4 menit (Actions build + cron pull), refresh halaman

Cek status di tab **Actions** repo kalau halaman belum berubah setelah ~6 menit.

## Kalau perlu deploy manual (darurat)

```bash
cd /home/aldo/titikjeda
./scripts/titikjeda-autodeploy.sh          # cara normal
# atau paksa:
docker compose -p titikjeda -f docker-compose.prod.yml pull
docker compose -p titikjeda -f docker-compose.prod.yml up -d
```

## Catatan penting

- **Jangan** pakai `docker-compose.yml` (versi build) di VM; yang aktif adalah
  `docker-compose.prod.yml`.
- **Jangan** ubah `deploy/nginx/default.conf` langsung di VM tanpa commit ke Git:
  perubahan lokal akan tertimpa saat auto-deploy berikutnya.
- `git status` di VM sebaiknya bersih. Kalau ada modifikasi lokal pada file yang
  dikelola script, script akan menimpanya dengan versi repo.

## Batas & troubleshooting

- **413 Request Entity Too Large saat upload lewat domain:** limit `client_max_body_size`
  di reverse proxy depan (host `103.84.116.31`) masih kecil. Ini di luar VM ini.
  Perlu diset oleh admin jaringan UNSRAT (700m). Upload langsung ke
  `103.84.116.67:3001` tidak terkena masalah ini.
- **Halaman tidak berubah setelah push:** cek tab Actions; kalau workflow gagal,
  digest tidak berubah dan VM tidak update (aman).
- **nginx crash-loop / 502:** conf produksi memakai `resolver 127.0.0.11` sehingga
  nama `express_backend` di-resolve saat request, bukan saat start. Kalau tetap
  bermasalah, cek `docker logs react_frontend`.
- **Media tidak bisa diputar:** pastikan nama file di kolom DB sama persis dengan
  file di `backend/uploads` (Linux case-sensitive).
