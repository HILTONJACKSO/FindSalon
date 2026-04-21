'use client';

import React from 'react';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiHeart, FiStar, FiGrid, FiMap } from 'react-icons/fi';
import { BiSliderAlt } from 'react-icons/bi';
export default function SalonSearch() {
  return (
    <div className="bg-sand min-vh-100 pb-5">
      {/* HEADER */}
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="d-flex justify-content-between align-items-end mb-4 pb-2">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Salons in Manhattan</h1>
            <p className="text-muted mb-0">124 premium spaces found for your style</p>
          </div>
          <div className="bg-white rounded-pill shadow-sm d-inline-flex p-1">
            <button className="btn btn-sm rounded-pill fw-bold bg-white text-dark border-0 px-3 py-2 shadow-sm d-flex align-items-center"><FiGrid className="me-2 text-rust"/> List</button>
            <button className="btn btn-sm rounded-pill fw-medium text-muted border-0 px-3 py-2 d-flex align-items-center"><FiMap className="me-2"/> Map</button>
          </div>
        </div>

        <div className="row">
          {/* SIDEBAR FILTERS */}
          <div className="col-lg-3 d-none d-lg-block pe-4">
            <div className="mb-4">
              <label className="fw-bold small text-muted mb-2 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Location</label>
              <div className="bg-white rounded-pill px-3 py-2 d-flex align-items-center shadow-sm">
                <FiMapPin className="text-rust me-2" />
                <input type="text" value="New York, NY" readOnly className="border-0 bg-transparent w-100 fw-medium text-dark" style={{ outline: 'none' }} />
              </div>
            </div>

            <div className="mb-4 border-top pt-4">
              <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Price Range</label>
              <div className="d-flex justify-content-between">
                {['$', '$$', '$$$', '$$$$'].map((price, idx) => (
                  <button key={idx} className={`btn rounded-circle d-flex justify-content-center align-items-center fw-medium ${price === '$$' ? 'bg-rust text-white shadow-sm' : 'bg-white text-dark shadow-sm border-0'}`} style={{ width: '45px', height: '45px', fontSize: '0.9rem' }}>
                    {price}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 border-top pt-4">
              <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Minimum Rating</label>
              <div className="d-flex flex-column gap-2">
                <label className="d-flex align-items-center form-check-label fw-medium text-dark">
                  <input type="radio" name="rating" className="form-check-input mt-0 me-2 border-rust" style={{ backgroundColor: 'var(--accent-rust)' }} checked readOnly />
                  4.5+ Stars <FiStar className="text-rust ms-1 fill-rust" style={{ fill: 'var(--accent-rust)' }} />
                </label>
                <label className="d-flex align-items-center form-check-label text-muted">
                  <input type="radio" name="rating" className="form-check-input mt-0 me-2" />
                  4.0+ Stars <FiStar className="ms-1" />
                </label>
              </div>
            </div>

            <div className="mb-4 border-top pt-4">
              <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Services</label>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge rounded-pill bg-rust py-2 px-3 fw-medium">Haircut</span>
                <span className="badge rounded-pill bg-white text-dark border py-2 px-3 fw-medium shadow-sm" style={{ borderColor: '#EBE5DB' }}>Coloring</span>
                <span className="badge rounded-pill bg-white text-dark border py-2 px-3 fw-medium shadow-sm" style={{ borderColor: '#EBE5DB' }}>Manicure</span>
                <span className="badge rounded-pill bg-white text-dark border py-2 px-3 fw-medium shadow-sm" style={{ borderColor: '#EBE5DB' }}>Facial</span>
                <span className="badge rounded-pill bg-white text-dark border py-2 px-3 fw-medium shadow-sm" style={{ borderColor: '#EBE5DB' }}>Massage</span>
                <span className="badge rounded-pill bg-white text-dark border py-2 px-3 fw-medium shadow-sm" style={{ borderColor: '#EBE5DB' }}>Bridal</span>
              </div>
            </div>

            <button className="btn w-100 rounded-pill py-2 fw-bold mt-2" style={{ backgroundColor: '#EBE5DB', color: 'var(--text-dark)' }}>Reset All Filters</button>
          </div>

          {/* LISTINGS */}
          <div className="col-lg-5">
            <div className="row g-4">
              
              {/* Card 1 */}
              <div className="col-sm-6">
                <div className="card border-0 bg-transparent h-100">
                  <div className="image-card-rounded shadow-sm position-relative mb-3">
                    <span className="position-absolute badge rounded-pill bg-white text-dark fw-bold shadow-sm" style={{ top: '15px', left: '15px', zIndex: 10, fontSize: '0.7rem' }}>
                      <FiStar className="text-rust me-1" /> FEATURED
                    </span>
                    <button className="position-absolute btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{ top: '15px', right: '15px', zIndex: 10, width: '35px', height: '35px' }}>
                      <FiHeart className="text-muted" />
                    </button>
                    <span className="position-absolute bg-dark text-white rounded-pill px-3 py-1 fw-bold fs-6 shadow" style={{ bottom: '15px', right: '15px', zIndex: 10 }}>from $85</span>
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" alt="Salon" className="w-100" style={{ height: '220px', objectFit: 'cover' }} />
                  </div>
                  <div className="px-1">
                    <div className="text-muted small fw-medium mb-1 d-flex align-items-center">
                      <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }} /> <span className="text-dark fw-bold me-1">4.9</span> · 1.2 miles away
                    </div>
                    <Link href="/salons/1" className="text-decoration-none"><h5 className="fw-bold text-dark mb-1">The Gilded Mane</h5></Link>
                    <p className="text-muted small lh-sm mb-3" style={{ fontSize: '0.8rem' }}>Expert coloring and editorial styling in the heart of SoHo. Experience the tactile luxury of our signature treatments.</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div className="d-flex align-items-center">
                        <img src="https://i.pravatar.cc/150?img=1" className="rounded-circle border border-2 border-white" width="28" height="28" alt="Stylist" style={{ marginLeft: '-0px' }} />
                        <img src="https://i.pravatar.cc/150?img=2" className="rounded-circle border border-2 border-white" width="28" height="28" alt="Stylist" style={{ marginLeft: '-10px' }} />
                        <span className="badge rounded-circle bg-light border text-dark ms-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>+4</span>
                      </div>
                      <button className="btn rounded-pill px-3 py-1 fw-bold" style={{ backgroundColor: '#FDF2E3', color: 'var(--accent-rust)', fontSize: '0.85rem' }}>Quick Book</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-sm-6">
                <div className="card border-0 bg-transparent h-100">
                  <div className="image-card-rounded shadow-sm position-relative mb-3">
                    <button className="position-absolute btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{ top: '15px', right: '15px', zIndex: 10, width: '35px', height: '35px' }}>
                      <FiHeart className="text-muted" />
                    </button>
                    <span className="position-absolute bg-dark text-white rounded-pill px-3 py-1 fw-bold fs-6 shadow" style={{ bottom: '15px', right: '15px', zIndex: 10 }}>from $45</span>
                    <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80" alt="Salon" className="w-100" style={{ height: '220px', objectFit: 'cover' }} />
                  </div>
                  <div className="px-1">
                    <div className="text-muted small fw-medium mb-1 d-flex align-items-center">
                      <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }} /> <span className="text-dark fw-bold me-1">4.7</span> · 0.8 miles away
                    </div>
                    <Link href="/salons/2" className="text-decoration-none"><h5 className="fw-bold text-dark mb-1">Noir Nail Studio</h5></Link>
                    <p className="text-muted small lh-sm mb-3" style={{ fontSize: '0.8rem' }}>Sustainable manicure experiences and avant-garde nail art designs for the modern curator.</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div className="d-flex align-items-center">
                        <img src="https://i.pravatar.cc/150?img=3" className="rounded-circle border border-2 border-white" width="28" height="28" alt="Stylist" style={{ marginLeft: '-0px' }} />
                        <span className="badge rounded-circle bg-light border text-dark ms-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>+8</span>
                      </div>
                      <button className="btn rounded-pill px-3 py-1 fw-bold" style={{ backgroundColor: '#FDF2E3', color: 'var(--accent-rust)', fontSize: '0.85rem' }}>Quick Book</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-sm-6">
                 <div className="card border-0 bg-transparent h-100">
                  <div className="image-card-rounded shadow-sm position-relative mb-3">
                    <button className="position-absolute btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{ top: '15px', right: '15px', zIndex: 10, width: '35px', height: '35px' }}>
                      <FiHeart className="text-muted" />
                    </button>
                    <span className="position-absolute bg-dark text-white rounded-pill px-3 py-1 fw-bold fs-6 shadow" style={{ bottom: '15px', right: '15px', zIndex: 10 }}>from $60</span>
                    <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80" alt="Salon" className="w-100" style={{ height: '220px', objectFit: 'cover' }} />
                  </div>
                  <div className="px-1">
                    <div className="text-muted small fw-medium mb-1 d-flex align-items-center">
                      <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }} /> <span className="text-dark fw-bold me-1">4.8</span> · 2.4 miles away
                    </div>
                    <Link href="/salons/3" className="text-decoration-none"><h5 className="fw-bold text-dark mb-1">Botanical Beauty</h5></Link>
                    <p className="text-muted small lh-sm mb-3" style={{ fontSize: '0.8rem' }}>Organic hair treatments and botanical facials in a serene, plant-filled oasis.</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div className="d-flex align-items-center">
                        <img src="https://i.pravatar.cc/150?img=4" className="rounded-circle border border-2 border-white" width="28" height="28" alt="Stylist" style={{ marginLeft: '-0px' }} />
                        <img src="https://i.pravatar.cc/150?img=5" className="rounded-circle border border-2 border-white" width="28" height="28" alt="Stylist" style={{ marginLeft: '-10px' }} />
                        <span className="badge rounded-circle bg-light border text-dark ms-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>+2</span>
                      </div>
                      <button className="btn rounded-pill px-3 py-1 fw-bold" style={{ backgroundColor: '#FDF2E3', color: 'var(--accent-rust)', fontSize: '0.85rem' }}>Quick Book</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT MAP */}
          <div className="col-lg-4 d-none d-lg-block position-relative">
            <div className="rounded-4 overflow-hidden position-sticky" style={{ top: '100px', height: 'calc(100vh - 120px)', background: 'linear-gradient(135deg, #e0e5db, #d0d7d1)' }}>
              {/* Map Placeholder */}
              <div className="position-absolute" style={{ top: '40%', left: '30%' }}>
                <div className="bg-rust rounded-circle shadow-lg border border-white border-2 text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                  <FiMapPin size={16}/>
                </div>
              </div>
              <div className="position-absolute" style={{ top: '60%', left: '50%' }}>
                <div className="bg-dark rounded-circle shadow border border-white border-2 text-white d-flex align-items-center justify-content-center opacity-75" style={{ width: '30px', height: '30px' }}>
                  <FiMapPin size={12}/>
                </div>
              </div>
              <div className="position-absolute" style={{ top: '70%', left: '70%' }}>
                <div className="bg-dark rounded-circle shadow border border-white border-2 text-white d-flex align-items-center justify-content-center opacity-75" style={{ width: '30px', height: '30px' }}>
                  <FiMapPin size={12}/>
                </div>
              </div>

              {/* Map Controls */}
              <div className="position-absolute bg-white rounded-pill shadow-sm d-flex flex-column" style={{ bottom: '30px', right: '30px' }}>
                 <button className="btn btn-sm border-0 pt-2 pb-1 text-dark fs-5 fw-bold">+</button>
                 <hr className="m-0 bg-secondary" style={{ opacity: 0.1 }} />
                 <button className="btn btn-sm border-0 pb-2 pt-1 text-dark fs-5 fw-bold">-</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
