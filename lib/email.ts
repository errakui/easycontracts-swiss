// Sistema Email con Resend
// Per attivare: crea account su https://resend.com e aggiungi RESEND_API_KEY su Vercel

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "noreply@easycontracts.tech";
const SUPPORT_EMAIL = "support@easycontracts.tech";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log("📧 Email non inviata (RESEND_API_KEY non configurata):", { to, subject });
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Errore invio email:", error);
      return false;
    }

    console.log(`✅ Email inviata a ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error("Errore invio email:", error);
    return false;
  }
}

// Template: Benvenuto dopo registrazione
export function getWelcomeEmail(name: string, plan: string): { subject: string; html: string } {
  return {
    subject: `Benvenuto su easycontracts! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Benvenuto su easycontracts!</h1>
          </div>
          <div class="content">
            <p>Ciao <strong>${name}</strong>,</p>
            <p>Grazie per esserti registrato su easycontracts! Il tuo account è attivo con il piano <strong>${plan}</strong>.</p>
            <p>Ora puoi:</p>
            <ul>
              <li>Generare contratti legali in 30 secondi</li>
              <li>Scaricare PDF professionali</li>
              <li>Gestire tutti i tuoi contratti dalla dashboard</li>
            </ul>
            <p style="text-align: center;">
              <a href="https://www.easycontracts.tech/generate" class="button">Genera il tuo primo contratto →</a>
            </p>
            <p>Se hai domande, rispondi a questa email o contattaci a ${SUPPORT_EMAIL}</p>
            <p>A presto,<br>Il team di easycontracts</p>
          </div>
          <div class="footer">
            <p>© 2026 easycontracts. Tutti i diritti riservati.</p>
            <p>
              <a href="https://www.easycontracts.tech/privacy">Privacy</a> | 
              <a href="https://www.easycontracts.tech/terms">Termini</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

// Template: Conferma pagamento
export function getPaymentConfirmEmail(name: string, plan: string, amount: string): { subject: string; html: string } {
  return {
    subject: `Pagamento confermato - Piano ${plan} 💳`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Pagamento Confermato</h1>
          </div>
          <div class="content">
            <p>Ciao <strong>${name}</strong>,</p>
            <p>Il tuo pagamento è stato elaborato con successo!</p>
            <div class="receipt">
              <h3 style="margin-top: 0;">Riepilogo</h3>
              <p><strong>Piano:</strong> ${plan}</p>
              <p><strong>Importo:</strong> ${amount}</p>
              <p><strong>Data:</strong> ${new Date().toLocaleDateString("it-IT")}</p>
            </div>
            <p>Ora hai accesso completo a tutte le funzionalità del piano ${plan}.</p>
            <p style="text-align: center;">
              <a href="https://www.easycontracts.tech/dashboard" class="button">Vai alla Dashboard →</a>
            </p>
            <p>Grazie per la fiducia!</p>
          </div>
          <div class="footer">
            <p>© 2026 easycontracts. Tutti i diritti riservati.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

// Template: Contratto generato
export function getContractGeneratedEmail(name: string, contractType: string): { subject: string; html: string } {
  return {
    subject: `Contratto "${contractType}" generato con successo 📄`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Contratto Generato</h1>
          </div>
          <div class="content">
            <p>Ciao <strong>${name}</strong>,</p>
            <p>Il tuo contratto "<strong>${contractType}</strong>" è stato generato con successo!</p>
            <p>Puoi scaricarlo e visualizzarlo dalla tua dashboard.</p>
            <p style="text-align: center;">
              <a href="https://www.easycontracts.tech/dashboard" class="button">Visualizza Contratto →</a>
            </p>
            <p><strong>Nota:</strong> Ti consigliamo sempre di far verificare i contratti da un professionista prima della firma.</p>
          </div>
          <div class="footer">
            <p>© 2026 easycontracts. Tutti i diritti riservati.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

