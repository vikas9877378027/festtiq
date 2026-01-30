#!/bin/bash

echo "========================================"
echo "   Festiq Deployment Script"
echo "========================================"
echo ""

echo "[1/4] Building Frontend..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend build failed!"
    exit 1
fi
echo "✓ Frontend built successfully"
echo ""

echo "[2/4] Creating deployment package..."
cd ..
mkdir -p deploy/frontend
mkdir -p deploy/backend

echo "Copying frontend files..."
cp -r client/dist/* deploy/frontend/
echo "✓ Frontend files copied"

echo "Copying backend files..."
cp -r server/* deploy/backend/
echo "✓ Backend files copied"

echo "Copying configuration files..."
cp .htaccess deploy/
cp ecosystem.config.js deploy/
cp server/.env.production deploy/backend/.env
echo "✓ Configuration files copied"
echo ""

echo "[3/4] Creating deployment instructions..."
cat > deploy/DEPLOYMENT_INSTRUCTIONS.txt << EOF
========================================
  DEPLOYMENT INSTRUCTIONS
========================================

FILES READY FOR UPLOAD:

1. Upload 'deploy/frontend/*' to your public_html folder
2. Upload 'deploy/backend/*' to your server folder (e.g., /home/username/backend)
3. Upload 'deploy/.htaccess' to public_html
4. Upload 'deploy/ecosystem.config.js' to project root

AFTER UPLOADING, SSH into your server and run:

  cd /home/username/backend
  npm install
  cd ..
  pm2 restart ecosystem.config.js
  pm2 save

========================================
EOF

echo "[4/4] Deployment package ready!"
echo ""
echo "✓ All files are in the 'deploy' folder"
echo "✓ Read 'deploy/DEPLOYMENT_INSTRUCTIONS.txt' for next steps"
echo ""
echo "========================================"
echo "   NEXT STEPS:"
echo "========================================"
echo "1. Open FileZilla or use SCP/SFTP"
echo "2. Upload files from 'deploy' folder to your server"
echo "3. SSH into server and restart backend with PM2"
echo ""
