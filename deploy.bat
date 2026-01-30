@echo off
echo ========================================
echo   Festiq Deployment Script
echo ========================================
echo.

echo [1/4] Building Frontend...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo ✓ Frontend built successfully
echo.

echo [2/4] Creating deployment package...
cd ..
if not exist "deploy" mkdir deploy
if not exist "deploy\frontend" mkdir deploy\frontend
if not exist "deploy\backend" mkdir deploy\backend

echo Copying frontend files...
xcopy /E /I /Y client\dist\* deploy\frontend\
echo ✓ Frontend files copied

echo Copying backend files...
xcopy /E /I /Y server\* deploy\backend\
echo ✓ Backend files copied

echo Copying configuration files...
copy /Y .htaccess deploy\
copy /Y ecosystem.config.js deploy\
copy /Y server\.env.production deploy\backend\.env
echo ✓ Configuration files copied
echo.

echo [3/4] Creating deployment instructions...
(
echo ========================================
echo   DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.
echo FILES READY FOR UPLOAD:
echo.
echo 1. Upload 'deploy/frontend/*' to your public_html folder
echo 2. Upload 'deploy/backend/*' to your server folder (e.g., /home/username/backend)
echo 3. Upload 'deploy/.htaccess' to public_html
echo 4. Upload 'deploy/ecosystem.config.js' to project root
echo.
echo AFTER UPLOADING, SSH into your server and run:
echo.
echo   cd /home/username/backend
echo   npm install
echo   cd ..
echo   pm2 restart ecosystem.config.js
echo   pm2 save
echo.
echo ========================================
) > deploy\DEPLOYMENT_INSTRUCTIONS.txt

echo [4/4] Deployment package ready!
echo.
echo ✓ All files are in the 'deploy' folder
echo ✓ Read 'deploy/DEPLOYMENT_INSTRUCTIONS.txt' for next steps
echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo 1. Open FileZilla or Hostinger File Manager
echo 2. Upload files from 'deploy' folder to your server
echo 3. SSH into server and restart backend with PM2
echo.
pause
