'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiShield, FiLock } from 'react-icons/fi';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-vh-100 bg-sand py-5">
      <div className="container" style={{ maxWidth: '600px' }}>
        <button onClick={() => router.back()} className="btn btn-link text-rust fw-bold text-decoration-none d-flex align-items-center gap-2 mb-4 p-0">
          <FiArrowLeft /> Back to Profile
        </button>

        <div className="bg-white rounded-5 shadow-sm p-5 border border-opacity-10">
          <div className="d-flex align-items-center gap-3 mb-5">
             <div className="bg-rust bg-opacity-10 p-3 rounded-circle text-rust">
                <FiShield size={32} />
             </div>
             <div>
                <h2 className="fw-bold mb-0 font-serif-italic">Privacy & Safety</h2>
                <p className="text-muted mb-0 small">Your security is our top priority.</p>
             </div>
          </div>

          <div className="bg-light p-4 rounded-4 mb-4">
             <div className="d-flex align-items-center gap-3 mb-3">
                <FiLock className="text-rust" />
                <h6 className="fw-bold mb-0">Two-Factor Authentication</h6>
             </div>
             <p className="small text-muted mb-0">Add an extra layer of security to your account by requiring a code from your phone to log in.</p>
             <button className="btn btn-outline-rust btn-sm rounded-pill mt-3 px-3">Enable 2FA</button>
          </div>

          <div className="d-flex flex-column gap-3">
             <div className="d-flex align-items-center justify-content-between p-2">
                <span className="small fw-medium">Profile Visibility</span>
                <span className="badge bg-rust bg-opacity-10 text-rust rounded-pill px-3">Private</span>
             </div>
             <div className="d-flex align-items-center justify-content-between p-2">
                <span className="small fw-medium">Data Collection</span>
                <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3">Minimal</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
