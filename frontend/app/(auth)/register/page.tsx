'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiStar } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { PiPlantFill } from "react-icons/pi";

const registerSchema = z.object({
  first_name: z.string().min(2, { message: 'First name is required' }),
  last_name: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().min(5, { message: 'WhatsApp number is required for booking updates' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['CUSTOMER', 'OWNER']),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

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
      // For registration, we always want persistence
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken();
      
      // Sync with backend
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
      console.error("Registration error full details:", err.response?.data || err.message || err);
      if (err.response?.data) {
        const backendErrors = err.response.data;
        const firstError = Object.values(backendErrors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : JSON.stringify(backendErrors));
      } else {
        const errorMessage = err.code ? `${err.code}: ${err.message}` : 'Registration failed';
        setError(err.code === 'auth/email-already-in-use' ? 'Email already in use' : errorMessage);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Google sign up failed');
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex bg-sand" style={{ backgroundColor: 'var(--bg-sand)' }}>
      <div className="row g-0 w-100">
        
        {/* LEFT SIDE: Image + Overlay */}
        <div className="col-lg-5 d-none d-lg-flex position-relative flex-column p-5" style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url("${activeTab === 'OWNER' ? 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80' : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="d-flex align-items-center mb-auto" style={{ zIndex: 10 }}>
            <img src="/logo.jpg" alt="FindSalon" className="rounded-circle shadow-lg" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          </div>

          <div className="position-relative" style={{ zIndex: 10, maxWidth: '450px' }}>
            <h1 className="text-white fw-bold mb-0 font-serif-italic" style={{ fontSize: '4.5rem', letterSpacing: '-2px', lineHeight: '1' }}>
              {activeTab === 'OWNER' ? 'Scale' : 'Refine'}
            </h1>
            <h1 className="text-rust fw-bold mb-3 font-serif-italic" style={{ fontSize: '4.5rem', letterSpacing: '-2px', lineHeight: '1' }}>
              {activeTab === 'OWNER' ? 'Your Business.' : 'Your Presence.'}
            </h1>
            <p className="text-white-50 fs-5 mb-4 lh-sm pe-4 font-serif-italic opacity-75">
              {activeTab === 'OWNER' 
                ? "The most prestigious suite for salon owners demand excellence in every interaction." 
                : "Join the elite circle of curated beauty. Every transformation begins with a single selection."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="col-lg-7 d-flex flex-column justify-content-start align-items-center p-4 p-md-5 pt-lg-5 position-relative overflow-auto" style={{ maxHeight: '100vh' }}>
          <div className="w-100 py-5" style={{ maxWidth: '450px' }}>
            
            <div className="d-flex mb-5 bg-white p-1 rounded-pill shadow-sm border overflow-hidden" style={{ width: 'fit-content' }}>
              <button 
                onClick={() => handleTabChange('CUSTOMER')}
                className={`btn rounded-pill px-4 py-2 fw-bold small transition-all ${activeTab === 'CUSTOMER' ? 'btn-rust shadow-sm' : 'btn-link text-muted text-decoration-none'}`}
                style={{ fontSize: '0.85rem' }}
              >
                Find a Salon
              </button>
              <button 
                onClick={() => handleTabChange('OWNER')}
                className={`btn rounded-pill px-4 py-2 fw-bold small transition-all ${activeTab === 'OWNER' ? 'btn-rust shadow-sm' : 'btn-link text-muted text-decoration-none'}`}
                style={{ fontSize: '0.85rem' }}
              >
                List Your Business
              </button>
            </div>

            <h2 className="fw-bold mb-4 font-serif-italic text-dark" style={{ fontSize: '3rem', letterSpacing: '-1.5px' }}>
              {activeTab === 'OWNER' ? 'Business Suite' : 'Create Profile'}
            </h2>

            {/* OAuth Buttons */}
            <div className="mb-4">
              <button 
                type="button" 
                onClick={handleGoogleSignUp}
                className="btn btn-white border w-100 rounded-pill py-3 d-flex align-items-center justify-content-center fw-medium bg-white shadow-sm"
              >
                <FcGoogle className="me-2" size={20} /> <span className="text-dark">Sign Up with Google</span>
              </button>
            </div>

            <div className="d-flex align-items-center mb-4">
              <hr className="flex-grow-1 opacity-25" />
              <span className="mx-3 text-muted" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>OR JOIN WITH EMAIL</span>
              <hr className="flex-grow-1 opacity-25" />
            </div>

            {error && <div className="alert alert-danger p-2 small border-0 rounded-3 bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
              
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>FIRST NAME</label>
                  <div className="position-relative">
                    <FiUser className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="Julianne"
                      className={`form-control rounded-pill py-2 ps-5 border border-secondary border-opacity-25 shadow-none ${errors.first_name ? 'is-invalid' : ''}`}
                      style={{ backgroundColor: 'white' }}
                      {...register('first_name')}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>LAST NAME</label>
                  <input 
                    type="text" 
                    placeholder="Moore"
                    className={`form-control rounded-pill py-2 px-4 border border-secondary border-opacity-25 shadow-none ${errors.last_name ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white' }}
                    {...register('last_name')}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>EMAIL ADDRESS</label>
                <div className="position-relative">
                  <FiMail className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    placeholder="julianne@findsalon.com"
                    className={`form-control rounded-pill py-2 ps-5 border border-secondary border-opacity-25 shadow-none ${errors.email ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white' }}
                    {...register('email')}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                  {activeTab === 'OWNER' ? 'BUSINESS PHONE' : 'WHATSAPP NUMBER'}
                </label>
                <div className="position-relative">
                  <FiPhone className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder={activeTab === 'OWNER' ? "Professional contact" : "+231 00-000-000"}
                    className={`form-control rounded-pill py-2 ps-5 border border-secondary border-opacity-25 shadow-none ${errors.phone ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white' }}
                    {...register('phone')}
                  />
                  {errors.phone && <div className="invalid-feedback ps-4">{errors.phone.message}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>PASSWORD</label>
                <div className="position-relative">
                  <FiLock className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className={`form-control rounded-pill py-2 px-5 border border-secondary border-opacity-25 shadow-none ${errors.password ? 'is-invalid' : ''}`}
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
                </div>
              </div>

              <div className="mb-4 form-check d-flex">
                <input type="checkbox" className="form-check-input rounded-circle border-secondary shadow-none me-3 mt-1 px-2" id="agreeTOS" required />
                <label className="form-check-label text-muted small" htmlFor="agreeTOS" style={{ lineHeight: '1.2' }}>
                  I agree to the <span className="text-rust fw-bold">Terms of Service</span> and <span className="text-rust fw-bold">Privacy Policy</span>.
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm"
                disabled={isSubmitting}
                style={{ fontSize: '1.1rem' }}
              >
                {isSubmitting ? 'Processing...' : activeTab === 'OWNER' ? 'Join Collection' : 'Create Profile'}
              </button>
            </form>

            <div className="text-center mt-5">
              <p className="text-muted small">
                Already have an account? <Link href="/login" className="text-rust fw-bold text-decoration-none hover-rust">Sign In</Link>
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
