'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api, getImageUrl } from '@/lib/api';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiStar, FiArrowRight, FiShield, FiBriefcase } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';

const registerSchema = z.object({
  first_name: z.string().min(2, { message: 'First name is required' }),
  last_name: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().min(5, { message: 'WhatsApp number is required for booking updates' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['CUSTOMER', 'OWNER']),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' }
  });

  const handleTabChange = (tab: 'CUSTOMER' | 'OWNER') => {
    setActiveTab(tab);
    setValue('role', tab);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken();
      
      await api.post('auth/register/', {
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        first_name: data.first_name,
        last_name: data.last_name,
        firebase_uid: userCredential.user.uid
      });
      
      router.push('/login?registered=true');
    } catch (err: any) {
      if (err.response?.data) {
        const backendErrors = err.response.data;
        const firstError = Object.values(backendErrors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : JSON.stringify(backendErrors));
      } else {
        setError(err.code === 'auth/email-already-in-use' ? 'This email is already part of our elite circle.' : 'Enrollment failed. Please verify your details.');
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err) {
      setError('Google enrollment failed. Please try another method.');
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex bg-white overflow-hidden">
      <div className="row g-0 w-100 flex-grow-1">
        
        {/* EDITORIAL HERO SIDE */}
        <div className="col-lg-5 d-none d-lg-flex position-relative flex-column justify-content-center p-5 overflow-hidden" style={{ background: '#0A0A0A' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="position-absolute w-100 h-100 top-0 start-0"
              style={{
                backgroundImage: `url(${getImageUrl(activeTab === 'OWNER' ? 'hero/owner_reg_bg.jpg' : 'hero/reg_bg.jpg')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
              }}
            />
          </AnimatePresence>
          <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.4) 100%)', zIndex: 1 }}></div>
          
          <div className="position-relative ps-5" style={{ zIndex: 10, maxWidth: '500px' }}>
            <FadeIn>
              <div className="d-flex align-items-center gap-2 mb-4">
                 <div className="bg-rust p-1 rounded-circle"></div>
                 <span className="text-white small fw-bold letter-spaced" style={{ fontSize: '0.65rem' }}>ENROLLMENT GATEWAY</span>
              </div>
              <h1 className="text-white display-2 fw-bold mb-0" style={{ letterSpacing: '-2px', lineHeight: '1' }}>
                {activeTab === 'OWNER' ? 'Scale' : 'Refine'}
              </h1>
              <h1 className="text-rust display-2 fw-bold mb-4 font-serif-italic" style={{ letterSpacing: '-2px', lineHeight: '1' }}>
                {activeTab === 'OWNER' ? 'Your Business.' : 'Your Presence.'}
              </h1>
              <p className="text-white text-opacity-70 fs-5 mb-5 lh-base" style={{ fontWeight: '300' }}>
                {activeTab === 'OWNER' 
                  ? "The most prestigious suite for salon owners who demand excellence in every interaction." 
                  : "Join the elite circle of curated beauty. Every transformation begins with a single selection."}
              </p>
              
              <div className="d-flex gap-4">
                 <div className="text-white text-opacity-40 small d-flex align-items-center gap-2">
                    <FiShield className="text-rust" /> SECURE DATA
                 </div>
                 <div className="text-white text-opacity-40 small d-flex align-items-center gap-2">
                    <FiStar className="text-rust" /> ELITE CIRCLE
                 </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* PREMIUM FORM SIDE */}
        <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 bg-white position-relative overflow-auto" style={{ maxHeight: '100vh' }}>
          <div className="w-100" style={{ maxWidth: '480px' }}>
            
            <FadeIn delay={0.2}>
              <div className="text-center mb-5">
                <div className="d-inline-flex bg-light p-1 rounded-pill mb-4 border shadow-sm">
                  <button 
                    onClick={() => handleTabChange('CUSTOMER')}
                    className={`btn rounded-pill px-4 py-2 fw-bold small transition-all ${activeTab === 'CUSTOMER' ? 'btn-dark shadow-lg' : 'btn-link text-muted text-decoration-none'}`}
                    style={{ fontSize: '0.75rem', letterSpacing: '1px' }}
                  >
                    FOR CLIENTS
                  </button>
                  <button 
                    onClick={() => handleTabChange('OWNER')}
                    className={`btn rounded-pill px-4 py-2 fw-bold small transition-all ${activeTab === 'OWNER' ? 'btn-dark shadow-lg' : 'btn-link text-muted text-decoration-none'}`}
                    style={{ fontSize: '0.75rem', letterSpacing: '1px' }}
                  >
                    FOR OWNERS
                  </button>
                </div>
                <h2 className="fw-bold text-dark display-6 mb-2 font-serif-italic">
                  {activeTab === 'OWNER' ? 'Business Suite' : 'Create Profile'}
                </h2>
                <p className="text-muted small">Begin your journey in our curated sanctuary.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="alert alert-danger py-2 px-3 small border-0 rounded-4 bg-danger bg-opacity-5 text-danger mb-4 text-center fw-medium">
                  {error}
                </motion.div>
              )}

              <div className="mb-4">
                <button 
                  type="button" 
                  onClick={handleGoogleSignUp}
                  className="btn btn-white border border-light shadow-sm w-100 rounded-pill py-3 d-flex align-items-center justify-content-center fw-bold transition-all hover-translate-up"
                  style={{ background: '#fff', fontSize: '0.85rem' }}
                >
                  <FcGoogle className="me-3" size={22} /> JOIN WITH GOOGLE
                </button>
              </div>

              <div className="d-flex align-items-center mb-4">
                <hr className="flex-grow-1 opacity-10" />
                <span className="mx-3 text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '2px' }}>OR ENROLL WITH EMAIL</span>
                <hr className="flex-grow-1 opacity-10" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="fw-bold small text-dark mb-2 ms-2 text-uppercase letter-spaced" style={{ fontSize: '0.6rem' }}>First Name</label>
                    <div className="position-relative">
                      <FiUser className="position-absolute text-muted opacity-50" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text" 
                        placeholder="Julianne"
                        className={`form-control rounded-pill py-3 ps-5 border-light bg-light bg-opacity-30 shadow-none transition-all ${errors.first_name ? 'border-danger' : 'focus-border-rust'}`}
                        style={{ fontSize: '0.9rem' }}
                        {...register('first_name')}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="fw-bold small text-dark mb-2 ms-2 text-uppercase letter-spaced" style={{ fontSize: '0.6rem' }}>Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Moore"
                      className={`form-control rounded-pill py-3 px-4 border-light bg-light bg-opacity-30 shadow-none transition-all ${errors.last_name ? 'border-danger' : 'focus-border-rust'}`}
                      style={{ fontSize: '0.9rem' }}
                      {...register('last_name')}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="fw-bold small text-dark mb-2 ms-2 text-uppercase letter-spaced" style={{ fontSize: '0.6rem' }}>Email Address</label>
                  <div className="position-relative">
                    <FiMail className="position-absolute text-muted opacity-50" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="email" 
                      placeholder="julianne@findsalon.com"
                      className={`form-control rounded-pill py-3 ps-5 border-light bg-light bg-opacity-30 shadow-none transition-all ${errors.email ? 'border-danger' : 'focus-border-rust'}`}
                      style={{ fontSize: '0.9rem' }}
                      {...register('email')}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="fw-bold small text-dark mb-2 ms-2 text-uppercase letter-spaced" style={{ fontSize: '0.6rem' }}>
                    {activeTab === 'OWNER' ? 'BUSINESS PHONE' : 'WHATSAPP NUMBER'}
                  </label>
                  <div className="position-relative">
                    <FiPhone className="position-absolute text-muted opacity-50" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder={activeTab === 'OWNER' ? "Professional contact" : "+231 00-000-000"}
                      className={`form-control rounded-pill py-3 ps-5 border-light bg-light bg-opacity-30 shadow-none transition-all ${errors.phone ? 'border-danger' : 'focus-border-rust'}`}
                      style={{ fontSize: '0.9rem' }}
                      {...register('phone')}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="fw-bold small text-dark mb-2 ms-2 text-uppercase letter-spaced" style={{ fontSize: '0.6rem' }}>Password</label>
                  <div className="position-relative">
                    <FiLock className="position-absolute text-muted opacity-50" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className={`form-control rounded-pill py-3 ps-5 pe-5 border-light bg-light bg-opacity-30 shadow-none transition-all ${errors.password ? 'border-danger' : 'focus-border-rust'}`}
                      style={{ fontSize: '0.9rem' }}
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
                </div>

                <div className="form-check d-flex mb-2 ms-2">
                  <input type="checkbox" className="form-check-input rounded-circle border-secondary shadow-none me-3 mt-1 px-2 cursor-pointer" id="agreeTOS" required />
                  <label className="form-check-label text-muted small fw-medium cursor-pointer" htmlFor="agreeTOS" style={{ lineHeight: '1.4' }}>
                    I accept the <Link href="/terms" className="text-rust fw-bold text-decoration-none border-bottom border-rust border-opacity-25">Membership Terms</Link> and <Link href="/privacy" className="text-rust fw-bold text-decoration-none border-bottom border-rust border-opacity-25">Privacy Protocol</Link>.
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-lg mt-2 transition-all hover-translate-up d-flex align-items-center justify-content-center gap-2"
                  disabled={isSubmitting}
                  style={{ fontSize: '1rem', letterSpacing: '1px' }}
                >
                  {isSubmitting ? 'PROCESSING...' : activeTab === 'OWNER' ? 'JOIN COLLECTION' : 'ENROLL NOW'} <FiArrowRight />
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="text-muted small fw-medium">
                  Already a member? <Link href="/login" className="text-rust fw-bold text-decoration-none border-bottom border-rust border-opacity-25 ms-1">SIGN IN</Link>
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
      `}</style>
    </div>
  );
}
