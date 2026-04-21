import React from 'react';
import Link from 'next/link';
import { FiCalendar, FiClock, FiMapPin, FiChevronRight, FiMoreHorizontal, FiDownload, FiXCircle } from 'react-icons/fi';
export default function BookingsPage() {
  const bookings = [
    {
      id: 'b1',
      salonName: 'Luxe Haven Salon',
      service: 'Balayage & Styling',
      professional: 'Julianne V.',
      date: 'Tomorrow, Oct 24',
      time: '10:30 AM',
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      price: 350
    },
    {
      id: 'b2',
      salonName: 'Velvet Rose Beauty',
      service: 'HydraFacial',
      professional: 'Marcus Thorne',
      date: 'Dec 12, 2023',
      time: '2:15 PM',
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      price: 180
    },
    {
       id: 'b3',
       salonName: 'Botanical Beauty SoHo',
       service: 'Deep Conditioning Treatment',
       professional: 'Sofia L.',
       date: 'Nov 28, 2023',
       time: '11:00 AM',
       status: 'completed',
       image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
       price: 95
    }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#FDFBF7' }}>
      <main className="container pb-5 pt-4 pt-md-5" style={{ maxWidth: '1000px' }}>
        <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
                <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Your Bookings</h1>
                <p className="text-muted mb-0">Manage your upcoming and past beauty experiences.</p>
            </div>
            <div className="dropdown d-none d-md-block">
                <button className="btn btn-white bg-white rounded-pill px-4 py-2 shadow-sm border border-opacity-10 fw-bold d-flex align-items-center gap-2">
                    Latest First <FiChevronRight style={{ transform: 'rotate(90deg)' }} />
                </button>
            </div>
        </div>

        {/* Upcoming Section */}
        <div className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-4">
                <div className="rounded-circle bg-rust" style={{ width: '8px', height: '8px' }}></div>
                <h4 className="fw-bold mb-0">Upcoming Appointments</h4>
            </div>

            <div className="d-flex flex-column gap-4">
                {bookings.filter(b => b.status === 'upcoming').map(booking => (
                    <div key={booking.id} className="bg-white rounded-4 overflow-hidden shadow-sm border border-opacity-10 hover-shadow transition-all">
                        <div className="row g-0">
                            <div className="col-md-3">
                                <div className="h-100 min-vh-20 position-relative">
                                    <img src={booking.image} alt={booking.salonName} className="w-100 h-100 object-fit-cover" style={{ minHeight: '180px' }} />
                                    <div className="position-absolute top-0 start-0 m-3 d-md-none">
                                        <span className="badge bg-rust text-white rounded-pill px-3 py-2 shadow-sm fw-bold">UPCOMING</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9 p-4 p-md-5 d-flex flex-column justify-content-center">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h3 className="fw-bold mb-1">{booking.salonName}</h3>
                                        <p className="text-muted fw-medium mb-0">{booking.service} with {booking.professional}</p>
                                    </div>
                                    <div className="d-none d-md-block text-end">
                                        <span className="badge bg-rust bg-opacity-10 text-rust rounded-pill px-3 py-2 fw-bold letter-spaced fs-6" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>UPCOMING</span>
                                        <div className="mt-2 fw-bold fs-4 text-dark">${booking.price}</div>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap gap-4 mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <FiCalendar className="text-rust" size={18} />
                                        <span className="fw-bold">{booking.date}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <FiClock className="text-rust" size={18} />
                                        <span className="fw-bold">{booking.time}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <FiMapPin className="text-muted" size={18} />
                                        <span className="text-muted small">Manhattan, NY</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 mt-auto pt-2">
                                    <button className="btn btn-rust text-white rounded-pill px-4 py-2 fw-bold shadow-sm">Manage Booking</button>
                                    <button className="btn btn-light bg-sand text-dark rounded-pill px-4 py-2 fw-bold border-0">Reschedule</button>
                                    <button className="btn btn-link text-muted d-flex align-items-center p-0 ms-auto text-decoration-none d-none d-sm-flex">
                                        <FiXCircle className="me-2" /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Past Section */}
        <div>
            <h4 className="fw-bold mb-4 opacity-75">Past Experiences</h4>

            <div className="d-flex flex-column gap-3">
                {bookings.filter(b => b.status === 'completed').map(booking => (
                    <div key={booking.id} className="bg-white rounded-4 p-4 shadow-sm border border-opacity-10 d-flex flex-column flex-md-row align-items-md-center transition-all cursor-pointer hover-bg-sand">
                        <div className="d-flex align-items-center flex-grow-1">
                            <div className="rounded-3 overflow-hidden flex-shrink-0 me-4" style={{ width: '64px', height: '64px' }}>
                                <img src={booking.image} alt={booking.salonName} className="w-100 h-100 object-fit-cover grayscale" style={{ filter: 'grayscale(50%)' }} />
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">{booking.salonName}</h5>
                                <div className="text-muted small mb-1">{booking.service}</div>
                                <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{booking.date} · {booking.time}</div>
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-2 gap-md-5 mt-4 mt-md-0">
                            <div className="text-md-end d-none d-sm-block">
                                <div className="fw-bold text-dark">${booking.price}</div>
                                <div className="text-success small fw-bold">Completed</div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-light rounded-pill px-4 py-2 fw-bold border font-sm d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                                    <FiDownload size={14} /> Receipt
                                </button>
                                <button className="btn btn-rust rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                                    Book Again
                                </button>
                                <button className="btn btn-light rounded-circle shadow-none border-0 p-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <FiMoreHorizontal className="text-muted" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center mt-5 pt-4">
             <Link href="/salons" className="text-rust fw-bold text-decoration-none d-flex align-items-center justify-content-center gap-2">
                 Discover more artisans <FiChevronRight />
             </Link>
        </div>
      </main>
    </div>
  );
}
