'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiUser, FiPhone, FiMapPin, FiArrowLeft, FiSave } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

const editProfileSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      location: user?.location || 'Monrovia, Liberia',
    }
  });

  const onSubmit = async (data: EditProfileValues) => {
    try {
      setError('');
      setSuccess(false);
      const res = await api.patch('/auth/profile/', data);
      
      // Update local store with new data
      setAuth({ ...user, ...res.data } as any, useAuthStore.getState().token);
      
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err: any) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="min-vh-100 bg-sand py-5">
      <div className="container" style={{ maxWidth: '600px' }}>
        
        <button 
          onClick={() => router.back()} 
          className="btn btn-link text-rust fw-bold text-decoration-none d-flex align-items-center gap-2 mb-4 p-0"
        >
          <FiArrowLeft /> Back to Profile
        </button>

        <div className="bg-white rounded-5 shadow-sm p-4 p-md-5 border border-opacity-10">
          <h2 className="fw-bold mb-2 font-serif-italic">Edit Profile</h2>
          <p className="text-muted mb-5">Update your personal information for a better experience.</p>

          {error && <div className="alert alert-danger rounded-4 border-0">{error}</div>}
          {success && <div className="alert alert-success rounded-4 border-0">Profile updated successfully! Redirecting...</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-dark">FIRST NAME</label>
                <div className="position-relative">
                  <FiUser className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    className={`form-control rounded-pill py-2 ps-5 border-secondary border-opacity-25 ${errors.first_name ? 'is-invalid' : ''}`}
                    {...register('first_name')}
                  />
                  {errors.first_name && <div className="invalid-feedback ps-2">{errors.first_name.message}</div>}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold small text-dark">LAST NAME</label>
                <div className="position-relative">
                  <FiUser className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    className={`form-control rounded-pill py-2 ps-5 border-secondary border-opacity-25 ${errors.last_name ? 'is-invalid' : ''}`}
                    {...register('last_name')}
                  />
                  {errors.last_name && <div className="invalid-feedback ps-2">{errors.last_name.message}</div>}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-dark">PHONE NUMBER</label>
              <div className="position-relative">
                <FiPhone className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="form-control rounded-pill py-2 ps-5 border-secondary border-opacity-25"
                  {...register('phone')}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label fw-bold small text-dark">LOCATION</label>
              <div className="position-relative">
                <FiMapPin className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className={`form-control rounded-pill py-2 ps-5 border-secondary border-opacity-25 ${errors.location ? 'is-invalid' : ''}`}
                  {...register('location')}
                />
                {errors.location && <div className="invalid-feedback ps-2">{errors.location.message}</div>}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              ) : (
                <><FiSave /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
