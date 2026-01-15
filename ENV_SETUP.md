# Configurazione Ambiente - easycontracts

## Variabili Necessarie (.env.local)

Crea un file `.env.local` nella root del progetto con queste variabili:

### DATABASE
```
DATABASE_URL="postgresql://user:password@host:5432/database"
```
Crea un database gratuito su [neon.tech](https://neon.tech) o [railway.app](https://railway.app)

### NEXTAUTH
```
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### GOOGLE OAUTH (Login con Google)
```
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
```
Ottieni da: [console.cloud.google.com](https://console.cloud.google.com)

### STRIPE (Pagamenti)
```
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_STRIPE_PRICE_PRO="price_xxx"
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS="price_xxx"
```
Ottieni da: [dashboard.stripe.com](https://dashboard.stripe.com/apikeys)

**Creare i prodotti Stripe:**
1. Vai su Products → Add Product
2. Crea "PRO" a €19/mese (recurring)
3. Crea "Business" a €49/mese (recurring)
4. Copia i Price IDs

### PERPLEXITY AI (Generazione Contratti)
```
PERPLEXITY_API_KEY="pplx-xxx"
```
Ottieni da: [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)

### APP URL
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
In produzione metti il tuo dominio.

---

## Webhook Stripe (Produzione)

1. Vai su [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://tuodominio.com/api/webhooks/stripe`
3. Eventi da ascoltare:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
4. Copia il Signing secret in `STRIPE_WEBHOOK_SECRET`
