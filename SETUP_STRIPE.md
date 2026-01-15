# 🔧 Setup Stripe per easycontracts

Guida completa per configurare Stripe e far funzionare i pagamenti.

## 1. Crea Account Stripe

1. Vai su [stripe.com](https://stripe.com) e crea un account
2. Completa la verifica dell'account (puoi usare la modalità test nel frattempo)

## 2. Ottieni le API Keys

1. Vai su [Stripe Dashboard > Developers > API keys](https://dashboard.stripe.com/apikeys)
2. Copia le chiavi:
   - **Publishable key** (inizia con `pk_test_` o `pk_live_`)
   - **Secret key** (inizia con `sk_test_` o `sk_live_`)

## 3. Crea i Prodotti

1. Vai su [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Clicca **Add product**

### Prodotto 1: Pro
- **Name**: Pro
- **Pricing**: €19.00 EUR
- **Billing period**: Monthly (recurring)
- Dopo aver creato, copia il **Price ID** (inizia con `price_`)

### Prodotto 2: Business
- **Name**: Business
- **Pricing**: €49.00 EUR
- **Billing period**: Monthly (recurring)
- Dopo aver creato, copia il **Price ID** (inizia con `price_`)

## 4. Configura il Webhook

### Produzione

1. Vai su [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Clicca **Add endpoint**
3. **Endpoint URL**: `https://tuo-dominio.com/api/webhook`
4. Seleziona questi eventi:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Clicca **Add endpoint**
6. Copia il **Signing secret** (inizia con `whsec_`)

### Sviluppo Locale (con Stripe CLI)

```bash
# Installa Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhook al tuo localhost
stripe listen --forward-to localhost:3000/api/webhook

# Copia il whsec_ che viene mostrato e usalo come STRIPE_WEBHOOK_SECRET
```

## 5. Configura le Variabili d'Ambiente

Crea/modifica il file `.env.local` nella root del progetto:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (copiati dal passo 3)
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Testa il Checkout

1. Avvia l'app: `npm run dev`
2. Vai alla homepage
3. Clicca su un piano a pagamento
4. Usa queste carte di test:
   - ✅ **Successo**: `4242 4242 4242 4242`
   - ❌ **Rifiutata**: `4000 0000 0000 0002`
   - ⚠️ **Richiede autenticazione**: `4000 0025 0000 3155`

## 7. Verifica che Funzioni

Dopo un pagamento di test, dovresti vedere:
1. ✅ La sessione di checkout completata su Stripe Dashboard
2. ✅ L'utente creato/aggiornato nel database con piano PRO/BUSINESS
3. ✅ La subscription creata nel database
4. ✅ Redirect automatico alla dashboard

## Troubleshooting

### "Stripe non configurato"
- Controlla che `STRIPE_SECRET_KEY` sia impostato correttamente

### "Price ID mancante"
- Controlla che `NEXT_PUBLIC_STRIPE_PRICE_PRO` e `NEXT_PUBLIC_STRIPE_PRICE_BUSINESS` siano impostati

### "Webhook non ricevuto"
- Verifica che `STRIPE_WEBHOOK_SECRET` sia corretto
- In locale, assicurati che `stripe listen` sia attivo

### "Errore nel checkout"
- Controlla i log del server per errori dettagliati
- Verifica che tutti i Price IDs siano validi e attivi

## Note sulla Produzione

Quando vai in produzione:
1. Cambia le chiavi da `test` a `live`
2. Crea i prodotti nella modalità live
3. Aggiorna i Price IDs
4. Configura il webhook con l'URL di produzione
5. Verifica il dominio su Stripe per il checkout personalizzato

