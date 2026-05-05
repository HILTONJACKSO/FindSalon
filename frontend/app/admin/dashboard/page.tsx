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

  if (loading) return <div>Loading statistics...</div>;

  const kpis = [
    { label: 'Total Revenue', value: `$${stats?.total_revenue?.toLocaleString()}`, icon: <FiDollarSign />, color: 'rust' },
    { label: 'Active Salons', value: stats?.total_salons, icon: <FiActivity />, color: 'dark' },
    { label: 'Pending Approvals', value: stats?.pending_approvals, icon: <FiClock />, color: 'rust' },
    { label: 'Total Bookings', value: stats?.total_bookings, icon: <FiShoppingBag />, color: 'dark' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-md-6 col-xl-3">
            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`bg-${kpi.color} bg-opacity-10 text-${kpi.color} rounded-circle p-3 d-flex align-items-center justify-content-center`} style={{ width: '50px', height: '50px' }}>
                  {React.cloneElement(kpi.icon as React.ReactElement, { size: 24 })}
                </div>
                {idx === 0 && <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small">+12.5%</span>}
              </div>
              <p className="text-muted small fw-bold text-uppercase letter-spaced mb-1" style={{ fontSize: '0.65rem' }}>{kpi.label}</p>
              <h3 className="fw-bold mb-0 text-dark">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Activity or Chart Placeholder */}
        <div className="col-lg-8">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0 text-dark">Platform Growth</h4>
              <div className="dropdown">
                <button className="btn btn-light rounded-pill px-3 py-1 small fw-bold border-0 shadow-none">Last 30 Days</button>
              </div>
            </div>
            <div className="chart-placeholder d-flex align-items-end gap-3" style={{ height: '300px' }}>
              {[40, 60, 30, 80, 50, 90, 70, 45, 85, 55, 95, 65].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-grow-1 rounded-top transition-all ${i % 2 === 0 ? 'bg-rust' : 'bg-dark'}`} 
                  style={{ height: `${h}%`, opacity: 0.8 }}
                ></div>
              ))}
            </div>
            <div className="d-flex justify-content-between mt-4 text-muted small fw-bold">
              <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
              <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <h4 className="fw-bold mb-4 text-dark">System Alerts</h4>
            <div className="d-flex flex-column gap-4">
              {stats?.pending_approvals > 0 && (
                <div className="d-flex gap-3">
                  <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                    <FiAlertCircle size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">Approval Needed</h6>
                    <p className="text-muted small mb-0">{stats.pending_approvals} salons are waiting for verification.</p>
                  </div>
                </div>
              )}
              <div className="d-flex gap-3">
                <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Revenue Peak</h6>
                  <p className="text-muted small mb-0">Platform revenue reached a new monthly high today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-scale:hover { transform: translateY(-5px); }
        .letter-spaced { letter-spacing: 1px; }
      `}</style>
    </div>
  );
}

