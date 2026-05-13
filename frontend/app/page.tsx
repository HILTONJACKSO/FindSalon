'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiSearch, FiStar, FiChevronRight, FiScissors, FiSmile, FiBook, FiCheckCircle, FiTag, FiClock, FiLock, FiArrowRight, FiDownload, FiZap, FiTrendingUp, FiSmartphone, FiTarget, FiShield, FiUsers, FiNavigation } from 'react-icons/fi';
import { MdOutlineFaceRetouchingNatural, MdSpa, MdOutlineRemoveRedEye } from 'react-icons/md';
import { api, getImageUrl } from '@/lib/api';
import { motion } from 'framer-motion';

import { useLocation } from '@/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/lib/location';
import InstallPwa from '@/components/pwa/InstallPwa';

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
    {children}
  </motion.div>
);

const SectionCarousel = ({ children, title, subtitle, badgeIcon, badgeText, viewAllLink, viewAllText = "VIEW ALL" }: any) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-py container mt-5 pt-lg-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 mb-md-5 gap-3 gap-md-4">
        <div>
          {badgeText && (
            <div className="d-inline-flex align-items-center gap-2 mb-3 bg-rust text-white px-3 py-1 rounded-pill shadow-sm">
              {badgeIcon}
              <span className="text-uppercase fw-bold small letter-spaced" style={{ fontSize: '0.65rem' }}>{badgeText}</span>
            </div>
          )}
          <h2 className="fw-bold mb-2" style={{ letterSpacing: '-1px' }}>{title}</h2>
          {subtitle && <p className="text-muted mb-0 lead opacity-75" style={{ maxWidth: '600px', fontSize: '1rem' }}>{subtitle}</p>}
        </div>
        <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3 w-100 w-md-auto">
          <div className="d-flex gap-2">
            <button onClick={() => scroll('left')} className="btn btn-outline-rust rounded-circle p-0 d-flex align-items-center justify-content-center transition-all hover-scale" style={{ width: '44px', height: '44px' }}>
              <FiChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button onClick={() => scroll('right')} className="btn btn-rust rounded-circle p-0 d-flex align-items-center justify-content-center transition-all hover-scale shadow-sm" style={{ width: '44px', height: '44px' }}>
              <FiChevronRight size={20} />
            </button>
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className="btn btn-dark rounded-pill px-4 py-2 fw-bold small letter-spaced d-flex align-items-center gap-2 transition-all hover-scale shadow-sm">
               {viewAllText} <FiArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
      
      <div className="position-relative">
        <div 
          ref={scrollRef}
          className="d-flex gap-3 gap-md-4 overflow-auto scrollbar-none pb-4 px-2"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [curatedSalons, setCuratedSalons] = useState<any[]>([]);
  const [nearbySalons, setNearbySalons] = useState<any[]>([]);
  const [independentPros, setIndependentPros] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [tickerServices, setTickerServices] = useState<any[]>([]);
  const [lookbookItems, setLookbookItems] = useState<any[]>([]);
  const { location: userLocation } = useLocation();

  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonsRes, servicesRes, allSalonsRes, tickerRes, portfolioRes] = await Promise.all([
          api.get('/salons/curated/').catch(() => ({ data: [] })),
          api.get('/services/').catch(() => ({ data: { results: [] } })),
          api.get('/salons/').catch(() => ({ data: { results: [] } })),
          api.get('/services/ticker/').catch(() => ({ data: [] })),
          api.get('/salons/portfolio/').catch(() => ({ data: [] }))
        ]);

        const salonsData = salonsRes.data || [];
        const servicesData = servicesRes.data.results || servicesRes.data || [];
        const allSalonsData = allSalonsRes.data.results || allSalonsRes.data || [];
        const tickerData = tickerRes.data || [];
        const portfolioData = portfolioRes.data.results || portfolioRes.data || [];

        setCuratedSalons(salonsData);
        setFeaturedServices(servicesData);
        setTickerServices(tickerData);
        setLookbookItems(portfolioData);

        // Filter Independent Pros
        const independent = allSalonsData.filter((s: any) => s.salon_type === 'INDEPENDENT');
        setIndependentPros(independent);

        if (userLocation && allSalonsData.length > 0) {
          const sorted = [...allSalonsData].sort((a, b) => {
            const distA = calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(a.latitude), parseFloat(a.longitude));
            const distB = calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(b.latitude), parseFloat(b.longitude));
            return distA - distB;
          });
          setNearbySalons(sorted);
        } else {
          setNearbySalons(allSalonsData);
        }
      } catch (err) {
        console.error("Failed to fetch homepage data", err);
      }
    };
    fetchData();
  }, [userLocation]);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FindSalon',
    alternateName: ['FindSalone', 'Find Salon Liberia'],
    url: 'https://findsalon.com',
    description: 'Liberia’s premier beauty marketplace for booking salons and spas.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://findsalon.com/salons?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Custom SVG Blob Mask Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="blobClip" clipPathUnits="objectBoundingBox">
            <path transform="translate(0.5, 0.5) scale(0.006) translate(-135.7, -122.15)" d="M 120.4, 53.6 C 143.2, 45.1 176.8, 62.1 190.7, 83.2 C 204.6, 104.3 211.8, 131.6 200.7, 153.6 C 189.6, 175.6 160.8, 192.1 133.6, 190.7 C 106.4, 189.3 80.8, 169.6 70.7, 153.6 C 60.6, 137.6 60.6, 104.3 70.7, 83.2 C 80.8, 62.1 106.4, 50.3 120.4, 53.6 Z" />
          </clipPath>
        </defs>
      </svg>
      {/* ELITE HERO SECTION - FLAGSHIP CREAM DESIGN */}
      <section className="position-relative overflow-hidden pt-5 pt-lg-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: '#FDF9F0' }}>
        {/* Subtle Grid Pattern Overlay */}
        <div className="position-absolute w-100 h-100 opacity-20" style={{ backgroundImage: `linear-gradient(#E5D5C5 1px, transparent 1px), linear-gradient(90deg, #E5D5C5 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }}></div>
        
        {/* Background Decorative Blob */}
        <div className="position-absolute rounded-circle blur-3xl opacity-30 d-none d-md-block" style={{ width: '800px', height: '800px', background: '#F4E7D3', top: '-10%', right: '-10%', filter: 'blur(150px)', zIndex: 0 }}></div>

        <div className="container position-relative pb-5 mt-4 mt-lg-5" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            {/* Left Content */}
            <div className="col-lg-6 text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="fw-bold mb-0" style={{ fontSize: 'var(--fs-display)', lineHeight: '1.1', letterSpacing: '-2px', color: '#5D2E17' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>Book. Arrive.</span> <br />
                  <span className="font-serif-italic position-relative ms-0 ms-lg-0 d-inline-block" style={{ fontSize: '1.1em', fontStyle: 'italic', color: '#B45309' }}>
                    Glow.
                    <motion.span 
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="position-absolute ms-1 d-none d-md-block" 
                      style={{ width: '5px', height: '80%', background: '#B45309', top: '15%', right: '-20px' }}
                    ></motion.span>
                  </span>
                </h1>
                <p className="mt-4 mb-5 mx-auto mx-lg-0 lead opacity-75" style={{ lineHeight: '1.6', maxWidth: '480px' }}>
                  Experience the world's most premium salon curated network. Every touchpoint designed for your sophisticated lifestyle.
                </p>

                {/* Flagship CTA - Replaces Search Inputs */}
                <Link href="/salons" className="text-decoration-none">
                  <div className="search-pill-luxury d-flex align-items-center shadow-sm bg-white p-2 rounded-pill border border-light transition-all hover-card-premium cursor-pointer mx-auto mx-lg-0" style={{ maxWidth: '400px' }}>
                    <div className="flex-grow-1 px-4 py-2 text-start">
                      <span className="d-block text-uppercase mb-0 opacity-50 fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px', color: '#5D2E17' }}>Explore Now</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Browse All Salons</span>
                    </div>
                    <div className="btn rounded-circle d-flex align-items-center justify-content-center transition-all hover-scale shadow-sm ms-2" style={{ width: '48px', height: '48px', background: '#F4E7D3', color: '#B45309', flexShrink: 0 }}>
                      <FiSearch size={20} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Right Visuals - Elite Organic Composition */}
            <div className="col-lg-6 position-relative mt-4 mt-lg-0 d-flex justify-content-center align-items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="position-relative w-100 d-flex justify-content-center"
              >
                {/* Traditional Rounded Image Layout */}
                <div className="position-relative mx-auto" style={{ width: '100%', maxWidth: '650px' }}>
                  <div className="position-absolute w-100 h-100 opacity-20 d-none d-md-block" style={{ backgroundImage: `radial-gradient(#B45309 0.5px, transparent 0.5px)`, backgroundSize: '15px 15px', zIndex: 0, top: '20px', left: '20px', borderRadius: '30px' }}></div>
                  <img 
                    src="/hero.jpg" 
                    alt="Luxury Experience" 
                    className="img-fluid rounded-5 shadow-2xl position-relative mx-auto"
                    style={{ zIndex: 1, width: '100%', objectFit: 'cover', minHeight: '450px' }}
                  />
                  
                  {/* Floating Glass Card: Verified */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="glass-card position-absolute shadow-xl d-none d-sm-block" 
                    style={{ top: '15%', left: '-5%', minWidth: '180px', zIndex: 20, background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(180, 83, 9, 0.2)', padding: '15px' }}
                  >
                    <div className="d-flex flex-column align-items-center text-center">
                      <div className="d-flex gap-1 mb-2">
                        {[1,2,3,4,5].map(s => <FiStar key={s} size={12} fill="#B45309" color="#B45309" />)}
                      </div>
                      <span className="tiny fw-bold" style={{ color: '#5D2E17', fontSize: '0.7rem' }}>Top Rated Stylists</span>
                      <span className="tiny opacity-70" style={{ color: '#5D2E17', fontSize: '0.6rem' }}>Monrovia</span>
                    </div>
                  </motion.div>

                  {/* Floating Glass Card: Booking */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="glass-card position-absolute shadow-xl" 
                    style={{ bottom: '10%', right: '-5%', minWidth: '200px', zIndex: 20, background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(180, 83, 9, 0.2)', padding: '12px 20px' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                        <FiCheckCircle className="text-success" size={16} />
                      </div>
                      <div className="d-flex flex-column text-start">
                        <span className="tiny fw-bold" style={{ color: '#5D2E17', fontSize: '0.75rem' }}>Appointment Confirmed</span>
                        <span className="tiny opacity-70" style={{ color: '#5D2E17', fontSize: '0.65rem' }}>Next slot available now</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

      </section>

      {/* LUXURY TICKER / MARQUEE SECTION - HIGH ENERGY ORANGE-RED */}
      {tickerServices.length > 0 && (
        <div className="py-3 overflow-hidden position-relative" style={{ backgroundColor: '#FF4500', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <motion.div 
            className="d-flex align-items-center gap-5"
            animate={{ x: [0, -2000] }}
            transition={{ 
              duration: 45, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ width: 'max-content' }}
          >
            {[...tickerServices, ...tickerServices, ...tickerServices, ...tickerServices].map((srv, idx) => (
              <Link 
                key={`${srv.id}-${idx}`} 
                href={`/salons/${srv.salon}`}
                className="text-decoration-none d-flex align-items-center gap-3 transition-all hover-translate-up"
              >
                {/* Modern Image Thumbnail */}
                <div className="position-relative" style={{ width: '50px', height: '50px' }}>
                  <img 
                    src={getImageUrl(srv.image)} 
                    className="w-100 h-100 object-fit-cover rounded-circle shadow-sm border border-white"
                    style={{ borderWidth: '2.5px', borderStyle: 'solid' }}
                    alt={srv.name}
                  />
                  {srv.discount_price && (
                    <div className="position-absolute bottom-0 end-0 bg-white text-orangered rounded-circle d-flex align-items-center justify-content-center shadow-sm fw-bold" style={{ width: '18px', height: '18px', fontSize: '0.5rem', border: '1px solid #FF4500', color: '#FF4500' }}>
                      %
                    </div>
                  )}
                </div>

                {/* Refined Text Content */}
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-white letter-spaced text-uppercase mb-0" style={{ fontSize: '0.75rem', letterSpacing: '1.2px' }}>
                      {srv.name}
                    </span>
                    {srv.discount_price ? (
                      <span className="badge bg-white text-orangered rounded-pill px-2" style={{ fontSize: '0.55rem', color: '#FF4500' }}>OFFER</span>
                    ) : (
                      <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-2" style={{ fontSize: '0.55rem' }}>POPULAR</span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-white opacity-70 small fw-medium text-uppercase" style={{ fontSize: '0.65rem' }}>{srv.salon_name}</span>
                    <span className="text-white opacity-30">•</span>
                    {srv.discount_price ? (
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>${srv.discount_price}</span>
                        <del className="text-white opacity-50 tiny" style={{ fontSize: '0.7rem' }}>${srv.price}</del>
                      </div>
                    ) : (
                      <span className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>${srv.price}</span>
                    )}
                  </div>
                </div>

                {/* Divider Line for Modern Look */}
                <div className="ms-4 h-100 opacity-20" style={{ width: '1px', height: '25px', backgroundColor: '#FFF' }}></div>
              </Link>
            ))}
          </motion.div>
          
          {/* Edge Fades for Smooth Appearance */}
          <div className="position-absolute top-0 start-0 h-100" style={{ width: '150px', zIndex: 2, background: 'linear-gradient(to right, #FF4500, transparent)' }}></div>
          <div className="position-absolute top-0 end-0 h-100" style={{ width: '150px', zIndex: 2, background: 'linear-gradient(to left, #FF4500, transparent)' }}></div>
        </div>
      )}

      {/* QUICK BROWSE SECTION - REDESIGNED BENTO CATEGORIES CAROUSEL */}
      <SectionCarousel 
        title="Explore Categories" 
        badgeText="Quick Browse" 
        badgeIcon={<FiTarget size={14} />}
        viewAllLink="/services"
      >
        {featuredServices.length > 0 ? (
          Array.from(new Set(featuredServices.map(s => s.category_name?.toLowerCase()))).map((catName, idx) => {
            const categoryIcon = catName?.includes('hair') ? <FiScissors size={20} /> : 
                                catName?.includes('face') ? <FiSmile size={20} /> : 
                                catName?.includes('spa') ? <MdSpa size={20} /> : 
                                catName?.includes('tattoo') ? <FiZap size={20} /> : <FiTag size={20} />;
            
            return (
              <div className="flex-shrink-0" key={idx} style={{ width: 'clamp(140px, 40vw, 180px)', scrollSnapAlign: 'start' }}>
                <Link href={`/salons?category=${catName}`} className="text-decoration-none">
                  <div className="position-relative overflow-hidden rounded-5 group shadow-sm transition-all hover-translate-up border border-light" style={{ height: '160px', background: '#FDF9F0' }}>
                    <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3 text-center">
                      <div className="text-rust mb-3 transition-all group-hover-scale" style={{ opacity: 0.8 }}>
                        {categoryIcon}
                      </div>
                      <p className="fw-bold text-dark mb-1 small text-uppercase letter-spaced" style={{ fontSize: '0.7rem', letterSpacing: '1.5px' }}>{catName}</p>
                      <div className="position-absolute bottom-0 mb-3 transition-all opacity-0 group-hover-opacity-100 translate-y-2 group-hover-translate-y-0">
                        <span className="tiny fw-bold text-rust" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>EXPLORE</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div className="flex-shrink-0 text-center opacity-50" key={i} style={{ width: '160px' }}>
              <div className="service-icon-circle mx-auto mb-3 bg-light"></div>
              <div className="bg-light h-2 w-75 mx-auto rounded"></div>
            </div>
          ))
        )}
      </SectionCarousel>

      {/* ELITE MOBILE ARTISTS - CAROUSEL */}
      {independentPros.length > 0 && (
        <FadeIn>
          <SectionCarousel 
            title="Elite Mobile Artists" 
            subtitle="The best independent beauty professionals, delivered directly to your doorstep."
            badgeText="On-Demand Beauty" 
            badgeIcon={<FiStar size={14} />}
            viewAllLink="/salons?type=INDEPENDENT"
          >
            {independentPros.map((pro) => (
              <div className="flex-shrink-0" key={pro.id} style={{ width: 'clamp(280px, 80vw, 380px)', scrollSnapAlign: 'start' }}>
                <Link href={`/salons/${pro.id}`} className="text-decoration-none">
                  <div className="position-relative overflow-hidden rounded-5 group shadow-sm transition-all hover-translate-up" style={{ height: '400px' }}>
                    <img 
                      src={getImageUrl(pro.cover_image || pro.images?.[0]?.image)} 
                      className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium"
                      alt={pro.name}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
                      <div className="d-flex justify-content-between align-items-end">
                        <div>
                          <h4 className="text-white fw-bold mb-1">{pro.name}</h4>
                          <p className="text-white text-opacity-70 small mb-0 d-flex align-items-center gap-2">
                             <FiMapPin size={12} className="text-rust" /> {pro.address}
                          </p>
                        </div>
                        <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-pill fw-bold" style={{ fontSize: '0.7rem', backdropFilter: 'blur(10px)' }}>
                           MOBILE ARTIST
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </SectionCarousel>
        </FadeIn>
      )}

      {/* STYLE LOOKBOOK - CAROUSEL */}
      <FadeIn>
        <SectionCarousel 
          title="The Style Lookbook" 
          subtitle="Book the exact style you want, directly from the artisans who created them."
          badgeText="Visual Booking" 
          badgeIcon={<MdOutlineRemoveRedEye size={14} />}
          viewAllLink="/lookbook"
          viewAllText="EXPLORE ALL LOOKS"
        >
          {lookbookItems.map((look) => (
            <div className="flex-shrink-0" key={look.id} style={{ width: 'clamp(280px, 85vw, 380px)', scrollSnapAlign: 'start' }}>
              <div 
                onClick={() => router.push('/lookbook')}
                className="position-relative overflow-hidden rounded-5 cursor-pointer group shadow-sm transition-all hover-translate-up"
                style={{ height: '500px' }}
              >
                <img 
                  src={getImageUrl(look.image || look.img)} 
                  className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium" 
                  alt={look.title} 
                />
                <div className="position-absolute bottom-0 start-0 w-100 h-100 transition-all group-hover-bg-black-20" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}></div>
                <div className="position-absolute bottom-0 start-0 w-100 p-4">
                  <div className="glass-card p-4 rounded-4 border border-white border-opacity-10 shadow-lg transition-all group-hover-translate-up" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)' }}>
                    <h4 className="text-white fw-bold mb-1">{look.title}</h4>
                    <p className="text-white text-opacity-70 small mb-3">by {look.salon_name || look.salon}</p>
                    <div className="btn btn-white btn-sm rounded-pill px-4 fw-bold text-dark opacity-0 group-hover-opacity-100 transition-all" style={{ fontSize: '0.7rem' }}>
                      BOOK THIS STYLE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </SectionCarousel>
      </FadeIn>

      {/* FEATURED TREATMENTS - CAROUSEL */}
      <SectionCarousel 
        title="Featured Treatments" 
        badgeText="Trending now" 
        badgeIcon={<FiZap size={14} />}
        viewAllLink="/services"
        viewAllText="SEE MENU"
      >
        {featuredServices.map((srv) => (
          <div className="flex-shrink-0" key={srv.id} style={{ width: 'clamp(260px, 75vw, 320px)', scrollSnapAlign: 'start' }}>
            <Link href={`/salons/${srv.salon}`} className="text-decoration-none">
              <div className="position-relative bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden h-100 transition-all hover-translate-up hover-shadow-xl group">
                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                  <img 
                    src={getImageUrl(srv.image)} 
                    className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium" 
                    alt={srv.name} 
                  />
                  <div className="position-absolute top-0 end-0 m-3 glass-card px-3 py-2 rounded-pill fw-bold text-dark shadow-sm" style={{ fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    ${srv.price}
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{srv.name}</h5>
                    <div className="d-flex align-items-center gap-1 text-warning fw-bold small">
                      <FiStar size={14} style={{ fill: 'currentColor' }} /> 
                      <span className="text-dark">{srv.salon_rating || '5.0'}</span>
                    </div>
                  </div>
                  <p className="text-rust small fw-bold mb-4 opacity-80" style={{ fontSize: '0.65rem', letterSpacing: '1.2px' }}>
                    {srv.salon_name?.toUpperCase()}
                  </p>
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top border-opacity-10">
                    <div className="d-flex align-items-center gap-2 text-muted tiny fw-bold text-uppercase letter-spaced">
                      <FiClock size={14} className="text-rust" /> {srv.duration} MIN
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted tiny fw-bold text-uppercase letter-spaced">
                      <FiTag size={14} className="text-rust" /> {srv.category_name}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </SectionCarousel>

      {/* SALONS NEAR YOU - CAROUSEL */}
      {nearbySalons.length > 0 && (
        <FadeIn>
          <SectionCarousel 
            title="Salons Near You" 
            badgeText="Proximity search" 
            badgeIcon={<FiMapPin size={14} />}
            viewAllLink="/salons"
            viewAllText="VIEW ON MAP"
          >
            {nearbySalons.map((salon) => {
              const distance = userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(salon.latitude), parseFloat(salon.longitude)) : null;
              const salonImage = getImageUrl(salon.images?.[0]?.image || salon.cover_image);
              
              return (
                <div className="flex-shrink-0" key={salon.id} style={{ width: 'clamp(300px, 90vw, 400px)', scrollSnapAlign: 'start' }}>
                  <Link href={`/salons/${salon.id}`} className="text-decoration-none">
                    <div className="position-relative overflow-hidden rounded-5 group shadow-sm transition-all hover-translate-up" style={{ height: '320px' }}>
                      <img 
                        src={salonImage} 
                        className="w-100 h-100 object-fit-cover transition-all hover-zoom-premium"
                        alt={salon.name}
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
                        <div className="d-flex justify-content-between align-items-end">
                          <div>
                            <h4 className="text-white fw-bold mb-1">{salon.name}</h4>
                            <p className="text-white text-opacity-70 small mb-0 d-flex align-items-center gap-1">
                              <FiMapPin size={12} className="text-rust" /> {salon.address}
                            </p>
                          </div>
                          {distance !== null && (
                            <div className="bg-rust text-white px-3 py-1 rounded-pill fw-bold shadow-sm" style={{ fontSize: '0.7rem', backdropFilter: 'blur(5px)' }}>
                               {formatDistance(distance)} AWAY
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="position-absolute top-0 start-0 m-4">
                         <div className="bg-white bg-opacity-90 backdrop-blur rounded-pill px-2 py-1 shadow-sm d-flex align-items-center">
                            <FiStar className="text-warning me-1" style={{ fill: 'currentColor' }} />
                            <span className="fw-bold small text-dark">{salon.rating || '5.0'}</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </SectionCarousel>
        </FadeIn>
      )}



      {/* HOW IT WORKS - REDESIGNED STEPS */}
      <section id="how-it-works" className="py-5" style={{ background: '#FDF9F0' }}>
        <div className="container py-5">
          <div className="text-center mb-5 pb-3">
            <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">Simple & Seamless</p>
            <h2 className="display-4 fw-bold font-serif-italic text-dark">How FindSalon Works</h2>
          </div>

          <div className="row g-4">
            {[
              { 
                id: '01', 
                icon: <FiSearch size={32} />,
                title: 'Search & Discover', 
                desc: 'Browse top-rated salons and barbers near you. Filter by your specific needs, compare prices, and read verified reviews.' 
              },
              { 
                id: '02', 
                icon: <FiZap size={32} />,
                title: 'Book Instantly', 
                desc: 'Select your service and pick a time slot. Secure your chair immediately by paying a small, safe deposit via MTN MoMo.' 
              },
              { 
                id: '03', 
                icon: <FiSmartphone size={32} />,
                title: 'Show up & Shine', 
                desc: 'Skip the waiting area. Walk right in for your luxury appointment, and simply pay the remaining balance directly to the salon.' 
              }
            ].map((step, idx) => (
              <div className="col-lg-4" key={step.id}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="position-relative p-5 h-100 transition-all hover-translate-up"
                  style={{ 
                    background: '#121212', 
                    borderRadius: '40px',
                    color: 'white',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  {/* Large Background Number */}
                  <div className="position-absolute top-0 end-0 p-4 opacity-5 fw-bold" style={{ fontSize: '8rem', lineHeight: 1, pointerEvents: 'none' }}>
                    {step.id}
                  </div>

                  <div className="position-relative" style={{ zIndex: 1 }}>
                    <div className="bg-rust rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-lg" style={{ width: '64px', height: '64px' }}>
                      <div className="text-white">{step.icon}</div>
                    </div>
                    <h4 className="fw-bold mb-3">{step.title}</h4>
                    <p className="text-white text-opacity-50 mb-0" style={{ lineHeight: '1.7' }}>{step.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OWNER SUITE - REDESIGNED HOOK CARD */}
      <section className="container mb-5 pb-5">
        <div className="bento-card p-5 text-white position-relative overflow-hidden transition-all hover-translate-up" style={{ 
          backgroundColor: '#121212', 
          borderRadius: '48px',
          border: '1px solid rgba(156, 74, 52, 0.3)',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)'
        }}>
          {/* Decorative background element */}
          <div className="position-absolute top-0 end-0 p-5 opacity-10 d-none d-lg-block" style={{ transform: 'rotate(-15deg) translate(20%, -20%)' }}>
            <FiTarget size={300} className="text-rust" />
          </div>
          
          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <span className="badge bg-rust text-white fw-bold px-3 py-2 rounded-pill shadow-sm mb-4 small letter-spaced">OWNER SUITE</span>
                <h2 className="fw-bold mb-3 display-5 font-serif-italic">Own a Salon or Barbershop?</h2>
                <p className="text-white text-opacity-75 mb-5 lead" style={{ maxWidth: '600px' }}>
                  Stop losing money to no-shows. Join Liberia's premier beauty network to manage your bookings, track your daily revenue, and grow your clientele with our elite digital tools.
                </p>
                
                <div className="row g-4 mb-5">
                  {[
                    { title: "No-Show Protection", icon: <FiShield size={20} /> },
                    { title: "Real-time Revenue Tracking", icon: <FiTrendingUp size={20} /> },
                    { title: "Verified Client Growth", icon: <FiUsers size={20} /> }
                  ].map((feature, idx) => (
                    <div className="col-sm-6 col-md-4" key={idx}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-rust">{feature.icon}</div>
                        <span className="fw-bold small letter-spaced text-uppercase" style={{ fontSize: '0.65rem' }}>{feature.title}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/register?role=OWNER" className="btn btn-rust btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg transition-all hover-scale border-0">
                  List Your Business for Free
                </Link>
              </div>

              <div className="col-lg-5 d-none d-lg-block text-end">
                <div className="bg-white bg-opacity-5 rounded-4 p-4 border border-white border-opacity-10 shadow-2xl text-start" style={{ backdropFilter: 'blur(10px)' }}>
                   <div className="d-flex justify-content-between align-items-center mb-4">
                     <h6 className="fw-bold mb-0 small text-rust text-uppercase letter-spaced">Business Analytics</h6>
                     <span className="tiny text-success fw-bold">+24% THIS WEEK</span>
                   </div>
                   <div className="d-flex align-items-end gap-2 mb-4" style={{ height: '100px' }}>
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-grow-1 bg-rust rounded-top" style={{ height: `${h}%`, opacity: 0.3 + (h/100) }}></div>
                      ))}
                   </div>
                   <div className="pt-3 border-top border-white border-opacity-10 d-flex justify-content-between">
                      <div>
                        <div className="tiny opacity-50 text-uppercase letter-spaced">Daily Revenue</div>
                        <div className="h5 fw-bold mb-0">$245.00</div>
                      </div>
                      <div className="text-end">
                        <div className="tiny opacity-50 text-uppercase letter-spaced">Bookings</div>
                        <div className="h5 fw-bold mb-0">12</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* PARTNER SECTION / BENTO GRID DESIGN */}
      <section id="pricing" className="container mt-5 pt-5 mb-5">
        <div className="text-center mb-5">
          <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">Business Growth</p>
          <h2 className="fw-bold mb-3 font-serif-italic display-4">FindSalon Partner Suite</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Liberia’s growing beauty marketplace. Build your digital presence, attract customers, and manage appointments — all at no cost.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="bento-grid">
          
          {/* Card 1: Grow Your Customer Base (Wide) */}
          <div className="bento-card bento-dark span-8 row-span-2" style={{ 
            background: '#121212',
            borderRadius: '32px',
            padding: 'clamp(24px, 4vw, 40px)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div className="position-relative" style={{ zIndex: 1 }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-rust bg-opacity-20 p-2 rounded-3">
                  <FiTrendingUp className="text-rust" size={24} />
                </div>
                <h4 className="fw-bold mb-0">Grow Your Customer Base</h4>
              </div>
              <p className="text-white-50 mb-5" style={{ maxWidth: '400px' }}>
                Reach thousands of active customers searching for your services. Our discovery engine puts your salon in front of the right people at the right time.
              </p>
              
              {/* Mock Visualization: Popularity List */}
              <div className="mt-4" style={{ maxWidth: '450px' }}>
                <div className="d-flex justify-content-between mb-2 small opacity-50">
                  <span>Service</span>
                  <span>Popularity</span>
                </div>
                {[
                  { name: 'Knotless Braids', val: '85%' },
                  { name: 'Silk Press', val: '72%' },
                  { name: 'Bridal Glam', val: '64%' }
                ].map((item, i) => (
                  <div key={i} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-medium">{item.name}</span>
                      <span className="tiny text-rust">{item.val}</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                      <div className="progress-bar bg-rust" style={{ width: item.val, borderRadius: '10px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Accent */}
            <div className="position-absolute top-0 end-0 p-5 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
              <FiTrendingUp size={200} />
            </div>
          </div>

          {/* Card 2: Accept Digital Bookings (Tall) */}
          <div className="bento-card bento-dark span-4 row-span-3" style={{ 
            background: '#1A1A1A',
            borderRadius: '32px',
            padding: 'clamp(24px, 4vw, 40px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div className="bg-rust bg-opacity-20 p-3 rounded-4 d-inline-flex mb-4">
                <FiSmartphone className="text-rust" size={28} />
              </div>
              <h4 className="fw-bold mb-3">Accept Digital Bookings</h4>
              <p className="text-white-50 small">
                Your salon is always open. Let customers book 24/7 from their mobile devices without a single phone call.
              </p>
            </div>
            
            {/* Mock Visual: App Notification Card */}
            <div className="bg-white bg-opacity-10 rounded-4 p-3 border border-white border-opacity-20 mt-4 shadow-lg">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                <span className="fw-bold text-white letter-spaced" style={{ fontSize: '0.65rem' }}>NEW BOOKING REQUEST</span>
              </div>
              <div className="mt-2">
                <div className="small fw-bold text-white">Sarah Williams</div>
                <div className="small text-white text-opacity-75">Today at 2:30 PM • $45.00</div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <div className="flex-grow-1 bg-rust rounded-pill text-white p-1 text-center fw-bold" style={{ fontSize: '0.7rem' }}>ACCEPT</div>
                <div className="flex-grow-1 bg-white bg-opacity-20 rounded-pill text-white p-1 text-center fw-bold" style={{ fontSize: '0.7rem' }}>VIEW</div>
              </div>
            </div>
          </div>

          {/* Card 3: Increase Visibility (Square) */}
          <div className="bento-card bento-dark span-4 row-span-2" style={{ 
            background: '#1A1A1A',
            borderRadius: '32px',
            padding: 'clamp(24px, 4vw, 40px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div className="bg-rust bg-opacity-20 p-2 rounded-3 d-inline-flex mb-4">
              <MdOutlineRemoveRedEye className="text-rust" size={24} />
            </div>
            <h4 className="fw-bold mb-3">Visibility</h4>
            <p className="text-white text-opacity-75 small mb-4">
              Showcase your work to a larger audience and build a prestigious digital brand.
            </p>
            {/* Mock Visual: Eye/Stats */}
            <div className="text-center py-3">
              <div className="display-6 fw-bold text-rust">1.2k+</div>
              <div className="small text-white text-opacity-50 text-uppercase fw-bold letter-spaced">Weekly Profile Views</div>
            </div>
          </div>

          {/* Card 4: Revenue Analytics (Wide) */}
          <div className="bento-card bento-dark span-4 row-span-2" style={{ 
            background: '#121212',
            borderRadius: '32px',
            padding: 'clamp(24px, 4vw, 40px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-rust bg-opacity-20 p-2 rounded-3">
                <FiZap className="text-rust" size={24} />
              </div>
              <h4 className="fw-bold mb-0">Analytics</h4>
            </div>
            <p className="text-white text-opacity-75 small mb-4">
              Track your revenue and bookings with powerful smart tools.
            </p>
            {/* Mock Chart Visual */}
            <div className="d-flex align-items-end gap-2 flex-grow-1 pt-3" style={{ minHeight: '120px' }}>
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="flex-grow-1 bg-rust bg-opacity-30 rounded-top transition-all hover-bg-rust" style={{ height: `${h}%`, minWidth: '8px' }}></div>
              ))}
            </div>
          </div>

          {/* Card 5: Unified Free Call to Action (Large Card) */}
          <div className="bento-card bento-dark span-12 row-span-2" style={{ 
            background: '#000',
            borderRadius: '40px',
            padding: 'clamp(24px, 6vw, 60px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            marginTop: '20px'
          }}>
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <h2 className="display-5 fw-bold mb-4">Complete Operating System. <span className="text-rust">Always Free.</span></h2>
                <p className="text-white text-opacity-75 mb-5 lead">
                  Join Liberia's elite beauty network today. Access every feature—from inventory management to automated SMS—with zero monthly costs.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/register?role=OWNER" className="btn btn-rust btn-lg rounded-pill px-5 fw-bold transition-all hover-scale shadow-lg">List Your Business Free</Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="bg-white bg-opacity-10 rounded-4 p-4 border border-white border-opacity-20">
                  <h6 className="fw-bold text-rust mb-4" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>ALL FEATURES INCLUDED</h6>
                  <div className="row g-3">
                    {[
                      "Digital Bookings", "Inventory Management", "Revenue Analytics",
                      "Staff Management", "SMS Reminders", "Mobile Money Ready",
                      "Customer Discovery", "Priority Ranking", "Business Profile"
                    ].map((feature, idx) => (
                      <div className="col-6" key={idx}>
                        <div className="d-flex align-items-center gap-2 small text-white">
                          <FiCheckCircle className="text-rust" size={14} /> {feature}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* MOBILE READY / PWA BENTO SECTION */}
      <section id="mobile-ready" className="section-py" style={{ background: '#F5F0E1' }}>
        <div className="container">
          <div className="bento-grid">
            
            {/* Main Header Card (Wide) */}
            <div className="bento-card span-8 row-span-2 adaptive-p" style={{ 
              background: '#121212',
              borderRadius: '40px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="position-relative" style={{ zIndex: 1 }}>
                <span className="text-rust fw-bold letter-spaced small mb-3 d-block">INSTANT • SECURE • NO STORAGE SPACE</span>
                <h2 className="display-4 fw-bold mb-4 font-serif-italic">Take FindSalon <br/> with you.</h2>
                <p className="text-white text-opacity-75 lead mb-0" style={{ maxWidth: '500px' }}>
                  Download our web app to your home screen for instant access to bookings, salon locations, and your style favorites. No App Store required.
                </p>
              </div>
              <div className="position-absolute bottom-0 end-0 p-5 opacity-5 d-none d-md-block">
                <FiDownload size={250} />
              </div>
            </div>

            {/* Installation & CTA Card (Tall Right) */}
            <div className="bento-card span-4 row-span-4 adaptive-p text-center" style={{ 
              background: '#1A1A1A',
              borderRadius: '40px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div className="pt-4">
                <div className="bg-rust rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-lg" style={{ width: '80px', height: '80px' }}>
                  <FiScissors className="text-white" size={40} />
                </div>
                <h4 className="fw-bold mb-2">Install on your device</h4>
                <p className="small text-white text-opacity-50">Works on iOS, Android, and Desktop</p>
              </div>

              {/* Mock App Preview */}
              <div className="bg-white bg-opacity-5 rounded-4 p-4 border border-white border-opacity-10 mt-4 mx-2">
                <div className="d-flex align-items-center gap-3 mb-4 text-start">
                   <div className="bg-white rounded-3 p-2" style={{ width: '50px' }}>
                     <img src="/icons/icon-192x192.jpg" className="w-100 rounded-2" alt="FS" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<FiScissors class="text-rust" size={30} />' }} />
                   </div>
                   <div>
                     <div className="small fw-bold">FindSalon</div>
                     <div className="tiny opacity-50">Web App Ready</div>
                   </div>
                </div>
                <InstallPwa variant="inline" />
              </div>

              <div className="pb-4 mt-4">
                <p className="tiny text-white text-opacity-50 mb-0">Experience the future of beauty bookings.</p>
              </div>
            </div>

            {/* Install Steps Card */}
            <div className="bento-card span-4 row-span-2 adaptive-p" style={{ 
              background: '#1A1A1A',
              borderRadius: '40px',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <FiDownload className="text-rust" /> How to install:
              </h5>
              <div className="d-flex flex-column gap-3">
                {[
                  "Click the download button above",
                  "Select 'Add to Home Screen'",
                  "Launch from your home screen"
                ].map((step, i) => (
                  <div key={i} className="d-flex align-items-start gap-3">
                    <span className="bg-rust text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.7rem', flexShrink: 0 }}>{i+1}</span>
                    <span className="small text-white text-opacity-75">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Elevate Experience Card */}
            <div className="bento-card span-4 row-span-2 adaptive-p" style={{ 
              background: '#121212',
              borderRadius: '40px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <p className="text-rust fw-bold text-uppercase tiny letter-spaced mb-2">Elevate your experience</p>
              <h5 className="fw-bold mb-3">Luxury booking, simplified for the web.</h5>
              <p className="small text-white text-opacity-50 mb-4">
                Experience a faster, more intuitive way to manage your beauty appointments. No downloads required.
              </p>
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 small fw-bold text-white mb-1">
                    <FiCheckCircle className="text-rust" size={14} /> Multi-Device Sync
                  </div>
                  <p className="tiny text-white text-opacity-50 mb-0 ps-4">Book on desktop, verify on phone. Instant sync.</p>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 small fw-bold text-white mb-1">
                    <FiCheckCircle className="text-rust" size={14} /> Instant Loading
                  </div>
                  <p className="tiny text-white text-opacity-50 mb-0 ps-4">Optimized architecture. No waiting.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <style jsx>{`
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }

        input::placeholder { color: #A0968F; font-weight: 400; }
        .hover-card-premium { position: relative; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-card-premium:hover { transform: translateY(-12px); box-shadow: 0 30px 60px -12px rgba(30, 25, 21, 0.15) !important; border-color: rgba(156, 74, 52, 0.2) !important; }
        .row-span-2 { grid-row: span 2 !important; }
        .row-span-3 { grid-row: span 3 !important; }
        .hover-zoom-premium { transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-card-premium:hover .hover-zoom-premium { transform: scale(1.1); }
        .action-reveal { transition: all 0.4s ease; }
        .hover-card-premium:hover .action-reveal { background: rgba(156, 74, 52, 0.02); }
        .hover-zoom:hover { transform: scale(1.05); }
        .hover-scale:hover { transform: scale(1.02); }
        .transition-all { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .letter-spaced { letter-spacing: 2px; }
        .cursor-pointer { cursor: pointer; }
        .hover-translate-right:hover { transform: translateX(5px); }
        .hover-translate-up:hover { transform: translateY(-5px); }

        .glass-input-wrapper {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          transition: all 0.3s ease;
        }
        .glass-input-wrapper:focus-within {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .glass-input {
          background: transparent;
          border: 0;
          color: white;
          width: 100%;
          padding-left: 12px;
          outline: none;
          font-weight: 500;
        }
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .hero-blob-container {
          width: 100%;
          max-width: 700px;
          height: auto;
          aspect-ratio: 1 / 1;
          position: relative;
        }
        .hero-blob-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          clip-path: url(#blobClip);
          border-radius: 40px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }

        .text-shine-white {
          background: linear-gradient(to right, #FFFFFF 20%, #F4EFEA 40%, #FFFFFF 60%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }

        .text-shine-silver {
          background: linear-gradient(to right, #FFFFFF 20%, #E5E4E2 40%, #FFFFFF 60%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .tiny { font-size: 0.7rem; }
        .letter-spaced { letter-spacing: 1.5px; }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        @media (max-width: 576px) {
          .hero-blob-container {
            transform: scale(0.85);
          }
        }
      `}</style>

    </>
  );
}
