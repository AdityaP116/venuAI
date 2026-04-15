import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOut as fbSignOut } from '../config/firebaseConfig';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);   // Supabase user row
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthError(null);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const intendedRole = localStorage.getItem('sentra_intended_role') || 'resident';
        localStorage.removeItem('sentra_intended_role');
        await loadProfile(fbUser, intendedRole);
      } else {
        setFirebaseUser(null);
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch user profile + role from Backend API (Syncs / registers user)
  const loadProfile = async (fbUser, intendedRole = 'resident') => {
    setLoading(true);
    try {
      const token = await fbUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          photoURL: fbUser.photoURL || null,
          displayName: fbUser.displayName || null,
          intendedRole,
        })
      });
      const data = await response.json();
      if (!response.ok || !data.user) {
        setProfile(null);
        setAuthError(data.error || 'no_user_record');
      } else {
        setProfile(data.user);
      }
    } catch (e) {
      setProfile(null);
      setAuthError('fetch_error');
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in — intendedRole tells backend which role to assign new users
  const loginWithGoogle = async (intendedRole = 'resident') => {
    setAuthError(null);
    setLoading(true);
    try {
      localStorage.setItem('sentra_intended_role', intendedRole);
      await signInWithGoogle();
      // Browser will redirect immediately after this call
    } catch (err) {
      setAuthError('google_sign_in_failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await fbSignOut();
    setFirebaseUser(null);
    setProfile(null);
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (firebaseUser) {
      await loadProfile(firebaseUser, profile?.role || 'resident');
    }
  };

  // Get Firebase ID token for API calls
  const getIdToken = async () => {
    if (firebaseUser) {
      return firebaseUser.getIdToken();
    }
    return null;
  };

  const value = {
    firebaseUser,
    user: profile,
    role: profile?.role || null,
    loading,
    authError,
    loginWithGoogle,
    logout,
    refreshProfile,
    getIdToken,
    isAdmin: profile?.role === 'admin',
    isGuard: profile?.role === 'guard',
    isResident: profile?.role === 'resident',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
