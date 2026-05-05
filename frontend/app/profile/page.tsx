'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiShoppingBag, FiMapPin, FiCalendar, FiChevronRight, 
  FiLogOut, FiHeart, FiStar, FiUser, FiCreditCard, 
  FiShield, FiEdit2, FiBell
} from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { getImageUrl, api } from '@/lib/api';

// --- Interfaces ---
interface SalonDetails {
  id: string;
  name: string;
  image?: string;
  cover_image?: string;
  rating?: number;
  reviews_count?: number;
  address: string;
}

interface ServiceDetails {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  salon_details: SalonDetails;
  service_details: ServiceDetails;
  date: string;
  start_time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

interface Review {
  id: string;
  salon_details: { name: string };
  rating: number;
  comment: string;
}

// --- Component ---
export default function UserProfile() {
  const router = useRouter();
  const { user, initialized, token } = useAuthStore();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<SalonDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication Guard
  useEffect(() => {
    if (initialized && typeof window !== 'undefined') {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'OWNER') {
        router.push('/owner/dashboard');
      }
    }
  }, [initialized, user, router]);

  // Data Fetching
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !token) return;

      try {
        const endpoints = [
          { key: 'bookings', url: 'bookings/' },
          { key: 'reviews', url: 'reviews/mine/' },
          { key: 'favorites', url: 'salons/followed/' }
        ];

        const results = await Promise.allSettled(
          endpoints.map(e => api.get(e.url))
        );

        results.forEach((res, i) => {
          if (res.status === 'fulfilled') {
            const data = Array.isArray(res.value.data) ? res.value.data : res.value.data.results || [];
            const key = endpoints[i].key;
            if (key === 'bookings') setBookings(data);
            if (key === 'reviews') setReviews(data);
            if (key === 'favorites') setFavorites(data);
          } else {
            console.error(`Failed to fetch ${endpoints[i].key}:`, res.reason);
          }
        });
      } catch (error) {
        console.error('Critical error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialized && user) {
      fetchProfileData();
    }
  }, [user, initialized, token]);

  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.patch('/auth/profile/', formData);
      useAuthStore.getState().setAuth({ ...user, avatar: res.data.avatar } as any, token);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!initialized || !user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-sand">
        <div className="spinner-border text-rust" role="status" />
      </div>
    );
  }

  const memberSince = user?.date_joined 
    ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'New Member';

  return (
    <div className="min-vh-100 d-flex flex-column bg-sand">
      <main className="container-fluid px-3 px-md-5 pb-5 pt-2" style={{ maxWidth: '1400px' }}>
         
         {/* User Header Card */}
         <section className="bg-white rounded-5 shadow-sm p-4 p-md-5 mb-5 d-flex flex-column flex-md-row align-items-center justify-content-between border border-opacity-10 text-center text-md-start">
             <div className="d-flex flex-column flex-md-row align-items-center gap-4 gap-md-5">
                  <div className="position-relative">
                      <div className="rounded-circle overflow-hidden border border-4 border-white shadow-sm bg-sand d-flex align-items-center justify-content-center" style={{ width: '140px', height: '140px' }}>
                          {user?.avatar ? (
                            <img 
                              src={getImageUrl(user.avatar) || ''} 
                              alt={user?.first_name || 'User'} 
                              className="w-100 h-100 object-fit-cover" 
                            />
                          ) : (
                            <span className="fw-bold text-rust display-4">
                              {(user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')}
                            </span>
                          )}
                      </div>
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="position-absolute bg-rust text-white rounded-circle d-flex align-items-center justify-content-center shadow border border-2 border-white cursor-pointer transition-all hover-scale" 
                         style={{ width: '32px', height: '32px', bottom: '5px', right: '5px' }}
                         aria-label="Edit Avatar"
                       >
                           <FiEdit2 size={14} />
                       </button>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         onChange={handleAvatarUpdate} 
                         accept="image/*" 
                         className="d-none" 
                       />
                  </div>
                  
                  <div>
                      <h1 className="fw-bold fs-1 mb-2 text-dark" style={{ letterSpacing: '-1px' }}>
                        {user?.first_name} {user?.last_name}
                      </h1>
                      <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-4 text-muted fw-medium small">
                          <span className="d-flex align-items-center justify-content-center justify-content-md-start">
                            <FiMapPin className="text-rust me-2" size={16}/> {user?.location || 'Monrovia, Liberia'}
                          </span>
                          <span className="d-flex align-items-center justify-content-center justify-content-md-start">
                            <FiCalendar className="text-rust me-2" size={16}/> Member since {memberSince}
                          </span>
                      </div>
                  </div>
             </div>
             
             <div className="mt-4 mt-md-0">
                 <Link href="/profile/edit" className="btn btn-rust text-white rounded-pill px-4 py-2 fw-bold shadow-sm transition-all hover-scale">
                   Edit Profile
                 </Link>
             </div>
         </section>

         <div className="row g-5">
            {/* Main Content Area */}
            <div className="col-12 col-xl-8">
                
                {/* Bookings Section */}
                <section className="mb-5">
                    <div className="d-flex justify-content-between align-items-end mb-4 px-1">
                        <h3 className="fw-bold mb-0">Booking History</h3>
                        <Link href="/bookings" className="text-rust fw-bold small letter-spaced text-decoration-none">VIEW ALL</Link>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {isLoading ? (
                          <div className="text-center py-5"><div className="spinner-border text-rust" /></div>
                        ) : bookings.length > 0 ? (
                          bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-center transition-all hover-scale" style={{ borderLeft: `4px solid ${booking.status === 'CONFIRMED' ? '#9C4A34' : '#dee2e6'}!important` }}>
                               <div className="rounded-3 overflow-hidden shadow-sm flex-shrink-0 me-4 bg-sand d-flex align-items-center justify-content-center border" style={{ width: '80px', height: '80px' }}>
                                   {booking.salon_details?.image ? (
                                     <img src={getImageUrl(booking.salon_details.image) || ''} alt="" className="w-100 h-100 object-fit-cover" />
                                   ) : (
                                     <FiShoppingBag className="text-muted opacity-25" size={32} />
                                   )}
                               </div>
                               <div className="flex-grow-1">
                                   <h5 className="fw-bold mb-1">{booking.salon_details?.name}</h5>
                                   <div className="text-muted small mb-1">{booking.service_details?.name}</div>
                                   <div className="text-rust fw-bold small">{new Date(booking.date).toLocaleDateString()} at {booking.start_time}</div>
                               </div>
                               <div className="d-none d-sm-block">
                                   <span className={`badge ${booking.status === 'CONFIRMED' ? 'bg-primary' : 'bg-secondary'} bg-opacity-10 ${booking.status === 'CONFIRMED' ? 'text-primary' : 'text-secondary'} px-3 py-2 rounded-pill fw-bold text-uppercase`} style={{ fontSize: '0.65rem' }}>
                                     {booking.status}
                                   </span>
                               </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white rounded-4 p-5 text-center border border-dashed">
                             <FiCalendar size={48} className="text-muted mb-3 opacity-25" />
                             <h5 className="fw-bold">No bookings yet</h5>
                             <p className="text-muted small mb-4">Start your transformation today by booking a service.</p>
                             <Link href="/salons" className="btn btn-rust rounded-pill px-4">Explore Salons</Link>
                          </div>
                        )}
                    </div>
                </section>

                {/* Saved Salons Section */}
                <section>
                     <div className="d-flex justify-content-between align-items-end mb-4 px-1">
                         <h3 className="fw-bold mb-0">Saved Salons</h3>
                         <Link href="/favorites" className="text-rust fw-bold small letter-spaced text-decoration-none">VIEW ALL</Link>
                     </div>
                     
                     <div className="row g-4">
                        {isLoading ? (
                          <div className="col-12 text-center py-4"><div className="spinner-border text-rust" /></div>
                        ) : favorites.length > 0 ? (
                          favorites.map((salon) => (
                            <div key={salon.id} className="col-12 col-md-6">
                                <div className="bg-white rounded-4 shadow-sm overflow-hidden border border-opacity-10 h-100 d-flex flex-column pb-3">
                                    <div className="position-relative bg-sand d-flex align-items-center justify-content-center border-bottom" style={{ height: '200px' }}>
                                        {salon.cover_image ? (
                                          <img src={getImageUrl(salon.cover_image) || ''} alt={salon.name} className="w-100 h-100 object-fit-cover" />
                                        ) : (
                                          <FiMapPin size={48} className="text-muted opacity-25" />
                                        )}
                                        <div className="position-absolute top-0 end-0 p-3">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm cursor-pointer" style={{ width: '36px', height: '36px' }}>
                                                <FaHeart className="text-rust" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 d-flex justify-content-between align-items-center flex-grow-1">
                                        <div>
                                            <h5 className="fw-bold mb-1">{salon.name}</h5>
                                            <div className="text-muted small d-flex align-items-center">
                                                <FaStar className="text-dark me-1" size={12} /> 
                                                <span className="fw-bold text-dark me-1">{salon.rating || '4.8'}</span> 
                                                ({salon.reviews_count || '0'} reviews)
                                            </div>
                                        </div>
                                        <Link href={`/salons/${salon.id}`} className="btn btn-light bg-sand text-rust fw-bold rounded-pill px-4 shadow-sm border-0 small">View</Link>
                                    </div>
                                </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center py-5 opacity-50 bg-white rounded-4 border border-dashed">
                             <FiHeart size={48} className="mb-2" />
                             <div className="fw-medium">No saved salons yet</div>
                          </div>
                        )}
                     </div>
                </section>
            </div>

            {/* Sidebar Column */}
            <aside className="col-12 col-xl-4">
                <div className="rounded-4 p-4 p-md-5 mb-5 shadow-sm border border-secondary border-opacity-10" style={{ backgroundColor: '#EBE7DF' }}>
                    <h4 className="fw-bold mb-4">Account Settings</h4>
                    <nav className="d-flex flex-column gap-1">
                        <SettingsLink href="/profile/edit" icon={<FiUser />} label="Edit Profile" />
                        <SettingsLink href="/profile/payments" icon={<FiCreditCard />} label="Payment Methods" />
                        <SettingsLink href="/profile/notifications" icon={<FiBell />} label="Notifications" />
                        <SettingsLink href="/profile/privacy" icon={<FiShield />} label="Privacy & Safety" />
                        
                        <button 
                          onClick={handleSignOut}
                          className="btn btn-link d-flex align-items-center gap-3 py-3 mt-3 text-danger fw-bold text-decoration-none transition-all p-0"
                        >
                            <FiLogOut size={18} /> Sign Out
                        </button>
                    </nav>
                </div>

                <section className="bg-white rounded-4 p-4 p-md-5 shadow-sm border border-opacity-10">
                    <h4 className="fw-bold mb-4">My Reviews</h4>
                    <div className="d-flex flex-column gap-4">
                        {isLoading ? (
                          <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-rust" /></div>
                        ) : reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="border-bottom pb-4 last-child-border-0">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold text-dark small">{review.salon_details?.name}</span>
                                    <div className="d-flex text-rust" style={{ gap: '2px' }}>
                                        {[1,2,3,4,5].map(star => (
                                          <FaStar 
                                            key={star} 
                                            size={10} 
                                            style={{ fill: star <= review.rating ? '#9C4A34' : '#dee2e6' }} 
                                          />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-muted small fst-italic lh-base mb-0">"{review.comment}"</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 opacity-50">
                            <FiStar size={32} className="mb-2" />
                            <div className="small fw-medium">No reviews yet</div>
                          </div>
                        )}
                    </div>
                </section>
            </aside>
         </div>
      </main>

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .btn-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 1px; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .last-child-border-0:last-child { border-bottom: 0 !important; }
      `}</style>
    </div>
  );
}

function SettingsLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="d-flex align-items-center justify-content-between py-3 border-bottom border-secondary border-opacity-10 text-decoration-none text-dark fw-medium transition-all hover-scale">
      <div className="d-flex align-items-center gap-3">
        <span className="text-rust opacity-75">{icon}</span>
        {label}
      </div>
      <FiChevronRight className="text-muted" />
    </Link>
  );
}
