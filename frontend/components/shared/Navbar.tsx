'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiMenu, FiX, FiBell, FiShoppingBag, FiLogOut, FiLayout } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar({ 
  variant: propVariant, 
}: { 
  variant?: 'default' | 'search' | 'profile', 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Hide global navbar for owner, admin, and auth pages
  const hidePaths = ['/owner', '/admin', '/login', '/register'];
  if (hidePaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  const variant = propVariant ?? (
    (pathname === '/' || pathname === '') ? 'default' :
    (pathname?.startsWith('/salons') && !pathname?.includes('/book')) ? 'search' :
    'profile'
  );

  const navItems = mounted ? (isLoggedIn 
    ? [
        { label: 'Home', path: '/' },
        { label: 'Explore', path: '/salons' },
        { label: 'Bookings', path: '/bookings' },
        { label: 'Favorites', path: '/favorites' }
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'Salons', path: '/salons' },
        { label: 'Services', path: '/services' },
        { label: 'Subscription', path: '/#pricing' },
        { label: 'Contact', path: '/contact' }
      ]) : [];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/salons' && pathname.startsWith('/salons')) return true;
    return pathname === path;
  };

  const isHome = pathname === '/' || pathname === '';

  return (
    <nav 
      className={`navbar py-3 px-4 px-md-5 sticky-top transition-all duration-500 ${
        scrolled 
          ? 'bg-white bg-opacity-75 backdrop-blur shadow-sm border-bottom' 
          : isHome ? 'bg-transparent' : 'bg-white border-bottom'
      }`}
      style={{ 
        zIndex: 1050,
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',

        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none'
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-4">
          <Link href="/" className="navbar-brand me-0 d-flex align-items-center">
            <img 
              src="/logo.jpg" 
              alt="FindSalon" 
              className="transition-all" 
              style={{ width: '160px', height: 'auto', maxHeight: '55px', objectFit: 'contain', borderRadius: '10px' }} 
            />
          </Link>




        {/* Desktop Nav Items */}
        <div className="d-none d-lg-flex align-items-center ms-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`text-decoration-none mx-3 transition-all ${isActive(item.path) ? 'text-rust fw-bold' : 'text-dark opacity-75 fw-medium hover-rust'}`}
              style={{ fontSize: '1.05rem', letterSpacing: '-0.2px' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

      </div>

      {/* Toggler for Mobile & Tablet */}
      <button className="navbar-toggler border-0 d-lg-none shadow-none p-0" onClick={() => setIsOpen(!isOpen)} style={{ outline: 'none' }}>
        {isOpen ? <FiX size={26} className="text-dark" /> : <FiMenu size={26} className="text-dark" />}
      </button>

      {/* Auth Items / Profile Actions */}
      <div className="d-none d-lg-flex align-items-center gap-4">
        {mounted && (isLoggedIn ? (
          <>
            <Link 
              href={user?.role === 'OWNER' ? '/owner/dashboard' : '/profile'} 
              className="btn btn-outline-rust rounded-pill px-4 py-2 d-flex align-items-center gap-2 small fw-bold"
            >
              <FiLayout size={16} /> Dashboard
            </Link>
            <button 
              onClick={handleSignOut}
              className="btn btn-link text-dark opacity-75 text-decoration-none fw-bold d-flex align-items-center gap-2 p-0"
            >
              <FiLogOut size={18} /> Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-dark fw-bold text-decoration-none hover-rust">Sign In</Link>
            <Link href="/register" className="btn btn-rust text-decoration-none px-4 py-2 rounded-pill fw-bold shadow-sm transition-all hover-scale">Join as Salon</Link>
          </>
        ))}
      </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="w-100 bg-white shadow-lg mt-3 p-4 d-lg-none position-absolute start-0 animate-fade-in" style={{ top: '100%', borderTop: '1px solid #ebe5db', zIndex: 1060 }}>
          <div className="d-flex flex-column gap-3 mb-4">
            {mounted && navItems.map((item) => (
              <Link key={item.path} href={item.path} className={`fw-bold fs-3 text-decoration-none transition-all ${isActive(item.path) ? 'text-rust' : 'text-dark opacity-75'}`} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
          <hr style={{ opacity: 0.1 }} />
          <div className="d-flex flex-column gap-3 mt-4">
            {mounted && (!isLoggedIn ? (
              <>
                <Link href="/login" className="btn btn-outline-dark rounded-pill fw-bold py-3 fs-5 shadow-sm" onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link href="/register" className="btn btn-rust rounded-pill fw-bold py-3 fs-5 shadow-sm" onClick={() => setIsOpen(false)}>Join as Salon</Link>
              </>
            ) : (
              <>
                <Link href={user?.role === 'OWNER' ? '/owner/dashboard' : '/profile'} className="btn btn-outline-rust rounded-pill fw-bold py-3 fs-5 shadow-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <button onClick={handleSignOut} className="btn btn-rust rounded-pill fw-bold py-3 fs-5 shadow-sm">Sign Out</button>
              </>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
