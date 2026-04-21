'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { FiMail, FiLock, FiUser, FiPhone, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { PiPlantFill } from "react-icons/pi";

const registerSchema = z.object({
  first_name: z.string().min(2, { message: 'First name is required' }),
  last_name: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['CUSTOMER', 'OWNER']),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      await api.post('/auth/register/', data);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.email?.[0] || 'Registration failed');
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex bg-sand" style={{ backgroundColor: 'var(--bg-sand)' }}>
      <div className="row g-0 w-100">
        
        {/* LEFT SIDE: Image + Overlay */}
        <div className="col-lg-5 d-none d-lg-flex position-relative flex-column p-5" style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="d-flex align-items-center mb-auto" style={{ zIndex: 10 }}>
            <div className="bg-rust rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px', color: 'white' }}>
              <PiPlantFill size={20} />
            </div>
            <span className="text-white fw-bold fs-5">FindSalon</span>
          </div>

          <div className="position-relative" style={{ zIndex: 10, maxWidth: '450px' }}>
            <h1 className="text-white fw-bold mb-0" style={{ fontSize: '4.5rem', letterSpacing: '-2px', lineHeight: '1.1' }}>Beauty</h1>
            <h1 className="text-rust fw-bold mb-3" style={{ fontSize: '4.5rem', letterSpacing: '-2px', lineHeight: '1.1' }}>Evolved.</h1>
            <p className="text-white-50 fs-5 mb-4 lh-sm pe-4">
              Join our community of curated beauty enthusiasts and book your next transformation in seconds.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 position-relative overflow-auto" style={{ maxHeight: '100vh' }}>
          <div className="w-100 py-4" style={{ maxWidth: '450px' }}>
            
            <h2 className="fw-bold mb-2 fs-1 text-dark">Create account</h2>
            <p className="text-muted mb-4 pb-2">Elevate your grooming experience today.</p>

            {/* OAuth Buttons */}
            <div className="row g-2 mb-4">
              <div className="col-12 col-sm-6">
                <button type="button" className="btn btn-white border w-100 rounded-pill py-2 d-flex align-items-center justify-content-center fw-medium bg-white text-nowrap shadow-sm">
                  <FcGoogle className="me-2 flex-shrink-0" size={20} /> <span className="text-dark">Google</span>
                </button>
              </div>
              <div className="col-12 col-sm-6">
                <button type="button" className="btn btn-dark w-100 rounded-pill py-2 d-flex align-items-center justify-content-center fw-medium text-nowrap shadow-sm">
                  <FaApple className="me-2 flex-shrink-0 text-white" size={20} /> <span className="text-white">Apple</span>
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <hr className="flex-grow-1 opacity-25" />
              <span className="mx-3 text-muted" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>OR CONTINUE WITH EMAIL</span>
              <hr className="flex-grow-1 opacity-25" />
            </div>

            {error && <div className="alert alert-danger p-2 small border-0 rounded-3 bg-danger bg-opacity-10 text-danger">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
              
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>FULLNAME</label>
                <div className="position-relative">
                  <FiUser className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  {/* Split name hack for UI matching: */}
                  <input type="hidden" {...register('last_name')} value="Moore" />
                  <input 
                    type="text" 
                    placeholder="Julianne Moore"
                    className={`form-control rounded-pill py-2 ps-5 border border-secondary border-opacity-25 shadow-none ${errors.first_name ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white', color: '#B9A197' }}
                    {...register('first_name')}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>EMAIL ADDRESS</label>
                <div className="position-relative">
                  <span className="position-absolute text-muted fw-bold" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }}>@</span>
                  <input 
                    type="email" 
                    placeholder="julianne@findsalon.com"
                    className={`form-control rounded-pill py-2 ps-5 border border-secondary border-opacity-25 shadow-none ${errors.email ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white', color: '#B9A197' }}
                    {...register('email')}
                  />
                  {errors.email && <div className="invalid-feedback ps-4">{errors.email.message}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>PHONE NUMBER</label>
                <div className="position-relative">
                  <FiPhone className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="+1 (555) 000-0000"
                    className={`form-control rounded-pill py-2 ps-5 border border-secondary border-opacity-25 shadow-none`}
                    style={{ backgroundColor: 'white', color: '#B9A197' }}
                    {...register('phone')}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>PASSWORD</label>
                <div className="position-relative">
                  <FiLock className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className={`form-control rounded-pill py-2 px-5 border border-secondary border-opacity-25 shadow-none ${errors.password ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white', color: '#B9A197' }}
                    {...register('password')}
                  />
                  <FiEyeOff className="position-absolute text-muted" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                  {errors.password && <div className="invalid-feedback ps-4">{errors.password.message}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-dark mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>ACCOUNT TYPE</label>
                <div className="position-relative">
                  <FiUser className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                  <select 
                    className={`form-select rounded-pill py-2 px-5 border border-secondary border-opacity-25 shadow-none ${errors.role ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white', color: '#B9A197', cursor: 'pointer' }}
                    {...register('role')}
                  >
                    <option value="CUSTOMER">Client (Book Appointments)</option>
                    <option value="OWNER">Salon Professional (Manage Business)</option>
                  </select>
                  {errors.role && <div className="invalid-feedback ps-4">{errors.role.message}</div>}
                </div>
              </div>

              <div className="mb-4 form-check d-flex">
                <input type="checkbox" className="form-check-input rounded-circle border-secondary shadow-none me-3 mt-1 px-2" id="agreeTOS" />
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
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted small">
                Already have an account? <Link href="/login" className="text-rust fw-bold text-decoration-none">Log In</Link>
              </p>
            </div>

          </div>

          <div className="position-absolute" style={{ bottom: '20px', right: '30px' }}>
            <span className="badge rounded-pill border border-warning text-dark px-3 py-2 fw-medium shadow-sm" style={{ backgroundColor: '#FDF2E3', fontSize: '0.65rem', letterSpacing: '0.5px' }}>
              <span className="text-rust me-1">★</span> PREMIUM SELECTION AVAILABLE
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
