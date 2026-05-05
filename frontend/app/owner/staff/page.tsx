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
    FiShare2,
    FiTrash2, 
    FiLayers,
    FiChevronRight,
    FiX,
    FiArrowRight
} from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';
import { api } from '@/lib/api';

export default function StaffManagementPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [staff, setStaff] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    first_name: '', last_name: '', email: '', job_title: '', availability: 'OFF_SHIFT'
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState<any>(null);
  const [allServices, setAllServices] = React.useState<any[]>([]);
  const [savingAssignment, setSavingAssignment] = React.useState(false);

  const fetchStats = React.useCallback(async () => {
    try {
      const response = await api.get('/staff/stats/');
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching staff stats", error);
    }
  }, []);

  const fetchStaff = React.useCallback(async () => {
    try {
      const response = await api.get('/staff/');
      setStaff(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching staff", error);
    }
  }, []);

  const fetchServices = React.useCallback(async () => {
    try {
      const response = await api.get('/services/');
      setAllServices(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching services", error);
    }
  }, []);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchStaff(), fetchServices()]);
      setLoading(false);
    };
    init();

    const interval = setInterval(() => {
      fetchStats();
      fetchStaff();
    }, 30000); // 30 seconds to avoid 429

    return () => clearInterval(interval);
  }, [fetchStats, fetchStaff, fetchServices]);

  const teamMetrics = [
    { label: 'Total Members', value: stats?.total_members || '0', icon: <FiUsers />, color: '#9C4A34' },
    { label: 'On Duty Today', value: stats?.on_duty_today || '0', icon: <FiCalendar />, color: '#0066CC' },
    { label: 'Performance Avg', value: stats?.performance_avg || '0.0', icon: <FiStar />, color: '#D4A017' },
    { label: 'New Hires (Month)', value: stats?.new_hires_month?.toString().padStart(2, '0') || '00', icon: <FiUserPlus />, color: '#5D6B35' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'ON_DUTY': return 'success';
        case 'ON_BREAK': return 'warning';
        case 'OFF_SHIFT': return 'secondary';
        default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/staff/', formData);
      setShowAddModal(false);
      setFormData({ first_name: '', last_name: '', email: '', job_title: '', availability: 'OFF_SHIFT' });
      fetchStaff();
      fetchStats();
    } catch (error) {
      console.error("Error adding staff member", error);
    } finally {
      setSubmitting(false);
    }
  };

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
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-rust rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
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
                      <div className="rounded-circle overflow-hidden shadow-sm bg-sand d-flex align-items-center justify-content-center fw-bold text-rust" style={{ width: '48px', height: '48px' }}>
                        {member.avatar ? <img src={member.avatar} alt={member.full_name} className="w-100 h-100 object-fit-cover" /> : member.full_name[0]}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{member.full_name}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{member.job_title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light">
                    <span className={`badge rounded-pill px-3 py-2 fw-bold text-capitalize bg-${getStatusColor(member.availability)} bg-opacity-10 text-${getStatusColor(member.availability)}`} style={{ fontSize: '0.65rem' }}>
                        <span className={`rounded-circle me-2 d-inline-block bg-${getStatusColor(member.availability)}`} style={{ width: '6px', height: '6px' }}></span>
                        {getStatusLabel(member.availability)}
                    </span>
                  </td>
                  <td className="py-4 border-bottom border-light" style={{ width: '220px' }}>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="tiny fw-bold text-muted opacity-50">Overall Rating</span>
                            <span className="tiny fw-bold text-rust">{member.performance_rating}/5</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: '#F0F0F0' }}>
                            <div className="progress-bar rounded-pill bg-rust" style={{ width: `${(member.performance_rating / 5) * 100}%` }}></div>
                        </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light">
                    <div className="d-flex flex-wrap gap-2">
                        {member.assigned_services_data?.length > 0 ? member.assigned_services_data.map((svc: any, i: number) => (
                            <span key={i} className="badge bg-sand text-dark border border-opacity-10 rounded-pill px-3 py-2 fw-medium" style={{ fontSize: '0.6rem' }}>{svc.name}</span>
                        )) : <span className="text-muted small italic">No services</span>}
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light text-end px-5">
                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            onClick={() => {
                                setSelectedStaff(member);
                                setShowAssignModal(true);
                            }}
                            className="btn btn-rust-outline rounded-pill px-3 py-2 fw-bold small transition-all hover-rust"
                            style={{ fontSize: '0.75rem' }}
                        >
                            Assign Services
                        </button>
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
          <span className="text-muted small fw-bold">SHOWING {staff.length} OF {stats?.total_members || 0} TEAM MEMBERS</span>
          <div className="d-flex gap-2 text-muted tiny fw-bold cursor-pointer hover-rust">
             Shift Handover Logs <FiArrowRight className="ms-2" />
          </div>
        </div>
      </div>


      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 9999 }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '500px' }}>
                <div className="p-5 position-relative">
                    <button 
                        onClick={() => setShowAddModal(false)} 
                        className="btn btn-light rounded-circle position-absolute border-0 d-flex align-items-center justify-content-center p-2" 
                        style={{ top: '24px', right: '24px', width: '40px', height: '40px', transition: 'all 0.3s ease' }}
                    >
                        <FiX size={20} style={{ transform: 'rotate(0deg)' }} />
                    </button>

                    <h2 className="fw-bold mb-4" style={{ letterSpacing: '-1px' }}>New Team Member</h2>
                    
                    <div className="custom-scrollbar pe-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <form onSubmit={handleAddMember}>
                            <div className="row g-3 m-0">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny">FIRST NAME</label>
                                    <input type="text" name="first_name" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" required value={formData.first_name} onChange={handleInputChange} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny">LAST NAME</label>
                                    <input type="text" name="last_name" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" required value={formData.last_name} onChange={handleInputChange} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny">EMAIL ADDRESS</label>
                                    <input type="email" name="email" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" required value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny">JOB TITLE</label>
                                    <input type="text" name="job_title" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" placeholder="e.g. Master Stylist" required value={formData.job_title} onChange={handleInputChange} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny">INITIAL STATUS</label>
                                    <select name="availability" className="form-select rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" value={formData.availability} onChange={handleInputChange}>
                                        <option value="OFF_SHIFT">Off Shift</option>
                                        <option value="ON_DUTY">On Duty</option>
                                        <option value="ON_BREAK">On Break</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-5">
                                    <button type="submit" className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale" disabled={submitting}>
                                        {submitting ? 'Adding Member...' : 'Add to Team'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ASSIGN SERVICES MODAL */}
      {showAssignModal && selectedStaff && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 10000 }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="p-5 position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>Assign Services</h2>
                            <p className="text-muted small mb-0">Select the treatments <span className="fw-bold text-dark">{selectedStaff.full_name}</span> is qualified to perform.</p>
                        </div>
                        <button onClick={() => setShowAssignModal(false)} className="btn btn-light rounded-circle p-2 border-0">
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="custom-scrollbar mb-4 pe-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <div className="row g-3 m-0">
                            {allServices.map(svc => {
                                const isAssigned = selectedStaff.assigned_services?.includes(svc.id);
                                return (
                                    <div key={svc.id} className="col-12 p-0">
                                        <div 
                                            onClick={async () => {
                                                const newServices = isAssigned 
                                                    ? selectedStaff.assigned_services.filter((id: number) => id !== svc.id)
                                                    : [...(selectedStaff.assigned_services || []), svc.id];
                                                
                                                // Optimistic update
                                                const updatedStaff = { ...selectedStaff, assigned_services: newServices };
                                                setSelectedStaff(updatedStaff);
                                                setStaff(staff.map(s => s.id === selectedStaff.id ? { ...s, assigned_services: newServices, assigned_services_data: allServices.filter(as => newServices.includes(as.id)) } : s));

                                                try {
                                                    await api.patch(`/staff/${selectedStaff.id}/`, { assigned_services: newServices });
                                                } catch (error) {
                                                    console.error("Failed to update services", error);
                                                }
                                            }}
                                            className={`p-3 rounded-4 border-2 transition-all cursor-pointer d-flex align-items-center justify-content-between ${isAssigned ? 'border-rust bg-sand' : 'border-light bg-light opacity-75'}`}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-3 overflow-hidden bg-white" style={{ width: '40px', height: '40px' }}>
                                                    <img src={svc.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'} className="w-100 h-100 object-fit-cover" alt="" />
                                                </div>
                                                <div>
                                                    <div className="fw-bold small">{svc.name}</div>
                                                    <div className="text-muted tiny">{svc.duration} MIN • ${svc.price}</div>
                                                </div>
                                            </div>
                                            {isAssigned && <FiCheckCircle className="text-rust" size={20} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowAssignModal(false)}
                        className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .tiny { font-size: 0.65rem; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-scale:hover { transform: translateY(-5px); }
        .hover-rust:hover { color: #9C4A34 !important; }
        .btn-rust-outline { 
            background: transparent; 
            border: 2px solid #9C4A34; 
            color: #9C4A34; 
        }
        .btn-rust-outline:hover {
            background: #9C4A34;
            color: white;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #FDFBF7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E0D5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9C4A34;
        }
      `}</style>
    </div>
  );
}

