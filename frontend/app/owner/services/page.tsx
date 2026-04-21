'use client';

import React, { useState } from 'react';
import { 
    FiPlus, 
    FiClock, 
    FiEdit2, 
    FiTrash2, 
    FiSearch, 
    FiBell, 
    FiUser,
    FiScissors,
    FiCheckSquare,
    FiWind,
    FiLayers,
    FiImage,
    FiCamera
} from 'react-icons/fi';

export default function ServicesManagementPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const categories = ['All', 'Hair', 'Nails', 'Skincare', 'Massage'];

  const services = [
    {
        id: 1,
        name: 'Signature Balayage',
        price: '$180+',
        duration: '120 min',
        category: 'Hair',
        icon: <FiScissors />,
        active: true,
        staff: 4,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 2,
        name: 'Gel Manicure',
        price: '$45',
        duration: '45 min',
        category: 'Nails',
        icon: <FiCheckSquare />,
        active: true,
        staff: 2,
        image: 'https://images.unsplash.com/photo-1604654894610-df490668711d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 3,
        name: 'Deep Tissue Massage',
        price: '$120',
        duration: '60 min',
        category: 'Massage',
        icon: <FiLayers />,
        active: false,
        staff: 1,
        image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46152?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 4,
        name: 'Hydra-Radiance Facial',
        price: '$95',
        duration: '75 min',
        category: 'Skincare',
        icon: <FiWind />,
        active: true,
        staff: 2,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="pb-5">
      {/* HEADER SECTION */}
      <header className="d-flex align-items-center justify-content-between mb-5 px-2">
        <div className="position-relative d-none d-md-block" style={{ width: '400px' }}>
          <FiSearch className="position-absolute translate-middle-y text-muted opacity-50" style={{ top: '50%', left: '16px' }} size={18} />
          <input 
            type="text" 
            placeholder="Search services..." 
            className="form-control rounded-pill border-0 shadow-sm ps-5 py-3 bg-white"
            style={{ fontSize: '0.9rem' }}
          />
        </div>
        <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-3 text-muted">
                <FiBell size={20} className="cursor-pointer hover-rust transition-all" />
                <div className="rounded-circle border border-2 border-white shadow-sm overflow-hidden" style={{ width: '36px', height: '36px' }}>
                     <FiUser size={18} className="m-2" />
                </div>
            </div>
            <button 
                onClick={toggleModal}
                className="btn btn-rust rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm border-0 transition-all hover-scale"
            >
                <FiPlus size={18} /> Add Service
            </button>
        </div>
      </header>

      {/* PAGE TITLE */}
      <div className="mb-5 px-2">
        <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Services Management</h1>
        <p className="text-muted mb-0 lh-base" style={{ maxWidth: '600px' }}>
            Manage your salon's treatment menu and pricing. Adjust durations, staff assignments, and availability in real-time.
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="d-flex gap-3 mb-5 px-2 overflow-auto scrollbar-none pb-2">
        {categories.map((cat) => (
            <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${activeCategory === cat ? 'btn-rust text-white shadow' : 'bg-white text-muted hover-bg-light shadow-sm border-0'}`}
                style={{ fontSize: '0.85rem' }}
            >
                {cat}
            </button>
        ))}
      </div>

      {/* SERVICE GRID */}
      <div className="row g-4 px-2">
        {/* ADD NEW SERVICE PLACEHOLDER */}
        <div className="col-12 col-md-6 col-xl-4" onClick={toggleModal}>
            <div className="bg-white rounded-5 p-5 border border-2 border-dashed border-opacity-20 d-flex flex-column align-items-center justify-content-center text-center h-100 transition-all hover-rust hover-scale cursor-pointer" style={{ minHeight: '350px' }}>
                <div className="bg-sand rounded-pill p-4 mb-4 text-rust">
                    <FiPlus size={32} />
                </div>
                <h5 className="fw-bold mb-2">Add New Service</h5>
                <p className="text-muted small px-4 mb-0">Introduce a new luxury treatment to your portfolio.</p>
            </div>
        </div>

        {/* SERVICE CARDS */}
        {services.map((svc) => (
            <div key={svc.id} className="col-12 col-md-6 col-xl-4">
                <div className={`bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden h-100 transition-all hover-scale ${!svc.active ? 'grayscale' : ''}`}>
                    <div className="position-relative" style={{ height: '220px' }}>
                        <img src={svc.image} className="w-100 h-100 object-fit-cover" alt={svc.name} />
                        {/* Price Badge */}
                        <div className="position-absolute top-0 end-0 m-3 bg-white bg-opacity-75 backdrop-blur rounded-pill px-3 py-1 fw-bold text-dark shadow-sm" style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.85)' }}>
                            {svc.price}
                        </div>
                        {/* Inactive Overlay */}
                        {!svc.active && (
                            <div className="position-absolute inset-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                                <h4 className="fw-bold text-white letter-spaced mb-0">INACTIVE</h4>
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">{svc.name}</h5>
                            <div className="form-check form-switch m-0">
                                <input className="form-check-input custom-switch" type="checkbox" checked={svc.active} readOnly />
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3 text-muted small mb-4 fw-medium">
                            <div className="d-flex align-items-center gap-1">
                                <FiClock size={14} className="opacity-50" /> {svc.duration}
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <span className="opacity-50">{svc.icon}</span> {svc.category}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-opacity-10">
                            <div className="d-flex align-items-center">
                                {[...Array(Math.min(3, svc.staff))].map((_, i) => (
                                    <div key={i} className="rounded-circle border border-2 border-white shadow-sm overflow-hidden" style={{ width: '32px', height: '32px', marginLeft: i > 0 ? '-10px' : '0' }}>
                                        <img src={`https://i.pravatar.cc/100?u=${svc.id}-${i}`} className="w-100 h-100 object-fit-cover" alt="staff" />
                                    </div>
                                ))}
                                {svc.staff > 3 && (
                                    <div className="rounded-circle border border-2 border-white bg-sand d-flex align-items-center justify-content-center fw-bold text-muted small" style={{ width: '32px', height: '32px', marginLeft: '-10px', fontSize: '0.6rem' }}>
                                        +{svc.staff - 2}
                                    </div>
                                )}
                            </div>
                            <div className="d-flex gap-3 text-muted">
                                <FiEdit2 className="cursor-pointer hover-rust trasition-all" size={18} />
                                <FiTrash2 className="cursor-pointer hover-danger transition-all text-danger opacity-50 hover-opacity-100" size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* ADD SERVICE MODAL */}
      {isModalOpen && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)' }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="p-5">
                    <div className="d-flex justify-content-between align-items-start mb-5">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>New Treatment</h2>
                            <p className="text-muted small mb-0">Define the details of your luxury service offering.</p>
                        </div>
                        <button onClick={toggleModal} className="btn btn-light rounded-circle shadow-sm p-3 d-flex align-items-center justify-content-center">
                            <FiPlus style={{ transform: 'rotate(45deg)' }} size={20} />
                        </button>
                    </div>

                    <div className="custom-scrollbar pe-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <div className="row g-4 m-0">
                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">SERVICE COVER IMAGE</label>
                                <div className="rounded-5 border-2 border-dashed border-opacity-10 bg-sand p-4 text-center cursor-pointer mb-2 transition-all hover-rust">
                                    <div className="d-flex flex-column align-items-center">
                                        <FiImage size={40} className="mb-2 opacity-50" />
                                        <span className="small fw-bold opacity-75">Click to browse or drag image here</span>
                                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>PNG, JPG or WEBP (Max 5MB)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">SERVICE NAME</label>
                                <input type="text" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" placeholder="e.g. Signature Director's Cut" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">CATEGORY</label>
                                <select className="form-select rounded-pill border-0 bg-sand p-3 shadow-none fw-bold">
                                    {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">PRICE (USD)</label>
                                <input type="text" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" placeholder="$0.00" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">DURATION (MIN)</label>
                                <input type="text" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" placeholder="60" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">MAX STAFF</label>
                                <input type="number" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" defaultValue={1} />
                            </div>
                            <div className="col-12 mt-5">
                                <button className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale" onClick={toggleModal}>
                                    Create Treatment Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 2px; }
        .grayscale { filter: grayscale(100%); }
        .grayscale img { opacity: 0.6; }
        .backdrop-blur { backdrop-filter: blur(8px); }
        .hover-scale:hover { transform: translateY(-5px); }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        
        .custom-switch:checked {
            background-color: #9C4A34;
            border-color: #9C4A34;
        }
        .hover-rust:hover { color: #9C4A34 !important; }
        .hover-danger:hover { color: #dc3545 !important; opacity: 1 !important; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #fdfbf7;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 74, 52, 0.2);
            border-radius: 10px;
            transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 74, 52, 0.5);
        }
      `}</style>
    </div>
  );
}
