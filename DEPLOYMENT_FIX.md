# 🔧 Festiq Deployment Error Fix

## Your Errors:

1. **`GET https://sumriktest.in/venues 404 (Not Found)`** ❌
2. **Hard refresh causes page error** ❌

---

## ✅ Solutions Implemented

I've made the following changes to fix both issues:

### 1. Fixed `.htaccess` File
- ✅ Added proper proxy configuration for mod_proxy
- ✅ Improved SPA routing for hard refresh
- ✅ Added fallback instructions if mod_proxy is not available

### 2. Fixed `server.js`
- ✅ Added production CORS configuration for `sumriktest.in`
- ✅ Added `/api/health` endpoint to check if backend is running
- ✅ Improved root endpoint with better status information

### 3. Created Verification Script
- ✅ `verify-deployment.sh` - Run this on your server to diagnose issues

---

## 🚀 What You Need to Do Now

### Step 1: SSH into Your Server

```bash
ssh username@sumriktest.in
```

### Step 2: Check if Backend is Running

```bash
pm2 list
```

**Expected output:** You should see `festiq-backend` with status `online`

**If NOT running:**
```bash
cd /path/to/your/backend
pm2 start ecosystem.config.js
pm2 save
```

### Step 3: Test Backend Locally

```bash
curl http://localhost:4000/api/health
```

**Expected output:**
```json
{"status":"healthy","uptime":123.45,"timestamp":"2026-01-30T..."}
```

**If it fails:** Backend is not running. Check logs:
```bash
pm2 logs festiq-backend
```

### Step 4: Enable Apache Proxy Modules

This is THE MOST IMPORTANT step! Without this, API calls will fail.

```bash
# Check if modules are enabled
apache2ctl -M | grep proxy

# If not listed, enable them:
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers

# Restart Apache
sudo systemctl restart apache2
```

### Step 5: Verify .htaccess Location

Make sure `.htaccess` is in the **root of your public_html** (same folder as `index.html`)

```bash
ls -la /var/www/html/.htaccess
# or
ls -la /home/username/public_html/.htaccess
```

### Step 6: Test API Proxy

```bash
curl https://sumriktest.in/api/health
```

**Expected:** Should return JSON with `{"status":"healthy"}`

**If 404:** Apache proxy is not working. Check:
1. Is `.htaccess` in the correct location?
2. Are proxy modules enabled? (Step 4)
3. Check Apache error logs: `sudo tail -f /var/log/apache2/error.log`

### Step 7: Deploy Updated Files

```bash
# On your LOCAL machine:
cd c:\Users\Lenovo\Downloads\Festiq-17nov

# Run deployment script
./deploy.sh  # or: bash deploy.sh

# Upload the files from 'deploy' folder:
# - deploy/frontend/* → /var/www/html/ (or public_html)
# - deploy/backend/* → /home/username/backend/
# - deploy/.htaccess → /var/www/html/.htaccess

# Then on SERVER, restart backend:
cd /home/username/backend
npm install
pm2 restart festiq-backend
```

---

## 🧪 Verification Tests

### Test 1: Backend Health
```bash
curl http://localhost:4000/api/health
```
✅ Should return: `{"status":"healthy",...}`

### Test 2: Backend API
```bash
curl http://localhost:4000/api/product/list
```
✅ Should return: `{"success":true,"products":[...]}`

### Test 3: Frontend Access
```bash
curl https://sumriktest.in
```
✅ Should return: HTML with React app

### Test 4: API Proxy (THIS IS THE MAIN FIX)
```bash
curl https://sumriktest.in/api/product/list
```
✅ Should return: `{"success":true,"products":[...]}`  
❌ If 404: Proxy is not working - see "Troubleshooting" below

### Test 5: SPA Routing (Hard Refresh Fix)
```bash
curl https://sumriktest.in/venues
```
✅ Should return: HTML (same as index.html)  
❌ If 404: .htaccess rewrite rules not working

---

## 🔍 Troubleshooting

### Issue: API Still Returns 404

**Cause:** Apache mod_proxy is not enabled or not working

**Fix Options:**

#### Option A: Enable mod_proxy (Recommended)
```bash
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2
```

#### Option B: Use API Subdomain (If mod_proxy not available)

1. Create subdomain `api.sumriktest.in` pointing to your server
2. Configure Apache virtual host:
```apache
<VirtualHost *:443>
    ServerName api.sumriktest.in
    
    ProxyPass / http://localhost:4000/
    ProxyPassReverse / http://localhost:4000/
</VirtualHost>
```

3. Update `client/.env.production`:
```env
VITE_API_BASE_URL=https://api.sumriktest.in
```

4. Rebuild and redeploy frontend:
```bash
cd client
npm run build
# Upload dist/* to public_html
```

#### Option C: Direct Backend URL (Not Recommended)

If all else fails, you can expose the backend directly on a different port:

1. Configure firewall to allow port 4000
2. Update `.env.production`:
```env
VITE_API_BASE_URL=https://sumriktest.in:4000
```
3. Rebuild frontend

---

### Issue: Hard Refresh Still Fails

**Cause:** .htaccess not working or not in correct location

**Fix:**
1. Verify `.htaccess` is in document root:
```bash
cd /var/www/html  # or /home/username/public_html
cat .htaccess
```

2. Check Apache config allows .htaccess:
```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```

Make sure you have:
```apache
<Directory /var/www/html>
    Options Indexes FollowSymLinks
    AllowOverride All    # ← This must be "All"
    Require all granted
</Directory>
```

3. Restart Apache:
```bash
sudo systemctl restart apache2
```

---

## 📊 PM2 Commands Reference

```bash
# List all processes
pm2 list

# View logs
pm2 logs festiq-backend

# Restart backend
pm2 restart festiq-backend

# Stop backend
pm2 stop festiq-backend

# Start backend
pm2 start ecosystem.config.js

# Save PM2 config (auto-start on reboot)
pm2 save
pm2 startup
```

---

## 🎯 Quick Success Check

After deploying, open your browser and:

1. Go to: `https://sumriktest.in`  
   ✅ Should load the app

2. Open DevTools Console (F12) and run:
```javascript
fetch('https://sumriktest.in/api/product/list')
  .then(r => r.json())
  .then(console.log)
```
   ✅ Should show: `{success: true, products: Array(...)}`  
   ❌ If 404: Backend proxy not working

3. Navigate to: `https://sumriktest.in/venues`  
   ✅ Should load venues page

4. Press F5 (hard refresh)  
   ✅ Should still show venues page  
   ❌ If 404: SPA routing not working

---

## 📧 Need More Help?

Run the verification script on your server:
```bash
cd /path/to/project
chmod +x verify-deployment.sh
./verify-deployment.sh
```

This will test all aspects of your deployment and show exactly what's wrong.

---

## ✨ Summary

**Main Issue:** Apache mod_proxy not enabled/configured  
**Main Fix:** Enable mod_proxy and restart Apache  
**Secondary Issue:** .htaccess not handling SPA routes  
**Secondary Fix:** Ensure .htaccess is in document root with AllowOverride All  

After following these steps, both errors should be resolved! 🎉
