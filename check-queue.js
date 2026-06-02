const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

exports.handler = async () => {
  const now = Date.now();
  const hours48 = 48 * 60 * 60 * 1000;
  const hours94 = 94 * 60 * 60 * 1000;

  try {
    // Hämta alla chattar som väntar
    const chatsSnap = await db.collection('chats')
      .where('queueStatus', '==', 'waiting')
      .where('therapistReplied', '==', false)
      .get();

    for (const chatDoc of chatsSnap.docs) {
      const chat = chatDoc.data();
      const firstMessageAt = chat.firstMessageAt?.toMillis();
      if (!firstMessageAt) continue;

      const waitTime = now - firstMessageAt;
      const userId = chat.userId;

      // Hämta användardata
      const userDoc = await db.collection('users').doc(userId).get();
      const user = userDoc.data();
      if (!user) continue;

      // 94h — full återbetalning
      if (waitTime >= hours94 && !chat.refundSent) {
        try {
          // Hämta senaste faktura från Stripe
          const invoices = await stripe.invoices.list({
            customer: user.customerId,
            limit: 1
          });

          if (invoices.data.length > 0) {
            const invoice = invoices.data[0];
            await stripe.refunds.create({
              payment_intent: invoice.payment_intent,
            });
          }

          // Markera i Firebase
          await db.collection('chats').doc(chatDoc.id).update({
            refundSent: true,
            refundSentAt: admin.firestore.FieldValue.serverTimestamp(),
            queueStatus: 'refunded'
          });

          // Skicka mail till användaren
          await db.collection('mail').add({
            to: chat.userEmail,
            message: {
              subject: 'Återbetalning från Trygga Kvinnor',
              text: 'Vi beklagar att du inte fått svar inom 94 timmar. Din betalning har återbetalats fullt ut. Vi hoppas att du ger oss en ny chans.',
              html: '<p>Vi beklagar att du inte fått svar inom 94 timmar. Din betalning har återbetalats fullt ut.</p><p>Vi hoppas att du ger oss en ny chans.</p><p>Med kärlek,<br/>Trygga Kvinnor</p>'
            }
          });

          console.log('Återbetalning skickad till:', chat.userEmail);

        } catch (err) {
          console.error('Återbetalningsfel:', err);
        }

      // 48h — 50% rabattkod
      } else if (waitTime >= hours48 && !chat.discountSent) {
        await db.collection('chats').doc(chatDoc.id).update({
          discountSent: true,
          discountSentAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Skicka mail med rabattkod
        await db.collection('mail').add({
          to: chat.userEmail,
          message: {
            subject: 'Vi beklagar dröjsmålet — här är 50% rabatt',
            text: 'Vi beklagar att du fått vänta längre än 48 timmar. Som kompensation får du 50% rabatt på nästa månad med koden: TRYGG50',
            html: '<p>Vi beklagar att du fått vänta längre än 48 timmar.</p><p>Som kompensation får du <strong>50% rabatt</strong> på nästa månad.</p><p>Använd koden: <strong style="font-size:1.2rem">TRYGG50</strong></p><p>Med kärlek,<br/>Trygga Kvinnor</p>'
          }
        });

        console.log('Rabattkod skickad till:', chat.userEmail);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('Queue check error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
