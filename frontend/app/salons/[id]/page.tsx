'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiShare2, FiHeart, FiStar, FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, startOfToday, isBefore } from 'date-fns';
import { usePopup } from '@/context/PopupContext';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/lib/location';

export default function SalonProfile() {
  const { location: userLocation } = useLocation();
  const { showPopup } = usePopup();
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [salon, setSalon] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  
  // Booking State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [momoNumber, setMomoNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [salonRes, servicesRes, reviewsRes] = await Promise.all([
          api.get(`/salons/${id}/`),
          api.get(`/services/?salon=${id}`),
          api.get(`/reviews/?salon=${id}`)
        ]);

        setSalon(salonRes.data);
        setServices(servicesRes.data.results || servicesRes.data);
        setReviews(reviewsRes.data.results || reviewsRes.data);
        setIsFollowing(salonRes.data.is_following);
        setFollowersCount(salonRes.data.followers_count);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch salon data", err);
        setError("Failed to load salon details. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleService = (service: any) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Pricing Calculations
  const basePrice = selectedServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
  const discount = basePrice * 0.07;
  const discountedPrice = basePrice - discount;
  const serviceFee = basePrice * 0.04;
  const totalPrice = discountedPrice + serviceFee;
  const payNow = serviceFee;
  const payAtSalon = discountedPrice;

  const handleShare = async () => {
    const shareData = {
      title: salon.name,
      text: `Check out ${salon.name} on FindSalon Liberia!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const toggleFollow = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await api.post(`/salons/${id}/follow/`);
      setIsFollowing(res.data.following);
      setFollowersCount(res.data.followers_count);
    } catch (err) {
      console.error("Failed to toggle follow", err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      const res = await api.post('/reviews/', {
        salon: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      setReviews([res.data, ...reviews]);
      setShowReviewModal(false);
      setNewReview({ rating: 5, comment: '' });
      
      showPopup({
        title: 'Review Published',
        message: 'Your feedback has been shared with the community. Thank you for supporting local excellence!',
        type: 'SUCCESS'
      });
    } catch (err: any) {
      console.error("Failed to submit review", err);
      const msg = err.response?.data?.non_field_errors?.[0] || 
                  err.response?.data?.detail || 
                  "We encountered an issue while publishing your review. Please try again later.";
      showPopup({
        title: 'Submission Error',
        message: msg,
        type: 'ERROR'
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (selectedServices.length === 0 || !selectedDate || !selectedTime) {

      showPopup({
        title: 'Selection Incomplete',
        message: 'Please select a treatment and appointment time to continue.',
        type: 'INFO'
      });
      return;
    }
    
    setIsBooking(true);
    try {
      // Convert "09:00 AM" or "02:30 PM" to "09:00" or "14:30"
      let [time, modifier] = selectedTime.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
      const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;

      const res = await api.post('/bookings/', {
        salon: id,
        services: selectedServices.map(s => s.id),
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: formattedTime,
      });
      
      setCreatedBookingId(res.data.id);
      setShowPaymentModal(true);
    } catch (err: any) {
      console.error("Booking failed", err);
      const msg = err.response?.data?.non_field_errors?.[0] || 
                  err.response?.data?.detail || 
                  "Booking failed. This time slot might already be taken.";
      showPopup({
        title: 'Booking Unavailable',
        message: msg,
        type: 'ERROR'
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!momoNumber || !createdBookingId) return;

    setIsPaying(true);
    try {
      await api.post(`/bookings/${createdBookingId}/pay_deposit/`, {
        momo_number: momoNumber
      });
      
      setShowPaymentModal(false);
      setBookingSuccess(true);
    } catch (err: any) {
      console.error("Payment failed", err);
      showPopup({
        title: 'Payment Failed',
        message: err.response?.data?.detail || "Failed to initiate MoMo payment.",
        type: 'ERROR'
      });
    } finally {
      setIsPaying(false);
    }
  };

  if (bookingSuccess) {
    try {
      return (
        <div className="bg-sand min-vh-100 d-flex align-items-center justify-content-center px-4">
          <div className="card border-0 bg-white shadow-lg rounded-5 p-5 text-center max-w-500">
            <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
              <FiCheckCircle size={40} />
            </div>
            <h2 className="fw-bold mb-3 text-dark">Appointment Secured!</h2>
            <p className="text-muted mb-4">Your visit to <span className="fw-bold text-dark">{salon?.name || 'the salon'}</span> is confirmed for <span className="fw-bold text-rust">{selectedDate ? format(selectedDate, 'MMMM do') : 'Date TBD'}</span> at <span className="fw-bold text-rust">{selectedTime || 'Time TBD'}</span>.</p>
            <div className="bg-light p-3 rounded-4 text-start mb-4">
              <h6 className="fw-bold small text-uppercase letter-spaced mb-2">Services</h6>
              {selectedServices?.map(s => (
                <div key={s.id} className="d-flex justify-content-between small mb-1">
                  <span>{s.name}</span>
                  <span className="fw-bold">${s.price}</span>
                </div>
              ))}
                <div className="d-flex justify-content-between small mb-1">
                  <span>FindSalon Discount (7%)</span>
                  <span className="fw-bold text-success">-${discount?.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Service Fee (4%)</span>
                  <span className="fw-bold">+${serviceFee?.toFixed(2)}</span>
                </div>
              <div className="border-top mt-2 pt-2 d-flex justify-content-between fw-bold">
                <span>Total Price</span>
                <span>${totalPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small text-rust mt-1 fw-bold">
                <span>Service Fee via MoMo</span>
                <span>${payNow?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mt-1">
                <span>Balance Due at Salon</span>
                <span>${payAtSalon?.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => window.location.href = '/'} className="btn btn-dark rounded-pill px-5 py-3 fw-bold w-100 transition-all hover-scale">Return Home</button>
          </div>
        </div>
      );
    } catch (e: any) {
      return <div className="p-5 text-danger bg-white min-vh-100">ERROR RENDERING SUCCESS: {e.toString()}</div>;
    }
  }

  if (loading) {
    return (
      <div className="bg-sand min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-rust" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-bold letter-spaced">CURATING EXPERIENCE...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="bg-sand min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="fw-bold mb-3">Oops!</h2>
          <p className="text-muted">{error || "Salon not found."}</p>
          <Link href="/salons" className="btn btn-rust rounded-pill px-4">Back to Discovery</Link>
        </div>
      </div>
    );
  }

  // Group services by category
  const categories = Array.from(new Set(services.map(s => s.category_name || "General Services")));

  return (
    <div className="bg-sand min-vh-100 pb-5">
      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card border-0 bg-white shadow-lg rounded-5 p-4 text-center" style={{ maxWidth: '400px' }}>
            <div className="bg-rust bg-opacity-10 text-rust rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <FiHeart size={28} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Join Our Community</h4>
            <p className="text-muted small mb-4">Please login to interact with <span className="fw-bold text-dark">{salon.name}</span>, book appointments, and leave reviews.</p>
            <div className="d-flex flex-column gap-2">
              <button onClick={() => router.push('/login')} className="btn btn-rust rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale">Sign In / Register</button>
              <button onClick={() => setShowAuthModal(false)} className="btn btn-light bg-transparent border-0 text-muted small py-2">Continue Browsing</button>
            </div>
          </div>
        </div>
      )}
      {showReviewModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card border-0 bg-white shadow-lg rounded-5 p-4 w-100" style={{ maxWidth: '450px' }}>
            <h4 className="fw-bold text-dark mb-2">Share Your Experience</h4>
            <p className="text-muted small mb-4">How was your visit to {salon.name}?</p>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase letter-spaced">Rating</label>
                <div className="d-flex gap-2 text-rust">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar 
                      key={star} 
                      size={28} 
                      className="cursor-pointer" 
                      style={{ fill: star <= newReview.rating ? 'var(--accent-rust)' : 'none' }} 
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase letter-spaced">Your Review</label>
                <textarea 
                  className="form-control rounded-4 border-secondary border-opacity-10 p-3" 
                  rows={4}
                  placeholder="Tell us about the service..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                ></textarea>
              </div>
              
              <div className="d-flex flex-column gap-2">
                <button type="submit" disabled={isSubmittingReview} className="btn btn-rust rounded-pill py-3 fw-bold shadow-sm">
                  {isSubmittingReview ? 'Posting...' : 'Post Review'}
                </button>
                <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-light bg-transparent border-0 text-muted small py-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MOMO PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card border-0 bg-white shadow-lg rounded-5 p-4 w-100" style={{ maxWidth: '450px' }}>
            <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <FiCheckCircle size={28} />
            </div>
            <h4 className="fw-bold text-dark mb-2 text-center">Secure Your Appointment</h4>
            <p className="text-muted small mb-4 text-center">To secure your booking at <span className="fw-bold text-dark">{salon.name}</span>, please pay the FindSalon Service Fee.</p>
            
            <div className="bg-light p-3 rounded-4 mb-4">
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Pay Now (Service Fee)</span>
                <span className="fw-bold text-dark">${payNow.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Balance Due at Salon</span>
                <span className="fw-bold text-dark">${payAtSalon.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase letter-spaced">MTN Mobile Money Number</label>
                <input 
                  type="tel"
                  className="form-control rounded-4 border-secondary border-opacity-10 p-3" 
                  placeholder="e.g. 0886123456"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  required
                />
                <small className="text-muted d-block mt-2" style={{ fontSize: '0.7rem' }}>A prompt will be sent to your phone to authorize the payment.</small>
              </div>
              
              <div className="d-flex flex-column gap-2">
                <button type="submit" disabled={isPaying || !momoNumber} className="btn btn-warning rounded-pill py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center">
                  {isPaying ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> Processing...</>
                  ) : 'Pay Service Fee via MoMo'}
                </button>
                <button type="button" disabled={isPaying} onClick={() => setShowPaymentModal(false)} className="btn btn-light bg-transparent border-0 text-muted small py-2">Pay Later (Booking remains Pending)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container px-3 px-lg-5 pt-4 mt-2">
        {/* HEADER SECTION */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
          <div>
            <div className="d-flex gap-2 mb-2">
              {salon.rating >= 4.8 && <span className="badge bg-warning text-dark px-2 border border-warning" style={{ fontSize: '0.65rem' }}>FEATURED</span>}
              <span className="badge bg-info text-white bg-opacity-75 px-2 border border-info" style={{ backgroundColor: '#8DB8D0!important', fontSize: '0.65rem' }}>PREMIUM</span>
            </div>
            <h1 className="fw-bold mb-2 text-dark font-serif-italic" style={{ fontSize: '3.5rem', letterSpacing: '-1.5px' }}>{salon.name}</h1>
            <div className="d-flex align-items-center text-muted fw-bold small letter-spaced" style={{ fontSize: '0.75rem' }}>
              <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }} /> <span className="text-dark me-2">{salon.rating}/5.0</span> · 
              <span className="text-decoration-underline mx-2 cursor-pointer">{reviews.length} REVIEWS</span> · 
              <span className="mx-2">{followersCount} FOLLOWERS</span> · {salon.address.toUpperCase()}
              {userLocation && salon.latitude && salon.longitude && (
                <>
                  <span className="mx-2">·</span>
                  <span className="badge bg-rust bg-opacity-10 text-rust rounded-pill px-3 py-1" style={{ fontSize: '0.65rem' }}>
                    {formatDistance(calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(salon.latitude), parseFloat(salon.longitude)))} FROM YOUR LOCATION
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="mt-4 mt-md-0 d-flex gap-2 position-relative">
            {showShareToast && (
              <div className="position-absolute top-0 start-50 translate-middle-x bg-dark text-white px-3 py-1 rounded-pill small shadow-lg" style={{ marginTop: '-40px', whiteSpace: 'nowrap', zIndex: 1000 }}>
                Link Copied!
              </div>
            )}
            <button 
              onClick={handleShare}
              className="btn btn-white bg-white rounded-pill border fw-bold shadow-sm px-4 py-2 d-flex align-items-center transition-all hover-scale"
            >
              <FiShare2 className="me-2" /> Share
            </button>
            <button 
              onClick={toggleFollow}
              className={`btn rounded-pill fw-bold shadow-sm px-4 py-2 d-flex align-items-center transition-all hover-scale ${isFollowing ? 'btn-rust' : 'btn-dark'}`}
            >
              <FiHeart className={`me-2 ${isFollowing ? 'fill-white' : ''}`} style={{ fill: isFollowing ? 'white' : 'none' }} /> 
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* IMAGE GRID */}
        <div className="row g-3 mb-5">
          {salon.images && salon.images.length > 0 ? (
            <>
              <div className={salon.images.length === 1 ? "col-12" : "col-md-8"}>
                <div className="rounded-4 overflow-hidden shadow-sm h-100" style={{ minHeight: '400px' }}>
                  <img src={getImageUrl(salon.images[0].image)} alt={salon.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              {salon.images.length > 1 && (
                <div className="col-md-4 d-flex flex-column gap-3">
                  <div className="row g-3" style={{ height: '190px' }}>
                    <div className={salon.images.length === 2 ? "col-12 h-100" : "col-6 h-100"}>
                      <div className="rounded-4 overflow-hidden h-100 shadow-sm">
                        <img src={getImageUrl(salon.images[1].image)} alt="Salon detailed" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      </div>
                    </div>
                    {salon.images.length > 2 && (
                      <div className="col-6 h-100">
                        <div className="rounded-4 overflow-hidden h-100 shadow-sm">
                          <img src={getImageUrl(salon.images[2].image)} alt="Products" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        </div>
                      </div>
                    )}
                  </div>
                  {salon.images.length > 3 && (
                    <div className="rounded-4 overflow-hidden shadow-sm position-relative" style={{ height: '194px' }}>
                      <button className="btn btn-light bg-white rounded-pill fw-bold shadow-sm px-3 py-1 position-absolute" style={{ bottom: '15px', right: '15px', zIndex: 10, fontSize: '0.8rem' }}>View {salon.images.length} Photos</button>
                      <img src={getImageUrl(salon.images[3].image)} alt="Spa room" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="col-12">
              <div className="rounded-4 overflow-hidden shadow-sm bg-sand d-flex align-items-center justify-content-center" style={{ height: '400px', border: '2px dashed rgba(0,0,0,0.1)' }}>
                <p className="text-muted fw-bold letter-spaced">NO BRAND IMAGERY UPLOADED</p>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT & SIDEBAR */}
        <div className="row position-relative">
          <div className="col-lg-7 pe-lg-5">
            
            {/* Nav Pills */}
            <div className="d-flex gap-2 overflow-auto mb-5 border-bottom pb-4 scrollbar-none">
              <button className="btn btn-rust rounded-pill fw-bold px-4 small shadow-sm text-uppercase letter-spaced">Services</button>
              {categories.map((cat: any) => (
                <button key={cat} className="btn rounded-pill fw-bold px-4 text-muted small text-uppercase letter-spaced transition-all hover-bg-light">{cat}</button>
              ))}
            </div>

            {/* Service Categories */}
            {categories.map((category: any) => (
              <div className="mb-5" key={category}>
                <h3 className="fw-bold mb-4 text-dark">{category}</h3>
                {services.filter(s => (s.category_name || "General Services") === category).map((service) => {
                  const isSelected = selectedServices.find(ss => ss.id === service.id);
                  return (
                    <div 
                      key={service.id} 
                      onClick={() => toggleService(service)}
                      className={`card border-0 shadow-sm rounded-5 mb-3 p-3 p-md-4 d-flex flex-row align-items-center transition-all hover-scale cursor-pointer ${isSelected ? 'border-rust border-2' : 'bg-white'}`}
                      style={isSelected ? { border: '2px solid var(--accent-rust)', backgroundColor: '#FDF2E3' } : {}}
                    >
                      <div className="rounded-4 overflow-hidden me-3 me-md-4 flex-shrink-0" style={{ width: '80px', height: '80px', backgroundColor: '#FDFBF7' }}>
                        <img 
                          src={getImageUrl(service.image) || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'} 
                          alt={service.name} 
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="flex-grow-1 pe-2 pe-md-4">
                        <h6 className="fw-bold mb-1 text-dark text-uppercase letter-spaced" style={{ fontSize: '0.85rem' }}>{service.name}</h6>
                        <p className="text-muted small mb-2 font-serif-italic d-none d-sm-block">{service.description}</p>
                        <div className="d-flex align-items-center gap-3 text-rust fw-bold" style={{ fontSize: '0.7rem' }}>
                          <span className="d-flex align-items-center"><FiClock className="me-1"/> {service.duration} MIN</span>
                        </div>
                      </div>
                      <div className="text-end min-w-80 flex-shrink-0">
                        <h5 className="fw-bold text-dark mb-2">${service.price}</h5>
                        <button className={`btn rounded-pill px-3 px-md-4 py-1 py-md-2 fw-bold small letter-spaced shadow-sm ${isSelected ? 'btn-rust' : 'btn-dark'}`}>
                          {isSelected ? 'ADDED' : 'ADD'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Testimonials */}
            <div className="mb-5 pt-4 border-top">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <div>
                    <h3 className="fw-bold mb-1 text-dark">Client Stories</h3>
                    <div className="fw-bold text-dark small">
                      <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }}/> {salon.rating} / 5.0
                    </div>
                  </div>
                  <button onClick={() => user ? setShowReviewModal(true) : setShowAuthModal(true)} className="btn btn-outline-rust rounded-pill px-4 fw-bold small">Write a Review</button>
                </div>
                
                {reviews.length > 0 ? (
                  <div className="row g-3">
                    {reviews.map((review) => (
                      <div className="col-md-6" key={review.id}>
                        <div className="card bg-white border-0 shadow-sm rounded-5 p-4 h-100">
                          <div className="d-flex align-items-center mb-3">
                            <div className="rounded-circle bg-rust bg-opacity-10 text-rust d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>
                              {review.user_name?.[0] || 'U'}
                            </div>
                            <div>
                              <h6 className="fw-bold text-dark mb-0 fs-6">{review.user_name || 'Guest User'}</h6>
                              <small className="text-muted" style={{ fontSize: '0.7rem' }}>{new Date(review.created_at).toLocaleDateString()}</small>
                            </div>
                          </div>
                          <div className="text-rust mb-2 d-flex gap-1" style={{ fontSize: '0.8rem' }}>
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} style={{ fill: i < review.rating ? 'var(--accent-rust)' : 'none' }}/>
                            ))}
                          </div>
                          <p className="text-muted small font-serif-italic mb-0" style={{ fontSize: '0.85rem' }}>"{review.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-5 p-5 text-center border border-dashed opacity-50">
                    <p className="mb-0 text-muted">No stories shared yet. Be the first to share yours!</p>
                  </div>
                )}
            </div>

          </div>

          {/* SIDEBAR WIDGET */}
          <div className="col-lg-5">
            <div className="card border-0 bg-white shadow-lg rounded-4 p-4 position-sticky" style={{ top: '20px' }}>
              <h4 className="fw-bold text-rust mb-1 fs-5">Reserve Your Visit</h4>
              <p className="text-muted small mb-4">Select your preferred date & time:</p>
              
              {/* Date Picker Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0 text-uppercase letter-spaced" style={{ fontSize: '0.8rem' }}>
                  {format(currentMonth, 'MMMM yyyy')}
                </h6>
                <div className="d-flex gap-2">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                    <FiChevronLeft />
                  </button>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                    <FiChevronRight />
                  </button>
                </div>
              </div>

              {/* Full Calendar Grid */}
              <div className="mb-4">
                <div className="row g-0 mb-2">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                    <div key={day} className="col text-center text-muted fw-bold" style={{ fontSize: '0.65rem' }}>{day}</div>
                  ))}
                </div>
                <div className="row g-1">
                  {(() => {
                    const start = startOfMonth(currentMonth);
                    const end = endOfMonth(currentMonth);
                    const days = eachDayOfInterval({ start, end });
                    
                    // Add padding for start of month
                    const startDay = start.getDay(); // 0 is Sunday
                    const padding = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start
                    
                    return (
                      <>
                        {[...Array(padding)].map((_, i) => (
                          <div key={`pad-${i}`} className="col" style={{ flex: '0 0 14.28%' }}></div>
                        ))}
                        {days.map((date) => {
                          const isPast = isBefore(date, startOfToday());
                          const isSelected = isSameDay(date, selectedDate);
                          return (
                            <div key={date.toString()} className="col" style={{ flex: '0 0 14.28%' }}>
                              <button 
                                onClick={() => !isPast && setSelectedDate(date)}
                                disabled={isPast}
                                className={`btn btn-sm w-100 rounded-circle p-0 d-flex align-items-center justify-content-center border-0 transition-all ${
                                  isSelected ? 'bg-rust text-white shadow-sm scale-110' : 
                                  isPast ? 'text-muted opacity-25 cursor-not-allowed' : 'text-dark hover-bg-light'
                                }`}
                                style={{ height: '32px', fontSize: '0.8rem', fontWeight: isSelected ? '700' : '500' }}
                              >
                                {date.getDate()}
                              </button>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Time Slots */}
              <h6 className="fw-bold text-dark mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.7rem' }}>Available Slots</h6>
              <div className="row g-2 mb-4">
                {['09:00 AM', '10:30 AM', '11:45 AM', '01:15 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'].map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <div className="col-4" key={time}>
                      <button 
                        onClick={() => setSelectedTime(time)}
                        className={`btn w-100 rounded-pill py-2 border fw-medium small transition-all ${
                          isSelected ? 'btn-dark border-dark shadow-sm' : 'bg-white text-dark hover-bg-light'
                        }`} 
                        style={{ fontSize: '0.75rem' }}
                      >
                        {time}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="border-top pt-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-dark small">Original Price ({selectedServices.length} Services)</span>
                  <span className="text-dark small">${basePrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-dark small">FindSalon Discount (7%)</span>
                  <span className="text-success small">-${discount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-dark small">Service Fee (4%)</span>
                  <span className="text-dark small">+${serviceFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center fw-bold mt-2 pt-2 border-top">
                  <span className="text-dark">Total Inclusive</span>
                  <span className="text-dark">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="bg-rust rounded-3 p-3 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-white fw-bold small">Pay Now (Service Fee)</span>
                    <span className="text-white fw-bold small">${payNow.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-white small opacity-75">Balance Due at Salon</span>
                    <span className="text-white small opacity-75">${payAtSalon.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm mb-3 transition-all hover-scale d-flex align-items-center justify-content-center" 
                disabled={selectedServices.length === 0 || !selectedTime || isBooking}
              >
                {isBooking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
              <p className="text-center text-muted mb-0" style={{ fontSize: '0.65rem' }}>Secure your spot by paying the Service Fee via MTN Mobile Money.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
