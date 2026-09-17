# Demon Top Up Haiti — corrected deploy package

This package keeps the existing Demon Top Up Haiti design and fixes the deployment structure:
- `index.html`, `style.css`, and `script.js` stay at the repository root.
- `server.js` serves the root files directly.
- The cart now creates an order through `/api/orders` and then requests a hosted payment checkout.
- `render.yaml` uses `npm install` and `npm start`.

## Render
Build Command: `npm install`
Start Command: `npm start`

## Payment
Real NatCash/MonCash/Visa checkout still requires the corresponding merchant/provider credentials in Render Environment Variables. No secret keys are included in this package.

Required when activating payments:
- `KOBARA_KEY` for the configured Kobara checkout
- `PUBLIC_URL` = your HTTPS Render URL
- `ADMIN_TOKEN` for admin API access
- `VISA_CHECKOUT_URL` if Visa checkout is configured through a PSP

Do not put secret keys in `index.html` or `script.js`.
