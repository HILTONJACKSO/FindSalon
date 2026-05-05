'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiHeart, FiStar, FiGrid, FiMap } from 'react-icons/fi';
import { BiSliderAlt } from 'react-icons/bi';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import SalonMap from '@/components/salons/SalonMap';

export default function SalonSearch() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  
  const [salons, setSalons] = useState<any[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [minRating, setMinRating] = useState(0);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await api.get('/salons/');
        // Handle paginated response
        const data = res.data.results || res.data;
        setSalons(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch salons", err);
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  useEffect(() => {
    let result = salons;
    if (searchQuery) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.offered_services?.some((os: string) => os.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (locationQuery) {
      result = result.filter(s => 
        s.address.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }
    if (minRating > 0) {
      result = result.filter(s => s.rating >= minRating);
    }
    if (minPrice !== '') {
      result = result.filter(s => s.min_price >= minPrice);
    }
    if (maxPrice !== '') {
      result = result.filter(s => s.min_price <= maxPrice);
    }
    if (selectedServices.length > 0) {
      result = result.filter(s => 
        selectedServices.some(service => 
          s.offered_services?.some((os: string) => os.toLowerCase().includes(service.toLowerCase()))
        )
      );
    }
    setFilteredSalons(result);
  }, [searchQuery, locationQuery, minRating, minPrice, maxPrice, selectedServices, salons]);
  return (
    <div className="bg-sand min-vh-100 pb-5">
      {/* HEADER */}
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="d-flex justify-content-between align-items-end mb-4 pb-2">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Salons</h1>
            <p className="text-muted mb-0">{filteredSalons.length} premium spaces found for your style</p>
          </div>
          <div className="bg-white rounded-pill shadow-sm d-inline-flex p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`btn btn-sm rounded-pill fw-bold border-0 px-3 py-2 d-flex align-items-center transition-all ${viewMode === 'list' ? 'bg-white text-dark shadow-sm' : 'text-muted'}`}
            >
              <FiGrid className={`me-2 ${viewMode === 'list' ? 'text-rust' : ''}`}/> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`btn btn-sm rounded-pill fw-medium border-0 px-3 py-2 d-flex align-items-center transition-all ${viewMode === 'map' ? 'bg-white text-dark shadow-sm' : 'text-muted'}`}
            >
              <FiMap className={`me-2 ${viewMode === 'map' ? 'text-rust' : ''}`}/> Map
            </button>
          </div>
        </div>

        <div className="row">
          {/* SIDEBAR FILTERS */}
          <div className="col-lg-3 d-none d-lg-block pe-4">
            <div className="mb-4">
              <label className="fw-bold small text-muted mb-2 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Location</label>
              <div className="bg-white rounded-pill px-3 py-2 d-flex align-items-center shadow-sm">
                <FiSearch className="text-rust me-2" />
                <input 
                  type="text" 
                  placeholder="Search salons..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent w-100 fw-medium text-dark" 
                  style={{ outline: 'none' }} 
                />
              </div>
            </div>

            <div className="mb-4 border-top pt-4">
              <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Price Range ($)</label>
              <div className="d-flex align-items-center gap-2">
                <div className="position-relative flex-grow-1">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="form-control border-0 shadow-sm rounded-pill px-3 py-2 text-center"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <span className="text-muted">—</span>
                <div className="position-relative flex-grow-1">
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="form-control border-0 shadow-sm rounded-pill px-3 py-2 text-center"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 border-top pt-4">
              <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Minimum Rating</label>
              <div className="d-flex flex-column gap-2">
                <label className="d-flex align-items-center form-check-label fw-medium text-dark cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    className="form-check-input mt-0 me-2 border-rust" 
                    onChange={() => setMinRating(4.5)}
                    checked={minRating === 4.5} 
                  />
                  4.5+ Stars <FiStar className="text-rust ms-1 fill-rust" style={{ fill: 'var(--accent-rust)' }} />
                </label>
                <label className="d-flex align-items-center form-check-label text-muted cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    className="form-check-input mt-0 me-2" 
                    onChange={() => setMinRating(4.0)}
                    checked={minRating === 4.0}
                  />
                  4.0+ Stars <FiStar className="ms-1" />
                </label>
                <label className="d-flex align-items-center form-check-label text-muted cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    className="form-check-input mt-0 me-2" 
                    onChange={() => setMinRating(0)}
                    checked={minRating === 0}
                  />
                  All Ratings
                </label>
              </div>
            </div>

            <div className="mb-4 border-top pt-4">
              <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Services</label>
              <div className="d-flex flex-wrap gap-2">
                {['Haircut', 'Coloring', 'Manicure', 'Facial', 'Massage', 'Bridal'].map((service) => (
                  <span 
                    key={service} 
                    onClick={() => {
                      if (selectedServices.includes(service)) {
                        setSelectedServices(selectedServices.filter(s => s !== service));
                      } else {
                        setSelectedServices([...selectedServices, service]);
                      }
                    }}
                    className={`badge rounded-pill py-2 px-3 fw-medium cursor-pointer transition-all shadow-sm ${
                      selectedServices.includes(service) 
                        ? 'bg-rust text-white border-rust' 
                        : 'bg-white text-dark border'
                    }`} 
                    style={{ 
                      borderColor: '#EBE5DB',
                      userSelect: 'none'
                    }}
                  >
                    {service}
                  </span >
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setSearchQuery('');
                setMinRating(0);
                setMinPrice('');
                setMaxPrice('');
                setSelectedServices([]);
              }}
              className="btn w-100 rounded-pill py-2 fw-bold mt-2" 
              style={{ backgroundColor: '#EBE5DB', color: 'var(--text-dark)' }}
            >
              Reset All Filters
            </button>
          </div>

          {/* LISTINGS */}
          <div className={`col-lg-5 ${viewMode === 'map' ? 'd-none d-lg-block' : 'd-block'}`}>
            <div className="row g-4">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <div className="col-sm-6" key={i}>
                    <div className="bg-light rounded-4 w-100 mb-3" style={{ height: '220px' }}></div>
                    <div className="bg-light rounded w-75 h-4 mb-2"></div>
                    <div className="bg-light rounded w-50 h-3"></div>
                  </div>
                ))
              ) : filteredSalons.length > 0 ? (
                filteredSalons.map((salon) => (
                  <div className="col-sm-6" key={salon.id}>
                    <div className="card border-0 bg-transparent h-100">
                      <div className="image-card-rounded shadow-sm position-relative mb-3 group overflow-hidden">
                        <button className="position-absolute btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center" style={{ top: '15px', right: '15px', zIndex: 10, width: '35px', height: '35px' }}>
                          <FiHeart className="text-muted" />
                        </button>
                        <span className="position-absolute bg-dark text-white rounded-pill px-3 py-1 fw-bold fs-6 shadow" style={{ bottom: '15px', right: '15px', zIndex: 10 }}>from ${salon.min_price}</span>
                        <img src={salon.cover_image} alt={salon.name} className="w-100 transition-all hover-zoom" style={{ height: '220px', objectFit: 'cover' }} />
                      </div>
                      <div className="px-1">
                        <div className="text-muted small fw-medium mb-1 d-flex align-items-center">
                          <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }} /> <span className="text-dark fw-bold me-1">{salon.rating}</span> · {Math.round(Math.random() * 5 + 0.5)} miles away
                        </div>
                        <Link href={`/salons/${salon.id}`} className="text-decoration-none"><h5 className="fw-bold text-dark mb-1">{salon.name}</h5></Link>
                        <p className="text-muted small lh-sm mb-2 line-clamp-2" style={{ fontSize: '0.8rem', minHeight: '2.4rem' }}>{salon.description || "Experience luxury editorial styling and bespoke treatments."}</p>
                        <div className="mb-3">
                            <div className="d-flex flex-wrap gap-1">
                                {salon.offered_services && salon.offered_services.length > 0 && (
                                    salon.offered_services.slice(0, 3).map((svc: any, i: number) => (
                                        <span key={i} className="badge bg-sand text-rust border-0 rounded-pill px-2 py-1 small fw-bold" style={{ fontSize: '0.6rem', opacity: 0.8 }}>{svc.name || svc}</span>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <div className="d-flex align-items-center text-muted small fw-bold letter-spaced" style={{ fontSize: '0.6rem' }}>
                            <FiMapPin className="text-rust me-1" /> {salon.address.split(',')[0].toUpperCase()}
                          </div>
                          <Link href={`/salons/${salon.id}`}>
                            <button className="btn rounded-pill px-3 py-1 fw-bold" style={{ backgroundColor: '#FDF2E3', color: 'var(--accent-rust)', fontSize: '0.85rem' }}>Quick Book</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h5 className="text-muted">No salons found matching your criteria.</h5>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT MAP */}
          <div className={`col-lg-4 d-lg-block position-relative ${viewMode === 'list' ? 'd-none' : 'd-block'}`}>
            <div className="rounded-4 overflow-hidden position-sticky shadow-sm" style={{ top: '100px', height: 'calc(100vh - 120px)', background: '#E0E5DB' }}>
              <SalonMap salons={filteredSalons} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
