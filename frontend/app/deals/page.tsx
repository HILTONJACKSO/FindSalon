'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiTag, FiClock, FiStar, FiChevronRight, FiGift, FiPercent, FiCopy, FiHeart, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function DealsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showShareToast, setShowShareToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('Referral Link Copied!');
  const [deals, setDeals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const showNotify = (message: string) => {
    setToastMessage(message);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  React.useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get('/deals/');
        setDeals(res.data.results || res.data);
      } catch (err) {
        console.error("Failed to fetch deals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleInvite = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const referralLink = `${window.location.origin}/register?ref=${user.id}`;
    const shareData = {
      title: 'FindSalon Liberia Referral',
      text: `Join me on FindSalon Liberia and get $10 off your first booking! Use my link:`,
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${referralLink}`);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  return (
    <div className="bg-sand min-vh-100 pb-5">
      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card border-0 bg-white shadow-lg rounded-5 p-4 text-center" style={{ maxWidth: '400px' }}>
            <div className="bg-rust bg-opacity-10 text-rust rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <FiGift size={28} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Login Required</h4>
            <p className="text-muted small mb-4">Please login to get your unique referral link and start earning credits!</p>
            <div className="d-flex flex-column gap-2">
              <button onClick={() => router.push('/login')} className="btn btn-rust rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale">Sign In / Register</button>
              <button onClick={() => setShowAuthModal(false)} className="btn btn-light bg-transparent border-0 text-muted small py-2">Maybe Later</button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE TOAST */}
      {showShareToast && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4 bg-dark text-white px-4 py-2 rounded-pill shadow-lg z-3">
          {toastMessage}
        </div>
      )}
      {/* HERO */}
      <div className="bg-white border-bottom py-5 mb-5 overflow-hidden position-relative">
        <div className="container px-4 text-center position-relative" style={{ zIndex: 2 }}>
          <div className="badge bg-rust text-white mb-3 px-3 py-2 rounded-pill fw-bold letter-spaced">EXCLUSIVE SAVINGS</div>
          <h1 className="fw-bold mb-3 font-serif-italic" style={{ fontSize: '3.5rem', letterSpacing: '-1.5px' }}>
            Luxury, Within Reach
          </h1>
          <p className="text-muted max-w-600 mx-auto fs-5">
            Discover the best beauty deals and limited-time offers from top-rated salons across Liberia.
          </p>
        </div>
        {/* Abstract decorative circles */}
        <div className="position-absolute top-0 start-0 translate-middle bg-rust opacity-5 rounded-circle" style={{ width: '400px', height: '400px' }}></div>
        <div className="position-absolute bottom-0 end-0 translate-middle-y bg-rust opacity-5 rounded-circle" style={{ width: '300px', height: '300px', marginRight: '-150px' }}></div>
      </div>

      <div className="container px-4">
        {/* REFERRAL CARD */}
        <div className="card border-0 rounded-5 shadow-lg overflow-hidden position-relative" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="row g-0">
            <div className="col-md-7 p-5 text-white position-relative" style={{ zIndex: 2 }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiGift className="text-rust" size={24} />
                <span className="fw-bold text-rust letter-spaced small">REFERRAL PROGRAM</span>
              </div>
              <h2 className="fw-bold mb-3 font-serif-italic" style={{ fontSize: '2.5rem' }}>Give $10, Get $10</h2>
              <p className="text-white text-opacity-75 mb-4 max-w-500">
                Share the love of luxury with your friends. When they complete their first booking, both of you get $10 credit towards your next visit.
              </p>
              <button 
                onClick={handleInvite}
                className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-sm transition-all hover-scale"
              >
                Invite Friends
              </button>
            </div>
            <div className="col-md-5 d-none d-md-block">
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80" 
                className="w-100 h-100" 
                style={{ objectFit: 'cover', opacity: 0.7 }} 
                alt="Referral"
              />
            </div>
          </div>
        </div>

        {/* ACTIVE OFFERS */}
        <div className="mt-5 pt-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Active Offers</h2>
              <p className="text-muted small mb-0">Limited-time promotions from our partner salons</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-rust" role="status"></div>
            </div>
          ) : deals.length === 0 ? (
            <div className="card border-0 rounded-5 shadow-sm p-5 text-center bg-white">
              <FiTag size={48} className="text-muted opacity-25 mb-3 mx-auto" />
              <h4 className="fw-bold text-dark mb-2">No Active Deals Today</h4>
              <p className="text-muted">Check back soon for exclusive salon promotions!</p>
            </div>
          ) : (
            <div className="row g-4">
              {deals.map((deal) => (
                <div key={deal.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 h-100 rounded-5 shadow-sm overflow-hidden bg-white transition-all hover-scale position-relative">
                    {/* Discount Badge */}
                    <div className="position-absolute top-0 start-0 m-3 z-2">
                      <div className="bg-rust text-white px-3 py-1 rounded-pill fw-bold small">
                        {deal.discount_percentage ? `${deal.discount_percentage}% OFF` : `$${deal.discount_amount} OFF`}
                      </div>
                    </div>
                    
                    <div className="ratio ratio-16x9">
                      <img 
                        src={deal.salon_image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"} 
                        alt={deal.salon_name} 
                        className="object-fit-cover" 
                      />
                    </div>
                    
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="text-rust fw-bold small mb-1 text-uppercase letter-spaced">{deal.salon_name}</h6>
                          <h4 className="fw-bold text-dark mb-2">{deal.title}</h4>
                        </div>
                      </div>
                      <p className="text-muted small mb-4 line-clamp-2">{deal.description}</p>
                      
                      <div className="bg-sand rounded-4 p-3 d-flex align-items-center justify-content-between">
                        <div>
                          <span className="text-muted small d-block mb-1">PROMO CODE</span>
                          <span className="fw-bold font-monospace text-dark">{deal.promo_code}</span>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(deal.promo_code);
                            showNotify("Code copied!");
                          }}
                          className="btn btn-light rounded-circle p-2 shadow-sm"
                        >
                          <FiCopy size={16} />
                        </button>
                      </div>
                      
                      <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <FiClock size={14} />
                          <span>Ends {new Date(deal.end_date).toLocaleDateString()}</span>
                        </div>
                        <Link href={`/salons/${deal.salon}`} className="text-rust fw-bold text-decoration-none small d-flex align-items-center gap-1">
                          Book Now <FiChevronRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NEWSLETTER */}
        <div className="mt-5 text-center py-5">
          <FiPercent className="text-rust mb-3" size={40} />
          <h3 className="fw-bold text-dark mb-2">Don't Miss Out on Future Deals</h3>
          <p className="text-muted small mb-4">Join 5,000+ others getting exclusive beauty offers in their inbox every week.</p>
          <div className="d-flex justify-content-center">
            <div className="d-flex shadow-sm rounded-pill bg-white p-1" style={{ maxWidth: '450px', width: '100%' }}>
              <input type="email" placeholder="Your email address" className="form-control border-0 px-4 rounded-pill" />
              <button className="btn btn-rust rounded-pill px-4 fw-bold">Join</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.02); }
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .btn-rust { background-color: #9C4A34; color: white; border: none; }
        .btn-rust:hover { background-color: #843d2b; color: white; }
        .letter-spaced { letter-spacing: 1px; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
