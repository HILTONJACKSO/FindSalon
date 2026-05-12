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
    <footer className="mt-0 pt-5 border-top border-white border-opacity-5 text-white-50" style={{ backgroundColor: '#121212' }}>
      <div className="container">
        <div className="row small pb-5">
          <div className="col-md-5 mb-5 mb-md-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/logo.jpg" alt="FindSalon Logo" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                   onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML += '<h5 class="text-white fw-bold mb-0">FindSalon</h5>' }} />
              <h5 className="text-white fw-bold mb-0">FindSalon</h5>
            </div>
            <p className="pe-md-5 text-white text-opacity-50" style={{ lineHeight: '1.8', maxWidth: '400px' }}>
              Redefining the beauty booking experience through curated elegance and selection.
            </p>
          </div>
          
          <div className="col-6 col-md-3 mb-4 mb-md-0">
            <h6 className="text-white fw-bold mb-4 small letter-spaced text-uppercase">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-3"><Link href="/#about" className="text-white-50 text-decoration-none hover-white transition-all">About</Link></li>
              <li className="mb-3"><Link href="/#pricing" className="text-white-50 text-decoration-none hover-white transition-all">Salon Partnership</Link></li>
              <li className="mb-0"><Link href="/register?role=OWNER" className="text-white-50 text-decoration-none hover-white transition-all">Register Business</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 mb-4 mb-md-0">
            <h6 className="text-white fw-bold mb-4 small letter-spaced text-uppercase">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-0"><Link href="/contact" className="text-white-50 text-decoration-none hover-white transition-all">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-4 pb-5 border-top border-white border-opacity-5 text-white-50 small d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
          <p className="mb-3 mb-md-0 text-white text-opacity-25" style={{ fontSize: '0.75rem' }}>© 2026 FindSalon. The Tactile Curator.</p>
          <div className="fw-bold letter-spaced text-white text-opacity-25" style={{ fontSize: '0.65rem' }}>
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
