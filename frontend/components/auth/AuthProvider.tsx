'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        
        // Fetch additional user info from our Django backend
        try {
          // We'll need a special endpoint that identifies the user by Firebase UID
          const res = await api.get(`/auth/profile/?t=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setAuth({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            role: res.data.role || 'CUSTOMER',
            first_name: res.data.first_name,
            last_name: res.data.last_name
          }, token);
        } catch (err: any) {
          console.error("Failed to sync profile with backend", err instanceof Error ? err.message : err);
          // If profile sync fails, we still set the auth but with default role
          setAuth({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'CUSTOMER'
          }, token);
        }
      } else {
        setAuth(null, null);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setAuth, setInitialized]);

  return <>{children}</>;
}
