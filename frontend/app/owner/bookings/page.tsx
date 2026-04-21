'use client';

import React from 'react';
import { 
    FiCalendar, 
    FiBell, 
    FiCheck, 
    FiX, 
    FiChevronLeft, 
    FiChevronRight, 
    FiSearch, 
    FiDownload, 
    FiPlus,
    FiFileText
} from 'react-icons/fi';

export default function BookingsManagementPage() {
  const kpis = [
    { label: "Today's Total Bookings", value: '24', growth: '+12%', icon: <FiCalendar />, color: '#9C4A34' },
    { label: 'New Requests', value: '07', tag: 'Action Needed', icon: <FiBell />, color: '#E65C00' },
    { label: 'Pending Actions', value: '03', icon: <FiCheck />, color: '#D4A017' },
  ];

  const appointments = [
    {
        id: 1,
        user: 'Amara Thompson',
        service: 'Signature Precision Cut',
        time: '10:30 AM - 11:45 AM',
        stylist: 'Elena V.',
        status: 'Pending',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 2,
        user: 'Julian Brooks',
        service: 'Balayage & Conditioning',
        time: '01:00 PM - 03:30 PM',
        stylist: 'Marcus K.',
        status: 'Confirmed',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 3,
        user: 'Sarah Chen',
        service: 'Deep Scalp Therapy',
        time: '04:00 PM - 04:45 PM',
        stylist: 'Elena V.',
        status: 'Confirmed',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 4,
        user: 'Robert Miller',
        service: 'Executive Grooming Package',
        time: '09:00 AM - 10:15 AM',
        stylist: 'Sophia R.',
        status: 'Completed',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="pb-5">
      
      {/* PAGE HEADER */}
      <div className="mb-5">
        <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb small fw-bold">
                <li className="breadcrumb-item"><a href="#" className="text-muted text-decoration-none">Dashboard</a></li>
                <li className="breadcrumb-item active text-rust" aria-current="page">Bookings</li>
            </ol>
        </nav>
        <div className="d-flex justify-content-between align-items-end">
            <div>
                <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Bookings Management</h1>
                <p className="text-muted mb-0">Manage your salon's daily heartbeat and client journey.</p>
            </div>
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-circle border border-2 border-white shadow-sm overflow-hidden" style={{ width: '32px', height: '32px', marginLeft: i > 1 ? '-10px' : '0' }}>
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="team" className="w-100 h-100 object-fit-cover" />
                        </div>
                    ))}
                    <div className="rounded-circle border border-2 border-white shadow-sm bg-sand d-flex align-items-center justify-content-center fw-bold text-muted small" style={{ width: '32px', height: '32px', marginLeft: '-10px', fontSize: '0.65rem' }}>+8</div>
                </div>
            </div>
        </div>
      </div>

      {/* KPI SUMMARY */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
            <div key={idx} className="col-12 col-md-4">
                <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 position-relative transition-all hover-scale cursor-pointer">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="rounded-4 p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color, width: '50px', height: '50px' }}>
                            {kpi.icon}
                        </div>
                        {kpi.growth && <span className="badge rounded-pill bg-warning bg-opacity-10 text-dark fw-bold" style={{ fontSize: '0.65rem' }}>{kpi.growth}</span>}
                        {kpi.tag && <span className="badge rounded-pill bg-rust bg-opacity-10 text-rust fw-bold" style={{ fontSize: '0.65rem' }}>{kpi.tag}</span>}
                    </div>
                    <div className="display-6 fw-bold mb-1" style={{ letterSpacing: '-1px' }}>{kpi.value}</div>
                    <div className="text-muted small fw-bold">{kpi.label}</div>
                </div>
            </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="row g-5">
        
        {/* LEFT SIDEBAR CONTROLS */}
        <div className="col-12 col-xl-4">
            
            {/* MINI CALENDAR */}
            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 mb-5 pb-5 position-relative overflow-hidden" style={{ backgroundColor: '#FDFBF7' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                    <h5 className="fw-bold mb-0">November 2024</h5>
                    <div className="d-flex gap-3">
                        <FiChevronLeft className="text-muted cursor-pointer" />
                        <FiChevronRight className="text-muted cursor-pointer" />
                    </div>
                </div>
                
                <div className="calendar-grid">
                    {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(day => (
                        <div key={day} className="text-center text-muted fw-bold mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>{day}</div>
                    ))}
                    {[28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((date, i) => (
                        <div key={i} className={`calendar-day ${date === 5 ? 'active shadow' : ''} ${i < 4 ? 'opacity-25' : ''}`}>
                            {date}
                            {date === 1 && <span className="dot bg-rust"></span>}
                            {date === 4 && <span className="dot bg-rust"></span>}
                            {date === 5 && <span className="dot bg-rust"></span>}
                            {date === 6 && <span className="dot bg-rust"></span>}
                            {date === 11 && <div className="dot-group"><span className="dot bg-rust"></span><span className="dot bg-warning"></span></div>}
                        </div>
                    ))}
                </div>

                <div className="mt-5 d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                        <span className="rounded-circle bg-warning" style={{ width: '10px', height: '10px' }}></span> Confirmed (18)
                    </div>
                    <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                        <span className="rounded-circle bg-rust" style={{ width: '10px', height: '10px' }}></span> Pending (07)
                    </div>
                    <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                        <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#5D6B35' }}></span> Completed (12)
                    </div>
                </div>
            </div>

            {/* QUICK FILTERS */}
            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 pb-5" style={{ backgroundColor: '#FDFBF7' }}>
                <h6 className="fw-bold mb-4 opacity-75 small letter-spaced" style={{ letterSpacing: '1px' }}>QUICK FILTERS</h6>
                <div className="mb-4">
                    <label className="text-muted small fw-bold mb-2">Stylist</label>
                    <select className="form-select rounded-4 border-0 shadow-sm py-3 px-4 fw-medium text-muted" style={{ fontSize: '0.9rem' }}>
                        <option>All Stylists</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label className="text-muted small fw-bold mb-2">Service Type</label>
                    <select className="form-select rounded-4 border-0 shadow-sm py-3 px-4 fw-medium text-muted" style={{ fontSize: '0.9rem' }}>
                        <option>All Services</option>
                    </select>
                </div>
            </div>
        </div>

        {/* FEED AREA (RIGHT) */}
        <div className="col-12 col-xl-8">
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                <h4 className="fw-bold mb-0">Appointments for Today, Nov 5</h4>
                <div className="d-flex gap-3">
                    <div className="bg-white p-2 rounded-3 shadow-sm border d-flex align-items-center cursor-pointer hover-scale">
                        <FiSearch size={18} className="text-muted" />
                    </div>
                    <div className="bg-white p-2 rounded-3 shadow-sm border d-flex align-items-center cursor-pointer hover-scale">
                        <FiDownload size={18} className="text-muted" />
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column gap-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 position-relative transition-all hover-translate-right">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '64px', height: '64px' }}>
                                    <img src={apt.avatar} alt={apt.user} className="w-100 h-100 object-fit-cover" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="fw-bold mb-0">{apt.user}</h5>
                                        <div className="text-muted small d-flex align-items-center gap-2 mt-1 fw-medium">
                                            <FiPlus size={14} className="opacity-50" /> {apt.service}
                                        </div>
                                    </div>
                                    <span className={`badge rounded-pill px-3 py-2 fw-bold ${
                                        apt.status === 'Pending' ? 'bg-rust bg-opacity-10 text-rust' : 
                                        apt.status === 'Completed' ? 'bg-sand text-dark border' : 
                                        'bg-blue bg-opacity-10 text-blue'
                                    }`} style={{ fontSize: '0.65rem' }}>
                                        <span className="rounded-circle me-2" style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'currentColor' }}></span>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-3 border-start ps-4 d-none d-md-block">
                                <span className="text-muted tiny fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>TIME SLOT</span>
                                <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.85rem' }}>{apt.time}</div>
                                <div className="d-flex align-items-center gap-2 mt-2">
                                     <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: apt.id % 2 === 0 ? '#0066CC' : '#9C4A34' }}></span>
                                     <span className="text-muted small fw-medium">{apt.stylist}</span>
                                </div>
                            </div>
                            <div className="col-auto text-end ps-4 border-start">
                                {apt.status === 'Pending' ? (
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-rust rounded-pill px-4 py-2 fw-bold text-white shadow-sm small border-0">Accept</button>
                                        <button className="btn btn-light rounded-pill px-4 py-2 fw-bold text-muted shadow-sm small border-0">Decline</button>
                                    </div>
                                ) : apt.status === 'Completed' ? (
                                    <button className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold small border-opacity-10">Invoice</button>
                                ) : (
                                    <button className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold small border-opacity-10">View Details</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-5">
                <button className="btn btn-link text-rust fw-bold text-decoration-none d-flex align-items-center justify-content-center gap-2 mx-auto">
                    Load More Appointments <FiChevronRight />
                </button>
            </div>
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button className="position-fixed bg-rust text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0 transition-all hover-scale" style={{ bottom: '40px', right: '40px', width: '64px', height: '64px', zIndex: 100 }}>
          <FiPlus size={28} strokeWidth={3} />
      </button>

      <style jsx>{`
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 10px;
        }
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.85rem;
            color: #1E1915;
            cursor: pointer;
            border-radius: 12px;
            position: relative;
            transition: all 0.2s ease;
        }
        .calendar-day:hover {
            background-color: #FFF;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .calendar-day.active {
            background-color: #9C4A34;
            color: white;
        }
        .calendar-day .dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            position: absolute;
            bottom: 6px;
        }
        .dot-group {
            display: flex;
            gap: 2px;
            position: absolute;
            bottom: 6px;
        }
        .dot-group .dot {
            position: static;
            width: 4px;
            height: 4px;
        }
        .tiny { font-size: 0.65rem; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .text-blue { color: #0066CC; }
        .bg-blue { background-color: #0066CC; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .hover-translate-right:hover {
            transform: translateX(10px);
        }
      `}</style>
    </div>
  );
}
