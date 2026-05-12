'use client';

import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiClock, FiActivity, FiArrowUpRight, FiArrowDownRight, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/admin/');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
      <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-rust" role="status">
              <span className="visually-hidden">Loading...</span>
          </div>
      </div>
  );

  const kpis = [
    { 
        label: 'Total Revenue', 
        value: `$${stats?.revenue?.total?.toLocaleString()}`, 
        sub: `Today: $${stats?.revenue?.today?.toLocaleString()}`,
        icon: <FiDollarSign />, 
        color: 'rust' 
    },
    { 
        label: 'Platform Growth', 
        value: stats?.growth?.total_salons, 
        sub: `${stats?.growth?.total_customers} Customers`,
        icon: <FiTrendingUp />, 
        color: 'dark' 
    },
    { 
        label: 'Approvals', 
        value: stats?.growth?.pending_salons, 
        sub: 'Pending Verification',
        icon: <FiClock />, 
        color: 'rust' 
    },
    { 
        label: 'Total Bookings', 
        value: stats?.bookings?.total, 
        sub: `Today: ${stats?.bookings?.today}`,
        icon: <FiShoppingBag />, 
        color: 'dark' 
    },
  ];

  return (
    <div className="admin-dashboard pb-5">
      
      {/* KPI GRID */}
      <div className="row g-4 mb-5 mt-2">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-md-6 col-xl-3">
            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`bg-${kpi.color} bg-opacity-10 text-${kpi.color} rounded-circle p-3 d-flex align-items-center justify-content-center`} style={{ width: '50px', height: '50px' }}>
                  {React.isValidElement(kpi.icon) && React.cloneElement(kpi.icon as React.ReactElement<any>, { size: 24 })}
                </div>
              </div>
              <p className="text-muted small fw-bold text-uppercase letter-spaced mb-1" style={{ fontSize: '0.65rem' }}>{kpi.label}</p>
              <h3 className="fw-bold mb-1 text-dark">{kpi.value}</h3>
              <p className="text-rust small fw-bold mb-0">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-5">
        
        {/* BOOKING TRACKER SECTION */}
        <div className="col-lg-12">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <h4 className="fw-bold mb-1 text-dark">Booking Performance Tracker</h4>
                        <p className="text-muted small mb-0">Platform-wide appointment volume breakdown</p>
                    </div>
                    <div className="bg-rust bg-opacity-10 text-rust rounded-pill px-4 py-2 fw-bold small">
                        Generated: {new Date(stats?.generated_at).toLocaleTimeString()}
                    </div>
                </div>

                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="p-4 rounded-5 bg-sand border border-opacity-10">
                            <h2 className="fw-bold text-rust mb-1">{stats?.bookings?.today}</h2>
                            <p className="text-muted small fw-bold text-uppercase letter-spaced mb-0">Bookings Today</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 rounded-5 bg-sand border border-opacity-10">
                            <h2 className="fw-bold text-dark mb-1">{stats?.bookings?.this_month}</h2>
                            <p className="text-muted small fw-bold text-uppercase letter-spaced mb-0">This Month</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 rounded-5 bg-sand border border-opacity-10">
                            <h2 className="fw-bold text-dark mb-1">{stats?.bookings?.this_year}</h2>
                            <p className="text-muted small fw-bold text-uppercase letter-spaced mb-0">This Year</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>

      <div className="row g-4">
        
        {/* REVENUE BREAKDOWN */}
        <div className="col-lg-8">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h4 className="fw-bold mb-0 text-dark">Revenue Insights</h4>
              <div className="d-flex gap-3">
                  <div className="d-flex align-items-center gap-2 small fw-bold">
                      <span className="rounded-circle bg-rust" style={{ width: '8px', height: '8px' }}></span> This Year
                  </div>
                  <div className="d-flex align-items-center gap-2 small fw-bold">
                      <span className="rounded-circle bg-dark" style={{ width: '8px', height: '8px' }}></span> Historical
                  </div>
              </div>
            </div>
            
            <div className="d-flex flex-column gap-4">
                <div className="d-flex justify-content-between align-items-center p-4 rounded-4 bg-sand border border-opacity-10">
                    <div>
                        <p className="text-muted small fw-bold text-uppercase mb-1">Today's Revenue</p>
                        <h4 className="fw-bold mb-0 text-dark">${stats?.revenue?.today?.toLocaleString()}</h4>
                    </div>
                    <FiArrowUpRight size={24} className="text-success" />
                </div>
                <div className="d-flex justify-content-between align-items-center p-4 rounded-4 bg-sand border border-opacity-10">
                    <div>
                        <p className="text-muted small fw-bold text-uppercase mb-1">Monthly Earnings</p>
                        <h4 className="fw-bold mb-0 text-dark">${stats?.revenue?.this_month?.toLocaleString()}</h4>
                    </div>
                    <FiTrendingUp size={24} className="text-rust" />
                </div>
                <div className="d-flex justify-content-between align-items-center p-4 rounded-4 bg-sand border border-opacity-10">
                    <div>
                        <p className="text-muted small fw-bold text-uppercase mb-1">Annual Revenue (YTD)</p>
                        <h4 className="fw-bold mb-0 text-dark">${stats?.revenue?.this_year?.toLocaleString()}</h4>
                    </div>
                    <FiDollarSign size={24} className="text-dark" />
                </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <h4 className="fw-bold mb-5 text-dark">Platform Status</h4>
            <div className="d-flex flex-column gap-5">
              {stats?.growth?.pending_salons > 0 && (
                <div className="d-flex gap-4">
                  <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                    <FiAlertCircle size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">Verification Queue</h6>
                    <p className="text-muted small mb-0">{stats.growth.pending_salons} salons are waiting for your approval to go live.</p>
                  </div>
                </div>
              )}
              <div className="d-flex gap-4">
                <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                  <FiUsers size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Community Growth</h6>
                  <p className="text-muted small mb-0">{stats.growth.total_customers} clients have registered on the platform.</p>
                </div>
              </div>
              <div className="d-flex gap-4">
                <div className="bg-dark bg-opacity-10 text-dark rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                  <FiActivity size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Owner Network</h6>
                  <p className="text-muted small mb-0">{stats.growth.total_owners} partners are managing salons on FindSalon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-scale:hover { transform: translateY(-5px); }
        .letter-spaced { letter-spacing: 1px; }
        .bg-sand { background-color: #FDFBF7; }
        .bg-rust { background-color: #9C4A34; }
        .text-rust { color: #9C4A34; }
      `}</style>
    </div>
  );
}

