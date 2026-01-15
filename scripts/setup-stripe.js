#!/usr/bin/env node

/**
 * 🚀 Script automatico per configurare Stripe
 * 
 * Crea automaticamente:
 * - Prodotto Pro (€19/mese)
 * - Prodotto Business (€49/mese)
 * - Aggiorna .env.local con i Price IDs
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://easycontracts.tech';

async function setupStripe() {
  console.log('🚀 Inizializzazione setup Stripe...\n');

  try {
    // 1. Crea prodotto PRO
    console.log('📦 Creazione prodotto PRO...');
    const proProdotto = await stripe.products.create({
      name: 'easycontracts Pro',
      description: '10 contratti/mese, tutti i template, export PDF professionale',
      metadata: {
        plan: 'pro',
        contracts_limit: '10',
      },
    });
    console.log(`✅ Prodotto PRO creato: ${proProdotto.id}`);

    // Crea prezzo PRO (€19/mese)
    const proPrice = await stripe.prices.create({
      product: proProdotto.id,
      unit_amount: 1900, // €19.00 in centesimi
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'pro',
      },
    });
    console.log(`✅ Prezzo PRO creato: ${proPrice.id} - €19/mese\n`);

    // 2. Crea prodotto BUSINESS
    console.log('📦 Creazione prodotto BUSINESS...');
    const businessProdotto = await stripe.products.create({
      name: 'easycontracts Business',
      description: 'Contratti illimitati, nessun watermark, team (5 membri), API access',
      metadata: {
        plan: 'business',
        contracts_limit: 'unlimited',
      },
    });
    console.log(`✅ Prodotto BUSINESS creato: ${businessProdotto.id}`);

    // Crea prezzo BUSINESS (€49/mese)
    const businessPrice = await stripe.prices.create({
      product: businessProdotto.id,
      unit_amount: 4900, // €49.00 in centesimi
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'business',
      },
    });
    console.log(`✅ Prezzo BUSINESS creato: ${businessPrice.id} - €49/mese\n`);

    // 3. Configura Customer Portal
    console.log('🔧 Configurazione Customer Portal...');
    // Nota: il portal va configurato manualmente nel dashboard Stripe
    console.log('⚠️  Ricorda di abilitare il Customer Portal nel dashboard Stripe:');
    console.log('    Settings → Billing → Customer Portal\n');

    // 4. Aggiorna .env.local
    console.log('📝 Aggiornamento .env.local...');
    const envPath = path.join(__dirname, '..', '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Rimuovi vecchie configurazioni se esistono
    envContent = envContent.replace(/NEXT_PUBLIC_STRIPE_PRICE_PRO=.*/g, '');
    envContent = envContent.replace(/NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=.*/g, '');
    envContent = envContent.replace(/STRIPE_PRODUCT_PRO=.*/g, '');
    envContent = envContent.replace(/STRIPE_PRODUCT_BUSINESS=.*/g, '');

    // Aggiungi nuove configurazioni
    envContent += `\n# Stripe Price IDs (generati automaticamente)\n`;
    envContent += `NEXT_PUBLIC_STRIPE_PRICE_PRO=${proPrice.id}\n`;
    envContent += `NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=${businessPrice.id}\n`;
    envContent += `STRIPE_PRODUCT_PRO=${proProdotto.id}\n`;
    envContent += `STRIPE_PRODUCT_BUSINESS=${businessProdotto.id}\n`;

    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log('✅ File .env.local aggiornato\n');

    // 5. Riepilogo
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 SETUP COMPLETATO CON SUCCESSO!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📋 Riepilogo Configurazione:\n');
    console.log(`🟢 Prodotto PRO:`);
    console.log(`   ID Prodotto: ${proProdotto.id}`);
    console.log(`   ID Prezzo:   ${proPrice.id}`);
    console.log(`   Costo:       €19/mese\n`);
    console.log(`🔵 Prodotto BUSINESS:`);
    console.log(`   ID Prodotto: ${businessProdotto.id}`);
    console.log(`   ID Prezzo:   ${businessPrice.id}`);
    console.log(`   Costo:       €49/mese\n`);
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('🔗 Link Utili:\n');
    console.log(`   Dashboard Stripe: https://dashboard.stripe.com/products`);
    console.log(`   Customer Portal:  https://dashboard.stripe.com/settings/billing/portal\n`);
    console.log('🚀 Prossimi Step:\n');
    console.log('   1. Riavvia il server Next.js (npm run dev)');
    console.log('   2. Testa il checkout su http://localhost:3000');
    console.log('   3. Usa carta test: 4242 4242 4242 4242\n');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Errore durante il setup:', error.message);
    if (error.type) {
      console.error(`   Tipo errore: ${error.type}`);
    }
    process.exit(1);
  }
}

// Verifica che la chiave API sia presente
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ ERRORE: STRIPE_SECRET_KEY non trovata!');
  console.error('   Esegui: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe.js');
  process.exit(1);
}

setupStripe();

