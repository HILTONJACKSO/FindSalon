'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  FiPlus, 
  FiTag, 
  FiCalendar, 
  FiTrash2, 
  FiEdit3, 
  FiCheckCircle, 
  FiXCircle,
  FiSearch,
  FiClock
} from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function OwnerDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [currentDeal, setCurrentDeal] = useState<any>({
    salon: '',
    title: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    promo_code: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dealsRes, salonsRes] = await Promise.all([
        api.get('/deals/'),
        api.get('/salons/mine/')
      ]);
      
      const salonsList = Array.isArray(salonsRes.data.results) ? salonsRes.data.results : (Array.isArray(salonsRes.data) ? salonsRes.data : []);
      const dealsList = Array.isArray(dealsRes.data.results) ? dealsRes.data.results : (Array.isArray(dealsRes.data) ? dealsRes.data : []);
      
      setDeals(dealsList);
      setSalons(salonsList);

      
      if (salonsList.length > 0 && !currentDeal.salon) {
        setCurrentDeal((prev: any) => ({ ...prev, salon: salonsList[0].id }));
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch deals data", err);
      setLoading(false);
    }
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.patch(`/deals/${currentDeal.id}/`, currentDeal);
        showNotify("Promotion updated successfully!");
      } else {
        await api.post('/deals/', currentDeal);
        showNotify("New promotion created successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error("Failed to save deal", err);
      let errorMsg = "Something went wrong. Please try again.";
      if (err.response?.data) {
        // Handle Django Rest Framework error structure
        const data = err.response.data;
        if (typeof data === 'object') {
          errorMsg = Object.entries(data).map(([key, val]) => `${key}: ${val}`).join(' | ');
        } else {
          errorMsg = data;
        }
      }
      showNotify(errorMsg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    try {
      await api.delete(`/deals/${id}/`);
      showNotify("Promotion deleted successfully!");
      fetchData();
    } catch (err: any) {
      console.error("Failed to delete deal", err);
      showNotify("Failed to delete promotion.", 'error');
    }
  };

  const openEdit = (deal: any) => {
    setCurrentDeal({
      ...deal,
      start_date: deal.start_date.split('T')[0],
      end_date: deal.end_date.split('T')[0]
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentDeal({
      salon: salons[0]?.id || '',
      title: '',
      description: '',
      discount_percentage: '',
      discount_amount: '',
      promo_code: '',
      start_date: '',
      end_date: '',
      is_active: true
    });
    setIsEditing(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="pb-5 position-relative">
      <OwnerHeader onQuickAction={handleOpenAddModal} />
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div 
          className={`position-fixed top-0 start-50 translate-middle-x mt-4 z-3 shadow-lg rounded-pill px-4 py-3 d-flex align-items-center gap-3 animate-fade-in ${notification.type === 'success' ? 'bg-dark text-white' : 'bg-danger text-white'}`}
          style={{ minWidth: '300px', border: notification.type === 'success' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
        >
          {notification.type === 'success' ? <FiCheckCircle className="text-success" size={20} /> : <FiXCircle size={20} />}
          <span className="fw-medium small">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="btn btn-sm btn-link text-white p-0 ms-auto opacity-50"><FiXCircle /></button>
        </div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 mt-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Promotions & Deals</h2>
          <p className="text-muted mb-0">Create and manage exclusive offers for your customers.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn btn-rust rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm transition-all hover-scale"
        >
          <FiPlus /> Create New Deal
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 bg-white shadow-sm rounded-5 p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3">
                <FiTag size={24} />
              </div>
            </div>
            <h3 className="fw-bold mb-1">{deals.length}</h3>
            <p className="text-muted small mb-0">Total Deals Created</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-white shadow-sm rounded-5 p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="bg-success bg-opacity-10 text-success rounded-circle p-3">
                <FiCheckCircle size={24} />
              </div>
            </div>
            <h3 className="fw-bold mb-1">{deals.filter(d => d.is_active).length}</h3>
            <p className="text-muted small mb-0">Active Promotions</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-white shadow-sm rounded-5 p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3">
                <FiClock size={24} />
              </div>
            </div>
            <h3 className="fw-bold mb-1">{deals.filter(d => new Date(d.end_date) < new Date()).length}</h3>
            <p className="text-muted small mb-0">Expired Deals</p>
          </div>
        </div>
      </div>

      {/* DEALS LIST */}
      <div className="card border-0 bg-white shadow-sm rounded-5 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small fw-bold text-muted text-uppercase">Title & Code</th>
                <th className="px-4 py-3 border-0 small fw-bold text-muted text-uppercase">Discount</th>
                <th className="px-4 py-3 border-0 small fw-bold text-muted text-uppercase">Duration</th>
                <th className="px-4 py-3 border-0 small fw-bold text-muted text-uppercase">Status</th>
                <th className="px-4 py-3 border-0 small fw-bold text-muted text-uppercase text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <div className="spinner-border text-rust" role="status"></div>
                  </td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <FiTag size={48} className="text-muted opacity-25 mb-3" />
                    <h5 className="text-muted">No deals found</h5>
                    <p className="text-muted small">Start by creating your first promotional offer.</p>
                  </td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id}>
                    <td className="px-4 py-3">
                      <div>
                        <div className="fw-bold text-dark">{deal.title}</div>
                        <div className="badge bg-light text-muted fw-bold font-monospace mt-1">{deal.promo_code}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {deal.discount_percentage ? (
                        <span className="fw-bold text-rust">{deal.discount_percentage}% OFF</span>
                      ) : (
                        <span className="fw-bold text-success">${deal.discount_amount} OFF</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="small text-muted d-flex align-items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(deal.start_date).toLocaleDateString()} - {new Date(deal.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {deal.is_active ? (
                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">Active</span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-10 text-muted rounded-pill px-3 py-2">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button onClick={() => openEdit(deal)} className="btn btn-light btn-sm rounded-circle p-2"><FiEdit3 /></button>
                        <button onClick={() => handleDelete(deal.id)} className="btn btn-light btn-sm rounded-circle p-2 text-danger"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div className="card border-0 rounded-5 shadow-lg bg-white p-4 w-100 mx-3 d-flex flex-column" style={{ maxWidth: '600px', maxHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
              <h4 className="fw-bold mb-0">{isEditing ? 'Edit Deal' : 'Create New Deal'}</h4>
              <button onClick={() => setShowModal(false)} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><FiXCircle size={24} /></button>
            </div>
            
            <div className="flex-grow-1 overflow-y-auto px-2 custom-modal-scroll" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <form onSubmit={handleSaveDeal} id="dealForm">
                <div className="row g-3">
                  {salons.length > 1 && (
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Select Salon</label>
                      <select 
                        className="form-select rounded-4 p-3 bg-light border-0"
                        value={currentDeal.salon}
                        onChange={(e) => setCurrentDeal({...currentDeal, salon: e.target.value})}
                        required
                      >
                        {salons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="col-md-8">
                    <label className="form-label small fw-bold text-muted">Deal Title</label>
                    <input 
                      type="text" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      placeholder="e.g., Summer Glow Up"
                      value={currentDeal.title}
                      onChange={(e) => setCurrentDeal({...currentDeal, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">Promo Code</label>
                    <input 
                      type="text" 
                      className="form-control rounded-4 p-3 bg-light border-0 font-monospace"
                      placeholder="SUMMER20"
                      value={currentDeal.promo_code}
                      onChange={(e) => setCurrentDeal({...currentDeal, promo_code: e.target.value.toUpperCase()})}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Description</label>
                    <textarea 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      rows={2}
                      placeholder="Tell your customers about this offer..."
                      value={currentDeal.description}
                      onChange={(e) => setCurrentDeal({...currentDeal, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Discount %</label>
                    <input 
                      type="number" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      placeholder="20"
                      value={currentDeal.discount_percentage}
                      onChange={(e) => setCurrentDeal({...currentDeal, discount_percentage: e.target.value, discount_amount: ''})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Fixed Amount ($)</label>
                    <input 
                      type="number" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      placeholder="10.00"
                      value={currentDeal.discount_amount}
                      onChange={(e) => setCurrentDeal({...currentDeal, discount_amount: e.target.value, discount_percentage: ''})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Start Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      value={currentDeal.start_date}
                      onChange={(e) => setCurrentDeal({...currentDeal, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">End Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-4 p-3 bg-light border-0"
                      value={currentDeal.end_date}
                      onChange={(e) => setCurrentDeal({...currentDeal, end_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="is_active" 
                        checked={currentDeal.is_active}
                        onChange={(e) => setCurrentDeal({...currentDeal, is_active: e.target.checked})}
                      />
                      <label className="form-check-label small fw-bold text-muted" htmlFor="is_active">Make this deal active immediately</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-4 pt-3 border-top d-flex gap-3 px-2">
              <button type="submit" form="dealForm" className="btn btn-rust flex-grow-1 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale">Save Promotion</button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-secondary flex-grow-1 rounded-pill py-3 fw-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.02); }
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .btn-rust { background-color: #9C4A34; color: white; border: none; }
        .btn-rust:hover { background-color: #843d2b; color: white; }
        .rounded-5 { border-radius: 2rem !important; }
        .rounded-4 { border-radius: 1rem !important; }
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

        .animate-fade-in {
          animation: fadeInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
