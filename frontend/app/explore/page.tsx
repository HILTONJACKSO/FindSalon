'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiHeart, FiChevronRight, FiScissors, FiCompass, FiAward, FiZap } from 'react-icons/fi';
import { api } from '@/lib/api';

const categories = [
  { name: 'Hair', icon: <FiScissors />, color: '#E1D9CC' },
  { name: 'Nails', icon: <FiZap />, color: '#F2EDE4' },
  { name: 'Spa', icon: <FiCompass />, color: '#EBE5DB' },
  { name: 'Makeup', icon: <FiAward />, color: '#F9F7F4' },
  { name: 'Facial', icon: <FiStar />, color: '#E1D9CC' },
  { name: 'Massage', icon: <FiHeart />, color: '#F2EDE4' },
];

export default function ExplorePage() {
  const [trendingSalons, setTrendingSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/salons/');
        // Mocking trending logic: just take first 4 for now
        setTrendingSalons((res.data.results || res.data).slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch trending salons", err);
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="bg-sand min-vh-100">
      {/* HERO / SEARCH SECTION */}
      <div className="bg-white border-bottom py-5 mb-5">
        <div className="container px-4">
          <div className="max-w-700 mx-auto text-center">
            <h1 className="fw-bold mb-4 font-serif-italic" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>
              Explore Beauty in Monrovia
            </h1>
            <div className="position-relative shadow-sm rounded-pill overflow-hidden border" style={{ borderColor: '#EBE5DB' }}>
              <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-4 text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search for services, salons or stylists..." 
                className="form-control form-control-lg border-0 ps-5 py-4 rounded-0"
                style={{ fontSize: '1.1rem' }}
              />
              <button className="btn btn-rust position-absolute top-50 end-0 translate-middle-y me-2 rounded-pill px-4 py-2 fw-bold">
                Find
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4">
        {/* CATEGORIES GRID */}
        <section className="mb-5 pb-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1 text-dark">Find by Category</h3>
              <p className="text-muted small mb-0">Browse top-rated services by specialty</p>
            </div>
          </div>
          <div className="row g-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-2">
                <Link href={`/salons?search=${cat.name}`} className="text-decoration-none">
                  <div className="card border-0 rounded-5 p-4 text-center h-100 transition-all hover-scale" style={{ backgroundColor: cat.color }}>
                    <div className="text-rust mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style={{ width: '50px', height: '50px' }}>
                      {cat.icon}
                    </div>
                    <h6 className="fw-bold text-dark mb-0 letter-spaced small">{cat.name.toUpperCase()}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* TRENDING SALONS */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1 text-dark">Trending Nearby</h3>
              <p className="text-muted small mb-0">The most booked salons this week in Monrovia</p>
            </div>
          </div>
          <div className="row g-4">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="col-md-3">
                  <div className="bg-white rounded-5 p-3 shadow-sm h-100 animate-pulse">
                    <div className="bg-light rounded-4 mb-3" style={{ height: '180px' }}></div>
                    <div className="bg-light rounded w-75 h-4 mb-2"></div>
                    <div className="bg-light rounded w-50 h-3"></div>
                  </div>
                </div>
              ))
            ) : (
              trendingSalons.map((salon) => (
                <div key={salon.id} className="col-md-3">
                  <Link href={`/salons/${salon.id}`} className="text-decoration-none">
                    <div className="card border-0 bg-white rounded-5 overflow-hidden shadow-sm h-100 transition-all hover-scale">
                      <div className="position-relative" style={{ height: '180px' }}>
                        <img src={salon.cover_image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={salon.name} />
                        <div className="position-absolute top-0 end-0 p-3">
                          <button className="btn btn-white btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                            <FiHeart size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="d-flex align-items-center mb-1">
                          <FiStar className="text-rust me-1" size={14} />
                          <span className="small fw-bold text-dark">{salon.rating}</span>
                        </div>
                        <h6 className="fw-bold text-dark mb-1 text-truncate">{salon.name}</h6>
                        <div className="d-flex align-items-center text-muted small">
                          <FiMapPin className="me-1" size={12} />
                          <span className="text-truncate">{salon.address}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
