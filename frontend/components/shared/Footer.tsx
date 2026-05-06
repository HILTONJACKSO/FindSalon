'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide global footer for owner, admin, and auth pages
  const hidePaths = ['/owner', '/admin', '/login', '/register'];
  if (hidePaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  return (
    <footer className="mt-5 pt-5 border-top text-white-50" style={{ backgroundColor: '#1E1915' }}>
      <div className="container">
        <div className="row small pb-5">
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/logo.jpg" alt="FindSalon Logo" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
              <h5 className="text-white fw-bold mb-0">FindSalon</h5>
            </div>
            <p className="pe-md-5 opacity-75" style={{ lineHeight: '1.6' }}>Redefining the beauty booking experience through curated elegance and selection.</p>
          </div>
          
          <div className="col-6 col-md-2 mb-4 mb-md-0">
            <h6 className="text-white fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/#about" className="text-white-50 text-decoration-none hover-white transition-all">About</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 mb-4 mb-md-0">
            <h6 className="text-white fw-bold mb-3">Salon Partnership</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/register?role=OWNER" className="text-white-50 text-decoration-none hover-white transition-all">Register Business</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-2">
            <h6 className="text-white fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/contact" className="text-white-50 text-decoration-none hover-white transition-all">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-4 pb-5 border-top border-secondary border-opacity-10 text-white-50 small d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0 opacity-50">© 2026 FindSalon. The Tactile Curator.</p>
          <div className="fw-bold letter-spaced opacity-50" style={{ fontSize: '0.65rem' }}>
            MONROVIA | LIBERIA
          </div>
        </div>
      </div>
      <style jsx>{`
        .hover-white:hover { color: #fff !important; }
        .transition-all { transition: all 0.3s ease; }
        .letter-spaced { letter-spacing: 2px; }
      `}</style>
    </footer>
  );
}
