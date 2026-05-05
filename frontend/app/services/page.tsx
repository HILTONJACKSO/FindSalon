'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiTag, FiClock, FiStar, FiChevronRight, FiMapPin } from 'react-icons/fi';
import { api } from '@/lib/api';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/lib/location';

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
        <div className="bg-sand min-vh-100 pb-5">
            {/* HERO / SEARCH HEADER */}
            <div className="bg-white border-bottom py-5 mb-5 shadow-sm">
                <div className="container px-4">
                    <div className="max-w-700 mx-auto text-center">
                        <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">Treatment Menu</p>
                        <h1 className="fw-bold mb-4 font-serif-italic" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>
                            Discover Your Perfect Glow
                        </h1>
                        <div className="position-relative shadow-sm rounded-pill overflow-hidden border" style={{ borderColor: '#EBE5DB' }}>
                            <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-4 text-muted" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search for treatments, categories or salons..." 
                                className="form-control form-control-lg border-0 ps-5 py-4 rounded-0"
                                style={{ fontSize: '1.1rem', outline: 'none', boxShadow: 'none' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h3 className="fw-bold mb-1 text-dark">Available Treatments</h3>
                        <p className="text-muted small mb-0">{filteredServices.length} options found across Monrovia</p>
                    </div>
                </div>

                <div className="row g-4 mt-2">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((srv) => (
                            <div key={srv.id} className="col-12 col-md-6 col-xl-3">
                                <Link href={`/salons/${srv.salon}`} className="text-decoration-none">
                                    <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden h-100 transition-all hover-scale">
                                        <div className="position-relative" style={{ height: '220px' }}>
                                            <img 
                                                src={srv.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'} 
                                                className="w-100 h-100 object-fit-cover" 
                                                alt={srv.name} 
                                            />
                                            <div className="position-absolute top-0 end-0 m-3 bg-white bg-opacity-75 backdrop-blur rounded-pill px-3 py-1 fw-bold text-dark shadow-sm" style={{ fontSize: '0.75rem' }}>
                                                ${srv.price}
                                            </div>
                                            {userLocation && srv.latitude && srv.longitude && (
                                                <div className="position-absolute bottom-0 start-0 m-3 bg-rust text-white rounded-pill px-3 py-1 fw-bold shadow-sm" style={{ fontSize: '0.65rem' }}>
                                                    {formatDistance(calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(srv.latitude), parseFloat(srv.longitude)))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{srv.name}</h6>
                                                <div className="text-warning small d-flex align-items-center">
                                                    <FiStar className="fill-warning me-1" size={12} /> {srv.salon_rating || '5.0'}
                                                </div>
                                            </div>
                                            <p className="text-rust small fw-bold mb-3 d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                                                <FiMapPin size={10} /> {srv.salon_name?.toUpperCase()}
                                            </p>
                                            <div className="d-flex align-items-center gap-3 text-muted small fw-medium pt-3 border-top border-opacity-10">
                                                <div className="d-flex align-items-center gap-1">
                                                    <FiClock size={14} className="opacity-50" /> {srv.duration} MIN
                                                </div>
                                                <div className="d-flex align-items-center gap-1">
                                                    <FiTag className="opacity-50" /> {srv.category_name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 mt-5">
                            <div className="bg-white rounded-5 p-5 shadow-sm d-inline-block">
                                <h4 className="fw-bold text-dark mb-2">No treatments found</h4>
                                <p className="text-muted mb-0">Try adjusting your search criteria</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .hover-scale:hover { transform: translateY(-5px); }
                .transition-all { transition: all 0.3s ease; }
                .letter-spaced { letter-spacing: 2px; }
                .max-w-700 { max-width: 700px; }
            `}</style>
        </div>
    );
}
