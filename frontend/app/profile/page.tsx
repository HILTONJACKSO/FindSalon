import React from 'react';
import Link from 'next/link';
import { FiBell, FiShoppingBag, FiMapPin, FiCalendar, FiChevronRight, FiLogOut, FiHeart, FiStar, FiCheck, FiUser, FiCreditCard, FiShield, FiEdit2 } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
export default function UserProfile() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#FDFBF7' }}>
      <main className="container-fluid px-3 px-md-5 pb-5 pt-2" style={{ maxWidth: '1400px' }}>
         
         {/* Hero Block */}
         <div className="bg-white rounded-5 shadow-sm p-4 p-md-5 mb-5 d-flex flex-column flex-md-row align-items-center justify-content-between position-relative overflow-hidden border border-opacity-10 text-center text-md-start">
             <div className="d-flex flex-column flex-md-row align-items-center gap-4 gap-md-5 z-1">
                 <div className="position-relative">
                     <div className="rounded-circle overflow-hidden border border-4 border-white shadow-sm" style={{ width: '140px', height: '140px', backgroundColor: '#e9ecef' }}>
                         <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Alex Rivera" className="w-100 h-100 object-fit-cover" />
                     </div>
                     <div className="position-absolute bg-rust text-white rounded-circle d-flex align-items-center justify-content-center shadow border border-2 border-white cursor-pointer" style={{ width: '32px', height: '32px', bottom: '5px', right: '5px' }}>
                         <FiEdit2 size={14} />
                     </div>
                 </div>
                 
                 <div>
                     <h1 className="fw-bold fs-1 mb-2 text-dark" style={{ letterSpacing: '-1px' }}>Alex Rivera</h1>
                     <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-4 text-muted fw-medium small">
                         <span className="d-flex align-items-center justify-content-center justify-content-md-start"><FiMapPin className="text-rust me-2" size={16}/> New York, NY</span>
                         <span className="d-flex align-items-center justify-content-center justify-content-md-start"><FiCalendar className="text-rust me-2" size={16}/> Member since Oct 2022</span>
                     </div>
                 </div>
             </div>
             
             <div className="mt-4 mt-md-0 z-1">
                 <button className="btn btn-rust text-white rounded-pill px-4 py-2 fw-bold shadow-sm">Edit Profile</button>
             </div>
         </div>

         {/* 2-Column Split Layout */}
         <div className="row g-5">
            {/* Left Column */}
            <div className="col-12 col-xl-8">
                
                {/* Booking History */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-end mb-4 px-1">
                        <h3 className="fw-bold mb-0">Booking History</h3>
                        <Link href="/bookings" className="text-rust fw-bold text-uppercase letter-spaced small cursor-pointer text-decoration-none" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>VIEW ALL</Link>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {/* Upcoming Component */}
                        <div className="bg-white rounded-4 p-4 shadow-sm border position-relative d-flex align-items-center cursor-pointer" style={{ borderLeft: '4px solid var(--accent-rust)!important' }}>
                           <div className="position-absolute top-0 bottom-0 start-0 bg-rust rounded-start" style={{ width: '4px' }}></div>
                           <div className="rounded-3 overflow-hidden shadow-sm flex-shrink-0 me-4" style={{ width: '80px', height: '80px' }}>
                               <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Luxe Haven Salon" className="w-100 h-100 object-fit-cover" />
                           </div>
                           <div className="flex-grow-1">
                               <h5 className="fw-bold mb-1">Luxe Haven Salon</h5>
                               <div className="text-muted small mb-1">Balayage & Styling</div>
                               <div className="text-rust fw-bold small" style={{ fontSize: '0.75rem' }}>Tomorrow at 10:30 AM</div>
                           </div>
                           <div className="d-none d-sm-block">
                               <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold text-uppercase shadow-none border-0" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>UPCOMING</div>
                           </div>
                        </div>

                        {/* Completed Component */}
                        <div className="bg-white rounded-4 p-4 shadow-sm border border-opacity-10 d-flex align-items-center cursor-pointer">
                           <div className="rounded-3 overflow-hidden flex-shrink-0 me-4 bg-secondary" style={{ width: '80px', height: '80px' }}>
                               <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Velvet Rose Beauty" className="w-100 h-100 object-fit-cover grayscale" style={{ filter: 'grayscale(30%)' }} />
                           </div>
                           <div className="flex-grow-1">
                               <h5 className="fw-bold mb-1">Velvet Rose Beauty</h5>
                               <div className="text-muted small mb-1">HydraFacial</div>
                               <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Dec 12, 2023</div>
                           </div>
                           <div className="d-none d-sm-flex align-items-center">
                               <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                                   <div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{ width: '12px', height: '12px' }}><FiCheck size={8} className="text-white" /></div> COMPLETED
                               </div>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Saved Salons */}
                <div>
                     <div className="d-flex justify-content-between align-items-end mb-4 px-1">
                         <h3 className="fw-bold mb-0">Saved Salons</h3>
                         <Link href="/favorites" className="text-rust fw-bold text-uppercase letter-spaced small cursor-pointer text-decoration-none" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>VIEW ALL</Link>
                     </div>
                     
                     <div className="row g-4">
                        {/* Salon 1 */}
                        <div className="col-12 col-md-6">
                            <div className="bg-white rounded-4 shadow-sm overflow-hidden border border-opacity-10 h-100 d-flex flex-column pb-3">
                                <div className="position-relative" style={{ height: '220px' }}>
                                    <img src="https://images.unsplash.com/photo-1516975080661-46bca198f26b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Azure Grooming" className="w-100 h-100 object-fit-cover" />
                                    <div className="position-absolute top-0 end-0 p-3">
                                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm cursor-pointer" style={{ width: '36px', height: '36px' }}>
                                            <FaHeart className="text-rust" size={16} />
                                        </div>
                                    </div>
                                    <div className="position-absolute bottom-0 start-0 p-3">
                                        <div className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>FEATURED</div>
                                    </div>
                                </div>
                                <div className="p-4 d-flex justify-content-between align-items-center flex-grow-1">
                                    <div>
                                        <h5 className="fw-bold mb-1">Azure Grooming</h5>
                                        <div className="text-muted small d-flex align-items-center">
                                            <FaStar className="text-dark me-1" size={12} /> <span className="fw-bold text-dark me-1">4.9</span> (128 reviews)
                                        </div>
                                    </div>
                                    <button className="btn btn-light bg-sand text-rust fw-bold rounded-pill px-4 shadow-sm border-0 small" style={{ fontSize: '0.85rem' }}>Quick Book</button>
                                </div>
                            </div>
                        </div>

                        {/* Salon 2 */}
                        <div className="col-12 col-md-6">
                            <div className="bg-white rounded-4 shadow-sm overflow-hidden border border-opacity-10 h-100 d-flex flex-column pb-3">
                                <div className="position-relative bg-dark" style={{ height: '220px' }}>
                                    <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="The Gloss Bar" className="w-100 h-100 object-fit-cover opacity-75" />
                                    <div className="position-absolute top-0 end-0 p-3">
                                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm cursor-pointer" style={{ width: '36px', height: '36px' }}>
                                            <FaHeart className="text-rust" size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 d-flex justify-content-between align-items-center flex-grow-1">
                                    <div>
                                        <h5 className="fw-bold mb-1">The Gloss Bar</h5>
                                        <div className="text-muted small d-flex align-items-center">
                                            <FaStar className="text-dark me-1" size={12} /> <span className="fw-bold text-dark me-1">4.7</span> (84 reviews)
                                        </div>
                                    </div>
                                    <button className="btn btn-light bg-sand text-rust fw-bold rounded-pill px-4 shadow-sm border-0 small" style={{ fontSize: '0.85rem' }}>Quick Book</button>
                                </div>
                            </div>
                        </div>

                     </div>
                </div>

            </div>

            {/* Right Column: Settings & Reviews */}
            <div className="col-12 col-xl-4">
                
                {/* Account Settings Tab list */}
                <div className="rounded-4 p-4 p-md-5 mb-5 shadow-sm border border-secondary border-opacity-10" style={{ backgroundColor: '#EBE7DF' }}>
                    <h4 className="fw-bold mb-4">Account Settings</h4>
                    <div className="d-flex flex-column gap-1">
                        
                        <div className="d-flex align-items-center justify-content-between py-3 cursor-pointer border-bottom border-secondary border-opacity-10">
                            <div className="d-flex align-items-center gap-3 text-dark fw-medium">
                                <FiUser className="text-rust opacity-75" size={18} />
                                Edit Profile
                            </div>
                            <FiChevronRight className="text-muted" />
                        </div>

                        <div className="d-flex align-items-center justify-content-between py-3 cursor-pointer border-bottom border-secondary border-opacity-10">
                            <div className="d-flex align-items-center gap-3 text-dark fw-medium">
                                <FiCreditCard className="text-rust opacity-75" size={18} />
                                Payment Methods
                            </div>
                            <FiChevronRight className="text-muted" />
                        </div>

                        <div className="d-flex align-items-center justify-content-between py-3 cursor-pointer border-bottom border-secondary border-opacity-10">
                            <div className="d-flex align-items-center gap-3 text-dark fw-medium">
                                <FiBell className="text-rust opacity-75" size={18} />
                                Notifications
                            </div>
                            <FiChevronRight className="text-muted" />
                        </div>

                        <div className="d-flex align-items-center justify-content-between py-3 cursor-pointer border-bottom border-secondary border-opacity-10 mb-2">
                            <div className="d-flex align-items-center gap-3 text-dark fw-medium">
                                <FiShield className="text-rust opacity-75" size={18} />
                                Privacy & Safety
                            </div>
                            <FiChevronRight className="text-muted" />
                        </div>

                        <div className="d-flex align-items-center gap-3 py-3 mt-3 cursor-pointer text-danger fw-bold transition-all">
                            <FiLogOut size={18} /> Sign Out
                        </div>

                    </div>
                </div>

                {/* My Reviews Feed */}
                <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border border-opacity-10">
                    <h4 className="fw-bold mb-4">My Reviews</h4>
                    
                    <div className="d-flex flex-column gap-4">
                        {/* Feed Item */}
                        <div className="border-bottom pb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-bold text-dark small">Luxe Haven Salon</span>
                                <div className="d-flex text-rust" style={{ gap: '2px' }}>
                                    {[1,2,3,4,5].map(star => <FaStar key={star} size={10} style={{ fill: 'var(--accent-rust)' }} />)}
                                </div>
                            </div>
                            <p className="text-muted small fst-italic lh-base">"Absolutely loved my balayage! The attention to detail was incredible. Definitely coming back."</p>
                            <div className="d-flex gap-2">
                                <div className="rounded-2 overflow-hidden bg-secondary" style={{ width: '40px', height: '40px' }}>
                                    <img src="https://images.unsplash.com/photo-1620052230113-176f184715f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Hair" className="w-100 h-100 object-fit-cover"/>
                                </div>
                            </div>
                        </div>

                        {/* Feed Item */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-bold text-dark small">Nail Artistry Hub</span>
                                <div className="d-flex text-rust" style={{ gap: '2px' }}>
                                    {[1,2,3,4,5].map(star => <FaStar key={star} size={10} style={{ fill: 'var(--accent-rust)' }} />)}
                                </div>
                            </div>
                            <p className="text-muted small fst-italic lh-base mb-0">"Fast service and very clean. My gel manicure lasted 3 weeks without chipping."</p>
                        </div>
                    </div>
                </div>

            </div>
         </div>
      </main>

    </div>
  );
}
