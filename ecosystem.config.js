module.exports = {
  apps: [
    {
      name: 'backend-staging',
      cwd: '/var/www/staging/backend',
      script: 'src/index.js',
      env: {
        NODE_ENV: 'staging',
        PORT: 4001,
      },
    },
    {
      name: 'backend-prod',
      cwd: '/var/www/prod/backend',
      script: 'src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
}
