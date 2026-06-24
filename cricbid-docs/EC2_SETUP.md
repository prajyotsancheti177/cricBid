# EC2 Multi-App Server Setup Guide

Run these commands **once** when setting up a fresh EC2 instance (or to retrofit the existing one). After this, every `git push` handles deployments automatically.

---

## 1. Install Dependencies (if not already done)

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## 2. Create Directory Structure

```bash
# CricBid directories
sudo mkdir -p /var/www/prod/frontend
sudo mkdir -p /var/www/prod/backend
sudo mkdir -p /var/www/staging/frontend
sudo mkdir -p /var/www/staging/backend

# Directory for future playground apps
sudo mkdir -p /var/www/apps

# Give your user ownership
sudo chown -R $USER:$USER /var/www
```

---

## 3. Configure Nginx

```bash
# Remove the default Nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# The CI/CD pipeline deploys configs from nginx/sites-available/ automatically.
# For first-time setup, copy them manually:
sudo cp /tmp/nginx-sites/cricbid.conf         /etc/nginx/sites-available/
sudo cp /tmp/nginx-sites/cricbid-staging.conf  /etc/nginx/sites-available/

# Enable them
sudo ln -sf /etc/nginx/sites-available/cricbid.conf         /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/cricbid-staging.conf  /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 4. Allow Nginx to Reload Without Password (required for CI/CD)

The CI/CD runs `sudo nginx -t && sudo systemctl reload nginx` as your SSH user.
Grant passwordless sudo for just those two commands:

```bash
sudo visudo -f /etc/sudoers.d/nginx-reload
```

Add this line (replace `ubuntu` with your EC2 username if different):
```
ubuntu ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /bin/systemctl reload nginx, /bin/cp * /etc/nginx/sites-available/*, /bin/ln -sf * /etc/nginx/sites-enabled/*
```

---

## 5. DNS Setup (in your domain registrar)

Add these records pointing to your EC2's public IP:

| Type | Name | Value |
|------|------|-------|
| A | `cricbid.online` | `<EC2_PUBLIC_IP>` |
| A | `*.cricbid.online` | `<EC2_PUBLIC_IP>` |

The wildcard `*.cricbid.online` covers:
- `www.cricbid.online`
- `api.cricbid.online`
- `staging.cricbid.online`
- `api.staging.cricbid.online`
- `playground.anyapp.cricbid.online`
- ...everything

---

## 6. SSL Certificate (wildcard — covers all subdomains)

```bash
# Get a wildcard cert — covers cricbid.online AND *.cricbid.online
sudo certbot --nginx \
  -d cricbid.online \
  -d "*.cricbid.online" \
  --server https://acme-v02.api.letsencrypt.org/directory \
  --preferred-challenges dns-01

# Certbot will ask you to add a DNS TXT record to verify ownership.
# Add it in your registrar, wait ~60s, then press Enter.

# Test auto-renewal
sudo certbot renew --dry-run
```

> Certbot sets up a cron/systemd timer for auto-renewal — you never need to renew manually.

---

## 7. Start PM2

```bash
# Start all apps from the ecosystem config
pm2 start /home/$USER/ecosystem.config.js

# Save PM2 process list (survives server restart)
pm2 save

# Set PM2 to start on boot
pm2 startup
# Run the command PM2 outputs

# Verify
pm2 list
```

---

## 8. GitHub Actions Secrets Required

In your GitHub repo → Settings → Secrets and Variables → Actions:

| Secret | Value |
|--------|-------|
| `EC2_HOST` | EC2 public IP or domain (e.g., `ec2-xx-xx-xx-xx.compute.amazonaws.com`) |
| `EC2_USER` | SSH username (usually `ubuntu`) |
| `EC2_SSH_KEY` | Full content of your EC2 private key (`.pem` file) |

---

## 9. Final State After Setup

```
EC2 Instance
│
├── Nginx (port 80 → redirect HTTPS, port 443 → route by subdomain)
│   ├── cricbid.online          →  /var/www/prod/frontend      (static React)
│   ├── api.cricbid.online      →  localhost:4000               (PM2: cricbid-prod)
│   ├── staging.cricbid.online  →  /var/www/staging/frontend   (static React)
│   └── api.staging.cricbid.online → localhost:4001            (PM2: cricbid-staging)
│
├── PM2
│   ├── cricbid-prod     (port 4000)  /var/www/prod/backend
│   └── cricbid-staging  (port 4001)  /var/www/staging/backend
│
└── SSL: wildcard cert for *.cricbid.online (auto-renewed by Certbot)
```

---

## 10. Adding a New App Later

When you want to host `playground.scorecard.cricbid.online`:

1. **Copy the Nginx template:**
   ```bash
   cp nginx/sites-available/_template-new-app.conf nginx/sites-available/scorecard.conf
   # Edit it: replace APP_NAME → scorecard, PORT_PROD → 5000, PORT_STG → 5001
   ```

2. **Add PM2 entries** in `ecosystem.config.js` (uncomment the template block, fill in values).

3. **Create deploy workflow** in the new app's GitHub repo — point it to `/var/www/apps/scorecard/`.

4. **Push to git** — CI/CD deploys the Nginx config and reloads automatically.

5. **On EC2 (first time only):**
   ```bash
   pm2 start /home/$USER/ecosystem.config.js --only scorecard-prod
   pm2 save
   ```

No SSL work needed — the wildcard cert already covers `playground.scorecard.cricbid.online`.
