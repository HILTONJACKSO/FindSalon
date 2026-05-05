'use client';

import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiBarChart2, FiPieChart, FiArrowUpRight, FiDownload } from 'react-icons/fi';
import { api } from '@/lib/api';

export default function AdminRevenue() {
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

  if (loading) return <div>Loading financial data...</div>;

  return (
    <div className="admin-revenue">
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h4 className="fw-bold mb-1 text-dark">Total Platform Revenue</h4>
                <p className="text-muted small mb-0">Gross volume processed through the system</p>
              </div>
              <button className="btn btn-rust rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2">
                <FiDownload /> Export CSV
              </button>
            </div>
            
            <div className="display-4 fw-bold text-dark mb-4">
              ${stats?.total_revenue?.toLocaleString()}
              <span className="fs-5 text-success ms-3 d-inline-flex align-items-center">
                <FiArrowUpRight className="me-1" /> +8.4%
              </span>
            </div>

            <div className="revenue-chart mt-5" style={{ height: '300px' }}>
                <div className="d-flex align-items-end h-100 gap-2">
                    {[30, 45, 60, 40, 70, 85, 65, 90, 75, 50, 80, 95].map((h, i) => (
                        <div key={i} className="flex-grow-1 bg-rust bg-opacity-25 rounded-top position-relative group" style={{ height: `${h}%` }}>
                            <div className="chart-bar-hover bg-rust rounded-top position-absolute w-100 h-100 top-0 start-0 opacity-0 transition-all"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="d-flex justify-content-between mt-3 text-muted small fw-bold">
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <h4 className="fw-bold mb-4 text-dark">Commission Split</h4>
            <div className="d-flex flex-column gap-4">
                <div className="p-4 bg-sand rounded-4">
                    <p className="text-muted small fw-bold text-uppercase mb-2">Platform Fee (10%)</p>
                    <h4 className="fw-bold text-rust mb-0">${(stats?.total_revenue * 0.1).toLocaleString()}</h4>
                </div>
                <div className="p-4 bg-sand rounded-4">
                    <p className="text-muted small fw-bold text-uppercase mb-2">Salon Payouts (90%)</p>
                    <h4 className="fw-bold text-dark mb-0">${(stats?.total_revenue * 0.9).toLocaleString()}</h4>
                </div>
                <div className="mt-4 pt-4 border-top border-light">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted small fw-bold">Active Subscriptions</span>
                        <span className="fw-bold text-dark">12</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small fw-bold">Average Booking Value</span>
                        <span className="fw-bold text-dark">$45.00</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .group:hover .chart-bar-hover { opacity: 1 !important; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
}
