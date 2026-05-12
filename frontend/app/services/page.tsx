'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiTag, FiClock, FiStar, FiChevronRight, FiMapPin, FiNavigation } from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/lib/location';
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

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { location: userLocation } = useLocation();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services/');
                const data = res.data.results || res.data;
                setServices(data);
                setFilteredServices(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch services", err);
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const filtered = services.filter(srv => 
            srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            srv.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            srv.salon_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredServices(filtered);
    }, [searchQuery, services]);

    if (loading) {
        return (
            <div className="bg-sand min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-rust" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-vh-100 pb-5">
            {/* ELITE HERO HEADER - FLAGSHIP CREAM DESIGN */}
            <section className="position-relative overflow-hidden pt-5 pb-5 mb-5" style={{ background: '#FDF9F0', minHeight: '380px', display: 'flex', alignItems: 'center' }}>
                <div className="position-absolute w-100 h-100 opacity-20" style={{ backgroundImage: `linear-gradient(#E5D5C5 1px, transparent 1px), linear-gradient(90deg, #E5D5C5 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }}></div>
                
                <div className="container position-relative px-4" style={{ zIndex: 1 }}>
                    <div className="max-w-700 mx-auto text-center">
                        <FadeIn>
                            <div className="d-inline-flex align-items-center gap-2 mb-3 bg-rust text-white px-3 py-1 rounded-pill shadow-sm">
                                <FiTag size={12} />
                                <span className="text-uppercase fw-bold small letter-spaced" style={{ fontSize: '0.6rem' }}>Treatment Menu</span>
                            </div>
                            <h1 className="display-3 fw-bold mb-4" style={{ color: '#5D2E17', letterSpacing: '-1.5px' }}>
                                Discover Your <span className="font-serif-italic" style={{ color: '#B45309' }}>Perfect Glow</span>
                            </h1>
                            
                            <div className="position-relative mt-5">
                                <div className="glass-card shadow-xl rounded-pill overflow-hidden border border-white border-opacity-50 d-flex align-items-center px-2 py-1" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
                                    <FiSearch className="ms-4 text-muted" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Search treatments, artists, or categories..." 
                                        className="form-control form-control-lg border-0 bg-transparent ps-3 py-3 shadow-none"
                                        style={{ fontSize: '1rem', fontWeight: '500' }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="btn btn-dark rounded-pill px-4 py-2 fw-bold ms-auto d-none d-md-block shadow-sm">SEARCH</button>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            <div className="container px-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark h4 font-serif-italic">Available Treatments</h2>
                        <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                            <span className="badge bg-rust bg-opacity-10 text-rust rounded-pill px-2">{filteredServices.length}</span> results found across Liberia
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                         <button className="btn btn-outline-light text-dark border-secondary border-opacity-10 rounded-pill px-4 small fw-bold shadow-none">FILTER</button>
                         <button className="btn btn-outline-light text-dark border-secondary border-opacity-10 rounded-pill px-4 small fw-bold shadow-none">SORT</button>
                    </div>
                </div>

                <div className="row g-4 mt-2">
                    <AnimatePresence mode='popLayout'>
                        {filteredServices.length > 0 ? (
                            filteredServices.map((srv, idx) => {
                                const distance = userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(srv.latitude), parseFloat(srv.longitude)) : null;
                                
                                return (
                                    <motion.div 
                                        key={srv.id} 
                                        className="col-12 col-md-6 col-xl-3"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    >
                                        <Link href={`/salons/${srv.salon}`} className="text-decoration-none group">
                                            <div className="bg-white rounded-5 shadow-sm border border-light overflow-hidden h-100 transition-all hover-translate-up">
                                                {/* Premium Image Header */}
                                                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                                                    <img 
                                                        src={getImageUrl(srv.image)} 
                                                        className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium" 
                                                        alt={srv.name} 
                                                    />
                                                    
                                                    {/* Glass Price Tag */}
                                                    <div className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill fw-bold text-dark shadow-sm border border-white border-opacity-50" 
                                                         style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', fontSize: '0.85rem' }}>
                                                        ${srv.price}
                                                    </div>

                                                    {/* Distance Badge */}
                                                    {distance !== null && (
                                                        <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill fw-bold text-white shadow-lg d-flex align-items-center gap-1" 
                                                             style={{ background: '#FF4500', fontSize: '0.65rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                            <FiNavigation size={10} /> {formatDistance(distance)} AWAY
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h6 className="fw-bold mb-1 text-dark group-hover-text-rust" style={{ letterSpacing: '-0.3px', transition: 'color 0.3s ease' }}>{srv.name}</h6>
                                                            <p className="text-rust small fw-bold mb-0 d-flex align-items-center gap-1 opacity-75" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                                                                <FiMapPin size={10} /> {srv.salon_name?.toUpperCase()}
                                                            </p>
                                                        </div>
                                                        <div className="bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                            <FiStar className="fill-warning" size={10} /> {srv.salon_rating || '5.0'}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light mt-2">
                                                        <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '0.7rem' }}>
                                                            <div className="d-flex align-items-center gap-1 fw-bold">
                                                                <FiClock size={12} className="text-rust" /> {srv.duration} MIN
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1 fw-bold">
                                                                <FiTag size={12} className="text-rust" /> {srv.category_name}
                                                            </div>
                                                        </div>
                                                        <FiChevronRight className="text-rust opacity-0 group-hover-opacity-100 transition-all translate-x-n2 group-hover-translate-x-0" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div 
                                className="col-12 text-center py-5 mt-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="bg-sand rounded-5 p-5 shadow-sm d-inline-block border border-light">
                                    <h4 className="fw-bold text-dark mb-2 font-serif-italic">No treatments found</h4>
                                    <p className="text-muted mb-0">Try adjusting your search query or filters</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .font-serif-italic { font-family: var(--font-serif); font-style: italic; }
                .letter-spaced { letter-spacing: 2px; }
                .max-w-700 { max-width: 700px; }
                .glass-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .glass-card:focus-within { background: #fff !important; transform: scale(1.02); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1) !important; }
                .hover-translate-up:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1) !important; }
                .hover-zoom-premium { transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
                .group:hover .hover-zoom-premium { transform: scale(1.1); }
                .group-hover-text-rust { color: #5D2E17; }
                .shadow-xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); }
            `}</style>
        </div>
    );
}
