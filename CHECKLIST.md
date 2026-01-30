# ✅ Deployment Checklist for sumriktest.in

## Before You Start

- [ ] You have SSH access to your server
- [ ] You have FTP/FileZilla credentials
- [ ] Backend code is ready in `server/` folder
- [ ] Frontend code is ready in `client/` folder

---

## Step 1: Build Frontend ⚙️

```bash
cd client
npm run build
```

**Output:** Should create `client/dist/` folder with built files

---

## Step 2: Upload Files 📤

### Upload to Server Root (public_html or /var/www/html)
Upload ALL files from `client/dist/`:
- [ ] `index.html`
- [ ] `assets/` folder
- [ ] `.htaccess` file (**IMPORTANT!**)

**Path on server:** `/var/www/html/` or `/home/username/public_html/`

### Upload Backend Files
Upload `server/` folder contents to:
- [ ] Backend folder on server (e.g., `/home/username/backend/`)
- [ ] Make sure `server/.env.production` is uploaded as `.env`

---

## Step 3: Enable Apache Modules 🔧

**SSH into your server** and run:

```bash
# Enable required modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers

# Restart Apache
sudo systemctl restart apache2
```

**This is CRITICAL!** Without these, API calls will fail with 404.

- [ ] Modules enabled
- [ ] Apache restarted

---

## Step 4: Start Backend 🚀

```bash
# Go to backend folder
cd ~/backend

# Install dependencies (first time only)
npm install

# Start with PM2
pm2 start server.js --name festiq-backend

# Save PM2 config (auto-restart on reboot)
pm2 save
pm2 startup
```

- [ ] Backend is running
- [ ] PM2 shows "online" status

---

## Step 5: Verify Everything Works ✨

### Test 1: Frontend Access
- [ ] Open: `https://sumriktest.in`
- [ ] Should load the homepage

### Test 2: Backend Health
SSH into server and run:
```bash
curl http://localhost:4000/api/health
```
- [ ] Should return: `{"status":"healthy",...}`

### Test 3: API Proxy (Most Important!)
```bash
curl https://sumriktest.in/api/product/list
```
- [ ] Should return: `{"success":true,"products":[...]}`
- [ ] If 404: Go back to Step 3

### Test 4: Hard Refresh
- [ ] Go to: `https://sumriktest.in/venues`
- [ ] Press F5 (refresh)
- [ ] Should still load the page (not 404)

### Test 5: Browser Console
Open DevTools (F12) → Console, run:
```javascript
fetch('https://sumriktest.in/api/product/list')
  .then(r => r.json())
  .then(console.log)
```
- [ ] Should show: `{success: true, products: Array(...)}`

---

## Common Issues & Quick Fixes 🔍

### Issue: API returns 404 ❌
**Fix:**
```bash
# Check if modules are enabled
apache2ctl -M | grep proxy

# If not listed, enable them
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2
```

### Issue: Backend not running ❌
**Fix:**
```bash
pm2 list
pm2 restart festiq-backend

# Check logs
pm2 logs festiq-backend
```

### Issue: Hard refresh gives 404 ❌
**Fix:**
- Make sure `.htaccess` is in the same folder as `index.html`
- Check Apache config allows `.htaccess`:
```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```
Make sure: `AllowOverride All`

---

## Verification Commands 🧪

Run these to check your deployment:

```bash
# 1. Check PM2 status
pm2 list

# 2. Test backend locally
curl http://localhost:4000/api/health

# 3. Test API proxy
curl https://sumriktest.in/api/product/list

# 4. Test SPA routing
curl -I https://sumriktest.in/venues

# 5. Check Apache modules
apache2ctl -M | grep -E '(proxy|rewrite)'

# 6. Check backend logs
pm2 logs festiq-backend --lines 20

# 7. Check Apache logs (if issues)
sudo tail -f /var/log/apache2/error.log
```

---

## File Structure on Server 📁

```
/var/www/html/  (or public_html/)
├── index.html          ← Frontend entry point
├── .htaccess           ← MUST be here!
└── assets/
    ├── *.js
    ├── *.css
    └── images/

/home/username/backend/
├── server.js
├── package.json
├── .env               ← Rename .env.production to .env
├── configs/
├── controllers/
├── models/
├── routes/
└── public/
    └── uploads/
```

---

## Success Criteria ✅

Your deployment is successful when:

- [x] ✅ Frontend loads: `https://sumriktest.in`
- [x] ✅ API works: `https://sumriktest.in/api/product/list` returns data
- [x] ✅ Hard refresh works: `https://sumriktest.in/venues` → F5 → still works
- [x] ✅ Backend is running: `pm2 list` shows "online"
- [x] ✅ No 404 errors in browser console

---

## Need Help? 📚

Check these files:
- `DEPLOY_NOW.txt` - Quick deployment steps
- `DEPLOYMENT_FIX.md` - Detailed troubleshooting
- `TROUBLESHOOTING.md` - Common issues and solutions

---

## Quick Reference 📌

**Frontend URL:** `https://sumriktest.in`  
**Backend URL:** `http://localhost:4000` (proxied through Apache)  
**API Endpoints:** `https://sumriktest.in/api/*`

**Important Folders:**
- Frontend: `/var/www/html/`
- Backend: `/home/username/backend/`
- Logs: `pm2 logs festiq-backend`

**Restart Commands:**
```bash
pm2 restart festiq-backend
sudo systemctl restart apache2
```

---

🎉 **Once all checkboxes are checked, your deployment is complete!**
