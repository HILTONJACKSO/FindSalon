'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCreditCard, FiPlus } from 'react-icons/fi';

export default function PaymentsPage() {
  const router = useRouter();

  return (
    <div className="min-vh-100 bg-sand py-5">
      <div className="container" style={{ maxWidth: '600px' }}>
        <button onClick={() => router.back()} className="btn btn-link text-rust fw-bold text-decoration-none d-flex align-items-center gap-2 mb-4 p-0">
          <FiArrowLeft /> Back to Profile
        </button>

        <div className="bg-white rounded-5 shadow-sm p-5 border border-opacity-10">
          <div className="d-flex align-items-center gap-3 mb-4">
             <div className="bg-rust bg-opacity-10 p-3 rounded-circle text-rust">
                <FiCreditCard size={32} />
             </div>
             <div>
                <h2 className="fw-bold mb-0 font-serif-italic">Payment Methods</h2>
                <p className="text-muted mb-0 small">Manage your secure payment options.</p>
             </div>
          </div>

          <div className="py-5 text-center bg-light rounded-4 border border-dashed mb-4">
             <p className="text-muted mb-0">No payment methods saved yet.</p>
          </div>

          <button className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
            <FiPlus /> Add New Card
          </button>
        </div>
      </div>
    </div>
  );
}
