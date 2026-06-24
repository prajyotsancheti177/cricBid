// PM2 ecosystem — manages all apps on this EC2 instance.
//
// Port allocation:
//   4000  cricbid          production backend
//   4001  cricbid          staging backend
//   5000  <next-app>       production backend  (reserve when adding)
//   5001  <next-app>       staging backend     (reserve when adding)
//
// To add a new app:
//   1. Add two entries below (prod + staging)
//   2. Copy nginx/_template-new-app.conf → nginx/sites-available/<app>.conf
//   3. SSH into EC2, run: sudo nginx -t && sudo systemctl reload nginx
//   4. pm2 start /home/ubuntu/ecosystem.config.js --only <app-name>
//   5. pm2 save

module.exports = {
  apps: [
    // ─── CricBid ────────────────────────────────────────────────────────────
    {
      name: 'cricbid-prod',
      cwd: '/var/www/prod/backend',
      script: 'src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'cricbid-staging',
      cwd: '/var/www/staging/backend',
      script: 'src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'staging',
        PORT: 4001,
      },
    },

    // ─── Add new apps below ──────────────────────────────────────────────────
    // {
    //   name: 'myapp-prod',
    //   cwd: '/var/www/apps/myapp/backend',
    //   script: 'src/index.js',
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 5000,
    //   },
    // },
    // {
    //   name: 'myapp-staging',
    //   cwd: '/var/www/apps/myapp/staging/backend',
    //   script: 'src/index.js',
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   env: {
    //     NODE_ENV: 'staging',
    //     PORT: 5001,
    //   },
    // },
  ],
}
