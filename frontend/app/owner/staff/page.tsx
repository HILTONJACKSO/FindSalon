'use client';

import React from 'react';
import { 
    FiUsers, 
    FiUserPlus, 
    FiMoreHorizontal, 
    FiStar, 
    FiCalendar, 
    FiCheckCircle, 
    FiTarget,
    FiDownload,
    FiShare2
} from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function StaffManagementPage() {
  const teamMetrics = [
    { label: 'Total Members', value: '18', icon: <FiUsers />, color: '#9C4A34' },
    { label: 'On Duty Today', value: '12', icon: <FiCalendar />, color: '#0066CC' },
    { label: 'Performance Avg', value: '4.8', icon: <FiStar />, color: '#D4A017' },
    { label: 'New Hires (Month)', value: '03', icon: <FiUserPlus />, color: '#5D6B35' },
  ];

  const staff = [
    {
        id: 1,
        name: 'Elena Vance',
        role: 'Master Stylist',
        status: 'On Duty',
        statusColor: 'success',
        skills: { cutting: 95, coloring: 98, styling: 92 },
        services: ['Balayage', 'Luxe Cut', 'Signature Color'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 2,
        name: 'Marcus Thorne',
        role: 'Senior Barber',
        status: 'On Break',
        statusColor: 'warning',
        skills: { cutting: 98, coloring: 40, styling: 85 },
        services: ['Executive Cut', 'Beard Sculpt', 'Hot Towel Shave'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 3,
        name: 'Sarah Chen',
        role: 'Skin Specialist',
        status: 'Off Shift',
        statusColor: 'secondary',
        skills: { cutting: 0, coloring: 0, styling: 95 },
        services: ['HydraFacial', 'Deep Scalp', 'Stone Therapy'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 4,
        name: 'Sophia Rossi',
        role: 'Junior Stylist',
        status: 'On Duty',
        statusColor: 'success',
        skills: { cutting: 75, coloring: 82, styling: 88 },
        services: ['Blowouts', 'Standard Cut', 'Basic Color'],
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="pb-5">
      <OwnerHeader />

      {/* PAGE HEADER */}
      <div className="row align-items-center mb-5 mt-2">
        <div className="col-12 col-md-8">
            <nav aria-label="breadcrumb" className="mb-2">
                <ol className="breadcrumb small fw-bold">
                    <li className="breadcrumb-item"><a href="#" className="text-muted text-decoration-none">Dashboard</a></li>
                    <li className="breadcrumb-item active text-rust" aria-current="page">Staff</li>
                </ol>
            </nav>
            <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Team Momentum</h1>
            <p className="text-muted mb-0">Manage your team of master stylists and support crew.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
            <div className="d-flex gap-3 justify-content-md-end">
                <button className="btn btn-white rounded-pill px-4 py-3 fw-bold shadow-sm border border-opacity-10 text-muted d-flex align-items-center gap-2">
                    <FiDownload /> Payroll
                </button>
                <button className="btn btn-rust rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
                    <FiUserPlus size={20} /> Add Member
                </button>
            </div>
        </div>
      </div>

      {/* METRIC GRID */}
      <div className="row g-4 mb-5">
        {teamMetrics.map((kpi, idx) => (
            <div key={idx} className="col-12 col-md-6 col-xl-3">
                <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color, width: '40px', height: '40px' }}>
                            {kpi.icon}
                        </div>
                    </div>
                    <div className="display-6 fw-bold mb-1" style={{ letterSpacing: '-1px' }}>{kpi.value}</div>
                    <div className="text-muted small fw-bold">{kpi.label}</div>
                </div>
            </div>
        ))}
      </div>

      {/* STAFF DIRECTORY TABLE */}
      <div className="bg-white rounded-5 shadow-sm border border-opacity-10 mb-5 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-sand bg-opacity-50">
              <tr>
                <th className="px-5 py-4 border-0 text-muted small fw-bold letter-spaced">MEMBER</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">AVAILABILITY</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">PERFORMANCE</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">ASSIGNED SERVICES</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced text-end px-5">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="cursor-pointer transition-all">
                  <td className="px-5 py-4 border-bottom border-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '48px', height: '48px' }}>
                        <img src={member.avatar} alt={member.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{member.name}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light">
                    <span className={`badge rounded-pill px-3 py-2 fw-bold text-capitalize bg-${member.statusColor} bg-opacity-10 text-${member.statusColor}`} style={{ fontSize: '0.65rem' }}>
                        <span className={`rounded-circle me-2 d-inline-block bg-${member.statusColor}`} style={{ width: '6px', height: '6px' }}></span>
                        {member.status}
                    </span>
                  </td>
                  <td className="py-4 border-bottom border-light" style={{ width: '220px' }}>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="tiny fw-bold text-muted opacity-50">Overall Rating</span>
                            <span className="tiny fw-bold text-rust">4.8/5</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: '#F0F0F0' }}>
                            <div className="progress-bar rounded-pill bg-rust" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light">
                    <div className="d-flex flex-wrap gap-2">
                        {member.services.map((svc, i) => (
                            <span key={i} className="badge bg-sand text-dark border border-opacity-10 rounded-pill px-3 py-2 fw-medium" style={{ fontSize: '0.6rem' }}>{svc}</span>
                        ))}
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light text-end px-5">
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-light rounded-pill px-3 py-1 fw-bold small border-0 bg-transparent text-muted">View Schedule</button>
                        <button className="btn btn-light rounded-circle p-2 border-0 bg-transparent text-muted"><FiMoreHorizontal size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-5 py-4 bg-sand bg-opacity-30 d-flex justify-content-between align-items-center border-top">
          <span className="text-muted small fw-bold">SHOWING {staff.length} OF 18 TEAM MEMBERS</span>
          <div className="d-flex gap-2 text-muted tiny fw-bold cursor-pointer hover-rust">
             Shift Handover Logs <FiArrowRight className="ms-2" />
          </div>
        </div>
      </div>

      {/* TEAM INTERACTION TILES */}
      <div className="row g-4">
        <div className="col-12 col-xl-6">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 d-flex align-items-center justify-content-between hover-scale transition-all cursor-pointer">
                <div className="d-flex align-items-center gap-4">
                     <div className="bg-blue bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-blue" style={{ width: '60px', height: '60px', color: '#0066CC' }}>
                        <FiCheckCircle size={24} />
                     </div>
                     <div>
                        <h5 className="fw-bold mb-1">Shift Verification</h5>
                        <p className="text-muted small mb-0">Review today's check-ins and break times.</p>
                     </div>
                </div>
                <div className="text-muted opacity-25"><FiChevronRight size={24} /></div>
            </div>
        </div>
        <div className="col-12 col-xl-6">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 d-flex align-items-center justify-content-between hover-scale transition-all cursor-pointer">
                <div className="d-flex align-items-center gap-4">
                     <div className="bg-rust bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-rust" style={{ width: '60px', height: '60px' }}>
                        <FiTarget size={24} />
                     </div>
                     <div>
                        <h5 className="fw-bold mb-1">Incentive Tracking</h5>
                        <p className="text-muted small mb-0">Commission calculations for current week.</p>
                     </div>
                </div>
                <div className="text-muted opacity-25"><FiChevronRight size={24} /></div>
            </div>
        </div>
      </div>

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .tiny { font-size: 0.65rem; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-scale:hover { transform: translateY(-5px); }
        .hover-rust:hover { color: #9C4A34 !important; }
      `}</style>
    </div>
  );
}

// Internal reusable Icon fix
function FiArrowRight({ className }: { className?: string }) {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}

function FiChevronRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg className={className} width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );
}
