'use client';

import React from 'react';
import { FiSearch, FiBell, FiHelpCircle } from 'react-icons/fi';

export default function OwnerHeader() {
  return (
    <header className="d-flex align-items-center justify-content-between mb-5">
      {/* Search Bar */}
      <div className="position-relative d-none d-md-block" style={{ width: '400px' }}>
        <FiSearch className="position-absolute translate-middle-y text-muted" style={{ top: '50%', left: '16px' }} size={18} />
        <input 
          type="text" 
          placeholder="Search customers by name or phone..." 
          className="form-control rounded-pill border-0 shadow-sm ps-5 py-3"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
        />
      </div>

      {/* Right Side Actions */}
      <div className="d-flex align-items-center gap-4">
        <div className="d-flex align-items-center gap-3 text-muted">
          <FiBell size={20} className="cursor-pointer hover-rust transition-all" />
          <FiHelpCircle size={20} className="cursor-pointer hover-rust transition-all" />
        </div>

        <button className="btn btn-rust d-none d-lg-block rounded-3 px-4 py-2 fw-bold small shadow-sm border-0 transition-all hover-scale" style={{ fontSize: '0.8rem' }}>
            Quick Action
        </button>
        
        <div className="border-start ps-4 d-flex align-items-center gap-3">
          <div className="text-end d-none d-lg-block">
            <h6 className="fw-bold mb-0 text-dark small">Aura Management</h6>
            <span className="text-muted fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Salon Owner</span>
          </div>
          <div className="rounded-circle overflow-hidden bg-sand border border-white border-2 shadow-sm" style={{ width: '40px', height: '40px' }}>
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
              alt="Owner" 
              className="w-100 h-100 object-fit-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
