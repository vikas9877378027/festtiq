#!/bin/bash

echo "========================================"
echo "   Festiq Deployment Verification"
echo "========================================"
echo ""

DOMAIN="https://sumriktest.in"
BACKEND_URL="http://localhost:4000"

echo "Testing Backend Server..."
echo "------------------------"

# Test 1: Check if backend is running locally
echo -n "1. Backend Health Check: "
HEALTH_CHECK=$(curl -s "$BACKEND_URL/api/health" 2>&1)
if echo "$HEALTH_CHECK" | grep -q "healthy"; then
    echo "✓ PASS - Backend is running"
    echo "   Response: $HEALTH_CHECK"
else
    echo "✗ FAIL - Backend is not responding"
    echo "   Error: $HEALTH_CHECK"
    echo ""
    echo "   Fix: Run 'pm2 restart festiq-backend' or 'pm2 start ecosystem.config.js'"
fi
echo ""

# Test 2: Check API endpoint
echo -n "2. Backend API Test: "
API_TEST=$(curl -s "$BACKEND_URL/api/product/list" 2>&1)
if echo "$API_TEST" | grep -q "success"; then
    echo "✓ PASS - API is responding"
else
    echo "✗ FAIL - API endpoint not working"
    echo "   Response: $API_TEST"
fi
echo ""

echo "Testing Frontend..."
echo "------------------------"

# Test 3: Check if frontend is accessible
echo -n "3. Frontend Access: "
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN" 2>&1)
if [ "$FRONTEND_TEST" = "200" ]; then
    echo "✓ PASS - Frontend is accessible"
else
    echo "✗ FAIL - Frontend returned status: $FRONTEND_TEST"
fi
echo ""

# Test 4: Check API proxy
echo -n "4. API Proxy Test: "
PROXY_TEST=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/product/list" 2>&1)
if [ "$PROXY_TEST" = "200" ]; then
    echo "✓ PASS - API proxy is working"
else
    echo "✗ FAIL - API proxy returned status: $PROXY_TEST"
    echo ""
    echo "   This is the main issue! API calls are failing."
    echo "   Possible fixes:"
    echo "   a) Check if mod_proxy is enabled: apache2ctl -M | grep proxy"
    echo "   b) Enable it: sudo a2enmod proxy && sudo a2enmod proxy_http"
    echo "   c) Restart Apache: sudo systemctl restart apache2"
    echo "   d) Check .htaccess is in public_html folder"
fi
echo ""

# Test 5: Check SPA routing
echo -n "5. SPA Routing Test: "
SPA_TEST=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/venues" 2>&1)
if [ "$SPA_TEST" = "200" ]; then
    echo "✓ PASS - SPA routing works (hard refresh will work)"
else
    echo "✗ FAIL - SPA routing returned status: $SPA_TEST"
    echo ""
    echo "   Fix: Ensure .htaccess has rewrite rules for React Router"
fi
echo ""

echo "Testing PM2..."
echo "------------------------"
pm2 list | grep festiq-backend
if [ $? -eq 0 ]; then
    echo "✓ PM2 process found"
    echo ""
    echo "Recent logs:"
    pm2 logs festiq-backend --lines 5 --nostream
else
    echo "✗ PM2 process not found"
    echo "   Fix: Run 'pm2 start ecosystem.config.js'"
fi
echo ""

echo "========================================"
echo "   Apache Module Check"
echo "========================================"
echo ""
echo "Required modules:"
apache2ctl -M 2>/dev/null | grep -E 'rewrite|proxy|headers' || httpd -M 2>/dev/null | grep -E 'rewrite|proxy|headers'
echo ""

echo "========================================"
echo "   Summary"
echo "========================================"
echo ""
echo "If all tests pass, your deployment is working correctly!"
echo "If any tests fail, follow the fix suggestions above."
echo ""
echo "Common issues:"
echo "1. Backend not running → pm2 restart festiq-backend"
echo "2. API proxy failing → Enable mod_proxy in Apache"
echo "3. SPA routing failing → Check .htaccess rewrite rules"
echo ""
