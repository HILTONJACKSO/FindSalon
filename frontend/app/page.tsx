'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiSearch, FiStar, FiChevronRight, FiScissors, FiSmile, FiBook, FiCheckCircle, FiTag, FiClock } from 'react-icons/fi';
import { MdOutlineFaceRetouchingNatural, MdSpa, MdOutlineRemoveRedEye } from 'react-icons/md';
import { api, getImageUrl } from '@/lib/api';
import { motion } from 'framer-motion';

import { useLocation } from '@/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/lib/location';

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
    {children}
  </motion.div>
);

export default function Home() {
  const [curatedSalons, setCuratedSalons] = useState<any[]>([]);
  const [nearbySalons, setNearbySalons] = useState<any[]>([]);
  const [independentPros, setIndependentPros] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const { location: userLocation } = useLocation();

  const router = useRouter();

  const [searchState, setSearchState] = useState({
    location: '',
    service: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchState.service) params.set('search', searchState.service);
    if (searchState.location) params.set('location', searchState.location);
    router.push(`/salons?${params.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonsRes, servicesRes, allSalonsRes, adsRes] = await Promise.all([
          api.get('/salons/curated/'),
          api.get('/services/'),
          api.get('/salons/'),
          api.get('/ads/public/?placement=LANDING_PAGE')
        ]);
        setCuratedSalons(salonsRes.data);
        setFeaturedServices(servicesRes.data.results || servicesRes.data);
        setAds(adsRes.data);

        const allSalons = allSalonsRes.data.results || allSalonsRes.data;
        
        // Filter Independent Pros
        const independent = allSalons.filter((s: any) => s.salon_type === 'INDEPENDENT');
        setIndependentPros(independent.slice(0, 3));

        if (userLocation) {
          const sorted = [...allSalons].sort((a, b) => {
            const distA = calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(a.latitude), parseFloat(a.longitude));
            const distB = calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(b.latitude), parseFloat(b.longitude));
            return distA - distB;
          });
          setNearbySalons(sorted.slice(0, 3));
        } else {
          setNearbySalons(allSalons.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch curated data", err);
      }
    };
    fetchData();
  }, [userLocation]);
  return (
    <>
      {/* HERO SECTION - REFINED & SHARP */}
      <section className="bg-sand pt-5 pb-5 mb-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container pt-4">
          <div className="row align-items-center">
            <div className="col-lg-6 pe-lg-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="fw-bold mb-0" style={{ fontSize: '4.5rem', lineHeight: '1.1', color: '#1E1915' }}>
                  Your Glow, <br/>
                  <span className="font-serif-italic text-rust" style={{ fontSize: '5rem' }}>Curated.</span>
                </h1>
                <p className="mt-4 mb-5 text-muted" style={{ fontSize: '1.1rem', maxWidth: '400px' }}>
                  Discover and book the most prestigious beauty artisans in your city. Experience tactile luxury with every appointment.
                </p>

                <div className="search-pill-container mt-4" style={{ maxWidth: '600px' }}>
                  <div className="search-pill d-flex align-items-center shadow-lg bg-white p-2 rounded-pill border border-light transition-all hover-shadow-xl">
                    {/* Location Input */}
                    <div className="flex-grow-1 px-4 py-2">
                      <label className="d-block text-rust fw-bold text-uppercase mb-0" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Where</label>
                      <div className="d-flex align-items-center">
                        <FiMapPin className="text-muted me-2" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search location..." 
                          className="w-100 border-0 bg-transparent shadow-none" 
                          style={{ outline: 'none', fontWeight: 600, fontSize: '0.95rem' }} 
                          value={searchState.location}
                          onChange={(e) => setSearchState({...searchState, location: e.target.value})}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                    </div>

                    <div className="search-divider" style={{ width: '1px', height: '40px', background: '#eee' }}></div>

                    {/* Service Input */}
                    <div className="flex-grow-1 px-4 py-2">
                      <label className="d-block text-rust fw-bold text-uppercase mb-0" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>What</label>
                      <div className="d-flex align-items-center">
                        <FiSearch className="text-muted me-2" size={14} />
                        <input 
                          type="text" 
                          placeholder="Hair, nails, spa..." 
                          className="w-100 border-0 bg-transparent shadow-none" 
                          style={{ outline: 'none', fontWeight: 600, fontSize: '0.95rem' }} 
                          value={searchState.service}
                          onChange={(e) => setSearchState({...searchState, service: e.target.value})}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                    </div>

                    {/* Integrated Search Button */}
                    <button 
                      className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center transition-all hover-scale shadow-sm ms-2"
                      style={{ width: '48px', height: '48px', flexShrink: 0 }}
                      onClick={handleSearch}
                    >
                      <FiSearch size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="d-flex flex-wrap align-items-center gap-4 mt-5">
                  <div className="d-flex align-items-center text-muted">
                    <FiCheckCircle className="text-rust me-2" />
                    <span className="small fw-medium">Curated Artists</span>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <FiCheckCircle className="text-rust me-2" />
                    <span className="small fw-medium">Instant Booking</span>
                  </div>
                  <Link 
                    href="/#pricing" 
                    className="text-rust fw-bold text-decoration-none d-flex align-items-center hover-translate-right"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    View Partner Plans <FiChevronRight className="ms-1" />
                  </Link>
                </div>


              </motion.div>
            </div>
            
            <div className="col-lg-6 mt-5 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="position-relative">
                  <img 
                    src="/hero.jpg" 
                    alt="Discover your glow" 
                    className="rounded-4 shadow-lg w-100"
                    style={{ height: '600px', objectFit: 'cover' }}
                  />
                  
                  <div className="position-absolute shadow-lg bg-white rounded-4 p-3 d-flex align-items-center" style={{ bottom: '30px', right: '30px', minWidth: '220px', zIndex: 10 }}>
                    <div className="bg-rust rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', color: 'white' }}>
                      <FiStar size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">5.0 Rating</h6>
                      <p className="text-muted small mb-0">Liberia's Finest</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      
      {/* ADVERTISING GRID SECTION */}
      {ads.length > 0 && (
        <FadeIn>
          <section className="container mt-5 pt-4">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <p className="text-rust text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Partner Spotlight</p>
                <h2 className="fw-bold mb-0 display-6">Featured Promotions</h2>
              </div>
            </div>
            
            <div className="row g-4">
              {ads.slice(0, 3).map((ad) => (
                <div className="col-lg-4" key={ad.id}>
                  <Link href={ad.link_url || `/salons/${ad.salon}`} className="text-decoration-none">
                    <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden h-100 transition-all hover-scale">
                      <div className="position-relative" style={{ height: '240px' }}>
                        <img src={getImageUrl(ad.image) || ''} className="w-100 h-100 object-fit-cover" alt={ad.title} />

                        <div className="position-absolute top-0 start-0 m-3">
                          <span className="badge bg-rust text-white rounded-pill px-3 py-1 fw-bold small shadow-sm">PROMOTED</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="fw-bold text-dark mb-2">{ad.title}</h5>
                        <p className="text-muted small mb-3 line-clamp-2">{ad.description}</p>
                        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-opacity-10">
                          <span className="fw-bold text-rust small text-uppercase letter-spaced">{ad.salon_name}</span>
                          <div className="btn btn-outline-dark btn-sm rounded-pill px-3">Book Now</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* NEARBY SALONS SECTION */}
      {nearbySalons.length > 0 && (
        <FadeIn>
          <section className="container mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <h2 className="fw-bold mb-0 display-6">Discover Excellence Near You</h2>
                <p className="text-muted mt-2">Curated experiences in your local community.</p>
              </div>
              <Link href="/salons" className="text-rust fw-bold text-decoration-none d-flex align-items-center hover-underline">
                View all salons <FiChevronRight className="ms-1" />
              </Link>
            </div>
            
            <div className="row g-4">
              {nearbySalons.map((salon) => (
                <div className="col-md-4" key={salon.id}>
                  <div 
                    onClick={() => router.push(`/salons/${salon.id}`)}
                    className="card border-0 bg-white shadow-sm rounded-5 overflow-hidden h-100 transition-all hover-scale cursor-pointer"
                  >
                    <div className="position-relative" style={{ height: '260px' }}>
                      <img 
                        src={getImageUrl(salon.images?.[0]?.image) || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80'} 
                        className="w-100 h-100 object-fit-cover"
                        alt={salon.name}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <div className="bg-white bg-opacity-90 backdrop-blur rounded-pill px-2 py-1 shadow-sm d-flex align-items-center">
                          <FiStar className="text-warning me-1" style={{ fill: 'currentColor' }} />
                          <span className="fw-bold small">{salon.rating || '5.0'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold text-dark mb-0">{salon.name}</h5>
                        <span className="text-rust fw-bold">${salon.min_price || '15'}</span>
                      </div>
                      <p className="text-muted small mb-3 d-flex align-items-center">
                        <FiMapPin className="me-1" /> {salon.address}
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        {salon.offered_services?.slice(0, 3).map((service: string) => (
                          <span key={service} className="badge bg-light text-dark rounded-pill px-3 py-1 fw-medium border border-opacity-10" style={{ fontSize: '0.65rem' }}>
                            {service.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ELITE MOBILE ARTISTS SECTION */}
      {independentPros.length > 0 && (
        <FadeIn>
          <section className="container mt-5 pt-5">
            <div className="bg-dark rounded-5 p-5 text-white overflow-hidden position-relative">
              <div className="position-absolute top-0 end-0 p-5 opacity-10">
                <FiScissors size={200} />
              </div>
              
              <div className="position-relative" style={{ zIndex: 1 }}>
                <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">At Your Door</p>
                <h2 className="fw-bold mb-2 display-5 font-serif-italic text-white">Elite Mobile Artists</h2>
                <p className="text-white-50 mb-5 lead opacity-75" style={{ maxWidth: '600px' }}>Skip the commute. Experience luxury beauty treatments in the comfort of your own home with our hand-picked independent professionals.</p>
                
                <div className="row g-4">
                  {independentPros.map((pro) => (
                    <div className="col-lg-4" key={pro.id}>
                      <div 
                        onClick={() => router.push(`/salons/${pro.id}`)}
                        className="bg-white bg-opacity-10 backdrop-blur rounded-4 p-4 h-100 transition-all hover-translate-up cursor-pointer border border-white border-opacity-10"
                      >
                        <div className="d-flex align-items-center mb-4">
                          <img 
                            src={pro.cover_image || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80'} 
                            className="rounded-circle object-fit-cover shadow-sm border border-white border-opacity-20"
                            style={{ width: '70px', height: '70px' }}
                            alt={pro.name}
                          />
                          <div className="ms-3">
                            <h5 className="fw-bold text-white mb-1">{pro.name}</h5>
                            <div className="d-flex align-items-center text-rust small fw-bold">
                              <FiStar className="me-1 fill-rust" size={12} /> {pro.rating || '5.0'} · Independent
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-white-50 small mb-4 line-clamp-2">{pro.description || "Expert beauty services delivered directly to your doorstep with meticulous attention to detail."}</p>
                        
                        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-10">
                          <span className="text-white fw-bold">From ${pro.min_price || '20'}</span>
                          <div className="btn btn-rust btn-sm rounded-pill px-3 fw-bold">Quick Book</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      )}


      <section className="container mt-5 pt-5">
        <p className="text-rust text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Quick Browse</p>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h2 className="fw-bold mb-0 display-6">Explore Categories</h2>
          <Link href="/services" className="text-rust text-decoration-none fw-bold small letter-spaced">VIEW ALL</Link>
        </div>
        
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4 mt-4">
          {featuredServices.length > 0 ? (
            featuredServices.slice(0, 6).map((srv, idx) => (
              <div className="col text-center" key={srv.id}>
                <Link href={`/salons/${srv.salon}`} className="text-decoration-none">
                  <div className="service-icon-circle mx-auto mb-3 transition-all hover-scale shadow-sm">
                    {srv.category_name?.toLowerCase().includes('hair') ? <FiScissors /> : 
                     srv.category_name?.toLowerCase().includes('face') ? <FiSmile /> : 
                     srv.category_name?.toLowerCase().includes('spa') ? <MdSpa /> : <FiTag />}
                  </div>
                  <p className="fw-bold text-dark mb-1 small text-uppercase letter-spaced" style={{ fontSize: '0.7rem' }}>{srv.name}</p>
                </Link>
              </div>
            ))
          ) : (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div className="col text-center opacity-50" key={i}>
                <div className="service-icon-circle mx-auto mb-3 bg-light"></div>
                <div className="bg-light h-2 w-75 mx-auto rounded"></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* TREATMENT HIGHLIGHTS - DETAILED LIST */}
      <section className="container mt-5 pt-5">
        <p className="text-rust text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Trending now</p>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h2 className="fw-bold mb-0 display-6">Featured Treatments</h2>
          <Link href="/services" className="text-rust text-decoration-none fw-bold small letter-spaced">SEE MENU</Link>
        </div>

        <div className="row g-4 mt-2">
            {featuredServices.slice(0, 4).map((srv) => (
                <div key={srv.id} className="col-12 col-md-6 col-xl-3">
                    <Link href={`/salons/${srv.salon}`} className="text-decoration-none">
                        <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden h-100 transition-all hover-scale">
                            <div className="position-relative" style={{ height: '200px' }}>
                                <img src={srv.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'} className="w-100 h-100 object-fit-cover" alt={srv.name} />
                                <div className="position-absolute top-0 end-0 m-3 bg-white bg-opacity-75 backdrop-blur rounded-pill px-3 py-1 fw-bold text-dark shadow-sm" style={{ fontSize: '0.75rem' }}>
                                    ${srv.price}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{srv.name}</h6>
                                    <div className="text-warning small d-flex align-items-center">
                                        <FiStar className="fill-warning me-1" size={12} /> {srv.salon_rating}
                                    </div>
                                </div>
                                <p className="text-rust small fw-bold mb-3" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{srv.salon_name?.toUpperCase()}</p>
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
            ))}
        </div>
      </section>

      {/* SALONS NEAR YOU */}
      {userLocation && nearbySalons.length > 0 && (
        <section className="container mt-5 pt-5">
          <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
            <p className="text-rust text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Proximity search</p>
            <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
              <div>
                <h2 className="fw-bold mb-0 display-6">Salons Near You</h2>
                {userLocation && (
                  <p className="text-muted small mt-1 mb-0">
                    Your Location: <span className="text-rust fw-bold">{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</span>
                  </p>
                )}
              </div>
              <div className="d-flex gap-3 align-items-center">
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-outline-rust btn-sm rounded-pill px-3 fw-bold"
                  style={{ fontSize: '0.75rem' }}
                >
                  <FiClock className="me-1" /> REFRESH LOCATION
                </button>
                <Link href="/salons" className="text-rust text-decoration-none fw-bold small letter-spaced">VIEW MAP</Link>
              </div>
            </div>
            <div className="row g-4 mt-2">
              {nearbySalons.map((salon) => {
                const distance = calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(salon.latitude), parseFloat(salon.longitude));
                return (
                  <div key={salon.id} className="col-md-4">
                    <Link href={`/salons/${salon.id}`} className="text-decoration-none">
                      <div className="d-flex align-items-center p-3 rounded-4 transition-all hover-bg-light">
                        <img 
                          src={salon.cover_image} 
                          alt={salon.name} 
                          className="rounded-circle object-fit-cover shadow-sm" 
                          style={{ width: '80px', height: '80px' }} 
                        />
                        <div className="ms-4">
                          <h6 className="fw-bold text-dark mb-1">{salon.name}</h6>
                          <p className="text-muted small mb-1 d-flex align-items-center gap-1">
                            <FiMapPin size={12} className="text-rust" /> {salon.address}
                          </p>
                          <span className="badge bg-rust text-white rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
                            {formatDistance(distance)} AWAY
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CURATED COLLECTIONS */}
      <FadeIn>
        <section className="container mt-5 pt-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h2 className="fw-bold mb-0 display-6">Curated Collections</h2>
            <Link href="/salons" className="text-rust text-decoration-none fw-bold small letter-spaced d-flex align-items-center">
              BROWSE MORE <FiChevronRight className="ms-1" />
            </Link>
          </div>
          <div className="row g-4">
            {curatedSalons.length > 0 ? (
              curatedSalons.map((salon) => (
                <div className="col-md-4" key={salon.id}>
                  <Link href={`/salons/${salon.id}`} className="text-decoration-none text-dark d-block">
                    <div className="image-card-rounded shadow-sm overflow-hidden position-relative group mb-3">
                      <div className="badge-float bg-white text-dark fw-bold border-0" style={{ top: '20px', right: '20px' }}>{salon.rating} ★</div>
                      <div className="position-absolute bg-white rounded-pill px-4 py-2 fw-bold shadow-sm" style={{ bottom: '20px', left: '20px', zIndex: 10, fontSize: '0.85rem' }}>FROM ${salon.min_price}</div>
                      <img src={salon.cover_image} alt={salon.name} className="w-100 transition-all hover-zoom" style={{ height: '420px', objectFit: 'cover' }} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center px-1">
                      <div>
                        <h5 className="fw-bold mb-1 letter-spaced text-uppercase" style={{ fontSize: '1rem' }}>{salon.name}</h5>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <p className="text-muted small mb-0"><FiMapPin className="me-1 text-rust"/>{salon.address}</p>
                          {userLocation && salon.latitude && salon.longitude && (
                            <span className="badge bg-rust bg-opacity-10 text-rust rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
                              {formatDistance(calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(salon.latitude), parseFloat(salon.longitude)))} away
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}><FiChevronRight /></div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              // Fallback Loaders / Skeleton
              [1, 2, 3].map((i) => (
                <div className="col-md-4" key={i}>
                  <div className="bg-light rounded-4 w-100" style={{ height: '420px' }}></div>
                </div>
              ))
            )}
          </div>
        </section>
      </FadeIn>

      {/* THREE STEPS */}
      <section className="container mt-5 pt-5 mb-5 pb-5 border-bottom border-light">
        <div className="row g-5">
          {[
            { id: '01', title: 'Search & Discover', desc: 'Browse through thousands of top-rated salons, filter by your specific needs, and read verified reviews from our community.' },
            { id: '02', title: 'Book Instantly', desc: 'Select your service, choose an artist, and pick a time slot that fits your lifestyle. Real-time availability at your fingertips.' },
            { id: '03', title: 'Show up & Shine', desc: 'Enjoy your luxury appointment. We securely process payments and streamline communication with the artist.' }
          ].map((step, idx) => (
            <div className="col-md-4" key={step.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <h4 className="text-rust fw-bold mb-3">{step.id}</h4>
                <h5 className="fw-bold">{step.title}</h5>
                <p className="text-muted mt-2">{step.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>


      {/* PARTNER SECTION / PRICING */}
      <section id="pricing" className="container mt-5 pt-5">
        <div className="bg-white rounded-5 p-0 shadow-sm overflow-hidden border border-opacity-10">
          <div className="row g-0">
            <div className="col-lg-5">
              <img src="/owner-suite.jpg" alt="Salon Professional" className="w-100 h-100 object-fit-cover" style={{ minHeight: '500px' }} />
            </div>
            <div className="col-lg-7 p-5">
              <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">Business Growth</p>
              <h2 className="fw-bold mb-3 font-serif-italic display-5">Aura Luxe Partner Suite</h2>
              <p className="text-muted mb-5 lead">Join Liberia's most prestigious beauty network. Register your business for free and enjoy your first month on us.</p>
              
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="p-4 rounded-4 bg-sand border border-opacity-10 h-100">
                    <h5 className="fw-bold mb-1">Essential Plan</h5>
                    <p className="text-muted small mb-3">Perfect for boutique artisans</p>
                    <div className="d-flex align-items-baseline gap-1 mb-4">
                      <span className="fs-3 fw-bold text-dark">$15</span>
                      <span className="text-muted small">/month</span>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2 small"><FiCheckCircle className="text-rust me-2"/> 10 Service Listings</li>
                      <li className="mb-2 small"><FiCheckCircle className="text-rust me-2"/> Basic Analytics</li>
                      <li className="mb-2 small"><FiCheckCircle className="text-rust me-2"/> Standard Support</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 rounded-4 bg-dark text-white h-100 shadow-lg position-relative overflow-hidden">
                    <div className="position-absolute top-0 end-0 bg-rust text-white px-3 py-1 fw-bold small" style={{ fontSize: '0.6rem', transform: 'rotate(45deg) translate(15px, -10px)', width: '100px', textAlign: 'center' }}>PRO</div>
                    <h5 className="fw-bold mb-1">Elite Plan</h5>
                    <p className="text-white-50 small mb-3">For high-volume luxury salons</p>
                    <div className="d-flex align-items-baseline gap-1 mb-4">
                      <span className="fs-3 fw-bold text-rust">$20</span>
                      <span className="text-white-50 small">/month</span>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2 small"><FiCheckCircle className="text-rust me-2"/> Unlimited Listings</li>
                      <li className="mb-2 small"><FiCheckCircle className="text-rust me-2"/> Advanced Growth Tools</li>
                      <li className="mb-2 small"><FiCheckCircle className="text-rust me-2"/> 24/7 Priority Concierge</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-rust bg-opacity-10 p-4 rounded-4 mb-5">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-rust text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">First Month Free</h6>
                    <p className="text-muted small mb-0">Start your journey today with zero upfront cost. No credit card required to register.</p>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                <Link href="/register?role=OWNER" className="btn btn-dark rounded-pill px-5 py-3 fw-bold">Register Business Free</Link>
                <Link href="/services" className="btn btn-outline-dark rounded-pill px-4 py-3 fw-bold">Explore Suite Features</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA & FOOTER */}
      <div className="bg-white mt-5 pt-5 pb-4">
        <div className="container">
          <div className="bg-dark rounded-4 p-5 text-white" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
              <div className="col-md-6">
                <p className="text-uppercase fw-bold mb-2 small text-rust letter-spaced">Elevate your experience</p>
                <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>Luxury booking,<br/>simplified for the web.</h2>
                <p className="mb-4" style={{ opacity: 0.8 }}>Experience a faster, more intuitive way to manage your beauty appointments. No downloads required—just pure, effortless browsing on any device.</p>
                <div className="d-flex mb-4">
                  <div className="me-4">
                    <h6 className="fw-bold"><FiCheckCircle className="text-rust me-1"/> Multi-Device Sync</h6>
                    <p className="small text-white-50">Book on your desktop, verify on your phone. Instant sync everywhere.</p>
                  </div>
                  <div>
                    <h6 className="fw-bold"><FiCheckCircle className="text-rust me-1"/> Instant Loading</h6>
                    <p className="small text-white-50">Optimized architecture means no waiting. Fast availability checks.</p>
                  </div>
                </div>
                <Link href="/salons">
                  <button className="btn btn-rust rounded-pill px-5 py-3 fw-bold transition-all hover-scale border-0">Start Browsing Now</button>
                </Link>
              </div>
              <div className="col-md-6 text-end">
                <img src="/elevate-experience.jpg" alt="Luxury booking interface" className="img-fluid rounded-3 border border-secondary shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        input::placeholder { color: #A0968F; font-weight: 400; }
        .hover-zoom:hover { transform: scale(1.05); }
        .hover-scale:hover { transform: scale(1.02); }
        .transition-all { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .letter-spaced { letter-spacing: 2px; }
      `}</style>
    </>
  );
}
