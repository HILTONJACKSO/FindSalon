'use client';

import React from 'react';
import Link from 'next/link';
import { FiShare2, FiHeart, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
export default function SalonProfile() {
  return (
    <div className="bg-sand min-vh-100 pb-5">
      <div className="container px-3 px-lg-5 pt-4 mt-2">
        {/* HEADER SECTION */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
          <div>
            <div className="d-flex gap-2 mb-2">
              <span className="badge bg-warning text-dark px-2 border border-warning" style={{ fontSize: '0.65rem' }}>FEATURED</span>
              <span className="badge bg-info text-white bg-opacity-75 px-2 border border-info" style={{ backgroundColor: '#8DB8D0!important', fontSize: '0.65rem' }}>PREMIUM</span>
            </div>
            <h1 className="fw-bold mb-2 text-dark" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>The Gilded Mane</h1>
            <div className="d-flex align-items-center text-muted fw-medium" style={{ fontSize: '0.9rem' }}>
              <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }} /> <span className="text-dark fw-bold me-1">4.9</span> · 
              <span className="text-decoration-underline mx-1">248 Reviews</span> · Mayfair, London
            </div>
          </div>
          <div className="mt-4 mt-md-0 d-flex gap-2">
            <button className="btn btn-white bg-white rounded-pill border fw-bold shadow-sm px-4 py-2 d-flex align-items-center"><FiShare2 className="me-2" /> Share</button>
            <button className="btn btn-dark rounded-pill fw-bold shadow-sm px-4 py-2 d-flex align-items-center"><FiHeart className="me-2 fill-white" style={{ fill: 'white' }} /> Follow</button>
          </div>
        </div>

        {/* IMAGE GRID */}
        <div className="row g-3 mb-5">
          <div className="col-md-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '400px' }}>
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Main Salon" className="w-100 h-100" style={{ objectFit: 'cover' }} />
            </div>
          </div>
          <div className="col-md-4 d-flex flex-column gap-3">
            <div className="row g-3" style={{ height: '190px' }}>
              <div className="col-6 h-100">
                <div className="rounded-4 overflow-hidden h-100 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80" alt="Salon detailed" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="col-6 h-100">
                <div className="rounded-4 overflow-hidden h-100 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80" alt="Products" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
            <div className="rounded-4 overflow-hidden shadow-sm position-relative" style={{ height: '194px' }}>
              <button className="btn btn-light bg-white rounded-pill fw-bold shadow-sm px-3 py-1 position-absolute" style={{ bottom: '15px', right: '15px', zIndex: 10, fontSize: '0.8rem' }}>View 24 Photos</button>
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80" alt="Spa room" className="w-100 h-100" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* CONTENT & SIDEBAR */}
        <div className="row position-relative">
          <div className="col-lg-7 pe-lg-5">
            
            {/* Nav Pills */}
            <div className="d-flex gap-2 overflow-auto mb-5 border-bottom pb-4">
              <button className="btn bg-rust text-white rounded-pill fw-medium px-4">Most Popular</button>
              <button className="btn rounded-pill fw-medium px-4 text-dark" style={{ backgroundColor: '#EBE5DB' }}>Haircutting</button>
              <button className="btn rounded-pill fw-medium px-4 text-dark" style={{ backgroundColor: '#EBE5DB' }}>Coloring</button>
              <button className="btn rounded-pill fw-medium px-4 text-dark" style={{ backgroundColor: '#EBE5DB' }}>Treatments</button>
            </div>

            {/* Service Category */}
            <div className="mb-5">
              <h3 className="fw-bold mb-4 text-dark">Haircutting & Styling</h3>
              
              <div className="card border-0 bg-white shadow-sm rounded-4 mb-3 p-4 d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.05rem' }}>Signature Director's Cut</h6>
                  <p className="text-muted small mb-1">Consultation, detox wash, precision cut, and editorial styling.</p>
                  <p className="text-rust small fw-bold mb-0">60 min</p>
                </div>
                <div className="text-end ms-4">
                  <h5 className="fw-bold text-dark mb-2">£95</h5>
                  <button className="btn btn-sm rounded-pill px-3 fw-bold text-dark" style={{ backgroundColor: '#EBE5DB' }}>ADD</button>
                </div>
              </div>

              <div className="card border-0 bg-white shadow-sm rounded-4 mb-3 p-4 d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.05rem' }}>Classic Blow Dry</h6>
                  <p className="text-muted small mb-1">Smooth finish or voluminous waves using premium heat protection.</p>
                  <p className="text-rust small fw-bold mb-0">45 min</p>
                </div>
                <div className="text-end ms-4">
                  <h5 className="fw-bold text-dark mb-2">£45</h5>
                  <button className="btn btn-sm rounded-pill px-3 fw-bold text-dark" style={{ backgroundColor: '#EBE5DB' }}>ADD</button>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="fw-bold mb-4 text-dark">Technical Coloring</h3>
              <div className="card border-0 bg-white shadow-sm rounded-4 mb-3 p-4 d-flex flex-row justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.05rem' }}>Lived-in Balayage</h6>
                  <p className="text-muted small mb-1">Custom hand-painted highlights for a natural, sun-kissed look.</p>
                  <p className="text-rust small fw-bold mb-0">180 min</p>
                </div>
                <div className="text-end ms-4">
                  <h5 className="fw-bold text-dark mb-2">£185</h5>
                  <button className="btn btn-sm rounded-pill px-3 fw-bold text-dark" style={{ backgroundColor: '#EBE5DB' }}>ADD</button>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-5 pt-4 border-top">
              <div className="d-flex justify-content-between align-items-end mb-4">
                <h3 className="fw-bold mb-0 text-dark">Client Stories</h3>
                <span className="fw-bold text-dark"><FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }}/> 4.9 / 5.0</span>
              </div>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card bg-transparent border-0 rounded-4 p-4 h-100" style={{ backgroundColor: '#FDFCFB!important', boxShadow: 'inset 0 0 0 1px #EBE5DB' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-rust bg-opacity-25 text-rust d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>EM</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0 fs-6">Elena Martinez</h6>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>2 days ago</small>
                      </div>
                    </div>
                    <div className="text-rust mb-2 shadow-none d-flex gap-1" style={{ fontSize: '0.8rem' }}>
                      <FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/>
                    </div>
                    <p className="text-muted small font-serif-italic mb-0">"The most professional service I've had in years. The atmosphere is quiet, luxury, and the balayage result exceeded my expectations."</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-transparent border-0 rounded-4 p-4 h-100" style={{ backgroundColor: '#FDFCFB!important', boxShadow: 'inset 0 0 0 1px #EBE5DB' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-dark bg-opacity-10 text-dark d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>JD</div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0 fs-6">James Dalton</h6>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>1 week ago</small>
                      </div>
                    </div>
                    <div className="text-rust mb-2 shadow-none d-flex gap-1" style={{ fontSize: '0.8rem' }}>
                      <FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/><FiStar style={{ fill: 'var(--accent-rust)' }}/>
                    </div>
                    <p className="text-muted small font-serif-italic mb-0">"The Director's Cut is worth every penny. Expert precision and great conversation. Truly a premium experience in the heart of Mayfair."</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SIDEBAR WIDGET */}
          <div className="col-lg-5">
            <div className="card border-0 bg-white shadow-lg rounded-4 p-4 position-sticky" style={{ top: '20px' }}>
              <h4 className="fw-bold text-rust mb-1 fs-5">Reserve Your Visit</h4>
              <p className="text-muted small mb-4">Select your preferred date & time:</p>
              
              {/* Date Picker Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>OCTOBER 2024</h6>
                <div className="d-flex gap-2 text-muted">
                  <FiChevronLeft className="cursor-pointer" />
                  <FiChevronRight className="cursor-pointer text-dark" />
                </div>
              </div>

              {/* Day Pills */}
              <div className="d-flex justify-content-between mb-4 border-bottom pb-4">
                <div className="d-flex flex-column align-items-center bg-rust text-white rounded-pill px-2 py-3 shadow-sm" style={{ width: '55px' }}>
                  <span className="small mb-1" style={{ fontSize: '0.7rem' }}>MON</span>
                  <span className="fw-bold fs-5">14</span>
                </div>
                <div className="d-flex flex-column align-items-center text-muted rounded-pill px-2 py-3" style={{ width: '55px', backgroundColor: '#F9F7F4' }}>
                  <span className="small mb-1" style={{ fontSize: '0.7rem' }}>TUE</span>
                  <span className="fw-bold fs-5 text-dark">15</span>
                </div>
                <div className="d-flex flex-column align-items-center text-muted rounded-pill px-2 py-3" style={{ width: '55px', backgroundColor: '#F9F7F4' }}>
                  <span className="small mb-1" style={{ fontSize: '0.7rem' }}>WED</span>
                  <span className="fw-bold fs-5 text-dark">16</span>
                </div>
                <div className="d-flex flex-column align-items-center text-muted rounded-pill px-2 py-3" style={{ width: '55px', backgroundColor: '#F9F7F4' }}>
                  <span className="small mb-1" style={{ fontSize: '0.7rem' }}>THU</span>
                  <span className="fw-bold fs-5 text-dark">17</span>
                </div>
              </div>

              {/* Time Slots */}
              <h6 className="fw-bold text-dark mb-3 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Available Slots</h6>
              <div className="row g-2 mb-4">
                <div className="col-4"><button className="btn w-100 rounded-pill py-2 border fw-medium text-dark small bg-white" style={{ fontSize: '0.8rem' }}>09:00 AM</button></div>
                <div className="col-4"><button className="btn w-100 rounded-pill py-2 border fw-medium text-dark small bg-white" style={{ fontSize: '0.8rem' }}>11:30 AM</button></div>
                <div className="col-4"><button className="btn btn-dark w-100 rounded-pill py-2 fw-medium small border-0 shadow-sm" style={{ fontSize: '0.8rem' }}>02:00 PM</button></div>
                <div className="col-4"><button className="btn w-100 rounded-pill py-2 border fw-medium text-muted small bg-white" style={{ fontSize: '0.8rem', opacity: 0.5 }} disabled>04:15 PM</button></div>
                <div className="col-4"><button className="btn w-100 rounded-pill py-2 border fw-medium text-dark small bg-white" style={{ fontSize: '0.8rem' }}>05:30 PM</button></div>
                <div className="col-4"><button className="btn w-100 rounded-pill py-2 border fw-medium text-muted small bg-white" style={{ fontSize: '0.8rem', opacity: 0.5 }} disabled>07:00 PM</button></div>
              </div>

              {/* Summary */}
              <div className="d-flex justify-content-between align-items-center border-top pt-4 mb-4">
                <span className="text-dark fw-medium small">Selected Services (1)</span>
                <h5 className="fw-bold text-dark mb-0">£95.00</h5>
              </div>

              <button className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm mb-3">Complete Booking</button>
              <p className="text-center text-muted mb-0" style={{ fontSize: '0.65rem' }}>No immediate payment required. You'll pay after your appointment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
