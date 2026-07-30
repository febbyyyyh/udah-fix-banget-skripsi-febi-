# ==========================================
# STAGE 1: Build Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS build-frontend

WORKDIR /app/titik-jeda

# Copy package.json dan install dependency
COPY titik-jeda/package*.json ./
RUN npm install

# Copy seluruh source code frontend dan build
COPY titik-jeda/ ./
RUN npm run build

# ==========================================
# STAGE 2: Setup Backend & Serve
# ==========================================
FROM node:20-alpine

WORKDIR /app/backend

# Copy package.json backend dan install dependency production saja
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy seluruh source code backend
COPY backend/ ./

# Buat folder uploads jika belum ada (meskipun index.js juga akan membuatnya)
RUN mkdir -p uploads

# Copy hasil build frontend (folder dist) dari STAGE 1 ke dalam struktur yang sesuai
# karena di backend/index.js, path yang dituju adalah "../titik-jeda/dist"
RUN mkdir -p /app/titik-jeda/dist
COPY --from=build-frontend /app/titik-jeda/dist /app/titik-jeda/dist

# Expose port backend
EXPOSE 5000

# Perintah untuk menjalankan backend (menggunakan node index.js langsung, bukan nodemon)
CMD ["node", "index.js"]
