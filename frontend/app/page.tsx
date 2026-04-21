import React from 'react';
import Link from 'next/link';
import { FiMapPin, FiSearch, FiStar, FiChevronRight, FiScissors, FiSmile, FiBook, FiCheckCircle } from 'react-icons/fi';
import { MdOutlineFaceRetouchingNatural, MdSpa, MdOutlineRemoveRedEye } from 'react-icons/md';
export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="container mt-5 pt-3">
        <div className="row align-items-center">
          <div className="col-lg-6 pe-lg-5">
            <h1 className="fw-bold mb-0" style={{ fontSize: '4.5rem', lineHeight: '1.1', color: '#1E1915' }}>
              Your Glow, <br/>
              <span className="font-serif-italic text-rust" style={{ fontSize: '5rem' }}>Curated.</span>
            </h1>
            <p className="mt-4 mb-5 text-muted" style={{ fontSize: '1.1rem', maxWidth: '400px' }}>
              Discover and book the most prestigious beauty artisans in your city. Experience tactile luxury with every appointment.
            </p>

            <div className="search-pill d-inline-flex w-100" style={{ maxWidth: '480px' }}>
              <div className="d-flex align-items-center flex-grow-1 px-3">
                <FiMapPin className="text-rust me-2" size={20} />
                <input type="text" placeholder="Location" className="w-100" />
              </div>
              <div className="search-divider"></div>
              <div className="d-flex align-items-center flex-grow-1 px-3">
                <FiSearch className="text-muted me-2" size={20} />
                <input type="text" placeholder="Service Name" className="w-100" />
              </div>
              <button className="btn-rust border-0 rounded-pill px-4 py-2">Find salon</button>
            </div>
          </div>
          <div className="col-lg-6 position-relative mt-5 mt-lg-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              className="rounded-4 shadow-lg w-100"
              style={{ height: '600px', objectFit: 'cover' }}
            >
              <source src="https://videos.pexels.com/video-files/3998103/3998103-uhd_2560_1440_30fps.mp4" type="video/mp4" />
            </video>
            <div className="badge-float d-flex align-items-center" style={{ bottom: '40px', top: 'auto', left: '-30px', right: 'auto', padding: '12px 24px', borderRadius: '30px' }}>
              <div className="bg-rust rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', color: 'white' }}>
                <FiStar />
              </div>
              <div>
                <div className="fw-bold fs-5">4.9/5</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Average Salon Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY SERVICES */}
      <section className="container mt-5 pt-5">
        <p className="text-rust text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Personalized for you</p>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h2 className="fw-bold mb-0">Luxury Services</h2>
          <Link href="/services" className="text-rust text-decoration-none fw-medium">View All Services</Link>
        </div>
        
        <div className="row text-center mt-5">
          {[ 
            { name: 'Hair Styling', icon: <FiScissors /> },
            { name: 'Facials', icon: <FiSmile /> },
            { name: 'Manicure', icon: <MdOutlineFaceRetouchingNatural /> },
            { name: 'Makeup', icon: <MdOutlineFaceRetouchingNatural /> }, // Simplified icon representation
            { name: 'Massage', icon: <MdSpa /> },
            { name: 'Lashes', icon: <MdOutlineRemoveRedEye /> }
          ].map((srv, idx) => (
            <div className="col" key={idx}>
              <div className="service-icon-circle">
                {srv.icon}
              </div>
              <p className="fw-medium text-dark">{srv.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURATED COLLECTIONS */}
      <section className="container mt-5 pt-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h2 className="fw-bold mb-0">Curated Collections</h2>
          <Link href="/salons" className="text-rust text-decoration-none fw-medium d-flex align-items-center">
            View All Salons <FiChevronRight className="ms-1" />
          </Link>
        </div>
        <div className="row g-4">
          {/* Card 1 */}
          <div className="col-md-4">
            <Link href="/salons/1" className="text-decoration-none text-dark d-block card-hover-effect">
              <div className="image-card-rounded shadow-sm">
                <span className="badge-float bg-dark text-white shadow-none">4.9 ★</span>
                <span className="position-absolute bg-white rounded-pill px-3 py-1 fw-bold fs-6" style={{ bottom: '15px', left: '15px', zIndex: 10 }}>From $120</span>
                <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=500&q=80" alt="Salon 1" className="w-100 transition-transform" style={{ height: '350px', objectFit: 'cover' }} />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                <div>
                  <h5 className="fw-bold mb-1">Aurelia Collective</h5>
                  <p className="text-muted small mb-0"><FiMapPin className="me-1"/>Manhattan, NY</p>
                </div>
                <div className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><FiChevronRight /></div>
              </div>
            </Link>
          </div>
          {/* Card 2 */}
          <div className="col-md-4">
            <Link href="/salons/2" className="text-decoration-none text-dark d-block card-hover-effect">
              <div className="image-card-rounded shadow-sm">
                <span className="badge-float bg-dark text-white shadow-none">4.8 ★</span>
                <span className="position-absolute bg-white rounded-pill px-3 py-1 fw-bold fs-6" style={{ bottom: '15px', left: '15px', zIndex: 10 }}>From $95</span>
                <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80" alt="Salon 2" className="w-100 transition-transform" style={{ height: '350px', objectFit: 'cover' }} />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                <div>
                  <h5 className="fw-bold mb-1">The Gilded Mane</h5>
                  <p className="text-muted small mb-0"><FiMapPin className="me-1"/>Brooklyn, NY</p>
                </div>
                <div className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><FiChevronRight /></div>
              </div>
            </Link>
          </div>
          {/* Card 3 */}
          <div className="col-md-4">
            <Link href="/salons/3" className="text-decoration-none text-dark d-block card-hover-effect">
              <div className="image-card-rounded shadow-sm">
                <span className="badge-float bg-dark text-white shadow-none">4.9 ★</span>
                <span className="position-absolute bg-white rounded-pill px-3 py-1 fw-bold fs-6" style={{ bottom: '15px', left: '15px', zIndex: 10 }}>From $150</span>
                <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=500&q=80" alt="Salon 3" className="w-100 transition-transform" style={{ height: '350px', objectFit: 'cover' }} />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                <div>
                  <h5 className="fw-bold mb-1">Ethereal Skin</h5>
                  <p className="text-muted small mb-0"><FiMapPin className="me-1"/>SoHo, NY</p>
                </div>
                <div className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><FiChevronRight /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* THREE STEPS */}
      <section className="container mt-5 pt-5 mb-5 pb-5 border-bottom border-light">
        <div className="row g-5">
          <div className="col-md-4">
            <h4 className="text-rust fw-bold mb-3">01</h4>
            <h5 className="fw-bold">Search & Discover</h5>
            <p className="text-muted mt-2">Browse through thousands of top-rated salons, filter by your specific needs, and read verified reviews from our community.</p>
          </div>
          <div className="col-md-4">
            <h4 className="text-rust fw-bold mb-3">02</h4>
            <h5 className="fw-bold">Book Instantly</h5>
            <p className="text-muted mt-2">Select your service, choose an artist, and pick a time slot that fits your lifestyle. Real-time availability at your fingertips.</p>
          </div>
          <div className="col-md-4">
            <h4 className="text-rust fw-bold mb-3">03</h4>
            <h5 className="fw-bold">Show up & Shine</h5>
            <p className="text-muted mt-2">Enjoy your luxury appointment. We securely process payments and streamline communication with the artist.</p>
          </div>
        </div>
      </section>

      {/* BANNER AD */}
      <section className="container mt-5">
        <div className="row align-items-center bg-rust rounded-4 p-5 text-white shadow" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="col-md-7 position-relative" style={{ zIndex: 1 }}>
            <span className="badge bg-light text-rust mb-3 shadow-sm px-3 py-2 rounded-pill">Find Glow</span>
            <h2 className="fw-bold" style={{ fontSize: '3rem', lineHeight: '1.2' }}>Take 25% off your first<br/>luxury spa day.</h2>
            <p className="mt-3 mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>Use code <strong>FINDGLOW</strong> at checkout. Valid for new users only.</p>
            <button className="btn btn-light rounded-pill px-4 py-3 fw-bold text-dark">Redeem Offer</button>
          </div>
          <div className="col-md-5 mt-4 mt-md-0 position-relative">
             <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80" alt="Spa Day" className="rounded-4 border border-4 border-white shadow img-fluid" style={{ transform: 'rotate(2deg)' }} />
          </div>
        </div>
      </section>

      {/* PARTNER SECTION */}
      <section className="container mt-5 pt-5">
        <div className="row align-items-center bg-white rounded-4 p-0 shadow-sm overflow-hidden">
          <div className="col-md-6 p-0">
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=700&q=80" alt="Salon Professional" className="img-fluid h-100" style={{ objectFit: 'cover', minHeight: '400px' }} />
          </div>
          <div className="col-md-6 p-5">
            <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">For Professionals</p>
            <h2 className="fw-bold mb-3">Grow your brand with FindSalon.</h2>
            <p className="text-muted mb-4">Present to thousands of active clients, manage your calendar effortlessly, and showcase your portfolio on the industry's most premium platform.</p>
            <ul className="list-unstyled mb-4">
              <li className="mb-2 text-dark fw-medium"><FiCheckCircle className="text-rust me-2"/> Zero subscription fees</li>
              <li className="mb-2 text-dark fw-medium"><FiCheckCircle className="text-rust me-2"/> Advanced marketing tools</li>
              <li className="mb-2 text-dark fw-medium"><FiCheckCircle className="text-rust me-2"/> Seamless payment processing</li>
            </ul>
            <button className="btn btn-dark rounded-pill px-4 py-2">Join Find Salon</button>
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
                <button className="btn-rust">Start Browsing Now</button>
              </div>
              <div className="col-md-6 text-end">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Luxury interior shadow" className="img-fluid rounded-3 opacity-50 border border-secondary" style={{ filter: 'brightness(0.7)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
