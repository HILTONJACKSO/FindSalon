'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiHeart, FiStar, FiGrid, FiMap, FiChevronRight, FiNavigation, FiSliders } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import { api, getImageUrl } from '@/lib/api';
import SalonMap from '@/components/salons/SalonMap';
import { motion, AnimatePresence } from 'framer-motion';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

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
    <div className="bg-white min-vh-100 pb-5">
      {/* ELITE HERO HEADER - FLAGSHIP CREAM DESIGN */}
      <section className="position-relative overflow-hidden pt-5 pb-5 mb-5" style={{ background: '#FDF9F0', minHeight: '320px', display: 'flex', alignItems: 'center' }}>
        <div className="position-absolute w-100 h-100 opacity-20" style={{ backgroundImage: `linear-gradient(#E5D5C5 1px, transparent 1px), linear-gradient(90deg, #E5D5C5 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }}></div>
        
        <div className="container position-relative px-4 px-lg-5" style={{ zIndex: 1 }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4">
            <FadeIn>
              <div className="d-inline-flex align-items-center gap-2 mb-2 bg-rust text-white px-3 py-1 rounded-pill shadow-sm">
                <FiMapPin size={12} />
                <span className="text-uppercase fw-bold small letter-spaced" style={{ fontSize: '0.6rem' }}>Premium Collection</span>
              </div>
              <h1 className="display-3 fw-bold mb-1" style={{ color: '#5D2E17', letterSpacing: '-1.5px' }}>
                Elite <span className="font-serif-italic" style={{ color: '#B45309' }}>Salons</span>
              </h1>
              <p className="text-muted mb-0 lead opacity-75">{filteredSalons.length} curated spaces for your unique style</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white rounded-pill shadow-xl d-inline-flex p-1 border border-light">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`btn btn-sm rounded-pill fw-bold border-0 px-4 py-2 d-flex align-items-center transition-all ${viewMode === 'list' ? 'bg-dark text-white shadow-lg' : 'text-muted'}`}
                >
                  <FiGrid className="me-2"/> LIST VIEW
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`btn btn-sm rounded-pill fw-bold border-0 px-4 py-2 d-flex align-items-center transition-all ${viewMode === 'map' ? 'bg-dark text-white shadow-lg' : 'text-muted'}`}
                >
                  <FiMap className="me-2"/> MAP VIEW
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="container-fluid px-4 px-lg-5">
        <div className="row g-5">
          {/* PREMIUM MINIMALIST SIDEBAR */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <FiSliders className="text-rust" />
                <h5 className="fw-bold mb-0 font-serif-italic">Refine Search</h5>
              </div>

              <div className="mb-4">
                <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Location & Name</label>
                <div className="glass-input-wrapper position-relative">
                   <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50" size={18} />
                   <input 
                      type="text" 
                      placeholder="Search salons..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-control rounded-pill ps-5 py-3 border-light shadow-sm fw-medium"
                      style={{ fontSize: '0.9rem' }}
                   />
                </div>
              </div>

              <div className="mb-4 pt-4 border-top border-light">
                <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Price Range</label>
                <div className="d-flex align-items-center gap-2">
                   <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="form-control rounded-pill border-light shadow-sm text-center py-2 fw-bold"
                      style={{ fontSize: '0.8rem' }}
                   />
                   <span className="text-muted opacity-30">—</span>
                   <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="form-control rounded-pill border-light shadow-sm text-center py-2 fw-bold"
                      style={{ fontSize: '0.8rem' }}
                   />
                </div>
              </div>

              <div className="mb-4 pt-4 border-top border-light">
                <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Minimum Excellence</label>
                <div className="d-flex flex-column gap-3">
                  {[4.5, 4.0, 0].map((rating) => (
                    <label key={rating} className="d-flex align-items-center cursor-pointer group">
                      <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                        <input 
                          type="radio" 
                          name="rating" 
                          className="form-check-input mt-0 border-rust shadow-none" 
                          onChange={() => setMinRating(rating)}
                          checked={minRating === rating} 
                        />
                      </div>
                      <span className={`ms-3 small fw-bold ${minRating === rating ? 'text-rust' : 'text-muted opacity-75'}`}>
                        {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                      </span>
                      {rating > 0 && <FiStar className={`ms-2 ${minRating === rating ? 'text-warning fill-warning' : 'text-muted opacity-30'}`} size={12} />}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4 pt-4 border-top border-light">
                <label className="fw-bold small text-muted mb-3 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Bespoke Services</label>
                <div className="d-flex flex-wrap gap-2">
                  {['Haircut', 'Coloring', 'Manicure', 'Facial', 'Massage', 'Braids'].map((service) => (
                    <button 
                      key={service} 
                      onClick={() => {
                        setSelectedServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
                      }}
                      className={`btn btn-sm rounded-pill px-3 py-2 fw-bold transition-all ${
                        selectedServices.includes(service) ? 'bg-rust text-white shadow-lg' : 'bg-light text-muted border-0'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {service.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setSearchQuery(''); setMinRating(0); setMinPrice(''); setMaxPrice(''); setSelectedServices([]); }}
                className="btn btn-link text-muted text-decoration-none w-100 small fw-bold mt-3 opacity-50 hover-opacity-100"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          </aside>

          {/* EDITORIAL LISTINGS */}
          <div className={`${viewMode === 'map' ? 'col-lg-5 d-none d-lg-block' : 'col-lg-9'}`}>
            <div className="row g-4">
              <AnimatePresence mode='popLayout'>
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map(i => (
                    <div className="col-12 col-md-6 col-xl-4" key={i}>
                       <div className="bg-light rounded-5 animate-pulse" style={{ height: '400px' }}></div>
                    </div>
                  ))
                ) : filteredSalons.length > 0 ? (
                  filteredSalons.map((salon, idx) => (
                    <motion.div 
                      key={salon.id} 
                      className={`${viewMode === 'map' ? 'col-12 col-md-12' : 'col-12 col-md-6 col-xl-4'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                      <div className="card border-0 bg-white rounded-5 shadow-sm overflow-hidden h-100 group transition-all hover-translate-up">
                        <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                          <img src={getImageUrl(salon.cover_image)} alt={salon.name} className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium" />
                          
                          <div className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill fw-bold text-dark shadow-sm border border-white border-opacity-50" 
                               style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', fontSize: '0.8rem' }}>
                            from ${salon.min_price}
                          </div>

                          <button className="position-absolute top-0 start-0 m-3 btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0" style={{ width: '36px', height: '36px' }}>
                            <FiHeart className="text-muted" size={16} />
                          </button>

                          <div className="position-absolute bottom-0 start-0 m-3 d-flex align-items-center gap-2">
                             <div className="bg-rust text-white px-3 py-1 rounded-pill fw-bold shadow-lg d-flex align-items-center gap-1" style={{ fontSize: '0.6rem' }}>
                                <FiNavigation size={10} /> {Math.round(Math.random() * 5 + 0.5)} MILES AWAY
                             </div>
                          </div>
                        </div>

                        <div className="p-4 d-flex flex-column h-100">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                             <Link href={`/salons/${salon.id}`} className="text-decoration-none">
                               <h5 className="fw-bold text-dark mb-0 font-serif-italic group-hover-text-rust" style={{ transition: 'color 0.3s' }}>{salon.name}</h5>
                             </Link>
                             <div className="bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                <FiStar className="fill-warning" size={10} /> {salon.rating}
                             </div>
                          </div>
                          
                          <p className="text-muted small mb-4 line-clamp-2" style={{ fontSize: '0.85rem' }}>{salon.description || "Experience luxury editorial styling and bespoke treatments at FindSalon's premier flagship locations."}</p>
                          
                          <div className="mt-auto pt-4 border-top border-light d-flex justify-content-between align-items-center">
                             <div className="d-flex align-items-center text-muted small fw-bold letter-spaced" style={{ fontSize: '0.6rem' }}>
                               <FiMapPin className="text-rust me-1" /> {salon.address.split(',')[0].toUpperCase()}
                             </div>
                             <Link href={`/salons/${salon.id}`} className="btn btn-dark rounded-pill px-4 py-2 small fw-bold shadow-sm transition-all hover-scale">
                               BOOK NOW
                             </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <div className="bg-sand p-5 rounded-5 border border-light d-inline-block">
                       <h4 className="fw-bold text-dark mb-2 font-serif-italic">No spaces found</h4>
                       <p className="text-muted mb-0">Try adjusting your filters or search criteria</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT MAP STICKY */}
          {viewMode === 'map' && (
            <div className="col-lg-4 d-lg-block position-relative">
              <div className="rounded-5 overflow-hidden position-sticky shadow-2xl border border-light" style={{ top: '100px', height: 'calc(100vh - 140px)' }}>
                <SalonMap salons={filteredSalons} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .font-serif-italic { font-family: var(--font-serif); font-style: italic; }
        .letter-spaced { letter-spacing: 2px; }
        .shadow-xl { box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.12); }
        .hover-translate-up:hover { transform: translateY(-10px); box-shadow: 0 25px 50px -15px rgba(0,0,0,0.1) !important; }
        .hover-zoom-premium { transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .group:hover .hover-zoom-premium { transform: scale(1.1); }
        .group-hover-text-rust { color: #B45309 !important; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
