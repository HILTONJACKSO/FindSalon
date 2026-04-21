'use client';

import React from 'react';
import { FiPlus, FiAlertCircle, FiTrendingDown, FiArrowRight, FiMoreHorizontal } from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function InventoryPage() {
  const categories = [
    'All Products', 'Hair Products', 'Skin Products', 'Tools & Equipment', 'Retail Items', 'Uniforms'
  ];

  const inventory = [
    {
      id: 1,
      name: 'Aura Silk Serum',
      description: 'Professional finishing oil',
      category: 'Hair Products',
      sku: 'AS-992-SR',
      stockLevel: 100, // percentage for bar
      stockLabel: 'In Stock (42)',
      stockColor: '#9C4A34',
      price: '$48.00',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Velvet Hold Hairspray',
      description: 'Extra strong finishing spray',
      category: 'Hair Products',
      sku: 'VH-110-HS',
      stockLevel: 25,
      stockLabel: 'Low Stock (3)',
      stockColor: '#D4A017',
      price: '$24.50',
      image: 'https://images.unsplash.com/photo-1594434032014-9725521f205c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Luxe Hydra-Mist',
      description: 'Post-facial cooling spray',
      category: 'Skin Products',
      sku: 'HM-484-SM',
      stockLevel: 0,
      stockLabel: 'Out of Stock (0)',
      stockColor: '#E0E0E0',
      price: '$32.00',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'Pro-Precision Shears',
      description: 'Rose gold titanium coating',
      category: 'Tools & Equipment',
      sku: 'TL-007-PS',
      stockLevel: 60,
      stockLabel: 'In Stock (8)',
      stockColor: '#9C4A34',
      price: '$185.00',
      image: 'https://images.unsplash.com/photo-1590540179852-2110a54f813a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="pb-5">
      <OwnerHeader />

      {/* PAGE HEADER */}
      <div className="row align-items-center mb-5">
        <div className="col-12 col-md-8">
          <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Inventory</h1>
          <p className="text-muted mb-0">Manage your salon supplies, professional kits, and retail products.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
          <button className="btn btn-rust rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ms-md-auto">
            <FiPlus size={20} /> Add Item
          </button>
        </div>
      </div>

      {/* ALERT HERO CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-xl-8">
            <div className="rounded-5 p-4 p-md-5 d-flex align-items-center gap-4 position-relative overflow-hidden border border-3 border-white shadow-sm" style={{ backgroundColor: '#FFF5F5', borderLeft: '12px solid #B23B3B !important' }}>
                <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-danger" style={{ minWidth: '80px', height: '80px' }}>
                    <FiAlertCircle size={40} />
                </div>
                <div className="flex-grow-1">
                    <h3 className="fw-bold mb-1 text-dark">Urgent: Out of Stock</h3>
                    <p className="mb-0 text-muted small lh-base" style={{ maxWidth: '400px' }}>
                        3 Essential products are currently unavailable and affecting service availability.
                    </p>
                </div>
                <button className="btn btn-link text-danger fw-bold text-decoration-underline p-0 border-0 ms-auto">
                    Reorder All
                </button>
            </div>
        </div>
        <div className="col-12 col-xl-4">
            <div className="rounded-5 p-4 p-md-5 d-flex align-items-center gap-4 border border-3 border-white shadow-sm h-100 position-relative overflow-hidden" style={{ backgroundColor: '#FDF2E3', borderLeft: '12px solid #9C4A34 !important' }}>
                <div className="bg-rust bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-rust" style={{ minWidth: '60px', height: '60px' }}>
                    <FiTrendingDown size={30} />
                </div>
                <div>
                   <h5 className="fw-bold mb-1 text-dark">Low Stock Items</h5>
                   <p className="mb-0 text-muted small">12 items need attention soon.</p>
                </div>
            </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="d-flex flex-wrap gap-2 mb-5 overflow-auto pb-2 scrollbar-none">
        {categories.map((cat, idx) => (
          <button 
            key={idx} 
            className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${idx === 0 ? 'btn-rust text-white shadow' : 'bg-sand text-muted hover-bg-light border-0'}`}
            style={{ fontSize: '0.85rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-5 shadow-sm border border-opacity-10 mb-5 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-sand bg-opacity-50">
              <tr>
                <th className="px-5 py-4 border-0 text-muted small fw-bold letter-spaced">PRODUCT DETAILS</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">CATEGORY</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">SKU</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">STOCK LEVEL</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">PRICE</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced text-end px-5">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="cursor-pointer transition-all">
                  <td className="px-5 py-4 border-bottom border-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-4 overflow-hidden border border-light" style={{ width: '56px', height: '56px' }}>
                        <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{item.name}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light">
                    <span className="badge rounded-pill px-3 py-2 fw-bold text-blue bg-blue bg-opacity-10" style={{ fontSize: '0.65rem', color: '#0066CC', backgroundColor: '#E5EFFF' }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 border-bottom border-light text-muted small fw-bold">{item.sku}</td>
                  <td className="py-4 border-bottom border-light" style={{ width: '200px' }}>
                    <div className="d-flex flex-column gap-1">
                        <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: '#F0F0F0' }}>
                            <div 
                                className="progress-bar rounded-pill" 
                                style={{ width: `${item.stockLevel}%`, backgroundColor: item.stockColor }}
                            ></div>
                        </div>
                        <span className="fw-bold" style={{ fontSize: '0.65rem', color: item.stockLevel === 0 ? '#B23B3B' : item.stockLevel < 30 ? '#D4A017' : '#9C4A34' }}>
                            {item.stockLabel}
                        </span>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light fw-bold text-dark">{item.price}</td>
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
        
        {/* Pagination placeholder */}
        <div className="px-5 py-4 bg-sand bg-opacity-30 d-flex justify-content-between align-items-center border-top">
          <span className="text-muted small fw-bold">Showing {inventory.length} of 128 products</span>
          <div className="d-flex gap-2">
            {[1, 2, 3].map(n => (
              <button key={n} className={`btn rounded-circle fw-bold ${n === 1 ? 'btn-rust text-white shadow' : 'btn-light bg-white border-0 opacity-50'}`} style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER NAV TILES */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 d-flex align-items-center justify-content-between cursor-pointer transition-all hover-scale">
                 <div>
                    <h4 className="fw-bold mb-1">Stock Analysis</h4>
                    <p className="text-muted small mb-0">Generate monthly usage and leakage report.</p>
                 </div>
                 <div className="text-rust">
                    <FiArrowRight size={24} />
                 </div>
            </div>
        </div>
        <div className="col-12 col-md-6">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 d-flex align-items-center justify-content-between cursor-pointer transition-all hover-scale">
                 <div>
                    <h4 className="fw-bold mb-1">Vendor Connect</h4>
                    <p className="text-muted small mb-0">Quick order from your top 3 distributors.</p>
                 </div>
                 <div className="text-rust">
                    <FiArrowRight size={24} />
                 </div>
            </div>
        </div>
      </div>

      <style jsx>{`
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .bg-sand { background-color: #FDFBF7; }
        .bg-rust { background-color: #9C4A34; }
        .text-rust { color: #9C4A34; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-scale:hover { transform: translateY(-5px); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
