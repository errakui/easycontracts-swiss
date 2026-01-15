#!/usr/bin/env node

/**
 * 🧪 Script per testare la configurazione Stripe
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripe() {
  console.log('🧪 Test configurazione Stripe...\n');

  try {
    // 1. Test connessione
    console.log('1️⃣ Test connessione API...');
    const balance = await stripe.balance.retrieve();
    console.log(`✅ Connessione OK - Valuta: ${balance.available[0]?.currency || 'EUR'}\n`);

    // 2. Lista prodotti
    console.log('2️⃣ Recupero prodotti esistenti...');
    const products = await stripe.products.list({ limit: 10 });
    console.log(`✅ Trovati ${products.data.length} prodotti:\n`);
    
    for (const product of products.data) {
      console.log(`   📦 ${product.name}`);
      console.log(`      ID: ${product.id}`);
      console.log(`      Descrizione: ${product.description || 'N/A'}`);
      
      // Recupera prezzi associati
      const prices = await stripe.prices.list({ product: product.id });
      for (const price of prices.data) {
        const amount = price.unit_amount / 100;
        const currency = price.currency.toUpperCase();
        const interval = price.recurring?.interval || 'one-time';
        console.log(`      💰 ${currency} ${amount}/${interval} - ID: ${price.id}`);
      }
      console.log('');
    }

    // 3. Verifica configurazione nel .env.local
    console.log('3️⃣ Verifica variabili d\'ambiente...');
    const priceProId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO;
    const priceBusinessId = process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS;

    if (priceProId) {
      console.log(`✅ NEXT_PUBLIC_STRIPE_PRICE_PRO: ${priceProId}`);
      const price = await stripe.prices.retrieve(priceProId);
      console.log(`   Valido - €${price.unit_amount / 100}/${price.recurring?.interval}`);
    } else {
      console.log('⚠️  NEXT_PUBLIC_STRIPE_PRICE_PRO non configurato');
    }

    if (priceBusinessId) {
      console.log(`✅ NEXT_PUBLIC_STRIPE_PRICE_BUSINESS: ${priceBusinessId}`);
      const price = await stripe.prices.retrieve(priceBusinessId);
      console.log(`   Valido - €${price.unit_amount / 100}/${price.recurring?.interval}`);
    } else {
      console.log('⚠️  NEXT_PUBLIC_STRIPE_PRICE_BUSINESS non configurato');
    }

    console.log('\n✅ Tutti i test completati con successo!\n');

  } catch (error) {
    console.error('❌ Errore durante i test:', error.message);
    process.exit(1);
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ ERRORE: STRIPE_SECRET_KEY non trovata!');
  process.exit(1);
}

testStripe();

