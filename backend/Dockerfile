FROM node:18-alpine

WORKDIR /app

# Salin package.json untuk instalasi library backend
COPY package*.json ./
RUN npm install

# Salin semua file kodingan backend
COPY . .

# Buka port backend (sesuaikan dengan port running di index.js kamu, contoh: 5000)
EXPOSE 5000

# Jalankan backend menggunakan node langsung ke index.js
CMD ["node", "index.js"]