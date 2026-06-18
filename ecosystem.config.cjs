module.exports = {
  apps: [
    {
      name: "odisha-wiki",
      script: "./server.js",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        HOST: "127.0.0.1",
        PORT: 4322,
        NODE_ENV: "production",
      },
    },
  ],
};
