'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide global footer for owner and admin dashboard pages
  if (pathname?.startsWith('/owner') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="mt-5 pt-4 border-top bg-white">
      <div className="container">
        <div className="row text-muted small pb-4">
          <div className="col-md-4 mb-3">
            <h5 className="text-dark fw-bold mb-3">FindSalon</h5>
            <p className="pe-md-4">Redefining the beauty booking experience through curated elegance and strict selection.</p>
          </div>
          <div className="col-md-2 mb-3">
            <h6 className="text-dark fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">About</Link></li>
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Careers</Link></li>
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Press</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h6 className="text-dark fw-bold mb-3">Partnerships</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Salon Partnership</Link></li>
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Brand Ambassadors</Link></li>
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Affiliates</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h6 className="text-dark fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Help Center</Link></li>
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Contact Us</Link></li>
              <li className="mb-2"><Link href="/" className="text-muted text-decoration-none">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-4 pb-4 border-top text-muted small d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0">© 2026 FindSalon. The Tactile Curator.</p>
          <div className="fw-medium" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
            LONDON | PARIS | NEW YORK
          </div>
        </div>
      </div>
    </footer>
  );
}
