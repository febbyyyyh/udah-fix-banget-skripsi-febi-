module.exports = {
  apps: [
    {
      name: "backend-api",
      script: "index.js",
      env: {
        NODE_ENV: "production",
        DB_HOST: "127.0.0.1",
        DB_PORT: "3306",
        DB_USER: "sql_titikjeda_online",
        DB_PASSWORD: "ec5d2cc0c70bf8",
        DB_NAME: "sql_titikjeda_online",
        PORT: "5005",
        JWT_SECRET: "TJ_4k9vLp2!xZ8mQ1wE7rY$tN5bC0hG3j",
        FRONTEND_URL: "https://titikjeda.online",
      },
    },
  ],
};
