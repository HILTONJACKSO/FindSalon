'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { FiMail, FiLock, FiStar, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Load saved credentials
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('remember_email');
      const savedPassword = localStorage.getItem('remember_password');
      if (savedEmail) setValue('email', savedEmail);
      if (savedPassword) setValue('password', savedPassword);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');

      // Save credentials if Keep Signed In is checked
      if (keepSigned) {
        localStorage.setItem('remember_email', data.email);
        localStorage.setItem('remember_password', data.password);
      } else {
        localStorage.removeItem('remember_email');
        localStorage.removeItem('remember_password');
      }
      let token: string;
      let userProfile: any;

      try {
        // 0. Set Persistence based on keepSigned
        await setPersistence(auth, keepSigned ? browserLocalPersistence : browserSessionPersistence);
        
        // 1. Try Firebase first (Standard User/Owner)
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        token = await userCredential.user.getIdToken();
        
        const profileRes = await api.get('auth/profile/', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        userProfile = profileRes.data;
      } catch (fbErr: any) {
        console.log("Firebase login failed, trying traditional fallback...", fbErr.code);
        
        // 2. Try Traditional Backend Login (For Admin accounts created manually)
        const loginRes = await api.post('auth/login/', {
          email: data.email,
          password: data.password
        });
        
        token = loginRes.data.access;
        // Fetch profile with the new JWT
        const profileRes = await api.get('auth/profile/', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        userProfile = profileRes.data;
      }

      setAuth(userProfile, token);
      
      // STRICT ROLE-BASED REDIRECTION SECURITY
      const role = userProfile.role;
      
      if (role === 'ADMIN') {
          console.log("Super Admin Access Granted. Routing to Command Center...");
          router.push('/admin/dashboard');
      } else if (role === 'OWNER') {
          console.log("Salon Owner Access Granted. Routing to Owner Dashboard...");
          router.push('/owner/dashboard');
      } else {
          router.push('/profile');
      }
    } catch (err: any) {

      console.error("Login final error:", err);
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      // Set persistence based on keepSigned
      await setPersistence(auth, keepSigned ? browserLocalPersistence : browserSessionPersistence);
      
      const provider = new GoogleAuthProvider();
      // Use Redirect instead of Popup for better stability in unstable networks
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked by browser. Please allow popups for this site.');
      } else {
        setError('Google sign in failed. Please try again.');
      }
    }
  };

  // Handle redirect result if needed (though AuthProvider usually catches it)
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const { getRedirectResult } = await import('firebase/auth');
        const result = await getRedirectResult(auth);
        if (result) {
          const token = await result.user.getIdToken();
          const profileRes = await api.get('auth/profile/', { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          setAuth(profileRes.data, token);
          router.push('/profile');
        }
      } catch (err) {
        console.error("Redirect result error:", err);
      }
    };
    checkRedirect();
  }, [router, setAuth]);

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex bg-sand" style={{ backgroundColor: 'var(--bg-sand)' }}>
      <div className="row g-0 w-100">
        
        {/* LEFT SIDE: Image + Overlay */}
        <div className="col-lg-5 d-none d-lg-flex position-relative flex-column justify-content-end p-5" style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1521590832167-7bfc17484d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="position-relative" style={{ zIndex: 10, maxWidth: '400px' }}>
            <h1 className="text-white fw-bold display-4 mb-0 font-serif-italic" style={{ letterSpacing: '-1.5px', lineHeight: '1.2' }}>Refine</h1>
            <h1 className="text-rust fw-bold display-4 mb-4 font-serif-italic" style={{ letterSpacing: '-1.5px', lineHeight: '1.2' }}>Your Aura.</h1>
            <p className="text-white-50 fs-5 mb-5 lh-base font-serif-italic opacity-75">
              Experience the world's most premium salon curated network. Every touchpoint, every service, designed for your sophisticated lifestyle.
            </p>
            <div className="d-flex align-items-center">
              <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 d-flex align-items-center gap-2 border border-white border-opacity-25">
                 <div className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></div>
                 <span className="text-white small fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>EXCLUSIVE MEMBER ACCESS</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="col-lg-7 d-flex flex-column justify-content-start align-items-center p-4 p-md-5 pt-lg-5 position-relative overflow-auto" style={{ maxHeight: '100vh' }}>
          <div className="w-100 py-5" style={{ maxWidth: '450px' }}>
            
            {/* Logo area */}
            <div className="mb-5 d-flex align-items-center">
               <img src="/logo.jpg" alt="FindSalon" className="rounded-circle shadow-lg" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
            </div>

            <h2 className="fw-bold mb-2 font-serif-italic" style={{ fontSize: '2.5rem', letterSpacing: '-1.5px' }}>Welcome Back</h2>
            <p className="text-muted small mb-5 lead">Sign in to your private sanctuary.</p>

            {/* OAuth Buttons */}
            <div className="mb-4">
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="btn btn-white border w-100 rounded-pill py-3 d-flex align-items-center justify-content-center fw-medium bg-white shadow-sm"
              >
                <FcGoogle className="me-2" size={20} /> <span className="text-dark">Sign In with Google</span>
              </button>
            </div>

            <div className="d-flex align-items-center mb-4">
              <hr className="flex-grow-1 opacity-25" />
              <span className="mx-3 text-muted" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>OR LOGIN WITH EMAIL</span>
              <hr className="flex-grow-1 opacity-25" />
            </div>

            {error && <div className="alert alert-danger p-2 small border-0 rounded-3 bg-danger bg-opacity-10 text-danger">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark">Email Address</label>
                <div className="position-relative">
                  <FiMail className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className={`form-control rounded-pill py-2 ps-5 border-0 shadow-sm ${errors.email ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white' }}
                    {...register('email')}
                  />
                  {errors.email && <div className="invalid-feedback ps-4">{errors.email.message}</div>}
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label fw-bold small text-dark mb-1">Password</label>
                  <Link href="/forgot" className="text-rust text-decoration-none small fw-medium" style={{ fontSize: '0.8rem' }}>Forgot Password?</Link>
                </div>
                <div className="position-relative">
                  <FiLock className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className={`form-control rounded-pill py-2 ps-5 pe-5 border-0 shadow-sm ${errors.password ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white' }}
                    {...register('password')}
                  />
                  <div 
                    className="position-absolute translate-middle-y text-muted cursor-pointer hover-rust" 
                    style={{ top: '50%', right: '15px' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </div>
                  {errors.password && <div className="invalid-feedback ps-4">{errors.password.message}</div>}
                </div>
              </div>
 
              <div className="mb-4 form-check d-flex align-items-center">
                <input 
                  type="checkbox" 
                  className="form-check-input rounded-circle border-secondary shadow-none me-2 mt-0" 
                  id="keepSigned" 
                  checked={keepSigned}
                  onChange={(e) => setKeepSigned(e.target.checked)}
                />
                <label className="form-check-label text-muted small" htmlFor="keepSigned">Keep me signed in</label>
              </div>

              <button 
                type="submit" 
                className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm"
                disabled={isSubmitting}
                style={{ fontSize: '1.1rem' }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-5">
              <p className="text-muted small">
                New to the collection? <Link href="/register" className="text-rust fw-bold text-decoration-none hover-rust">Request Access</Link>
              </p>
            </div>

          </div>



        </div>
      </div>
    </div>
  );
}
