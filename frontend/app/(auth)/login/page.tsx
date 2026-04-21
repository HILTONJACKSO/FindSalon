'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { FiMail, FiLock, FiStar } from 'react-icons/fi';
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
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      const res = await api.post('/auth/login/', data);
      const { access, refresh } = res.data;
      const profileRes = await api.get('/auth/profile/', { headers: { Authorization: `Bearer ${access}` } });
      setAuth(profileRes.data, access, refresh);
      const role = profileRes.data.role;
      if (role === 'OWNER') router.push('/owner/dashboard');
      else if (role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    }
  };

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
            <h1 className="text-white fw-bold display-4 mb-0" style={{ letterSpacing: '-1px' }}>Define your</h1>
            <h1 className="text-rust fw-bold display-4 mb-4" style={{ letterSpacing: '-1px' }}>aesthetic.</h1>
            <p className="text-white-50 fs-5 mb-5 lh-base">
              Experience the most premium salon curated network. Every touchpoint, every service, designed for your sophisticated lifestyle.
            </p>
            <div className="d-flex align-items-center">
              <div className="d-flex me-3">
                <img src="https://i.pravatar.cc/150?img=1" className="rounded-circle border border-2 border-dark" width="35" height="35" alt="Avatar 1" style={{ marginLeft: '-0px' }} />
                <img src="https://i.pravatar.cc/150?img=2" className="rounded-circle border border-2 border-dark" width="35" height="35" alt="Avatar 2" style={{ marginLeft: '-10px' }} />
                <img src="https://i.pravatar.cc/150?img=3" className="rounded-circle border border-2 border-dark" width="35" height="35" alt="Avatar 3" style={{ marginLeft: '-10px' }} />
              </div>
              <span className="text-white small fw-medium">Join 50k+ curated members</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center p-4 p-md-5 position-relative">
          <div className="w-100" style={{ maxWidth: '450px' }}>
            
            {/* Logo area */}
            <div className="mb-4 d-flex align-items-center">
               <div className="bg-rust rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px', color: 'white' }}>
                 <FiStar size={20} />
               </div>
            </div>

            <h2 className="fw-bold mb-2">Welcome to FindSalon</h2>
            <p className="text-muted small mb-5">Please enter your details to sign in.</p>

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
                    type="password" 
                    placeholder="••••••••"
                    className={`form-control rounded-pill py-2 ps-5 border-0 shadow-sm ${errors.password ? 'is-invalid' : ''}`}
                    style={{ backgroundColor: 'white' }}
                    {...register('password')}
                  />
                  {errors.password && <div className="invalid-feedback ps-4">{errors.password.message}</div>}
                </div>
              </div>

              <div className="mb-4 form-check d-flex align-items-center">
                <input type="checkbox" className="form-check-input rounded-circle border-secondary shadow-none me-2 mt-0" id="keepSigned" />
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
                Don't have an account? <Link href="/register" className="text-rust fw-bold text-decoration-none">Sign Up</Link>
              </p>
            </div>

          </div>

          <div className="position-absolute bottom-0 w-100 text-center pb-4">
            <span className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px' }}>PRIVACY POLICY &nbsp;&nbsp;•&nbsp;&nbsp; TERMS OF SERVICE</span>
          </div>

        </div>
      </div>
    </div>
  );
}
