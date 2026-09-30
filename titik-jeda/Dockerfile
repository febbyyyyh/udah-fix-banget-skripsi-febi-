FROM nginx:alpine

# 1. Salin konfigurasi kustom Nginx (penanganan React Router/SPA)
COPY default.conf /etc/nginx/conf.d/default.conf

# 2. Salin folder dist hasil build
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
