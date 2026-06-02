import { useState, useEffect } from 'react';
import { auth } from './firebase';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      setChecking(true);
      const user = auth.currentUser;
      if (!user) {
        setIsPremium(false);
        return;
      }
      const response = await fetch(
        `/.netlify/functions/check-premium?userId=${user.uid}`
      );
      const data = await response.json();
      setIsPremium(data.isPremium || false);
    } catch (error) {
      console.error('Error checking premium:', error);
      setIsPremium(false);
    } finally {
      setChecking(false);
    }
  };

 const createCheckoutSession = async (priceId) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        alert('Du måste vara inloggad för att uppgradera');
        return;
      }
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.uid,
          email: user.email || '',
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Något gick fel. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return {
    isPremium,
    loading,
    checking,
    createCheckoutSession,
    refreshPremiumStatus: checkPremiumStatus,
  };
};
