'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getImageUrl, api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
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
  FiGrid,
  FiBriefcase,
  FiTag,
  FiImage,
  FiShoppingBag,
  FiBell
} from 'react-icons/fi';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile/');
        const userProfile = res.data;
        setProfile(userProfile);
        
        if (userProfile.role !== 'OWNER' && userProfile.role !== 'ADMIN') {
          router.push('/profile');
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        router.push('/login');
      }
    };
    fetchProfile();
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!profile) return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-sand">
        <div className="text-center">
            <div className="spinner-border text-rust mb-3" role="status"></div>
            <p className="text-muted small fw-bold">Verifying Credentials...</p>
        </div>
    </div>
  );

  if (profile.role !== 'OWNER' && profile.role !== 'ADMIN') {
    return (
        <div className="d-flex min-vh-100 align-items-center justify-content-center bg-sand">
            <div className="text-center">
                <p className="text-muted small fw-bold">Redirecting to your profile...</p>
            </div>
        </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: <FiGrid />, path: '/owner/dashboard' },
    { label: 'Services', icon: <FiScissors />, path: '/owner/services' },
    { label: 'Lookbook', icon: <FiImage />, path: '/owner/lookbook' },
    { label: 'Bookings', icon: <FiCalendar />, path: '/owner/bookings' },
    { label: 'Inventory', icon: <FiDatabase />, path: '/owner/inventory' },
    { label: 'Customers', icon: <FiUsers />, path: '/owner/customers' },
    { label: 'Staff', icon: <FiBriefcase />, path: '/owner/staff' },
    { label: 'Deals', icon: <FiTag />, path: '/owner/deals' },
    { label: 'Wholesale Supplies', icon: <FiShoppingBag />, path: '/owner/supplies' },
    { label: 'Notifications', icon: <FiBell />, path: '/owner/notifications' },
    { label: 'Analytics', icon: <FiPieChart />, path: '/owner/analytics' },
    { label: 'Billing', icon: <FiDollarSign />, path: '/owner/billing' },
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
        className={`d-flex flex-column transition-all z-2 overflow-y-auto sidebar-custom-scroll ${isSidebarOpen ? 'translate-x-0' : 'translate-x-mobile-hide'} position-fixed position-md-sticky h-100vh h-md-auto`}
        style={{ 
          width: '280px', 
          minWidth: '280px', 
          backgroundColor: '#1E1915',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          top: 0
        }}
      >
        <div className="p-4 pt-5">
          {/* Logo / Salon Info */}
          <div className="mb-5 px-2">
            <Link href="/owner/dashboard" className="text-decoration-none">
              <div className="d-flex align-items-center">
                <img src="/logo.jpg" alt="FindSalon" height="50" className="rounded-1 shadow-sm" style={{ filter: 'brightness(1.1)' }} />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="d-flex flex-column gap-3 mb-5">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`text-decoration-none px-4 py-3 rounded-pill d-flex align-items-center gap-3 transition-all ${isActive(item.path) ? 'bg-white shadow-sm text-rust fw-bold' : 'text-white-50 hover-bg-espresso fw-medium'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={isActive(item.path) ? 'text-rust' : 'text-white-50 opacity-50'}>{item.icon}</span>
                <span style={{ fontSize: '1.05rem' }} className="fw-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider Line */}
        <div className="px-4 mb-2">
            <hr className="my-0 opacity-10" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Sidebar Footer - Profile Card */}
        <div className="p-4 mt-auto">
          <Link href="/owner/settings" className="text-decoration-none text-white-50 d-flex align-items-center gap-3 px-4 py-2 hover-light mb-3 fw-bold" style={{ fontSize: '1rem' }}>
            <FiSettings className="opacity-50" /> <span className="hover-target">Settings</span>
          </Link>
          <Link href="/owner/support" className="text-decoration-none text-white-50 d-flex align-items-center gap-3 px-4 py-2 hover-light mb-4 fw-bold" style={{ fontSize: '1rem' }}>
            <FiHelpCircle className="opacity-50" /> <span className="hover-target">Support</span>
          </Link>
          
          <Link href="/owner/settings?tab=Owner+Profile" className="d-flex align-items-center gap-3 px-3 py-2 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-10 text-decoration-none transition-all hover-scale" onClick={() => setIsSidebarOpen(false)}>
            <div className="rounded-circle overflow-hidden bg-white shadow-sm border d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                {profile?.avatar ? (
                  <img src={getImageUrl(profile.avatar)} alt="Owner" className="w-100 h-100 object-fit-cover" />
                ) : (
                  <span className="fw-bold text-rust small">
                    {(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '')}
                  </span>
                )}
            </div>
            <div className="flex-grow-1 min-w-0">
                <h6 className="fw-bold mb-0 text-white text-truncate" style={{ fontSize: '1rem' }}>
                  {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email : 'Salon Owner Profile'}
                </h6>
                <span className="text-white-50" style={{ fontSize: '0.75rem' }}>View Account</span>
            </div>
          </Link>

          <button 
            onClick={handleLogout}
            className="btn btn-link text-decoration-none text-white-50 d-flex align-items-center gap-3 px-4 py-2 hover-light mt-3 w-100 border-0 fw-bold shadow-none" 
            style={{ fontSize: '1rem' }}
          >
            <FiLogOut className="opacity-50" /> <span className="hover-target">Logout</span>
          </button>
        </div>
      </aside>

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
          background: transparent;
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

        .hover-bg-espresso:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }
        
        .hover-bg-espresso:hover span {
          color: white !important;
          opacity: 1 !important;
        }

        .hover-light:hover {
          color: white !important;
        }

        .hover-target {
          transition: transform 0.3s ease;
          display: inline-block;
        }
        
        .hover-light:hover .hover-target {
          transform: translateX(8px);
        }

        .hover-scale:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
