'use client';

import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiHeart, FiShare2, FiShoppingBag, FiArrowRight, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api, getImageUrl } from '@/lib/api';

const LOOKS = [
  { id: 1, title: 'Clean Fade with Design', price: 15, salon: 'Jack Salon', salonId: 1, category: 'Barbering', img: 'https://images.unsplash.com/photo-1552068751-34cb5cf055b3?auto=format&fit=crop&q=80' },
  { id: 2, title: 'Ombre Goddess Braids', price: 85, salon: 'Aura Luxe', salonId: 2, category: 'Braids', img: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80' },
  { id: 3, title: 'Glow Up Glam', price: 45, salon: 'Grace Salon', salonId: 3, category: 'Makeup', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80' },
  { id: 4, title: 'Knotless Box Braids', price: 120, salon: 'Amin Salon', salonId: 4, category: 'Braids', img: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80' },
  { id: 5, title: 'Classic Manicure', price: 25, salon: 'Sky Salon', salonId: 5, category: 'Nails', img: 'https://images.unsplash.com/photo-1604654894610-df490c81726a?auto=format&fit=crop&q=80' },
  { id: 6, title: 'Modern Buzz Cut', price: 10, salon: 'Jack Salon', salonId: 1, category: 'Barbering', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80' },
  { id: 7, title: 'Bridal High Bun', price: 60, salon: 'Elite Beauty', salonId: 6, category: 'Hair', img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80' },
  { id: 8, title: 'Rose Gold Acrylics', price: 40, salon: 'Sky Salon', salonId: 5, category: 'Nails', img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80' }
];

export default function LookbookPage() {
  const [looks, setLooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLook, setSelectedLook] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        const res = await api.get('/salons/portfolio/');
        const portfolioData = res.data.results || res.data || [];
        // If we have real data, use it. Otherwise fallback to curated LOOKS for demo quality.
        if (portfolioData.length > 0) {
          setLooks(portfolioData);
        } else {
          setLooks(LOOKS);
        }
      } catch (err) {
        console.error("Failed to fetch lookbook", err);
        setLooks(LOOKS);
      } finally {
        setLoading(false);
      }
    };
    fetchLooks();
  }, []);

  return (
    <div className="min-h-screen bg-sand pt-5 pb-5 mt-4">
      <div className="container mt-5">
        <button 
          onClick={() => router.push('/')}
          className="btn btn-link text-rust text-decoration-none d-flex align-items-center p-0 mb-4 fw-bold"
        >
          <FiChevronLeft className="me-1" /> BACK TO HOME
        </button>

        <div className="text-center mb-5">
          <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">Inspiration Hub</p>
          <h1 className="fw-bold display-4 font-serif-italic">The Style Lookbook</h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: '600px' }}>
            Discover your next favorite look. Click any image to instantly book the artist behind the style.
          </p>
        </div>

        {/* MASONRY GRID */}
        <div className="lookbook-grid mb-5">
          {looks.map((look) => (
            <motion.div 
              key={look.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lookbook-item group"
              onClick={() => setSelectedLook(look)}
            >
              <div className="position-relative overflow-hidden rounded-4 cursor-pointer shadow-sm">
                <img 
                  src={look.image || look.img} 
                  className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium" 
                  style={{ display: 'block' }} 
                  alt={look.title} 
                />
                <div className="lookbook-overlay">
                  <div className="p-4 h-100 d-flex flex-column justify-content-end">
                    <span className="badge bg-white text-rust rounded-pill mb-2 align-self-start fw-bold" style={{ fontSize: '0.65rem' }}>
                      {(look.category || 'STYLE').toUpperCase()}
                    </span>
                    <h5 className="text-white fw-bold mb-1">{look.title}</h5>
                    <p className="text-white text-opacity-80 small mb-0">
                      by {look.salon_name || look.salon} · <span className="fw-bold">${look.price}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* QUICK BOOK MODAL */}
      <AnimatePresence>
        {selectedLook && (
          <div className="lookbook-modal-backdrop" onClick={() => setSelectedLook(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="lookbook-modal bg-white rounded-5 shadow-2xl p-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="row g-0">
                <div className="col-md-6 position-relative">
                  <img src={selectedLook.image || selectedLook.img} className="w-100 h-100 object-fit-cover" style={{ minHeight: '500px' }} alt={selectedLook.title} />
                  <button 
                    onClick={() => setSelectedLook(null)}
                    className="btn btn-white rounded-circle position-absolute top-0 start-0 m-3 d-md-none"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <FiX />
                  </button>
                </div>
                <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <span className="text-rust fw-bold text-uppercase small letter-spaced">{selectedLook.category || 'STYLE'}</span>
                      <h2 className="fw-bold mb-1 mt-1">{selectedLook.title}</h2>
                      <p className="text-muted">Masterfully crafted by <span className="text-dark fw-bold">{selectedLook.salon_name || selectedLook.salon}</span></p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-light border rounded-circle p-2 text-dark transition-all hover-bg-light"><FiHeart /></button>
                      <button className="btn btn-outline-light border rounded-circle p-2 text-dark transition-all hover-bg-light"><FiShare2 /></button>
                    </div>
                  </div>

                  <div className="bg-sand p-4 rounded-4 mb-5 border border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted small mb-0">Starting at</p>
                        <h3 className="fw-bold mb-0 text-dark">${selectedLook.price}</h3>
                      </div>
                      <div className="text-end">
                        <p className="text-muted small mb-0">Availability</p>
                        <p className="text-success fw-bold mb-0 small d-flex align-items-center gap-1">
                          <span className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></span> Available Today
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => router.push(`/salons/${selectedLook.salonId || selectedLook.salon}`)}
                    className="btn btn-rust rounded-pill py-3 fw-bold w-100 shadow-lg transition-all hover-scale d-flex align-items-center justify-content-center gap-2 mb-3"
                  >
                    <FiShoppingBag /> Book this look now <FiArrowRight />
                  </button>
                  
                  <button 
                    onClick={() => setSelectedLook(null)}
                    className="btn btn-link text-muted w-100 small text-decoration-none hover-text-dark"
                  >
                    Keep exploring
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .lookbook-grid {
          columns: 1;
          column-gap: 24px;
        }
        @media (min-width: 768px) { .lookbook-grid { columns: 2; } }
        @media (min-width: 1200px) { .lookbook-grid { columns: 4; } }
        
        .lookbook-item {
          break-inside: avoid;
          margin-bottom: 24px;
        }
        
        .lookbook-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(30, 25, 21, 0.9) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .lookbook-item:hover .lookbook-overlay {
          opacity: 1;
        }
        
        .lookbook-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 25, 21, 0.85);
          backdrop-filter: blur(12px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .lookbook-modal {
          max-width: 1000px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .hover-zoom-premium { transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .group:hover .hover-zoom-premium { transform: scale(1.08); }
        
        .letter-spaced { letter-spacing: 2px; }
      `}</style>
    </div>
  );
}
