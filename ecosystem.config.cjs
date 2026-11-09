module.exports = {
  apps: [
    {
      name: 'uzel',
      cwd: '/var/www/uzel/repo',
      script: 'build/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '3101'
      }
    }
  ]
};