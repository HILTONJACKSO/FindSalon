'use client';

import React from 'react';
import { FiTrendingUp, FiCalendar, FiClock, FiUsers, FiArrowRight, FiCheck, FiMoreHorizontal, FiDatabase } from 'react-icons/fi';

export default function OwnerDashboard() {
  const kpis = [
    { label: 'Total Revenue', value: '$14,280.00', growth: '+12%', icon: <FiTrendingUp />, color: 'rust' },
    { label: 'Total Bookings', value: '184', growth: '+5%', icon: <FiCalendar />, color: 'blue' },
    { label: 'Appointments Today', value: '24', current: 'Today', icon: <FiClock />, color: 'orange' },
    { label: 'New Customers', value: '42', growth: '+8', icon: <FiUsers />, color: 'green' },
  ];

  const recentActivity = [
    { 
        id: 1, 
        user: 'Elena Vance', 
        action: 'Booked: Balayage & Trim', 
        time: '2 minutes ago', 
        status: 'New', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        badgeColor: 'bg-success bg-opacity-10 text-success'
    },
    { 
        id: 2, 
        user: 'Marcus Thorne', 
        action: 'Completed: Men\'s Executive Cut', 
        time: '15 minutes ago', 
        peak: '$2,450 peak',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        badgeColor: 'bg-rust bg-opacity-10 text-rust'
    },
    { 
        id: 3, 
        user: 'Sarah Chen', 
        action: 'Rescheduled: HydraFacial', 
        time: '1 hour ago', 
        status: 'Updated',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        badgeColor: 'bg-warning bg-opacity-10 text-warning'
    },
  ];

  return (
    <div className="pb-5">
      
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 mt-4">
        <div>
           <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Dashboard Overview</h1>
           <p className="text-muted mb-0">Welcome back, your salon is performing beautifully today.</p>
        </div>
        <div className="d-flex align-items-center gap-3 mt-4 mt-md-0">
            <div className="bg-white rounded-4 p-3 shadow-sm d-flex align-items-center gap-3 border border-opacity-10">
                <div className="d-flex flex-column">
                    <span className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>STATUS</span>
                    <span className="fw-bold text-dark d-flex align-items-center gap-2">
                        <span className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></span> Live
                    </span>
                </div>
                <div className="border-start ps-3 d-flex flex-column">
                    <span className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>CURRENT SHIFT</span>
                    <span className="fw-bold text-dark">Morning Crew</span>
                </div>
            </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-12 col-md-6 col-xl-3">
            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer position-relative overflow-hidden">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="bg-sand rounded-pill p-3 text-rust d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', backgroundColor: '#FDF2E3' }}>
                        {kpi.icon}
                    </div>
                    <span className={`fw-bold small ${kpi.growth?.startsWith('+') ? 'text-success' : 'text-rust'}`}>
                        {kpi.growth || kpi.current}
                    </span>
                </div>
                <div className="text-muted small fw-bold mb-1">{kpi.label}</div>
                <h2 className="fw-bold mb-0" style={{ letterSpacing: '-1px' }}>{kpi.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS & ACTIVITY ROW */}
      <div className="row g-5 mb-5">
        
        {/* REVENUE GROWTH CHART */}
        <div className="col-12 col-xl-8">
            <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border border-opacity-10 h-100">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h4 className="fw-bold mb-1">Revenue Growth</h4>
                        <p className="text-muted small mb-0">Weekly performance analysis</p>
                    </div>
                    <div className="badge bg-rust bg-opacity-10 text-rust rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2">
                         Live Data <span className="rounded-circle bg-rust" style={{ width: '6px', height: '6px' }}></span>
                    </div>
                </div>

                {/* SVG CHART - HIGH FIDELITY SIMULATION */}
                <div className="position-relative mt-2" style={{ height: '300px' }}>
                    <svg viewBox="0 0 800 300" className="w-100 h-100 overflow-visible">
                        {/* Gradients */}
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#9C4A34" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#9C4A34" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        {/* Area Fill */}
                        <path 
                            d="M0,250 L120,220 L240,240 L360,180 L480,210 L600,160 L720,120 L800,100 L800,300 L0,300 Z" 
                            fill="url(#chartGradient)"
                        />
                        
                        {/* Main Line */}
                        <path 
                            d="M0,250 L120,220 L240,240 L360,180 L480,210 L600,160 L720,120 L800,100" 
                            fill="none" 
                            stroke="#9C4A34" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />

                        {/* Data Nodes */}
                        {[
                            {x: 0, y: 250}, {x: 120, y: 220}, {x: 240, y: 240}, 
                            {x: 360, y: 180}, {x: 480, y: 210}, {x: 600, y: 160}, 
                            {x: 720, y: 120}, {x: 800, y: 100}
                        ].map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#9C4A34" strokeWidth="2" />
                        ))}

                        {/* Grid Lines Placeholder */}
                        <g opacity="0.05">
                            {[0, 60, 120, 180, 240, 300].map(y => (
                                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="black" />
                            ))}
                        </g>
                    </svg>

                    {/* Labels */}
                    <div className="d-flex justify-content-between mt-4 text-muted fw-bold px-4" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                        <span>MON</span>
                        <span>TUE</span>
                        <span>WED</span>
                        <span>THU</span>
                        <span>FRI</span>
                        <span>SAT</span>
                        <span>SUN</span>
                    </div>
                </div>
            </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="col-12 col-xl-4">
            <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border border-opacity-10 h-100 d-flex flex-column">
                <h4 className="fw-bold mb-5">Recent Activity</h4>
                
                <div className="d-flex flex-column gap-5 flex-grow-1">
                    {recentActivity.map((act) => (
                        <div key={act.id} className="d-flex align-items-center gap-4">
                            <div className="position-relative flex-shrink-0">
                                <div className="rounded-circle overflow-hidden bg-sand border border-white border-2 shadow-sm" style={{ width: '56px', height: '56px' }}>
                                    <img src={act.avatar} alt={act.user} className="w-100 h-100 object-fit-cover" />
                                </div>
                                {act.peak && (
                                    <div className="position-absolute bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ top: '-10px', right: '-10px', width: '40px', height: '40px', fontSize: '0.6rem', textAlign: 'center', fontWeight: 'bold' }}>
                                        {act.peak.replace(' ', '\n')}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow-1 min-w-0">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h6 className="fw-bold mb-0 text-truncate">{act.user}</h6>
                                    {act.status && <span className={`badge rounded-pill px-3 py-1 fw-bold fs-7 ${act.badgeColor}`} style={{ fontSize: '0.6rem' }}>{act.status}</span>}
                                </div>
                                <p className="text-muted small mb-1 text-truncate">{act.action}</p>
                                <span className="text-muted opacity-50" style={{ fontSize: '0.7rem' }}>{act.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 pt-4">
                    <button className="btn btn-outline-rust w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                        View All Activity <FiArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>

      </div>

      {/* BOTTOM ALERTS / FOOTER ROW */}
      <div className="row g-4">
        <div className="col-12 col-md-8">
            <div className="bg-dark rounded-5 p-5 shadow-sm h-100 position-relative overflow-hidden" style={{ backgroundColor: '#1E1915' }}>
                <div className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3" style={{ backgroundColor: '#FDF2E3', letterSpacing: '1px', fontSize: '0.65rem' }}>INVENTORY ALERT</div>
                <h3 className="text-white fw-bold mb-0 display-6" style={{ letterSpacing: '-1.5px' }}>4 Items Below Minimum</h3>
                {/* Visual Flair */}
                <div className="position-absolute opacity-25" style={{ bottom: '-50px', right: '-20px', fontSize: '12rem', color: '#FFF' }}>
                    <FiDatabase />
                </div>
            </div>
        </div>
        <div className="col-12 col-md-4">
            <div className="bg-white rounded-5 p-5 shadow-sm h-100 border border-opacity-10 d-flex flex-column justify-content-center">
                 <h4 className="fw-bold mb-2">Top Performing Service</h4>
                 <div className="text-rust fw-bold fs-3 mb-2">Balayage & Styling</div>
                 <div className="text-muted small fw-bold mt-auto d-flex align-items-center gap-2">
                     <span className="text-dark">82%</span> of total revenue this month
                 </div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-5 pt-5 border-top border-opacity-10">
        <div className="row g-4 justify-content-between">
            <div className="col-12 col-md-4">
                <div className="fw-bold fs-4 mb-3">FindSalon</div>
                <p className="text-muted small lh-lg mb-0" style={{ maxWidth: '300px' }}>
                    Providing the world's finest curators with the tools to redefine beauty services. The Tactile Curator.
                </p>
            </div>
            <div className="col-6 col-md-2">
                <h6 className="fw-bold text-muted mb-4 small letter-spaced" style={{ letterSpacing: '1px' }}>MANAGEMENT</h6>
                <ul className="list-unstyled d-flex flex-column gap-3 text-muted" style={{ fontSize: '0.9rem' }}>
                    <li>Revenue Reports</li>
                    <li>Staff Scheduling</li>
                    <li>Inventory Logs</li>
                </ul>
            </div>
            <div className="col-6 col-md-2">
                <h6 className="fw-bold text-muted mb-4 small letter-spaced" style={{ letterSpacing: '1px' }}>SUPPORT</h6>
                <ul className="list-unstyled d-flex flex-column gap-3 text-muted" style={{ fontSize: '0.9rem' }}>
                    <li>Help Center</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                </ul>
            </div>
        </div>
        <div className="mt-5 pt-4 text-muted border-top border-opacity-5" style={{ fontSize: '0.75rem' }}>
            © 2024 FindSalon. The Tactile Curator. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .fs-7 { font-size: 0.65rem; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: translateY(-5px); }
        .bg-sand { background-color: #FDFBF7; }
        .btn-outline-rust {
            border: 2px solid #9C4A34;
            color: #9C4A34;
        }
        .btn-outline-rust:hover {
            background-color: #9C4A34;
            color: white;
        }
      `}</style>
    </div>
  );
}
