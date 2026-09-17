# Demon Top Up Haiti — V2

Refonte responsive inspirée des maquettes fournies.

## Inclus
- Dark/red Demon UI desktop + mobile
- Jeux: Free Fire, PUBG Mobile, Blood Strike, Mobile Legends, COD Mobile, Roblox
- Abonnements: Netflix, Disney+, Spotify, YouTube Premium
- Panier persistant via localStorage
- Checkout avec client/téléphone/ID de jeu
- Méthodes: NatCash, MonCash, Visa
- Création de commande via API
- Hosted checkout: Kobara pour NatCash/MonCash lorsqu'il est activé
- Adaptateur Visa via `VISA_CHECKOUT_URL`
- Admin orders protégé par `ADMIN_TOKEN`
- Multi-langue: HT / FR / EN / ES

## Lancer
```bash
npm install
npm start
```

## Variables `.env`
```env
PORT=3000
PUBLIC_URL=https://votre-domaine.com
ADMIN_TOKEN=change-me
KOBARA_KEY=...
VISA_CHECKOUT_URL=https://...
```

Important: ne mets jamais les clés secrètes dans le frontend. Avant le live, configure et teste les webhooks du prestataire et vérifie le contrat de signature webhook fourni par le prestataire.
