'use client';

import React from 'react';
import { FiUserPlus, FiMoreHorizontal, FiChevronLeft, FiChevronRight, FiCheck, FiSearch } from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    first_name: '', last_name: '', email: '', phone: '', is_vip: false, notes: ''
  });
  const [submitting, setSubmitting] = React.useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/customers/stats/');
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers/', { params: { search: searchTerm } });
      setCustomers(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get('/customers/activities/');
      setActivities(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/customers/', formData);
      setShowAddModal(false);
      setFormData({ first_name: '', last_name: '', email: '', phone: '', is_vip: false, notes: '' });
      fetchCustomers();
      fetchStats();
      fetchActivities();
    } catch (error) {
      console.error("Error adding customer", error);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchCustomers(), fetchActivities()]);
      setLoading(false);
    };
    init();

    const interval = setInterval(() => {
      fetchStats();
      fetchCustomers();
      fetchActivities();
    }, 5000);

    return () => clearInterval(interval);
  }, [searchTerm]);

  const kpis = [
    { label: 'TOTAL CUSTOMERS', value: stats?.total_customers?.toLocaleString() || '0', color: 'rust' },
    { label: 'ACTIVE THIS MONTH', value: stats?.active_this_month?.toLocaleString() || '0', color: 'blue' },
    { label: 'AVERAGE LTV', value: `$${stats?.avg_ltv || '0'}`, color: 'orange' },
    { label: 'NEW REGISTRATIONS', value: `${stats?.new_registrations_pct >= 0 ? '+' : ''}${stats?.new_registrations_pct || '0'}%`, color: 'green' },
  ];

  return (
    <div className="pb-5">
      <OwnerHeader />

      {/* PAGE HEADER */}
      <div className="row align-items-center mb-5">
        <div className="col-12 col-md-5">
          <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Customer Base</h1>
          <p className="text-muted mb-0">Manage your elite clientele and their preferences.</p>
        </div>
        <div className="col-12 col-md-3">
          <div className="position-relative">
            <FiSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
            <input 
              type="text" 
              className="form-control rounded-pill border-0 shadow-sm ps-5 py-3 bg-white" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-rust rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ms-md-auto"
          >
            <FiUserPlus size={20} /> Add Customer
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-12 col-md-3">
            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale">
              <span className="text-muted fw-bold mb-2 d-block" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{kpi.label}</span>
              <h2 className="fw-bold mb-0" style={{ letterSpacing: '-1px' }}>{kpi.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* CUSTOMER TABLE CARD */}
      <div className="bg-white rounded-5 shadow-sm border border-opacity-10 mb-5 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-sand bg-opacity-50">
              <tr>
                <th className="px-5 py-4 border-0 text-muted small fw-bold letter-spaced">CUSTOMER</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">LAST VISIT</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">TOTAL SPENT</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">TOP SERVICE</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced text-end px-5">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr 
                  key={cust.id} 
                  onClick={() => setSelectedCustomer(cust)}
                  className={`cursor-pointer transition-all ${selectedCustomer?.id === cust.id ? 'bg-rust bg-opacity-5' : ''}`}
                >
                  <td className="px-5 py-4 border-bottom border-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle overflow-hidden shadow-sm bg-sand d-flex align-items-center justify-content-center fw-bold text-rust" style={{ width: '44px', height: '44px' }}>
                        {cust.avatar ? <img src={cust.avatar} alt={cust.first_name} className="w-100 h-100 object-fit-cover" /> : cust.first_name[0]}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{cust.first_name} {cust.last_name} {cust.is_vip && <span className="badge bg-rust text-white ms-1" style={{ fontSize: '0.5rem' }}>VIP</span>}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{cust.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light fw-medium text-muted">{cust.last_visit ? new Date(cust.last_visit).toLocaleDateString() : 'No visits'}</td>
                  <td className="py-4 border-bottom border-light fw-bold text-dark">${parseFloat(cust.total_spent).toLocaleString()}</td>
                  <td className="py-4 border-bottom border-light">
                    <span className="badge rounded-pill px-3 py-2 fw-bold text-dark opacity-75" style={{ backgroundColor: cust.service_color || '#E5EFFF', fontSize: '0.65rem' }}>
                      {cust.top_service || 'NEW'}
                    </span>
                  </td>
                  <td className="py-4 border-bottom border-light text-end px-5">
                    <button className="btn btn-light rounded-circle p-2 border-0 bg-transparent text-muted">
                        <FiMoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-5 py-4 bg-sand bg-opacity-30 d-flex justify-content-between align-items-center border-top">
          <span className="text-muted small fw-bold">SHOWING {customers.length} OF {stats?.total_customers || 0} CUSTOMERS</span>
          <div className="d-flex gap-2">
            <button className="btn btn-light rounded-pill p-2 border-0 bg-white shadow-sm opacity-50" disabled><FiChevronLeft /></button>
            <button className="btn rounded-circle fw-bold btn-rust text-white shadow" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>1</button>
            <button className="btn btn-light rounded-pill p-2 border-0 bg-white shadow-sm opacity-50" disabled><FiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="row g-5">
        {/* RECENT ACTIVITY */}
        <div className="col-12 col-xl-4">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <h4 className="fw-bold mb-5">Recent Activity</h4>
            <div className="d-flex flex-column gap-5 position-relative ms-2">
              {/* Vertical line indicator */}
              <div className="position-absolute start-0 h-100 border-start border-2 opacity-10" style={{ marginLeft: '-1px' }}></div>
              
              <div className="d-flex flex-column gap-5">
                {activities.length > 0 ? activities.map((activity, idx) => (
                  <div key={activity.id} className="position-relative ps-4">
                    <div className="position-absolute start-0 rounded-circle bg-rust" style={{ width: '12px', height: '12px', marginLeft: '-7px', top: '5px' }}></div>
                    <h6 className="fw-bold mb-1">{activity.description}</h6>
                    <span className="text-muted small">{new Date(activity.created_at).toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="text-muted small italic">No recent activity</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER INSIGHTS PANEL */}
        <div className="col-12 col-xl-8">
          {selectedCustomer ? (
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100 animate-fade-in">
                <div className="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom border-light">
                    <div className="rounded-circle overflow-hidden shadow bg-sand d-flex align-items-center justify-content-center fw-bold text-rust" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                        {selectedCustomer.avatar ? <img src={selectedCustomer.avatar} alt={selectedCustomer.first_name} className="w-100 h-100 object-fit-cover" /> : selectedCustomer.first_name[0]}
                    </div>
                    <div>
                        <h3 className="fw-bold mb-1">{selectedCustomer.first_name} {selectedCustomer.last_name}</h3>
                        <p className="text-muted mb-0">{selectedCustomer.email}</p>
                        {selectedCustomer.is_vip && <span className="badge bg-rust text-white mt-2 px-3 py-2 rounded-pill" style={{ fontSize: '0.65rem' }}>VIP CLIENT</span>}
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-12 col-md-4">
                        <div className="bg-sand bg-opacity-50 rounded-4 p-4 border">
                            <span className="text-muted small fw-bold d-block mb-1">TOTAL SPENT</span>
                            <h4 className="fw-bold text-dark mb-0">${parseFloat(selectedCustomer.total_spent).toLocaleString()}</h4>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="bg-sand bg-opacity-50 rounded-4 p-4 border">
                            <span className="text-muted small fw-bold d-block mb-1">LAST VISIT</span>
                            <h4 className="fw-bold text-dark mb-0">{selectedCustomer.last_visit ? new Date(selectedCustomer.last_visit).toLocaleDateString() : 'N/A'}</h4>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="bg-sand bg-opacity-50 rounded-4 p-4 border">
                            <span className="text-muted small fw-bold d-block mb-1">TOP SERVICE</span>
                            <h4 className="fw-bold text-dark mb-0">{selectedCustomer.top_service || 'N/A'}</h4>
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <h5 className="fw-bold mb-4">Internal Styling Notes</h5>
                    <div className="bg-light bg-opacity-30 rounded-4 p-4 border border-dashed text-muted italic min-vh-10" style={{ minHeight: '100px' }}>
                        {selectedCustomer.notes || 'No private notes available for this client.'}
                    </div>
                </div>

                <div>
                    <h5 className="fw-bold mb-4">Recent Bookings</h5>
                    <div className="text-center py-5 bg-sand bg-opacity-30 rounded-4 border border-light">
                        <p className="text-muted small mb-0">Coming Soon: Booking history integration</p>
                    </div>
                </div>
            </div>
          ) : (
            <div className="bg-sand bg-opacity-50 rounded-5 p-5 border border-2 border-white border-dashed h-100 d-flex flex-column align-items-center justify-content-center text-center py-5 shadow-inner">
                <div className="mb-4 text-muted opacity-30">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
                </div>
                <h5 className="fw-bold text-dark mb-3">Select a customer to view detailed insights</h5>
                <p className="text-muted small mx-auto" style={{ maxWidth: '350px' }}>
                    Access comprehensive booking history, private styling notes, and spending patterns here.
                </p>
            </div>
          )}
        </div>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 9999 }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '500px' }}>
                <div className="p-5">
                    <h2 className="fw-bold mb-4" style={{ letterSpacing: '-1px' }}>New Client</h2>
                    <form onSubmit={handleAddCustomer}>
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="form-label small fw-bold text-muted">FIRST NAME</label>
                                <input type="text" name="first_name" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" required value={formData.first_name} onChange={handleInputChange} />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-bold text-muted">LAST NAME</label>
                                <input type="text" name="last_name" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" required value={formData.last_name} onChange={handleInputChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted">EMAIL</label>
                                <input type="email" name="email" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" required value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted">PHONE</label>
                                <input type="text" name="phone" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" value={formData.phone} onChange={handleInputChange} />
                            </div>
                            <div className="col-12">
                                <div className="form-check form-switch mt-2">
                                    <input className="form-check-input" type="checkbox" name="is_vip" checked={formData.is_vip} onChange={handleInputChange} />
                                    <label className="form-check-label fw-bold small text-muted">MARK AS VIP CLIENT</label>
                                </div>
                            </div>
                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm" disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Register Client'}
                                </button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-link w-100 mt-2 text-muted text-decoration-none small">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .bg-sand { background-color: #FDFBF7; }
        .shadow-inner { box-shadow: inset 0 2px 15px rgba(0,0,0,0.02); }
        .hover-scale:hover { transform: translateY(-5px); }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}
