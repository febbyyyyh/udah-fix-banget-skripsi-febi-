FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

# 1. Salin konfigurasi kustom Nginx (penanganan React Router/SPA)
COPY default.conf /etc/nginx/conf.d/default.conf

# 2. Salin hasil build dari source frontend
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
