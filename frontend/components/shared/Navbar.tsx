'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiMenu, FiX, FiBell, FiShoppingBag } from 'react-icons/fi';

export default function Navbar({ 
  variant: propVariant, 
  isLoggedIn: propIsLoggedIn 
}: { 
  variant?: 'default' | 'search' | 'profile', 
  isLoggedIn?: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide global navbar for owner dashboard pages
  if (pathname?.startsWith('/owner')) return null;

  // Auto-detect states based on route if not provided as props
  const isLoggedIn = propIsLoggedIn ?? (
    pathname?.startsWith('/profile') || 
    pathname?.startsWith('/bookings') || 
    pathname?.startsWith('/favorites') ||
    pathname?.includes('/book') // Assume logged in for booking flow
  );

  const variant = propVariant ?? (
    (pathname === '/' || pathname === '') ? 'default' :
    (pathname?.startsWith('/salons') && !pathname?.includes('/book')) ? 'search' :
    'profile'
  );

  const navItems = isLoggedIn 
    ? [
        { label: 'Explore', path: '/salons' },
        { label: 'Bookings', path: '/bookings' },
        { label: 'Favorites', path: '/favorites' },
        { label: 'Profile', path: '/profile' }
      ]
    : [
        { label: 'Salons', path: '/salons' },
        { label: 'Explore', path: '/explore' },
        { label: 'Deals', path: '/deals' }
      ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/salons' && pathname.startsWith('/salons')) return true;
    return pathname === path;
  };

  return (
    <nav className={`navbar py-3 px-4 px-md-5 sticky-top z-3 shadow-sm ${variant !== 'default' ? 'bg-white border-bottom' : 'bg-white'}`} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container-fluid align-items-center">
        <Link href="/" className="navbar-brand me-4 d-flex align-items-center">
          <div className="fw-bold fs-3 text-dark" style={{ letterSpacing: '-1.5px' }}>Aura Velvet</div>
        </Link>

        {/* Toggler for Mobile */}
        <button className="navbar-toggler border-0 d-md-none shadow-none" onClick={() => setIsOpen(!isOpen)} style={{ outline: 'none' }}>
          {isOpen ? <FiX size={26} className="text-dark" /> : <FiMenu size={26} className="text-dark" />}
        </button>

        {/* Desktop Search Pill (Conditional) */}
        {variant === 'search' && !isLoggedIn && (
          <div className="search-pill bg-sand flex-grow-1 mx-4 d-none d-md-flex" style={{ maxWidth: '400px' }}>
            <FiSearch className="text-muted ms-2" size={18} />
            <input type="text" placeholder="Search..." className="w-100 bg-transparent border-0 ms-2 px-1 shadow-none" style={{ fontSize: '0.9rem', outline: 'none' }} />
          </div>
        )}

        {/* Desktop Nav Items */}
        <div className="d-none d-md-flex align-items-center justify-content-center flex-grow-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`text-decoration-none mx-3 transition-all ${isActive(item.path) ? 'text-rust fw-bold border-bottom border-rust border-2 pb-1' : 'text-dark opacity-75 fw-medium hover-rust'}`}
              style={{ fontSize: '0.95rem' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Items / Profile Actions */}
        <div className="d-none d-md-flex align-items-center gap-3">
          {isLoggedIn ? (
            <>
              <FiBell size={20} className="text-dark opacity-75 cursor-pointer hover-rust" />
              <FiShoppingBag size={20} className="text-dark opacity-75 cursor-pointer hover-rust" />
              <Link href="/profile" className="ms-2">
                <div className="rounded-circle overflow-hidden bg-secondary shadow-sm border border-2 border-rust transition-all hover-scale" style={{ width: '36px', height: '36px' }}>
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="User" className="w-100 h-100 object-fit-cover" />
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-dark fw-bold me-4 text-decoration-none">Sign In</Link>
              <Link href="/register" className="btn-rust text-decoration-none px-4 py-2">Join as Salon</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="w-100 bg-white shadow-lg mt-3 p-4 d-md-none position-absolute start-0" style={{ top: '100%', borderTop: '1px solid #ebe5db' }}>
          <div className="d-flex flex-column gap-3 mb-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className={`fw-bold fs-3 text-decoration-none ${isActive(item.path) ? 'text-rust' : 'text-dark'}`} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
          <hr style={{ opacity: 0.1 }} />
          <div className="d-flex flex-column gap-3 mt-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="btn btn-outline-dark rounded-pill fw-bold py-3 fs-5" onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link href="/register" className="btn btn-rust rounded-pill fw-bold py-3 fs-5" onClick={() => setIsOpen(false)}>Join as Salon</Link>
              </>
            ) : (
              <Link href="/profile" className="btn btn-rust rounded-pill fw-bold py-3 fs-5" onClick={() => setIsOpen(false)}>My Profile</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
