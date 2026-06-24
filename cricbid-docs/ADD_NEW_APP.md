# How to Add a New Playground App

This doc is for agents. Follow these steps exactly to host a new app at
`playground.APP_NAME.cricbid.online` on the shared EC2 instance.

No EC2 SSH access needed during normal operation — everything deploys via CI/CD.
The only manual EC2 step is creating the target directory (Step 4).

---

## Prerequisites

- `gh` CLI is authenticated (`gh auth status` must show `prajyotsancheti177`)
- Working directory is `/Users/prajyot/Destruction` (the cricbid monorepo)
- You are on the `develop` branch of the cricbid repo
- The new app's GitHub secrets (`EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`) must be
  added manually by the user — remind them at the end

---

## Step 1 — Choose a name and port

Pick an `APP_NAME` (lowercase, no spaces, e.g. `scorecard`, `fantasy`, `testinggggg`).

Check `ecosystem.config.js` in the cricbid repo root for the next available port.
Current allocation:
```
4000  cricbid-prod
4001  cricbid-staging
5000  (next available for a backend app)
```
If the new app is frontend-only (no backend), no port is needed — skip ecosystem changes.

---

## Step 2 — Create the new repo locally

Create the folder inside `/Users/prajyot/Destruction/` (keep all projects in one place):

```
/Users/prajyot/Destruction/APP_NAME/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   └── App.js
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

### frontend/public/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>APP_NAME</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### frontend/src/index.js
```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

### frontend/src/App.js
```js
import React from 'react'

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '120px' }}>
      <h1>APP_NAME</h1>
    </div>
  )
}

export default App
```

### frontend/package.json
```json
{
  "name": "APP_NAME-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version"]
  }
}
```

### .github/workflows/deploy.yml
```yaml
name: Deploy to playground

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install & build frontend
        working-directory: frontend
        run: |
          npm install
          npm run build

      - name: Deploy frontend build to EC2
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: "frontend/build"
          target: "/var/www/apps/APP_NAME/frontend"
          strip_components: 1
```

---

## Step 3 — Add Nginx config to the cricbid repo

Create `nginx/sites-available/APP_NAME.conf` inside `/Users/prajyot/Destruction/`:

```nginx
# playground.APP_NAME.cricbid.online → /var/www/apps/APP_NAME/frontend

server {
    listen 80;
    server_name playground.APP_NAME.cricbid.online;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name playground.APP_NAME.cricbid.online;

    ssl_certificate     /etc/letsencrypt/live/cricbid.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cricbid.online/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    root  /var/www/apps/APP_NAME/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

If the app has a backend, add two more server blocks for
`api.playground.APP_NAME.cricbid.online` proxying to `localhost:PORT`.
See `nginx/sites-available/_template-new-app.conf` for the full backend template.

---

## Step 4 — Remind the user to create the EC2 directory

The SCP step in CI/CD will fail silently if the target directory doesn't exist.
Tell the user to SSH into the EC2 and run:

```bash
sudo mkdir -p /var/www/apps/APP_NAME/frontend
sudo chown -R ubuntu:ubuntu /var/www/apps
```

This is the **only manual EC2 step** required.

---

## Step 5 — Create the GitHub repo and push

Run these commands from inside `/Users/prajyot/Destruction/APP_NAME/`:

```bash
git init
git checkout -b main
git add .
git commit -m "init: APP_NAME frontend"
gh repo create prajyotsancheti177/APP_NAME --public --source=. --remote=origin --push
```

---

## Step 6 — Commit the Nginx config to the cricbid repo

Run from `/Users/prajyot/Destruction/`:

```bash
git add nginx/sites-available/APP_NAME.conf
git commit -m "feat: add nginx config for playground.APP_NAME.cricbid.online"
git push origin develop
```

This triggers the cricbid staging CI/CD which copies the new Nginx config to the
EC2 and reloads Nginx. The new subdomain becomes live immediately after.

---

## Step 7 — Remind the user to add GitHub secrets to the new repo

The `testinggggg` workflow uses these secrets. They have the same values as the
cricbid repo secrets. The user must add them manually at:

```
https://github.com/prajyotsancheti177/APP_NAME/settings/secrets/actions
```

| Secret | Value |
|--------|-------|
| `EC2_HOST` | EC2 public IP or hostname |
| `EC2_USER` | SSH username (usually `ubuntu`) |
| `EC2_SSH_KEY` | Full content of the `.pem` private key |

Once added, re-run the failed workflow (or push a new commit) to trigger deployment.

---

## Step 8 — Verify

After both pipelines complete:
- `playground.APP_NAME.cricbid.online` should load the frontend
- Check pipeline logs at `https://github.com/prajyotsancheti177/APP_NAME/actions`
- Check Nginx config deployment at `https://github.com/prajyotsancheti177/cricBid/actions`

---

## Summary Checklist

```
[ ] Chose APP_NAME and next available port (if backend needed)
[ ] Created /Users/prajyot/Destruction/APP_NAME/ with all files
[ ] Created nginx/sites-available/APP_NAME.conf in cricbid repo
[ ] Told user to mkdir on EC2: /var/www/apps/APP_NAME/frontend
[ ] Created GitHub repo and pushed (gh repo create ...)
[ ] Committed Nginx config to cricbid repo and pushed to develop
[ ] Told user to add EC2_HOST, EC2_USER, EC2_SSH_KEY secrets to new repo
[ ] Verified both pipelines passed and subdomain is live
```
