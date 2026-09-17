DEMON TOP UP HAITI — RENDER DEPLOY

Build Command: npm install
Start Command: npm start
Health Check: /api/health

Required environment variables in Render:
- ADMIN_TOKEN
- PUBLIC_URL
- KOBARA_KEY (only when Kobara payments are enabled)
- VISA_CHECKOUT_URL (only when Visa PSP is enabled)

The Express 5 catch-all route has been corrected for Express 5 path syntax.
