FROM node:18-alpine

WORKDIR /app

# Langsung install web server ringan
RUN npm install -g serve

# Salin folder 'dist' hasil build lokal kamu ke dalam Docker
COPY dist ./dist

EXPOSE 3000

# Jalankan aplikasi langsung dari folder dist
CMD ["serve", "-s", "dist", "-l", "3000"]