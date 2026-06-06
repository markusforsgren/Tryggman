import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Registrera ny användare
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Uppdatera display name
      await updateProfile(userCredential.user, { displayName });
      
      // Skapa user document i Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        isPremium: false,
        createdAt: new Date(),
        subscriptionStatus: 'none'
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Logga in
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Logga ut
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Återställ lösenord
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Uppdatera profil
  const updateUserProfile = async (updates) => {
    try {
      if (updates.displayName) {
        await updateProfile(auth.currentUser, { displayName: updates.displayName });
      }
      
      // Uppdatera i Firestore
      await setDoc(doc(db, 'users', auth.currentUser.uid), updates, { merge: true });
      
      setCurrentUser({ ...currentUser, ...updates });
    } catch (error) {
      throw error;
    }
  };

  // Hämta Premium-status från Firestore
  const checkPremiumStatus = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsPremium(userData.isPremium || false);
        return userData.isPremium || false;
      }
      return false;
    } catch (error) {
      console.error('Error checking premium:', error);
      return false;
    }
  };

  // Lyssna på auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Hämta user data från Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ 
            ...user, 
            displayName: user.displayName || userData.displayName,
            isPremium: userData.isPremium || false 
          });
          setIsPremium(userData.isPremium || false);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setIsPremium(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isPremium,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    checkPremiumStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
