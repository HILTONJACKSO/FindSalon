'use client';

import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiHeart, FiShare2, FiShoppingBag, FiArrowRight, FiX, FiNavigation, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api, getImageUrl } from '@/lib/api';

const FALLBACK_LOOKS = [
  { id: 1, title: 'Knotless Braids', price: 120, salon_name: 'Aura Luxe', category: 'Braids', image: null },
  { id: 2, title: 'Signature Waving', price: 45, salon_name: 'Amin Salon', category: 'Styling', image: null },
  { id: 3, title: 'Luxury Glam', price: 65, salon_name: 'Grace Salon', category: 'Makeup', image: null },
  { id: 4, title: 'Modern Fade', price: 20, salon_name: 'Jack Salon', category: 'Barbering', image: null }
];

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
        setLooks(portfolioData.length > 0 ? portfolioData : FALLBACK_LOOKS);
      } catch (err) {
        console.error("Failed to fetch lookbook", err);
        setLooks(FALLBACK_LOOKS);
      } finally {
        setLoading(false);
      }
    };
    fetchLooks();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ELITE HERO SECTION - FLAGSHIP CREAM DESIGN */}
      <section className="position-relative overflow-hidden pt-5 pb-5" style={{ background: '#FDF9F0', minHeight: '420px', display: 'flex', alignItems: 'center' }}>
        {/* Subtle Grid Pattern Overlay */}
        <div className="position-absolute w-100 h-100 opacity-20" style={{ backgroundImage: `linear-gradient(#E5D5C5 1px, transparent 1px), linear-gradient(90deg, #E5D5C5 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }}></div>
        
        {/* Background Decorative Blob */}
        <div className="position-absolute rounded-circle blur-3xl opacity-30 d-none d-md-block" style={{ width: '600px', height: '600px', background: '#F4E7D3', top: '-10%', right: '-10%', filter: 'blur(120px)', zIndex: 0 }}></div>

        <div className="container position-relative py-5" style={{ zIndex: 1 }}>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="d-inline-flex align-items-center gap-2 mb-3 bg-rust text-white px-3 py-1 rounded-pill shadow-sm">
                <FiNavigation size={12} />
                <span className="text-uppercase fw-bold small letter-spaced" style={{ fontSize: '0.6rem' }}>Inspiration Hub</span>
              </div>
              <h1 className="display-3 fw-bold mb-3" style={{ color: '#5D2E17', letterSpacing: '-1.5px' }}>
                The Style <span className="font-serif-italic" style={{ color: '#B45309' }}>Lookbook</span>
              </h1>
              <p className="lead mt-4 mb-0 opacity-75 mx-auto" style={{ maxWidth: '600px', color: '#7C4B30' }}>
                Discover your next favorite look. Book the exact style you want from the artists who created them.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container py-5 mt-n4 position-relative" style={{ zIndex: 5 }}>
        {/* BACK BUTTON - MINIMALIST */}
        <button 
          onClick={() => router.back()}
          className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0 mb-5 fw-bold transition-all hover-translate-x-n2"
          style={{ fontSize: '0.75rem', letterSpacing: '1px' }}
        >
          <FiChevronLeft /> BACK TO EXPLORE
        </button>

        {/* EDITORIAL MASONRY GRID */}
        <div className="lookbook-grid mb-5">
          <AnimatePresence>
            {looks.map((look, idx) => (
              <motion.div 
                key={look.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="lookbook-item group"
                onClick={() => setSelectedLook(look)}
              >
                <div className="position-relative overflow-hidden rounded-5 cursor-pointer shadow-sm border border-light">
                  <img 
                    src={getImageUrl(look.image || look.img)} 
                    className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium" 
                    style={{ display: 'block', minHeight: idx % 3 === 0 ? '450px' : '350px' }} 
                    alt={look.title} 
                  />
                  
                  {/* Premium Glass Overlay */}
                  <div className="lookbook-overlay p-4 d-flex flex-column justify-content-end">
                    <div className="translate-y-4 group-hover-translate-y-0 transition-all duration-500">
                      <span className="badge bg-white text-rust rounded-pill mb-3 align-self-start fw-bold" style={{ fontSize: '0.65rem', padding: '0.5rem 1rem' }}>
                        {(look.category || 'STYLE').toUpperCase()}
                      </span>
                      <h4 className="text-white fw-bold mb-1 font-serif-italic">{look.title}</h4>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <p className="text-white text-opacity-80 small mb-0 fw-medium">
                          by <span className="text-white">{look.salon_name || look.salon}</span>
                        </p>
                        <span className="text-white fw-bold">${look.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* LUXURY MAGAZINE MODAL */}
      <AnimatePresence>
        {selectedLook && (
          <div className="lookbook-modal-backdrop" onClick={() => setSelectedLook(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="lookbook-modal bg-white rounded-5 shadow-2xl p-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="row g-0">
                <div className="col-lg-6 position-relative">
                  <img src={getImageUrl(selectedLook.image || selectedLook.img)} className="w-100 h-100 object-fit-cover" style={{ minHeight: '600px' }} alt={selectedLook.title} />
                  <button 
                    onClick={() => setSelectedLook(null)}
                    className="btn btn-white rounded-circle position-absolute top-0 end-0 m-4 shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: '44px', height: '44px', zIndex: 10 }}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                       <span className="bg-rust text-white px-3 py-1 rounded-pill fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                          {selectedLook.category?.toUpperCase() || 'STYLE'}
                       </span>
                       <div className="bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                          <FiStar className="fill-warning" size={10} /> 5.0
                       </div>
                    </div>
                    <h2 className="display-5 fw-bold mb-2 font-serif-italic" style={{ color: '#5D2E17' }}>{selectedLook.title}</h2>
                    <p className="lead text-muted" style={{ fontSize: '1.1rem' }}>
                      Exclusively crafted by <span className="text-dark fw-bold border-bottom border-rust border-opacity-50">{selectedLook.salon_name || selectedLook.salon}</span>
                    </p>
                  </div>

                  <div className="glass-pill-container d-flex flex-wrap gap-3 mb-5 mt-2">
                    <div className="bg-light px-4 py-2 rounded-pill d-flex align-items-center gap-2">
                      <FiClock className="text-rust" />
                      <span className="small fw-bold">90-120 MIN</span>
                    </div>
                    <div className="bg-light px-4 py-2 rounded-pill d-flex align-items-center gap-2">
                      <FiHeart className="text-danger" />
                      <span className="small fw-bold">FAVORITE</span>
                    </div>
                  </div>

                  <div className="bg-sand p-4 rounded-5 mb-5 border border-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Starting Price</p>
                        <h2 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-1px' }}>${selectedLook.price}.00</h2>
                      </div>
                      <div className="text-end">
                        <div className="d-inline-flex align-items-center gap-2 bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                          <div className="bg-success rounded-circle animate-pulse" style={{ width: '8px', height: '8px' }}></div>
                          <span className="fw-bold small">Available Today</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <button 
                      onClick={() => router.push(`/salons/${selectedLook.salonId || selectedLook.salon}`)}
                      className="btn btn-rust rounded-pill py-3 fw-bold w-100 shadow-lg transition-all hover-translate-up d-flex align-items-center justify-content-center gap-2"
                      style={{ fontSize: '1.1rem' }}
                    >
                      <FiShoppingBag /> BOOK THIS STYLE NOW <FiArrowRight />
                    </button>
                    
                    <button 
                      onClick={() => setSelectedLook(null)}
                      className="btn btn-link text-muted w-100 small text-decoration-none fw-bold hover-text-rust"
                      style={{ letterSpacing: '1px' }}
                    >
                      CONTINUE EXPLORING
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .font-serif-italic { font-family: var(--font-serif); font-style: italic; }
        .letter-spaced { letter-spacing: 2px; }
        
        .lookbook-grid {
          columns: 1;
          column-gap: 24px;
        }
        @media (min-width: 768px) { .lookbook-grid { columns: 2; } }
        @media (min-width: 1200px) { .lookbook-grid { columns: 3; } }
        
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
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(10px);
        }
        
        .lookbook-item:hover .lookbook-overlay {
          opacity: 1;
          transform: translateY(0);
        }
        
        .lookbook-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 25, 21, 0.9);
          backdrop-filter: blur(15px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .lookbook-modal {
          max-width: 1100px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .hover-zoom-premium { transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .group:hover .hover-zoom-premium { transform: scale(1.15); }
        
        .mt-n4 { margin-top: -2.5rem !important; }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
