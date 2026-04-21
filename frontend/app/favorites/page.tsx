import React from 'react';
import Link from 'next/link';
import { FiHeart, FiStar, FiMapPin, FiChevronRight, FiSearch } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

export default function FavoritesPage() {
  const favoriteSalons = [
    {
      id: '1',
      name: 'Aurelia Collective',
      location: 'Manhattan, NY',
      rating: 4.9,
      reviews: 128,
      priceFrom: 120,
      image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
      isFeatured: true
    },
    {
      id: '2',
      name: 'The Gilded Mane',
      location: 'Brooklyn, NY',
      rating: 4.8,
      reviews: 95,
      priceFrom: 95,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      isFeatured: false
    },
    {
      id: '3',
      name: 'Ethereal Skin',
      location: 'SoHo, NY',
      rating: 4.9,
      reviews: 154,
      priceFrom: 150,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      isFeatured: false
    },
    {
      id: '4',
      name: 'Azure Grooming',
      location: 'Artisan Row, NY',
      rating: 4.9,
      reviews: 128,
      priceFrom: 85,
      image: 'https://images.unsplash.com/photo-1516975080661-46bca198f26b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      isFeatured: true
    }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#FDFBF7' }}>
      <main className="container pb-5 pt-4 pt-md-5" style={{ maxWidth: '1200px' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div>
                <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Favorites</h1>
                <p className="text-muted mb-0">Your curated collection of top beauty artisans.</p>
            </div>
            <div className="search-pill bg-white shadow-sm d-flex align-items-center px-3 py-2 rounded-pill border border-opacity-10" style={{ maxWidth: '300px' }}>
                <FiSearch className="text-muted me-2" size={18} />
                <input type="text" placeholder="Filter favorites..." className="bg-transparent border-0 w-100 small" style={{ outline: 'none' }} />
            </div>
        </div>

        <div className="row g-4">
            {favoriteSalons.map(salon => (
                <div key={salon.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden border border-opacity-10 h-100 d-flex flex-column hover-shadow transition-all card-hover-effect">
                        <div className="position-relative" style={{ height: '200px' }}>
                            <img src={salon.image} alt={salon.name} className="w-100 h-100 object-fit-cover" />
                            <div className="position-absolute top-0 end-0 p-3">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm cursor-pointer hover-scale" style={{ width: '36px', height: '36px' }}>
                                    <FaHeart className="text-rust" size={16} />
                                </div>
                            </div>
                            {salon.isFeatured && (
                                <div className="position-absolute bottom-0 start-0 p-3">
                                    <div className="badge bg-rust text-white px-3 py-2 rounded-pill fw-bold small text-uppercase shadow" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>FEATURED</div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex-grow-1 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="text-muted small fw-bold d-flex align-items-center">
                                    <FiStar className="text-rust me-1" style={{ fill: 'var(--accent-rust)' }} /> <span className="text-dark me-1">{salon.rating}</span> ({salon.reviews})
                                </div>
                                <div className="fw-bold text-rust" style={{ fontSize: '0.9rem' }}>From ${salon.priceFrom}</div>
                            </div>
                            <h5 className="fw-bold text-dark mb-1">{salon.name}</h5>
                            <p className="text-muted small mb-4"><FiMapPin className="me-1" /> {salon.location}</p>
                            
                            <div className="mt-auto d-flex gap-2">
                                <Link href={`/salons/${salon.id}`} className="btn btn-light bg-sand text-rust fw-bold rounded-pill px-4 flex-grow-1 shadow-none border-0 small" style={{ fontSize: '0.85rem' }}>View Salon</Link>
                                <button className="btn btn-rust rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                                    <FiChevronRight className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty State / Add More Card */}
            <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <Link href="/salons" className="text-decoration-none h-100">
                    <div className="rounded-4 border border-2 border-dashed border-secondary border-opacity-25 h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center transition-all bg-light bg-opacity-10 hover-bg-sand">
                        <div className="bg-white rounded-circle shadow-sm p-3 mb-3 text-rust">
                            <FiSearch size={24} />
                        </div>
                        <h6 className="fw-bold text-dark mb-1">Discover More</h6>
                        <p className="text-muted small mb-0 px-2">Keep exploring to find more artisans you'll love.</p>
                    </div>
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}
