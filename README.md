# Demon Top Up Haiti — V1.2 Payment-ready

## Payment architecture
- NatCash: hosted checkout through Kobara when your merchant account/API key is active.
- MonCash: hosted checkout through Kobara when active.
- Visa: adapter for a card-acquirer/PSP hosted checkout. Visa is the card network, not a standalone merchant checkout account.

Kobara documents an API endpoint for creating payments and hosted checkout, with `natcash`, `moncash`, and card-related providers depending on what is activated on the merchant account. The integration keeps secret keys on the server.

## To activate
1. Create/verify your merchant account with the selected provider.
2. Put the live API key in `.env` as `KOBARA_KEY` (never in frontend).
3. Set `PUBLIC_URL` to the HTTPS domain.
4. Configure the provider webhook to `/api/webhooks/kobara`.
5. For Visa, obtain a card-acquiring/PSP setup and put its hosted checkout URL in `VISA_CHECKOUT_URL`.
6. Test with sandbox before live.
7. Only mark an order `paid` after a verified provider webhook.

## Run
`npm install`
`npm start`
