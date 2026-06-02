const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

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

const PREMIUM_PRICE_ID = process.env.VITE_STRIPE_PRICE_ID_PREMIUM;

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: JSON.stringify({ error: `Webhook Error: ${err.message}` }) };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription;

        // Hämta subscription för att se vilket price_id
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        const isPremium = priceId === PREMIUM_PRICE_ID;
        const plan = isPremium ? 'premium' : 'bas';

        console.log(`✅ Checkout completed for user: ${userId}, plan: ${plan}`);

        await db.collection('users').doc(userId).set({
          isPremium: isPremium,
          plan: plan,
          subscriptionId: subscriptionId,
          customerId: session.customer,
          premiumActivatedAt: admin.firestore.FieldValue.se
