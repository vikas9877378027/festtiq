# Troubleshooting Guide - Festiq Deployment

## Issue 1: 404 Error on API Calls (`GET /venues 404`)

### Root Cause
The API calls are returning 404 because either:
1. The backend server is not running on port 4000
2. Apache mod_proxy is not enabled
3. The .htaccess proxy rules are not working

### Solution Steps

#### Step 1: Check if Backend is Running

SSH into your server and run:
```bash
pm2 list
```

If `festiq-backend` is not running or shows errors:
```bash
cd /path/to/your/backend
pm2 restart ecosystem.config.js
pm2 logs festiq-backend
```

#### Step 2: Verify Backend is Accessible

Test if the backend is responding:
```bash
curl http://localhost:4000/api/product/list
```

If you get a response, the backend is working. If not, check:
```bash
pm2 logs festiq-backend --lines 50
```

#### Step 3: Enable Apache Proxy Modules

Check if mod_proxy is enabled:
```bash
apache2ctl -M | grep proxy
# or
httpd -M | grep proxy
```

You should see:
- proxy_module
- proxy_http_module

If not enabled, run:
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

#### Step 4: Test .htaccess Rules

Make sure `.htaccess` is in your `public_html` folder (where index.html is).

Test by visiting:
```
https://sumriktest.in/api/product/list
```

It should return JSON data, not a 404.

---

## Issue 2: Hard Refresh / Direct URL Navigation Error

### Root Cause
When you refresh or directly navigate to a route like `/venues`, the server tries to find a file called `venues` instead of serving `index.html` for React Router to handle.

### Solution
The `.htaccess` file should already handle this (lines 15-19), but make sure:

1. `.htaccess` is in the **root of public_html** (same folder as index.html)
2. `AllowOverride All` is set in Apache config
3. `mod_rewrite` is enabled

---

## Quick Diagnostic Commands

Run these on your server:

```bash
# 1. Check if backend is running
pm2 list

# 2. Check backend logs
pm2 logs festiq-backend --lines 20

# 3. Check if backend responds locally
curl http://localhost:4000/api/product/list

# 4. Check Apache modules
apache2ctl -M | grep -E '(rewrite|proxy)'

# 5. Test .htaccess is working
curl -I https://sumriktest.in/venues
# Should return 200 and serve index.html, not 404
```

---

## Alternative Solution: Remove Proxy (If mod_proxy Not Available)

If your hosting doesn't support mod_proxy, you have two options:

### Option A: Use Subdomain for API
1. Create subdomain: `api.sumriktest.in`
2. Point it to your backend server
3. Update `.env.production`:
```env
VITE_API_BASE_URL=https://api.sumriktest.in
```
4. Rebuild frontend: `npm run build`
5. Redeploy

### Option B: Run Backend on Different Port with CORS
1. Remove proxy rules from `.htaccess`
2. Make sure backend has CORS enabled for your domain
3. Frontend will make direct calls to backend

---

## Testing After Fixes

1. **Test API**: Open browser console and run:
```javascript
fetch('https://sumriktest.in/api/product/list')
  .then(r => r.json())
  .then(console.log)
```

2. **Test Hard Refresh**: 
   - Navigate to: `https://sumriktest.in/venues`
   - Hit F5 (refresh)
   - Should load the page, not show 404

3. **Check Backend Logs**:
```bash
pm2 logs festiq-backend --lines 50
```

---

## Common Errors

### Error: `[proxy_http:error] [pid XXX] AH01114`
**Fix**: Backend is not running or not accessible
```bash
pm2 restart festiq-backend
```

### Error: `500 Internal Server Error`
**Fix**: Check if mod_proxy is enabled and .htaccess syntax is correct

### Error: `net::ERR_CONNECTION_REFUSED`
**Fix**: Backend is not running on port 4000
```bash
pm2 start ecosystem.config.js
```

---

## Need More Help?

Check these files:
1. Backend logs: `pm2 logs festiq-backend`
2. Apache error logs: `/var/log/apache2/error.log`
3. Apache access logs: `/var/log/apache2/access.log`
