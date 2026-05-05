'use client';

import React from 'react';
import Link from 'next/link';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-sand p-4">
      <div className="text-center" style={{ maxWidth: '600px' }}>
        <div className="display-1 fw-bold text-rust mb-0 opacity-25" style={{ fontSize: '10rem', letterSpacing: '-5px' }}>404</div>
        <div className="position-relative" style={{ marginTop: '-80px' }}>
          <h1 className="display-4 fw-bold font-serif-italic text-dark mb-4">Aura Not Found.</h1>
          <p className="text-muted lead mb-5 px-md-5">
            The sanctuary you are looking for has either moved to a new location or never existed in our collection.
          </p>
          
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link href="/" className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 transition-all hover-scale">
              <FiHome /> Back to Collection
            </Link>
            <Link href="/salons" className="btn btn-white border rounded-pill px-5 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all hover-scale bg-white shadow-sm">
              <FiSearch /> Search Salons
            </Link>
          </div>

          <div className="mt-5 pt-4">
             <button 
               onClick={() => window.history.back()} 
               className="btn btn-link text-muted text-decoration-none small fw-bold d-inline-flex align-items-center gap-2 opacity-75 hover-opacity-100"
             >
               <FiArrowLeft /> Return to previous page
             </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .bg-sand { background-color: #fbf9f4; }
        .hover-scale:hover { transform: translateY(-3px); }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
