'use client';

import React, { useState } from 'react';
import { 
    FiHome, 
    FiClock, 
    FiUsers, 
    FiBell, 
    FiMapPin, 
    FiCamera, 
    FiChevronRight, 
    FiSearch, 
    FiHelpCircle,
    FiArrowRight
} from 'react-icons/fi';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Business Profile');

  const tabs = [
    { label: 'Business Profile', icon: <FiHome /> },
    { label: 'Operating Hours', icon: <FiClock /> },
    { label: 'Team Management', icon: <FiUsers /> },
    { label: 'Notifications', icon: <FiBell /> },
  ];

  const hours = [
    { day: 'Monday', time: '09:00 AM to 07:00 PM', active: true },
    { day: 'Tuesday', time: '09:00 AM to 07:00 PM', active: true },
    { day: 'Sunday', time: 'Closed for maintenance', active: false },
  ];

  return (
    <div className="pb-5">
      {/* HEADER SECTION */}
      <header className="d-flex align-items-center justify-content-between mb-5">
        <div className="position-relative d-none d-md-block" style={{ width: '350px' }}>
          <FiSearch className="position-absolute translate-middle-y text-muted opacity-50" style={{ top: '50%', left: '16px' }} size={18} />
          <input 
            type="text" 
            placeholder="Search settings..." 
            className="form-control rounded-pill border-0 shadow-sm ps-5 py-3 bg-sand"
            style={{ fontSize: '0.9rem' }}
          />
        </div>
        <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-3 text-muted">
                <FiBell size={20} className="cursor-pointer hover-rust transition-all" />
                <FiHelpCircle size={20} className="cursor-pointer hover-rust transition-all" />
            </div>
            <div className="rounded-circle overflow-hidden bg-sand border border-white border-2 shadow-sm" style={{ width: '40px', height: '40px' }}>
                <img src="https://i.pravatar.cc/100?img=32" alt="Profile" className="w-100 h-100 object-fit-cover" />
            </div>
        </div>
      </header>

      {/* PAGE TITLE */}
      <div className="row align-items-center mb-5">
        <div className="col-12 col-md-8">
            <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Settings</h1>
            <p className="text-muted mb-0">Manage your salon brand, team, and operational preferences.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
            <button className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-sm transition-all hover-scale">
                Save Changes
            </button>
        </div>
      </div>

      <div className="row g-5">
        
        {/* SETTINGS NAVIGATION (LEFT) */}
        <div className="col-12 col-lg-3">
            <div className="bg-white rounded-5 p-3 shadow-sm border border-opacity-10 d-flex flex-column gap-2 sticky-top" style={{ top: '30px' }}>
                {tabs.map((tab) => (
                    <button 
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`btn text-start px-4 py-3 rounded-4 d-flex align-items-center gap-3 border-0 transition-all ${activeTab === tab.label ? 'bg-sand text-rust fw-bold' : 'text-muted hover-bg-sand'}`}
                    >
                        <span className={activeTab === tab.label ? 'text-rust' : 'opacity-50'}>{tab.icon}</span>
                        <span style={{ fontSize: '0.9rem' }}>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* SETTINGS CONTENT (RIGHT) */}
        <div className="col-12 col-lg-9">
            
            {/* BUSINESS IDENTITY CARD */}
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 mb-5">
                <div className="d-flex align-items-center gap-2 mb-5">
                    <span className="bg-rust rounded-pill" style={{ width: '6px', height: '24px' }}></span>
                    <h4 className="fw-bold mb-0">Business Identity</h4>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-12 col-md-6">
                        <label className="text-muted small fw-bold mb-2 letter-spaced">SALON NAME</label>
                        <input 
                            type="text" 
                            defaultValue="Aura Luxe Studio" 
                            className="form-control rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium"
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="text-muted small fw-bold mb-2 letter-spaced">BUSINESS CATEGORY</label>
                        <select className="form-select rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium text-muted">
                            <option>Premium Hair & Styling</option>
                        </select>
                    </div>
                </div>

                <div className="mb-5">
                    <label className="text-muted small fw-bold mb-2 letter-spaced">SALON DESCRIPTION</label>
                    <textarea 
                        rows={4}
                        defaultValue="A boutique experience focusing on organic treatments and bespoke styling. Our mission is to create a serene environment where beauty meets wellness."
                        className="form-control rounded-5 border-0 shadow-sm py-4 px-4 bg-sand fw-medium lh-base text-muted"
                    ></textarea>
                </div>

                <div>
                    <label className="text-muted small fw-bold mb-3 letter-spaced">BRAND IMAGERY</label>
                    <div className="d-flex flex-wrap gap-4">
                        <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '120px', height: '120px' }}>
                            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '120px', height: '120px' }}>
                            <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="rounded-circle border border-2 border-dashed border-opacity-20 d-flex flex-column align-items-center justify-content-center cursor-pointer transition-all hover-rust hover-scale bg-sand" style={{ width: '120px', height: '120px', color: '#9C4A34' }}>
                            <FiCamera size={24} className="mb-2" />
                            <span className="fw-bold" style={{ fontSize: '0.65rem' }}>Upload New</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* OPERATING HOURS CARD */}
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 mb-5">
                <div className="d-flex align-items-center gap-2 mb-5">
                    <span className="bg-rust rounded-pill" style={{ width: '6px', height: '24px' }}></span>
                    <h4 className="fw-bold mb-0">Operating Hours</h4>
                </div>

                <div className="d-flex flex-column gap-3">
                    {hours.map((h, i) => (
                        <div key={i} className="bg-sand rounded-4 p-4 d-flex align-items-center justify-content-between shadow-sm border border-white border-3">
                             <div className="d-flex align-items-center gap-4">
                                <div className="form-check form-switch m-0">
                                    <input 
                                        className="form-check-input custom-switch" 
                                        type="checkbox" 
                                        defaultChecked={h.active} 
                                        style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                                    />
                                </div>
                                <span className="fw-bold text-dark">{h.day}</span>
                             </div>
                             <div className="d-flex align-items-center gap-3">
                                {h.active ? (
                                    <>
                                        <div className="bg-white rounded-pill px-4 py-2 small fw-bold text-dark shadow-inner border border-opacity-5">09:00 AM</div>
                                        <span className="text-muted small fw-bold">to</span>
                                        <div className="bg-white rounded-pill px-4 py-2 small fw-bold text-dark shadow-inner border border-opacity-5">07:00 PM</div>
                                    </>
                                ) : (
                                    <span className="text-muted fst-italic small">{h.time}</span>
                                )}
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* LOCATION CARD */}
            <div className="row g-4">
                <div className="col-12 col-xl-6">
                    <div className="bg-sand rounded-5 p-5 shadow-sm border border-white border-2 h-100" style={{ backgroundColor: '#ECE5DD' }}>
                         <h6 className="fw-bold text-rust mb-3 letter-spaced">LOCATION BRANDING</h6>
                         <p className="text-muted small lh-base mb-5" style={{ maxWidth: '300px' }}>
                            Your physical address defines your localized SEO. Ensure it's accurate to help clients find your sanctuary.
                         </p>
                         <div className="bg-white rounded-pill px-4 py-3 fw-bold text-dark mb-4 shadow-sm border" style={{ fontSize: '0.9rem' }}>
                            128 Editorial Way, Suite 400, N
                         </div>
                         <a href="#" className="text-decoration-none fw-bold text-rust d-flex align-items-center gap-2 small">
                            Update on Map <FiArrowRight />
                         </a>
                    </div>
                </div>
                <div className="col-12 col-xl-6">
                    <div className="bg-white rounded-5 shadow-sm border border-opacity-10 h-100 overflow-hidden position-relative min-h-300">
                        <img 
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                            className="w-100 h-100 object-fit-cover opacity-50 grayscale" 
                        />
                        <div className="position-absolute top-50 start-50 translate-middle bg-rust text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg border border-4 border-white" style={{ width: '48px', height: '48px' }}>
                            <FiMapPin size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .letter-spaced { font-size: 0.65rem; }
        .min-h-300 { min-height: 300px; }
        .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .grayscale { filter: grayscale(100%) sepia(30%) brightness(95%); }
        .hover-bg-sand:hover { background-color: #FDFBF7; }
        
        /* Custom Switch Styling to match design */
        .custom-switch:checked {
            background-color: #9C4A34;
            border-color: #9C4A34;
        }
      `}</style>
    </div>
  );
}
