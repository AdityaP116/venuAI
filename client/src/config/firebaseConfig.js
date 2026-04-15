// ============================================================
// FIREBASE CONFIGURATION
// 1. Go to https://console.firebase.google.com
// 2. Create a project (or use existing)
// 3. Go to Project Settings → Your apps → Web app
// 4. Copy the firebaseConfig object below
// 5. In Authentication → Sign-in method → Enable "Google"
// 6. Add your domain (localhost) to Authorized domains
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Sign in with Google redirect
export const signInWithGoogle = () => signInWithRedirect(auth, googleProvider);

// Sign out
export const signOut = () => firebaseSignOut(auth);

export default app;
