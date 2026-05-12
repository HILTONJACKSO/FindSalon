'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiGrid, FiUsers, FiDollarSign, FiSettings, FiLogOut, 
  FiMenu, FiX, FiShield, FiAlertCircle, FiZap, FiShoppingBag, FiBell
} from 'react-icons/fi';

import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && initialized) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'ADMIN') {
        router.replace('/');
      }
    }
  }, [user, initialized, router, mounted]);

  if (!initialized || (user && user.role !== 'ADMIN')) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-sand">
        <div className="spinner-border text-rust" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', icon: <FiGrid />, path: '/admin/dashboard' },
    { label: 'Salons', icon: <FiShield />, path: '/admin/salons' },
    { label: 'Wholesale Items', icon: <FiShoppingBag />, path: '/admin/wholesale' },
    { label: 'Broadcast Alerts', icon: <FiBell />, path: '/admin/broadcast' },
    { label: 'Revenue', icon: <FiDollarSign />, path: '/admin/revenue' },
    { label: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
  ];

  return (
    <div className="admin-container d-flex bg-sand min-vh-100">
      {/* Sidebar */}
      <aside className={`admin-sidebar bg-dark text-white p-4 d-flex flex-column transition-all ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="d-flex align-items-center justify-content-between mb-5 flex-shrink-0">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-rust rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
              <FiShield className="text-white" size={18} />
            </div>
            {isSidebarOpen && <span className="fw-bold fs-5 letter-spaced text-uppercase">Admin Panel</span>}
          </div>
          <button className="btn btn-link text-white p-0 d-md-none" onClick={() => setIsSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="nav flex-column gap-2 flex-grow-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`nav-link d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${pathname === item.path ? 'bg-rust shadow-sm' : 'hover-bg-white-10'}`}
              style={{ color: 'white' }}
            >
              <span className="fs-5" style={{ color: 'white' }}>{item.icon}</span>
              {isSidebarOpen && <span className="fw-medium" style={{ color: 'white' }}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 flex-shrink-0">
          <button 
            className="btn btn-link text-decoration-none d-flex align-items-center gap-3 p-3 w-100 text-start hover-text-white"
            style={{ color: 'white' }}
            onClick={() => router.push('/')}
          >
            <FiLogOut size={20} style={{ color: 'white' }} />
            {isSidebarOpen && <span style={{ color: 'white' }}>Exit Panel</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <header className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1 text-dark">System Administration</h2>
            <p className="text-muted small mb-0">Platform overview and management</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <div className="fw-bold text-dark">{user?.email}</div>
              <div className="text-rust small fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Super Administrator</div>
            </div>
            <img 
              src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=A34E32&color=fff'} 
              className="rounded-circle shadow-sm" 
              style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
              alt="Admin"
            />
          </div>
        </header>

        {children}
      </main>

      <style jsx>{`
        .admin-sidebar {
          width: 280px;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 1000;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 74, 52, 0.5) transparent;
        }
        .admin-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .admin-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-sidebar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 74, 52, 0.3);
          border-radius: 10px;
        }
        .admin-sidebar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 74, 52, 0.6);
        }
        .admin-sidebar.closed {
          width: 80px;
          padding: 1.5rem 1rem !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 74, 52, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 74, 52, 0.6);
        }
        .hover-bg-white-10:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: white !important;
        }
        .hover-text-white:hover {
          color: white !important;
        }
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .letter-spaced {
          letter-spacing: 1px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            left: -280px;
          }
          .admin-sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}
