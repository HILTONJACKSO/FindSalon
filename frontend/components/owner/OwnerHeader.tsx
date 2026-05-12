'use client';

import { FiSearch, FiBell, FiHelpCircle, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface OwnerHeaderProps {
  onQuickAction?: () => void;
  searchPlaceholder?: string;
  actionLabel?: string;
}

export default function OwnerHeader({ onQuickAction, searchPlaceholder, actionLabel }: OwnerHeaderProps) {
  const [profile, setProfile] = useState<any>(null);
  const [salon, setSalon] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Profile
        try {
          const profileRes = await api.get('/auth/profile/');
          setProfile(profileRes.data);
        } catch (e) {
          console.error("Profile fetch failed", e);
        }

        // 2. Fetch Salon
        try {
          const salonRes = await api.get('/salons/mine/');
          const mySalon = Array.isArray(salonRes.data) ? salonRes.data[0] : salonRes.data;
          setSalon(mySalon);
        } catch (e) {
          console.error("Salon fetch failed", e);
        }

        // 3. Fetch Notifications
        try {
          const notifRes = await api.get('/notifications/');
          const notifData = notifRes.data.results || notifRes.data;
          setNotifications(Array.isArray(notifData) ? notifData : []);
        } catch (e) {
          console.error("Notifications fetch failed", e);
          setNotifications([]);
        }

      } catch (err) {
        console.error("Header global fetch error:", err);
      }
    };
    fetchData();

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/mark_read/`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark_all_read/');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-4">
      {/* Search Bar - Desktop and Tablet */}
      <div className="position-relative d-none d-lg-block" style={{ width: '400px' }}>
        <FiSearch className="position-absolute translate-middle-y text-muted" style={{ top: '50%', left: '16px' }} size={18} />
        <input 
          type="text" 
          placeholder={searchPlaceholder || "Search..."} 
          className="form-control rounded-pill border-0 shadow-sm ps-5 py-3"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
        />
      </div>

      {/* Mobile Search Bar (Toggleable) */}
      {showMobileSearch && (
        <div className="d-lg-none w-100 animate-fade-in">
          <div className="position-relative">
            <FiSearch className="position-absolute translate-middle-y text-muted" style={{ top: '50%', left: '16px' }} size={18} />
            <input 
              type="text" 
              autoFocus
              placeholder={searchPlaceholder || "Search..."} 
              className="form-control rounded-pill border-0 shadow-sm ps-5 py-3"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
            />
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted px-3"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Right Side Actions */}
      <div className={`d-flex align-items-center justify-content-between justify-content-md-end gap-3 gap-md-4 flex-grow-1 ${showMobileSearch ? 'd-none' : 'd-flex'}`}>
        <div className="d-flex align-items-center gap-3 text-muted">
          
          {/* Mobile Search Toggle */}
          <FiSearch 
            size={20} 
            className="d-lg-none cursor-pointer hover-rust transition-all" 
            onClick={() => setShowMobileSearch(true)}
          />

          {/* Notifications Bell */}
          <div className="position-relative" ref={notificationRef}>
            <FiBell 
              size={20} 
              className={`cursor-pointer transition-all ${showNotifications ? 'text-rust' : 'hover-rust'}`} 
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-rust p-1 border border-white border-2" style={{ width: '10px', height: '10px' }}>
                <span className="visually-hidden">unread notifications</span>
              </span>
            )}

            {showNotifications && (
              <div 
                className="position-absolute end-0 mt-3 bg-white shadow-lg rounded-5 border border-opacity-10 overflow-hidden z-3" 
                style={{ width: 'clamp(280px, 90vw, 380px)', top: '100%' }}
              >
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-sand bg-opacity-50">
                  <h6 className="fw-bold mb-0 text-dark">Notifications</h6>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="btn btn-link text-rust text-decoration-none small fw-bold p-0"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="notification-list overflow-auto" style={{ maxHeight: '400px' }}>
                  {notifications.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                      <FiInfo size={32} className="opacity-25 mb-3" />
                      <p className="small mb-0">No notifications yet.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-bottom transition-all cursor-pointer hover-bg-sand ${!n.is_read ? 'bg-rust bg-opacity-5' : ''}`}
                        onClick={() => !n.is_read && markAsRead(n.id)}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className={`small mb-0 ${!n.is_read ? 'fw-bold text-dark' : 'text-muted'}`}>{n.title}</h6>
                          <span className="text-muted opacity-50" style={{ fontSize: '0.65rem' }}>
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="small text-muted mb-0 lh-sm">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 bg-sand text-center">
                     <Link href="/owner/notifications" className="text-decoration-none text-rust small fw-bold" onClick={() => setShowNotifications(false)}>View All Alerts</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <FiHelpCircle size={20} className="d-none d-sm-block cursor-pointer hover-rust transition-all" />
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {actionLabel && onQuickAction && (
            <button 
              onClick={onQuickAction}
              className="btn btn-rust rounded-pill px-3 px-md-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm border-0 transition-all hover-scale"
              style={{ fontSize: 'var(--fs-xs)' }}
            >
              <span className="d-none d-sm-inline">{actionLabel}</span>
              <span className="d-sm-none">+</span>
            </button>
          )}

          <div className="border-start ps-3 ps-md-4 d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <div className="d-flex align-items-center gap-2 justify-content-end">
                {salon?.subscription_plan && (
                  <span className={`badge rounded-pill px-2 py-0 small border border-opacity-10 ${salon.subscription_plan === 'PRO' ? 'bg-dark text-white' : 'bg-rust bg-opacity-10 text-rust'}`} style={{ fontSize: '0.6rem' }}>
                    {salon.subscription_plan}
                  </span>
                )}
                <h6 className="fw-bold mb-0 text-dark small">
                  {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email : 'Salon Owner'}
                </h6>
              </div>
              <span className="text-muted fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Salon Owner</span>
            </div>
            <div className="rounded-circle overflow-hidden bg-sand border border-white border-2 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              {profile?.avatar ? (
                <img 
                  src={getImageUrl(profile.avatar)} 
                  alt="Owner" 
                  className="w-100 h-100 object-fit-cover" 
                />
              ) : (
                <span className="fw-bold text-rust small">
                  {(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
