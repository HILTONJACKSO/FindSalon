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
  FiX,
  FiPieChart,
  FiGrid
} from 'react-icons/fi';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: <FiGrid />, path: '/owner/dashboard' },
    { label: 'Services', icon: <FiScissors />, path: '/owner/services' },
    { label: 'Bookings', icon: <FiCalendar />, path: '/owner/bookings' },
    { label: 'Inventory', icon: <FiDatabase />, path: '/owner/inventory' },
    { label: 'Customers', icon: <FiUsers />, path: '/owner/customers' },
    { label: 'Staff', icon: <FiUsers />, path: '/owner/staff' },
    { label: 'Analytics', icon: <FiPieChart />, path: '/owner/analytics' },
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

          {/* Navigation */}
          <nav className="d-flex flex-column gap-3 mb-5">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`text-decoration-none px-4 py-3 rounded-pill d-flex align-items-center gap-3 transition-all ${isActive(item.path) ? 'bg-white shadow-sm border border-opacity-10 text-rust fw-bold' : 'text-muted hover-bg-sand fw-medium'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={isActive(item.path) ? 'text-rust' : 'text-muted opacity-50'}>{item.icon}</span>
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Upgrade Card */}
          <div className="mx-2 mb-5">
             <div className="bg-orange p-4 rounded-5 text-white" style={{ background: 'linear-gradient(135deg, #FF7E5F, #FE512E)' }}>
                <h6 className="fw-bold mb-2">Upgrade to Pro</h6>
                <p className="small opacity-75 mb-4" style={{ fontSize: '0.7rem' }}>Unlock advanced analytics and team scheduling tools.</p>
                <button className="btn btn-dark w-100 rounded-pill py-2 fw-bold small border-0 shadow-sm" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>Upgrade</button>
             </div>
          </div>
        </div>

        {/* Sidebar Footer - Profile Card */}
        <div className="p-4 mt-auto border-top border-opacity-10">
          <Link href="/owner/settings" className="text-decoration-none text-muted d-flex align-items-center gap-3 px-4 py-2 hover-rust mb-3 small fw-bold">
            <FiSettings className="opacity-50" /> Settings
          </Link>
          <Link href="/owner/support" className="text-decoration-none text-muted d-flex align-items-center gap-3 px-4 py-2 hover-rust mb-4 small fw-bold">
            <FiHelpCircle className="opacity-50" /> Support
          </Link>
          
          <div className="d-flex align-items-center gap-3 px-3 py-2 bg-sand rounded-4 border border-opacity-10">
            <div className="rounded-circle overflow-hidden bg-secondary shadow-sm" style={{ width: '40px', height: '40px' }}>
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Owner" className="w-100 h-100 object-fit-cover" />
            </div>
            <div className="flex-grow-1 min-w-0">
                <h6 className="fw-bold mb-0 text-dark small text-truncate">Salon Owner Profile</h6>
                <span className="text-muted" style={{ fontSize: '0.65rem' }}>View Account</span>
            </div>
          </div>
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
