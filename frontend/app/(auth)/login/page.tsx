'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api, getImageUrl } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { FiMail, FiLock, FiStar, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

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
        await setPersistence(auth, keepSigned ? browserLocalPersistence : browserSessionPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        token = await userCredential.user.getIdToken();
        const profileRes = await api.get('auth/profile/', { headers: { Authorization: `Bearer ${token}` } });
        userProfile = profileRes.data;
      } catch (fbErr) {
        const loginRes = await api.post('auth/login/', { email: data.email, password: data.password });
        token = loginRes.data.access;
        const profileRes = await api.get('auth/profile/', { headers: { Authorization: `Bearer ${token}` } });
        userProfile = profileRes.data;
      }

      setAuth(userProfile, token);
      const role = userProfile.role;
      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'OWNER') router.push('/owner/dashboard');
      else router.push('/profile');
    } catch (err) {
      setError('The credentials provided do not match our private records.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await setPersistence(auth, keepSigned ? browserLocalPersistence : browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError('Google authentication failed. Please try another method.');
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex bg-white overflow-hidden">
      <div className="row g-0 w-100 flex-grow-1">
        
        {/* EDITORIAL HERO SIDE */}
        <div className="col-lg-6 d-none d-lg-flex position-relative flex-column justify-content-center p-5 overflow-hidden" style={{ background: '#0A0A0A' }}>
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="position-absolute w-100 h-100 top-0 start-0"
            style={{
              backgroundImage: `url(${getImageUrl('hero/login_bg.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          />
          <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.9) 0%, transparent 100%)', zIndex: 1 }}></div>
          
          <div className="position-relative ps-5" style={{ zIndex: 10, maxWidth: '500px' }}>
            <FadeIn>
              <div className="d-flex align-items-center gap-2 mb-4">
                 <div className="bg-rust p-1 rounded-circle"></div>
                 <span className="text-white small fw-bold letter-spaced" style={{ fontSize: '0.65rem' }}>EXCLUSIVE MEMBER ACCESS</span>
              </div>
              <h1 className="text-white display-2 fw-bold mb-0" style={{ letterSpacing: '-2px', lineHeight: '1' }}>Refine</h1>
              <h1 className="text-rust display-2 fw-bold mb-4 font-serif-italic" style={{ letterSpacing: '-2px', lineHeight: '1' }}>Your Aura.</h1>
              <p className="text-white text-opacity-70 fs-5 mb-5 lh-base" style={{ fontWeight: '300' }}>
                Experience the world's most premium salon curated network. Every touchpoint, every service, designed for your sophisticated lifestyle.
              </p>
              
              <div className="d-flex gap-4">
                 <div className="text-white text-opacity-40 small d-flex align-items-center gap-2">
                    <FiShield className="text-rust" /> SECURE ACCESS
                 </div>
                 <div className="text-white text-opacity-40 small d-flex align-items-center gap-2">
                    <FiStar className="text-rust" /> CURATED NETWORK
                 </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* PREMIUM FORM SIDE */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 bg-white position-relative">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            
            <FadeIn delay={0.2}>
              <div className="text-center mb-5">
                <img src="/logo.jpg" alt="FindSalon" className="rounded-circle shadow-xl mb-4" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '3px solid #FDF9F0' }} />
                <h2 className="fw-bold text-dark display-6 mb-2 font-serif-italic">Welcome Back</h2>
                <p className="text-muted small">Sign in to your private sanctuary.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} 
                  className="py-3 px-4 small rounded-4 mb-4 text-center fw-medium"
                  style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
                  {error}
                </motion.div>
              )}

              <div className="mb-4">
                <button 
                  type="button" 
                  onClick={handleGoogleSignIn}
                  className="btn btn-white border border-light shadow-sm w-100 rounded-pill py-3 d-flex align-items-center justify-content-center fw-bold transition-all hover-translate-up"
                  style={{ background: '#fff', fontSize: '0.9rem' }}
                >
                  <FcGoogle className="me-3" size={22} /> CONTINUE WITH GOOGLE
                </button>
              </div>

              <div className="d-flex align-items-center mb-4">
                <hr className="flex-grow-1 opacity-10" />
                <span className="mx-3 text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '2px' }}>OR LOGIN WITH EMAIL</span>
                <hr className="flex-grow-1 opacity-10" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
                <div className="group">
                  <label className="fw-bold small text-dark mb-2 ms-2">Email Address</label>
                  <div className="position-relative">
                    <FiMail className="position-absolute text-muted opacity-50" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="email" 
                      placeholder="mama@gmail.com"
                      className={`form-control rounded-pill py-3 ps-5 border-light bg-light bg-opacity-30 shadow-none transition-all ${errors.email ? 'border-danger' : 'focus-border-rust'}`}
                      style={{ fontSize: '0.95rem' }}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="text-danger small mt-1 ms-3 fw-medium">{errors.email.message}</p>}
                </div>

                <div className="group">
                  <div className="d-flex justify-content-between align-items-center mb-2 ms-2">
                    <label className="fw-bold small text-dark mb-0">Password</label>
                    <Link href="/forgot" className="text-rust text-decoration-none small fw-bold hover-underline" style={{ fontSize: '0.75rem' }}>FORGOT PASSWORD?</Link>
                  </div>
                  <div className="position-relative">
                    <FiLock className="position-absolute text-muted opacity-50" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className={`form-control rounded-pill py-3 ps-5 pe-5 border-light bg-light bg-opacity-30 shadow-none transition-all ${errors.password ? 'border-danger' : 'focus-border-rust'}`}
                      style={{ fontSize: '0.95rem' }}
                      {...register('password')}
                    />
                    <div 
                      className="position-absolute translate-middle-y text-muted cursor-pointer hover-rust" 
                      style={{ top: '50%', right: '18px' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </div>
                  </div>
                  {errors.password && <p className="text-danger small mt-1 ms-3 fw-medium">{errors.password.message}</p>}
                </div>

                <div className="form-check d-flex align-items-center mb-2 ms-2">
                  <input 
                    type="checkbox" 
                    className="form-check-input rounded-circle border-secondary shadow-none me-2 mt-0 cursor-pointer" 
                    id="keepSigned" 
                    checked={keepSigned}
                    onChange={(e) => setKeepSigned(e.target.checked)}
                  />
                  <label className="form-check-label text-muted small fw-medium cursor-pointer" htmlFor="keepSigned">Keep me signed in for 30 days</label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-lg mt-2 transition-all hover-translate-up d-flex align-items-center justify-content-center gap-2"
                  disabled={isSubmitting}
                  style={{ fontSize: '1rem', letterSpacing: '1px' }}
                >
                  {isSubmitting ? 'VERIFYING ACCESS...' : 'SIGN IN NOW'} <FiArrowRight />
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="text-muted small fw-medium">
                  New to the collection? <Link href="/register" className="text-rust fw-bold text-decoration-none border-bottom border-rust border-opacity-25 ms-1">REQUEST ACCESS</Link>
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-serif-italic { font-family: var(--font-serif); font-style: italic; }
        .letter-spaced { letter-spacing: 2px; }
        .shadow-xl { box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1); }
        .hover-translate-up:hover { transform: translateY(-5px); }
        .focus-border-rust:focus { border-color: #B45309 !important; background-color: #fff !important; }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
