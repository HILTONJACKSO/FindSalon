'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiDollarSign, 
  FiCalendar, 
  FiScissors, 
  FiDatabase, 
  FiUsers, 
  FiSettings, 
  FiHelpCircle, 
  FiLogOut,
  FiPlus,
  FiMenu,
  FiX
} from 'react-icons/fi';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', icon: <FiDollarSign />, path: '/owner/dashboard' },
    { label: 'Inventory', icon: <FiDatabase />, path: '/owner/inventory' },
    { label: 'Customers', icon: <FiUsers />, path: '/owner/customers' },
    { label: 'Services', icon: <FiScissors />, path: '/owner/services' },
    { label: 'Settings', icon: <FiSettings />, path: '/owner/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/owner/dashboard' && pathname === '/owner/dashboard') return true;
    return pathname === path;
  };

  return (
    <div className="d-flex min-vh-100 bg-sand" style={{ backgroundColor: '#FDFBF7' }}>
      
      {/* Mobile Sidebar Toggler */}
      <button 
        className="btn d-md-none position-fixed top-0 start-0 m-3 z-3 bg-white shadow-sm rounded-circle p-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`bg-white border-end d-flex flex-column transition-all z-2 overflow-y-auto sidebar-custom-scroll ${isSidebarOpen ? 'translate-x-0' : 'translate-x-mobile-hide'} position-fixed position-md-sticky h-100vh h-md-auto`}
        style={{ 
          width: '280px', 
          minWidth: '280px', 
          backgroundColor: '#FFF',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          top: 0
        }}
      >
        <div className="p-4 pt-5">
          {/* Logo / Salon Info */}
          <div className="mb-5">
                <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-1.5px' }}>Aura Luxe</h4>
                <p className="text-muted fw-bold mb-0" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>PREMIUM SALON TIER</p>
          </div>

          {/* Book Appointment CTA */}
          <div className="mb-5">
            <button className="btn btn-warning w-100 rounded-pill py-3 fw-bold text-white shadow-lg border-0 transition-all hover-scale" style={{ backgroundColor: '#E65C00' }}>
               Book Appointment
            </button>
          </div>

          {/* Navigation */}
          <nav className="d-flex flex-column gap-2 mb-auto">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`text-decoration-none px-4 py-3 rounded-pill d-flex align-items-center gap-3 transition-all ${isActive(item.path) ? 'bg-white shadow-sm border border-opacity-10 text-rust fw-bold' : 'text-muted hover-bg-sand fw-medium'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={isActive(item.path) ? 'text-rust' : 'text-muted opacity-50'}>{item.icon}</span>
                <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto border-top border-opacity-10">
          <Link href="/owner/support" className="text-decoration-none text-muted d-flex align-items-center gap-3 px-4 py-2 hover-rust mb-2 small fw-bold">
            <FiHelpCircle className="opacity-50" /> Support
          </Link>
          <button className="btn btn-link text-decoration-none text-muted d-flex align-items-center gap-3 px-4 py-2 w-100 text-start hover-rust p-0 shadow-none border-0 small fw-bold">
            <FiLogOut className="opacity-50" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-3 p-md-5 overflow-auto">
        <div className="container-fluid p-0">
           {children}
        </div>
      </main>

      <style jsx global>{`
        .h-100vh { height: 100vh; }
        .translate-x-mobile-hide {
           transform: translateX(-100%);
        }
        @media (min-width: 768px) {
          .translate-x-mobile-hide {
            transform: translateX(0);
          }
          .position-md-sticky {
            position: sticky !important;
          }
        }
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom Scrollbar for Sidebar */
        .sidebar-custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-custom-scroll::-webkit-scrollbar-track {
          background: #FDFBF7;
        }
        .sidebar-custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(156, 74, 52, 0.4);
          border-radius: 10px;
          transition: background-color 0.3s ease;
        }
        .sidebar-custom-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(156, 74, 52, 1);
        }
        .sidebar-custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 74, 52, 0.4) #FDFBF7;
        }
      `}</style>
    </div>
  );
}
