'use client';

import React from 'react';
import { FiUserPlus, FiMoreHorizontal, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function CustomersPage() {
  const kpis = [
    { label: 'TOTAL CUSTOMERS', value: '1,284', color: 'rust' },
    { label: 'ACTIVE THIS MONTH', value: '412', color: 'blue' },
    { label: 'AVERAGE LTV', value: '$840', color: 'orange' },
    { label: 'NEW REGISTRATIONS', value: '+12%', color: 'green' },
  ];

  const customers = [
    {
      id: 1,
      name: 'Elena Rodriguez',
      email: 'elena.rod@example.com',
      lastVisit: 'Oct 12, 2023',
      totalSpent: '$2,450.00',
      topService: 'BALAYAGE LUXE',
      serviceColor: '#E5EFFF',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Julian Vane',
      email: 'julian.v@example.com',
      lastVisit: 'Oct 05, 2023',
      totalSpent: '$890.00',
      topService: 'PRECISION CUT',
      serviceColor: '#FFF2EB',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Sienna Brooks',
      email: 'sienna.b@example.com',
      lastVisit: 'Sep 28, 2023',
      totalSpent: '$4,120.00',
      topService: 'FULL TREATMENT',
      serviceColor: '#FFF9E5',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'Marcus Thorne',
      email: 'm.thorne@example.com',
      lastVisit: 'Sep 15, 2023',
      totalSpent: '$560.00',
      topService: 'BEARD SCULPT',
      serviceColor: '#F5ECE7',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="pb-5">
      <OwnerHeader />

      {/* PAGE HEADER */}
      <div className="row align-items-center mb-5">
        <div className="col-12 col-md-8">
          <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Customer Base</h1>
          <p className="text-muted mb-0">Manage your elite clientele and their preferences.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
          <button className="btn btn-rust rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ms-md-auto">
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
                <tr key={cust.id} className="cursor-pointer transition-all">
                  <td className="px-5 py-4 border-bottom border-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '44px', height: '44px' }}>
                        <img src={cust.avatar} alt={cust.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{cust.name}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{cust.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light fw-medium text-muted">{cust.lastVisit}</td>
                  <td className="py-4 border-bottom border-light fw-bold text-dark">{cust.totalSpent}</td>
                  <td className="py-4 border-bottom border-light">
                    <span className="badge rounded-pill px-3 py-2 fw-bold text-dark opacity-75" style={{ backgroundColor: cust.serviceColor, fontSize: '0.65rem' }}>
                      {cust.topService}
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
          <span className="text-muted small fw-bold">SHOWING 1 TO 4 OF 1,284 CUSTOMERS</span>
          <div className="d-flex gap-2">
            <button className="btn btn-light rounded-pill p-2 border-0 bg-white shadow-sm"><FiChevronLeft /></button>
            {[1, 2, 3].map(n => (
              <button key={n} className={`btn rounded-circle fw-bold ${n === 1 ? 'btn-rust text-white shadow' : 'btn-light bg-white border-0 opacity-50'}`} style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{n}</button>
            ))}
            <button className="btn btn-light rounded-pill p-2 border-0 bg-white shadow-sm"><FiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="row g-5">
        {/* RECENT ACTIVITY */}
        <div className="col-12 col-xl-4">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
            <h4 className="fw-bold mb-5">Recent Activity</h4>
            <div className="d-flex flex-column gap-5">
              <div className="d-flex gap-4">
                <div className="border-start border-4 border-rust ps-4">
                   <h6 className="fw-bold mb-1">Elena Rodriguez booked Balayage</h6>
                   <span className="text-muted small">2 hours ago</span>
                </div>
              </div>
              <div className="d-flex gap-4">
                <div className="border-start border-4 border-warning ps-4" style={{ borderColor: '#FFCC00 !important' }}>
                   <h6 className="fw-bold mb-1">New note added for Sienna B.</h6>
                   <span className="text-muted small">Yesterday</span>
                </div>
              </div>
              <div className="d-flex gap-4">
                <div className="border-start border-4 border-info ps-4" style={{ borderColor: '#00CCFF !important' }}>
                   <h6 className="fw-bold mb-1">Marcus Thorne's status: VIP</h6>
                   <span className="text-muted small">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER INSIGHTS PLACEHOLDER */}
        <div className="col-12 col-xl-8">
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
        </div>
      </div>

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
