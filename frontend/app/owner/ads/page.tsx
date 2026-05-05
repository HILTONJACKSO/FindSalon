'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api, getImageUrl } from '@/lib/api';
import { 
  FiPlus, 
  FiImage, 
  FiMonitor, 
  FiTrash2, 
  FiEdit3, 
  FiCheckCircle, 
  FiXCircle,
  FiSearch,
  FiClock,
  FiExternalLink,
  FiCreditCard,
  FiZap,
  FiLayout,
  FiEye
} from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';
import toast from 'react-hot-toast';

export default function OwnerAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentAd, setCurrentAd] = useState<any>({
    salon: '',
    title: '',
    description: '',
    link_url: '',
    placement: 'LANDING_PAGE',
    start_date: '',
    end_date: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adsRes, salonsRes] = await Promise.all([
        api.get('/ads/'),
        api.get('/salons/mine/')
      ]);
      
      const salonsList = Array.isArray(salonsRes.data.results) ? salonsRes.data.results : (Array.isArray(salonsRes.data) ? salonsRes.data : []);
      const adsList = Array.isArray(adsRes.data.results) ? adsRes.data.results : (Array.isArray(adsRes.data) ? adsRes.data : []);
      
      setAds(adsList);
      setSalons(salonsList);

      
      if (salonsList.length > 0 && !currentAd.salon) {
        setCurrentAd(prev => ({ ...prev, salon: salonsList[0].id }));
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch ads data", err);
      toast.error("Failed to load ads.");
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentAd({ ...currentAd, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(currentAd).forEach(key => {
        if (key === 'image' && currentAd[key] instanceof File) {
          formData.append(key, currentAd[key]);
        } else if (key !== 'image') {
          formData.append(key, currentAd[key]);
        }
      });

      if (isEditing) {
        await api.patch(`/ads/${currentAd.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Ad updated successfully!");
      } else {
        await api.post('/ads/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Ad campaign created! Proceed to payment to activate.");
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error("Failed to save ad", err);
      toast.error("Failed to save ad campaign.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ad campaign?")) return;
    try {
      await api.delete(`/ads/${id}/`);
      toast.success("Ad deleted successfully!");
      fetchData();
    } catch (err: any) {
      toast.error("Failed to delete ad.");
    }
  };

  const handlePayment = (ad: any) => {
    toast((t) => (
      <span>
        Redirecting to <b>MTN MoMo</b> for ${ad.placement === 'LANDING_PAGE' ? '50.00' : '25.00'} payment...
        <button className="btn btn-sm btn-dark ms-2" onClick={() => toast.dismiss(t.id)}>OK</button>
      </span>
    ), { icon: '💸' });
  };

  const resetForm = () => {
    setCurrentAd({
      salon: salons[0]?.id || '',
      title: '',
      description: '',
      link_url: '',
      placement: 'LANDING_PAGE',
      start_date: '',
      end_date: '',
      image: null
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  const getPlacementLabel = (p: string) => {
    switch(p) {
      case 'LANDING_PAGE': return 'Landing Page Hero';
      case 'BOOKING_PAGE': return 'Booking Sidebar';
      case 'CLIENT_DASHBOARD': return 'Client Dashboard';
      default: return p;
    }
  };

  const getStatusBadge = (s: string) => {
    switch(s) {
      case 'ACTIVE': return <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">Active</span>;
      case 'PENDING': return <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2">Pending Payment</span>;
      case 'EXPIRED': return <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2">Expired</span>;
      default: return <span className="badge bg-secondary bg-opacity-10 text-muted rounded-pill px-3 py-2">{s}</span>;
    }
  };

  return (
    <div className="pb-5 position-relative">
      <OwnerHeader onQuickAction={() => { resetForm(); setShowModal(true); }} />
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 mt-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Ad Studio</h2>

          <p className="text-muted mb-0">Boost your salon's visibility with premium ad placements.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn btn-rust rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm transition-all hover-scale"
        >
          <FiPlus /> Launch Campaign
        </button>
      </div>

      {/* STATS */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100" style={{ backgroundColor: 'rgba(156, 74, 52, 0.05)' }}>
            <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3 d-inline-block mb-3" style={{ width: 'fit-content' }}>
              <FiZap size={20} />
            </div>
            <h3 className="fw-bold mb-1">{ads.filter(a => a.status === 'ACTIVE').length}</h3>
            <p className="text-muted small mb-0 fw-bold">Active Campaigns</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100" style={{ backgroundColor: 'rgba(13, 110, 253, 0.05)' }}>
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-inline-block mb-3" style={{ width: 'fit-content' }}>
              <FiEye size={20} />
            </div>
            <h3 className="fw-bold mb-1">0</h3>
            <p className="text-muted small mb-0 fw-bold">Total Impressions</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100" style={{ backgroundColor: 'rgba(25, 135, 84, 0.05)' }}>
            <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-inline-block mb-3" style={{ width: 'fit-content' }}>
              <FiExternalLink size={20} />
            </div>
            <h3 className="fw-bold mb-1">0</h3>
            <p className="text-muted small mb-0 fw-bold">Click-throughs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-5 p-4 h-100" style={{ backgroundColor: 'rgba(255, 193, 7, 0.05)' }}>
            <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-inline-block mb-3" style={{ width: 'fit-content' }}>
              <FiCreditCard size={20} />
            </div>
            <h3 className="fw-bold mb-1">{ads.filter(a => a.status === 'PENDING').length}</h3>
            <p className="text-muted small mb-0 fw-bold">Awaiting Payment</p>
          </div>
        </div>
      </div>


      {/* ADS GRID */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-rust" role="status"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 bg-white shadow-sm rounded-5 p-5 text-center">
              <FiMonitor size={64} className="text-muted opacity-25 mb-4 mx-auto" />
              <h4 className="fw-bold">No Ad Campaigns Yet</h4>
              <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
                Promote your salon to thousands of potential clients. Start your first campaign today.
              </p>
              <button 
                onClick={() => { resetForm(); setShowModal(true); }}
                className="btn btn-outline-rust rounded-pill px-4 py-2 fw-bold mt-3 mx-auto"
              >
                Create First Ad
              </button>
            </div>
          </div>
        ) : (
          ads.map((ad) => (
            <div className="col-lg-4 col-md-6" key={ad.id}>
              <div className="card border-0 bg-white shadow-sm rounded-5 overflow-hidden h-100 transition-all hover-scale">
                <div className="position-relative" style={{ height: '200px' }}>
                  <img 
                    src={ad.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80'} 
                    alt={ad.title} 
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    {getStatusBadge(ad.status)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark mb-0">{ad.title}</h5>
                    <span className="small text-muted fw-bold">{getPlacementLabel(ad.placement)}</span>
                  </div>
                  <p className="text-muted small mb-4 line-clamp-2">{ad.description || 'No description provided.'}</p>
                  
                  <div className="d-flex align-items-center gap-3 text-muted small mb-4 pt-3 border-top">
                    <div className="d-flex align-items-center gap-1">
                      <FiClock size={14} /> {new Date(ad.start_date).toLocaleDateString()}
                    </div>
                    <span>→</span>
                    <div className="d-flex align-items-center gap-1">
                      {new Date(ad.end_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    {ad.status === 'PENDING' && (
                      <button 
                        onClick={() => handlePayment(ad)}
                        className="btn btn-dark flex-grow-1 rounded-pill small py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                      >
                        <FiCreditCard /> Pay Now
                      </button>
                    )}
                    <button 
                      onClick={() => { setCurrentAd(ad); setIsEditing(true); setShowModal(true); }}
                      className="btn btn-light rounded-circle p-2"
                    >
                      <FiEdit3 />
                    </button>
                    <button 
                      onClick={() => handleDelete(ad.id)}
                      className="btn btn-light rounded-circle p-2 text-danger"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div className="card border-0 rounded-5 shadow-lg bg-white p-4 w-100 mx-3 d-flex flex-column" style={{ maxWidth: '700px', maxHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
              <h4 className="fw-bold mb-0">{isEditing ? 'Update Campaign' : 'New Ad Campaign'}</h4>
              <button onClick={() => setShowModal(false)} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><FiXCircle size={24} /></button>
            </div>
            
            <div className="flex-grow-1 overflow-y-auto px-2 custom-modal-scroll" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <form onSubmit={handleSaveAd} id="adForm">
                <div className="row g-3">
                  <div className="col-md-12">
                    <div 
                      className="ad-upload-zone rounded-4 d-flex flex-column align-items-center justify-content-center p-5 border-dashed border-2 mb-3 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ 
                        backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '200px',
                        border: '2px dashed #ddd',
                        backgroundColor: '#f9f9f9'
                      }}
                    >
                      {!imagePreview && (
                        <>
                          <FiImage size={40} className="text-muted mb-2" />
                          <p className="text-muted small fw-bold">Click to upload ad banner</p>
                          <p className="text-muted" style={{ fontSize: '0.65rem' }}>Recommended: 1200 x 400px (JPG/PNG)</p>
                        </>
                      )}
                      {imagePreview && (
                        <div className="bg-dark bg-opacity-50 text-white rounded-pill px-3 py-1 small fw-bold backdrop-blur">
                          Change Image
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="d-none" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-bold text-muted">Campaign Title</label>
                    <input 
                      type="text" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      placeholder="e.g., Mother's Day Special"
                      value={currentAd.title}
                      onChange={(e) => setCurrentAd({...currentAd, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Placement</label>
                    <select 
                      className="form-select rounded-4 p-3 bg-light border-0"
                      value={currentAd.placement}
                      onChange={(e) => setCurrentAd({...currentAd, placement: e.target.value})}
                      required
                    >
                      <option value="LANDING_PAGE">Landing Page Hero ($50/mo)</option>
                      <option value="BOOKING_PAGE">Booking Sidebar ($25/mo)</option>
                      <option value="CLIENT_DASHBOARD">Client Dashboard ($30/mo)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Link URL (Optional)</label>
                    <input 
                      type="url" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      placeholder="https://yoursalon.com/offer"
                      value={currentAd.link_url}
                      onChange={(e) => setCurrentAd({...currentAd, link_url: e.target.value})}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Description</label>
                    <textarea 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      rows={2}
                      placeholder="What's this promotion about?"
                      value={currentAd.description}
                      onChange={(e) => setCurrentAd({...currentAd, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Start Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      value={currentAd.start_date}
                      onChange={(e) => setCurrentAd({...currentAd, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">End Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      value={currentAd.end_date}
                      onChange={(e) => setCurrentAd({...currentAd, end_date: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-4 pt-3 border-top d-flex gap-3 px-2">
              <button type="submit" form="adForm" className="btn btn-rust flex-grow-1 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale">
                {isEditing ? 'Update Campaign' : 'Create & Proceed'}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-secondary flex-grow-1 rounded-pill py-3 fw-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.02); }
        .text-rust { color: #9C4A34; }
        .btn-rust { background-color: #9C4A34; color: white; border: none; }
        .btn-rust:hover { background-color: #843d2b; color: white; }
        .rounded-5 { border-radius: 2rem !important; }
        .rounded-4 { border-radius: 1rem !important; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .backdrop-blur {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .custom-modal-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-modal-scroll::-webkit-scrollbar-track {
          background: #F8F9FA;
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb {
          background: #9C4A34;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
