'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiBell, FiHeart, FiCheck, FiX, FiMapPin, FiStar, FiCreditCard, FiSmartphone, FiDollarSign, FiShield, FiCalendar, FiShare2, FiList, FiClock, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import Navbar from '@/components/shared/Navbar';
// We will import step components later

// Define Types
export type ServiceType = { id: string; name: string; description: string; duration: number; price: number; type: 'cut' | 'color' | 'treatment'; };
export type ProfessionalType = { id: string; name: string; title: string; image: string; rating: number; };

// Mock Data
export const mockServices: ServiceType[] = [
  { id: 's1', name: 'Signature Precision Cut', description: 'Wash, customized cut, and signature blowout.', duration: 75, price: 125, type: 'cut' },
  { id: 's2', name: 'Dimensional Balayage', description: 'Hand-painted highlights for a sun-kissed, natural look.', duration: 180, price: 350, type: 'color' },
  { id: 's3', name: 'Deep Silk Therapy', description: 'Intensive moisture mask with steamed botanical oils.', duration: 45, price: 75, type: 'treatment' }
];

export const mockProfessionals: ProfessionalType[] = [
  { id: 'p1', name: 'Julianne V.', title: 'Color Specialist', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
  { id: 'p2', name: 'Marcus Thorne', title: 'Precision Cutting', image: 'https://images.unsplash.com/photo-1544168190-79c15427015f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
  { id: 'p3', name: 'Sofia L.', title: 'Extensions & Texture', image: 'https://images.unsplash.com/photo-1620052230113-176f184715f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: 4.9 }
];

export default function BookingWizard() {
  const params = useParams();
  const salonId = params?.id || '1'; // Safety fallback
  
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('s1');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('p1');
  
  // Date & Time specific state
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-24'); // Defaulting to Oct 24
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('2:30 PM'); // Defaulting to 2:30 PM like mockup
  
  // Payment specific state
  const [paymentMethod, setPaymentMethod] = useState<'saved_card' | 'mobile_money' | 'pay_at_salon'>('saved_card');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const selectedService = mockServices.find(s => s.id === selectedServiceId) || mockServices[0];
  const selectedProfessional = mockProfessionals.find(p => p.id === selectedProfessionalId) || mockProfessionals[0];

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    else {
      console.log('Finished');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#FDFBF7' }}> {/* var(--bg-sand) equivalent */}
      
      {currentStep < 4 ? (
        <>
      {/* Main Content Area */}
      <main className="container-fluid flex-grow-1 px-4 px-xl-5 pt-2 pb-5">
         
         {/* Stepper Node */}
         <div className="d-flex justify-content-center align-items-center my-4 pb-3">
             {/* Step 1 */}
             <div className="d-flex flex-column align-items-center" style={{ width: '80px' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm ${currentStep >= 1 ? (currentStep > 1 ? 'bg-success' : 'bg-rust') : 'bg-secondary bg-opacity-25'}`} style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}>
                    {currentStep > 1 ? <FiCheck /> : "1"}
                </div>
                <span className={`small mt-2 fw-bold text-uppercase ${currentStep >= 1 ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Service</span>
             </div>

             <div className={`flex-grow-1 border-top border-2 mx-3 ${currentStep >= 2 ? 'border-rust' : 'border-secondary border-opacity-10'}`} style={{ maxWidth: '100px', transition: 'border-color 0.3s ease' }}></div>

             {/* Step 2 */}
             <div className="d-flex flex-column align-items-center" style={{ width: '80px' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${currentStep >= 2 ? (currentStep > 2 ? 'bg-success text-white' : 'bg-rust text-white') : 'bg-secondary bg-opacity-10 text-muted'}`} style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}>
                    {currentStep > 2 ? <FiCheck /> : "2"}
                </div>
                <span className={`small mt-2 fw-bold text-uppercase ${currentStep >= 2 ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Time</span>
             </div>

             <div className={`flex-grow-1 border-top border-2 mx-3 ${currentStep >= 3 ? 'border-rust' : 'border-secondary border-opacity-10'}`} style={{ maxWidth: '100px', transition: 'border-color 0.3s ease' }}></div>

             {/* Step 3 */}
             <div className="d-flex flex-column align-items-center" style={{ width: '80px' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${currentStep === 3 ? 'bg-rust text-white' : 'bg-secondary bg-opacity-10 text-muted'}`} style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}>
                    3
                </div>
                <span className={`small mt-2 fw-bold text-uppercase ${currentStep === 3 ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Confirm</span>
             </div>
         </div>

         {/* 2-Column Split */}
         <div className="row g-5 justify-content-center mt-2">
            
            {/* Left Content Column */}
            <div className="col-12 col-lg-7 col-xl-6">
                        {currentStep === 1 && (
                            <div className="mb-4">
                                <Link href={`/salons/${salonId}`} className="text-rust fw-bold text-decoration-none d-inline-flex align-items-center small mb-2 hover-rust">
                                    <FiArrowLeft className="me-2" /> Back to Salon
                                </Link>
                                <p className="text-muted fs-5 mb-5 pe-4">Curating your perfect look. Select the treatments and the artist you wish to guide your transformation.</p>
                            </div>
                        )}

                        {currentStep === 1 && (
                          <>
                        <div className="d-flex justify-content-between align-items-end border-bottom border-dark border-opacity-10 pb-3 mb-4">
                            <h3 className="fw-bold fs-4 mb-0">Select Services</h3>
                            <span className="text-rust fw-bold text-uppercase letter-spaced" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>View Menu</span>
                        </div>

                        <div className="d-flex flex-column gap-3 mb-5">
                            {mockServices.map(service => (
                                <div 
                                    key={service.id}
                                    className={`d-flex align-items-center p-3 p-md-4 bg-white rounded-4 border shadow-sm transition-all cursor-pointer ${selectedServiceId === service.id ? 'border-rust shadow' : 'border-transparent'}`}
                                    onClick={() => setSelectedServiceId(service.id)}
                                >
                                    {/* Placeholder Service Image styling */}
                                    <div className="rounded-3 overflow-hidden bg-light me-4 flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                                        <div className="w-100 h-100 bg-secondary bg-opacity-10"></div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold fs-5 mb-1">{service.name}</div>
                                        <div className="text-muted small mb-2">{service.description}</div>
                                        <div className="fw-bold text-dark d-flex gap-2 small">
                                            <span>{service.duration} min</span>
                                            <span className={service.id === 's2' ? 'text-rust' : ''}>${service.price}{service.id === 's2' ? '+' : ''}</span>
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center border border-2 ${selectedServiceId === service.id ? 'bg-rust border-rust text-white' : 'border-secondary bg-light bg-opacity-25 text-muted'}`} style={{ width: '28px', height: '28px' }}>
                                            {selectedServiceId === service.id ? <FiCheck size={16} /> : <span style={{ fontSize: '1.2rem', lineHeight: '1rem', paddingBottom: '2px' }}>+</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-between align-items-end border-bottom border-dark border-opacity-10 pb-3 mb-4 mt-5">
                            <h3 className="fw-bold fs-4 mb-0">Choose Your Professional</h3>
                            <span className="text-muted small">Optional</span>
                        </div>

                        <div className="row g-3 g-md-4">
                            {mockProfessionals.map(pro => (
                                <div className="col-12 col-sm-4 text-center cursor-pointer" key={pro.id} onClick={() => setSelectedProfessionalId(pro.id)}>
                                    <div className="position-relative d-inline-block w-100 mb-3">
                                        <img 
                                            src={pro.image} 
                                            alt={pro.name} 
                                            className={`img-fluid rounded-4 transition-all w-100 object-fit-cover shadow-sm ${selectedProfessionalId === pro.id ? 'border border-2 border-rust' : ''}`}
                                            style={{ filter: selectedProfessionalId === pro.id ? 'none' : 'grayscale(100%) opacity(70%)', height: '250px' }}
                                        />
                                        {selectedProfessionalId === pro.id && (
                                            <div className="position-absolute bg-rust text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ top: '-10px', right: '-10px', width: '25px', height: '25px', border: '3px solid white' }}>
                                                <FiCheck size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="fw-bold text-dark">{pro.name}</div>
                                    <div className="text-muted small">{pro.title}</div>
                                </div>
                            ))}
                        </div>
                          </>
                        )}
                
                {/* Steps 2 & 3 Placeholders based on progress */}
                {currentStep === 2 && (
                    <div>
                        <h1 className="fw-bold mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>When shall we see you?</h1>
                         <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-5 border border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-5">
                               <h4 className="fw-bold mb-0 fs-3">October 2024</h4>
                               <div className="d-flex gap-3">
                                  <button className="btn rounded-circle d-flex align-items-center justify-content-center bg-sand border-0 shadow-none" style={{ width: '45px', height: '45px' }}><FiArrowLeft size={18}/></button>
                                  <button className="btn rounded-circle d-flex align-items-center justify-content-center bg-sand border-0 shadow-none" style={{ width: '45px', height: '45px' }}><FiArrowLeft size={18} style={{ transform: 'rotate(180deg)' }}/></button>
                               </div>
                            </div>
                            
                            <div className="d-flex justify-content-between mb-4">
                               {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                   <div key={day} className="text-center text-muted fw-bold" style={{ width: '14.28%', fontSize: '0.65rem', letterSpacing: '1px' }}>{day}</div>
                               ))}
                            </div>
                            
                            <div className="d-flex flex-wrap justify-content-between mb-2">
                                {/* Row 1 */}
                                {[{d: 29, m: true}, {d: 30, m: true}, {d: 1, m: false}, {d: 2, m: false}, {d: 3, m: false}, {d: 4, m: false, selected: true}, {d: 5, m: false}].map((day, idx) => (
                                   <div key={idx} className="text-center d-flex align-items-center justify-content-center mb-4 cursor-pointer" style={{ width: '14.28%' }}>
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-medium ${day.selected ? 'bg-rust text-white shadow' : (day.m ? 'text-muted opacity-50' : 'text-dark')}`} style={{ width: '45px', height: '45px', fontSize: '1.1rem' }}>
                                            {day.d}
                                        </div>
                                   </div>
                                ))}
                                {/* Row 2 */}
                                {[{d: 6, m: false}, {d: 7, m: false}, {d: 8, m: false}, {d: 9, m: false}, {d: 10, m: false}, {d: 11, m: false}, {d: 12, m: false}].map((day, idx) => (
                                   <div key={'r2'+idx} className="text-center d-flex align-items-center justify-content-center cursor-pointer" style={{ width: '14.28%' }}>
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-medium text-dark`} style={{ width: '45px', height: '45px', fontSize: '1.1rem' }}>
                                            {day.d}
                                        </div>
                                   </div>
                                ))}
                            </div>
                        </div>

                        <h3 className="fw-bold fs-4 mb-4 d-flex align-items-center"><span className="bg-rust text-white rounded-circle d-inline-flex justify-content-center align-items-center me-2 overflow-hidden" style={{ width: '20px', height: '20px' }}></span> Available Time Slots</h3>
                        
                        {['MORNING', 'AFTERNOON', 'EVENING'].map(timeOfDay => (
                            <div key={timeOfDay} className="mb-4">
                                <label className="text-muted small fw-bold mb-3 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>{timeOfDay}</label>
                                <div className="row g-3">
                                    {[1,2,3,4].map(idx => (
                                        <div className="col-6 col-sm-4 col-md-3" key={idx}>
                                            <button className="btn btn-white bg-white border shadow-sm w-100 py-3 fw-bold text-dark rounded-3">10:00 AM</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {currentStep === 3 && (
                    <div>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <h1 className="fw-bold mb-0" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Payment Method</h1>
                            <div className="flex-grow-1 border-bottom border-rust border-2 ms-2" style={{ maxWidth: '60px' }}></div>
                        </div>

                        <div className="bg-white rounded-4 shadow-sm p-2 mb-4 mt-4">
                             <div className="d-flex align-items-center p-4 border-bottom cursor-pointer" onClick={() => setPaymentMethod('saved_card')}>
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '45px', height: '45px' }}><FiCreditCard size={20} className="text-dark" /></div>
                                <div className="flex-grow-1">
                                    <div className="fw-bold fs-5">Saved Card</div>
                                    <div className="text-muted small">Visa •••• 4242</div>
                                </div>
                                <div className={`rounded-circle border border-2 d-flex align-items-center justify-content-center ${paymentMethod === 'saved_card' ? 'border-rust' : 'border-secondary bg-opacity-25'}`} style={{ width: '25px', height: '25px' }}>
                                    {paymentMethod === 'saved_card' && <div className="bg-rust rounded-circle" style={{ width: '13px', height: '13px' }}></div>}
                                </div>
                             </div>

                             <div className="d-flex align-items-center p-4 border-bottom cursor-pointer" onClick={() => setPaymentMethod('mobile_money')}>
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '45px', height: '45px' }}><FiSmartphone size={20} className="text-dark" /></div>
                                <div className="flex-grow-1">
                                    <div className="fw-bold fs-5">Mobile Money</div>
                                    <div className="text-muted small">Pay using your mobile wallet</div>
                                </div>
                                <div className={`rounded-circle border border-2 d-flex align-items-center justify-content-center ${paymentMethod === 'mobile_money' ? 'border-rust' : 'border-secondary bg-opacity-25'}`} style={{ width: '25px', height: '25px' }}>
                                    {paymentMethod === 'mobile_money' && <div className="bg-rust rounded-circle" style={{ width: '13px', height: '13px' }}></div>}
                                </div>
                             </div>

                             <div className="d-flex align-items-center p-4 cursor-pointer" onClick={() => setPaymentMethod('pay_at_salon')}>
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '45px', height: '45px' }}><FiDollarSign size={20} className="text-dark" /></div>
                                <div className="flex-grow-1">
                                    <div className="fw-bold fs-5">Pay at Salon</div>
                                    <div className="text-muted small">Secure your slot and pay after service</div>
                                </div>
                                <div className={`rounded-circle border border-2 d-flex align-items-center justify-content-center ${paymentMethod === 'pay_at_salon' ? 'border-rust' : 'border-secondary bg-opacity-25'}`} style={{ width: '25px', height: '25px' }}>
                                    {paymentMethod === 'pay_at_salon' && <div className="bg-rust rounded-circle" style={{ width: '13px', height: '13px' }}></div>}
                                </div>
                             </div>
                        </div>

                        <div className="form-check d-flex align-items-start mt-4 mb-5 pt-3 pe-md-5">
                            <input 
                                className="form-check-input flex-shrink-0 mt-1 me-3 shadow-none border-secondary" 
                                type="checkbox" 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <label className="form-check-label text-muted lh-base">
                                I agree to the <span className="text-rust fw-bold cursor-pointer">Terms of Service</span> and acknowledge the <span className="text-rust fw-bold cursor-pointer">Cancellation Policy</span>. A 24-hour notice is required for full refunds.
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar - Booking Summary */}
            <div className="col-12 col-lg-5 col-xl-4 position-relative">
                <div className="position-sticky bg-white rounded-4 shadow-sm border border-secondary border-opacity-10 overflow-hidden" style={{ top: '100px' }}>
                    
                    {currentStep === 3 && (
                        <div className="w-100" style={{ height: '180px' }}>
                            <div className="w-100 h-100 bg-dark position-relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                               <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>
                               <div className="position-absolute bottom-0 start-0 p-4 w-100">
                                   <div className="fw-bold text-white fs-4 mb-1" style={{ letterSpacing: '-0.5px' }}>Velvet & Vine Artistry</div>
                                   <div className="text-white small d-flex align-items-center opacity-75"><FiMapPin className="me-1" size={12}/> Beverly Hills, CA 90210</div>
                               </div>
                            </div>
                        </div>
                    )}

                    <div className="p-4 p-md-5">
                        {currentStep < 3 && <h3 className="fw-bold fs-4 mb-4">Booking Summary</h3>}

                        {/* Step 3 Only: Your Selection Bubble */}
                        {currentStep === 3 && (
                            <div className="mb-4">
                                <div className="text-muted small fw-bold mb-3" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>YOUR SELECTION</div>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <img src={selectedProfessional.image} alt="Pro" className="rounded-circle object-fit-cover shadow-sm bg-secondary" style={{ width: '50px', height: '50px' }} />
                                    <div>
                                        <div className="fw-bold text-dark fs-5">{selectedProfessional.name}</div>
                                        <div className="text-muted small d-flex align-items-center gap-1">
                                            {selectedProfessional.title} <FiStar className="text-rust ms-1" style={{ fill: 'var(--accent-rust)' }}/> <span className="text-dark fw-bold">{selectedProfessional.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <div className="text-muted small fw-bold mb-2 uppercase letter-spaced" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>SERVICE</div>
                                <div className="fw-bold fs-5 text-dark" style={{ lineHeight: '1.2' }}>{selectedService.name}</div>
                                <div className="text-muted small mt-1">with {selectedProfessional.name}</div>
                            </div>
                            {currentStep < 3 && <div className="fw-bold text-dark fs-5">${selectedService.price}</div>}
                            {currentStep === 3 && <span className="badge bg-warning bg-opacity-25 text-dark px-2 rounded-2 border border-warning shadow-sm" style={{ backgroundColor: '#FCE7C8!important' }}>{selectedService.duration} min</span>}
                        </div>

                        {currentStep >= 2 && (
                            <div className="row mb-4 border-top pt-4">
                                <div className="col-7">
                                     <div className="text-muted small fw-bold mb-2 uppercase letter-spaced" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>DATE</div>
                                     <div className="fw-bold text-dark fs-6" style={{ letterSpacing: '-0.5px' }}>{currentStep === 3 ? 'Oct 24, 2023' : selectedDate}</div>
                                </div>
                                <div className="col-5 border-start">
                                     <div className="text-muted small fw-bold mb-2 ps-2 uppercase letter-spaced" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>TIME</div>
                                     <div className="fw-bold text-dark fs-6 ps-2" style={{ letterSpacing: '-0.5px' }}>{selectedTimeSlot}</div>
                                </div>
                            </div>
                        )}

                        {currentStep < 3 && (
                            <div className="d-flex justify-content-between align-items-center py-3 border-top border-bottom border-dark border-opacity-10">
                                <span className="text-muted small">Estimated Time</span>
                                <span className="fw-bold text-dark">{Math.floor(selectedService.duration / 60)}h {selectedService.duration % 60}m</span>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="border-top pt-4 mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-muted">${selectedService.price.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Service Fee & Tax</span>
                                    <span className="text-muted">$18.45</span>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between align-items-end mt-4 mb-4">
                            <div>
                               {currentStep === 3 && <div className="text-muted small fw-bold mb-2 uppercase letter-spaced text-start" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>TOTAL PRICE</div>}
                               <h3 className={`fw-bold mb-0 ${currentStep === 3 ? 'text-dark display-6' : 'text-dark'}`}>{currentStep === 3 ? 'Total' : 'Total'}</h3>
                            </div>
                            <div className="text-end">
                                <h3 className={`fw-bold mb-0 ${currentStep === 3 ? 'text-rust display-6' : 'text-rust'}`} style={{ letterSpacing: '-1px' }}>
                                   ${(selectedService.price + (currentStep === 3 ? 18.45 : 0)).toFixed(2)}
                                </h3>
                                {currentStep === 3 && <div className="text-muted fst-italic" style={{ fontSize: '0.65rem' }}>+ Taxes & Fees at salon</div>}
                            </div>
                        </div>

                        {currentStep < 3 ? (
                            <button className="btn btn-rust w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm" onClick={handleNextStep}>
                                Continue to {currentStep === 1 ? 'Time' : 'Confirmation'}
                            </button>
                        ) : (
                            <button className="btn btn-rust w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm d-flex justify-content-center align-items-center" onClick={handleNextStep} disabled={!agreedToTerms}>
                                Confirm & Book <FiArrowLeft className="ms-2" style={{ transform: 'rotate(180deg)' }} />
                            </button>
                        )}
                        
                        {currentStep < 3 && <div className="text-center text-muted fst-italic mt-3" style={{ fontSize: '0.7rem' }}>Tax and tip added at the salon</div>}

                    </div>
                </div>

                {/* Optional Warning Banner under summary */}
                {currentStep === 2 && (
                    <div className="bg-warning bg-opacity-25 p-4 rounded-4 mt-4 d-flex align-items-start gap-3 border shadow-sm border-warning" style={{ backgroundColor: '#FDF2E3!important' }}>
                        <div className="bg-dark rounded-circle text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '22px', height: '22px', fontSize: '0.75rem', fontWeight: 'bold' }}>i</div>
                        <div className="text-dark small lh-base fw-medium">Arrive 10 minutes early to enjoy a complementary welcome glass of Aura Champagne.</div>
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="border border-opacity-10 p-4 rounded-4 mt-4 d-flex align-items-center gap-3">
                        <div className="text-dark"><FiShield size={20} /></div>
                        <div className="text-muted small lh-base">Your payment information is encrypted and securely processed. We never store your full card details.</div>
                    </div>
                )}
            </div>

         </div>

         {/* Bottom Action Bar for smaller screens could go here, but omitted since layout relies on responsive flex/grid */}
        </main>
       </>
      ) : (
        <>
          <main className="container pb-5 pt-3 pt-md-4" style={{ maxWidth: '1000px' }}>
             {/* Row 1: Header + Image */}
             <div className="row g-5 align-items-center mb-5">
                <div className="col-12 col-md-6 order-2 order-md-1">
                   <div className="bg-rust rounded-circle d-flex align-items-center justify-content-center text-white mb-4 shadow" style={{ width: '60px', height: '60px' }}>
                      <FiCheck size={30} strokeWidth={3} />
                   </div>
                   <h1 className="display-4 fw-bold text-dark mb-3" style={{ letterSpacing: '-2px', lineHeight: '1.1' }}>Booking<br/>Confirmed</h1>
                   <p className="fs-5 text-muted mb-0">We've reserved your spot at <span className="text-rust fw-bold">The Gilded Mane</span>.</p>
                </div>
                <div className="col-12 col-md-6 order-1 order-md-2">
                   <div className="rounded-5 overflow-hidden shadow-sm position-relative" style={{ height: '320px' }}>
                       <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Salon" className="w-100 h-100 object-fit-cover" />
                       <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                           <div className="text-white small fw-medium d-flex align-items-center"><FiMapPin className="me-2 text-white outline-dark"/> 1242 Artisan Row, Suite 400, New York, NY</div>
                       </div>
                   </div>
                </div>
             </div>

             {/* Row 2: Cards */}
             <div className="row g-4 mb-4">
                <div className="col-12 col-md-7">
                    <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm h-100 border border-opacity-10">
                        <div className="text-rust fw-bold small mb-3 letter-spaced text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>SERVICE DETAILS</div>
                        <h3 className="fw-bold fs-3 mb-3">{selectedService.name}</h3>
                        <p className="text-muted small lh-base mb-5 pe-md-4">{selectedService.description} Includes standard styling with {selectedProfessional.name}.</p>
                        
                        <div className="d-flex align-items-center">
                            <img src={selectedProfessional.image} alt={selectedProfessional.name} className="rounded-circle me-3 border shadow-sm object-fit-cover" style={{ width: '50px', height: '50px' }} />
                            <div className="me-5">
                                <div className="text-muted text-uppercase fw-bold mb-1 letter-spaced" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>STYLIST</div>
                                <div className="fw-bold">{selectedProfessional.name}</div>
                            </div>
                            <div>
                                <div className="text-muted text-uppercase fw-bold mb-1 letter-spaced" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>DURATION</div>
                                <div className="fw-bold">{selectedService.duration} Minutes</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-5">
                    <div className="bg-rust rounded-4 p-4 p-md-5 shadow-lg h-100 text-white d-flex flex-column align-items-center justify-content-center border-0 text-center position-relative overflow-hidden" style={{ backgroundColor: '#A2451C' }}>
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-10"></div>
                        <FiCalendar size={36} className="mb-4 opacity-75 z-1" />
                        <div className="fw-medium mb-2 fs-5 opacity-75 z-1">{selectedDate === '2024-10-24' ? 'Friday, Oct 24' : selectedDate}</div>
                        <h2 className="fw-bold display-5 mb-4 z-1" style={{ letterSpacing: '-1px' }}>{selectedTimeSlot}</h2>
                        <div className="bg-white bg-opacity-25 rounded-pill px-4 py-2 border border-white border-opacity-25 fw-bold text-uppercase small letter-spaced z-1 shadow-sm" style={{ letterSpacing: '2px', fontSize: '0.75rem' }}>CONFIRMED</div>
                    </div>
                </div>
             </div>

             {/* Row 3: Admin & Warning */}
             <div className="row g-4 mb-5">
                <div className="col-12 col-md-5 d-flex flex-column">
                    <h5 className="fw-bold mb-4 ms-1 pt-3">Manage Appointment</h5>
                    <div className="d-flex flex-column gap-3 flex-grow-1">
                        <button className="btn btn-light bg-white rounded-pill px-4 py-3 d-flex justify-content-between align-items-center shadow-sm w-100 border-0">
                            <span className="d-flex align-items-center fw-bold text-dark"><FiCalendar className="text-rust me-3" size={18} /> Add to Calendar</span>
                            <FiChevronRight className="text-muted" />
                        </button>
                        <button className="btn btn-light bg-white rounded-pill px-4 py-3 d-flex justify-content-between align-items-center shadow-sm w-100 border-0">
                            <span className="d-flex align-items-center fw-bold text-dark"><FiShare2 className="text-rust me-3" size={18} /> Share Appointment</span>
                            <FiChevronRight className="text-muted" />
                        </button>
                        <Link href="/bookings" className="btn btn-light bg-white rounded-pill px-4 py-3 d-flex justify-content-between align-items-center shadow-sm w-100 border-0 text-decoration-none transition-all hover-scale">
                            <span className="d-flex align-items-center fw-bold text-dark"><FiList className="text-rust me-3" size={18} /> View My Bookings</span>
                            <FiChevronRight className="text-muted" />
                        </Link>
                    </div>
                </div>
                <div className="col-12 col-md-7 pt-3">
                    <div className="rounded-4 p-4 p-md-5 h-100 border-0" style={{ backgroundColor: '#F6F3EC' }}>
                        <h5 className="fw-bold mb-4">What to expect</h5>
                        
                        <div className="d-flex mb-4">
                            <FiClock className="text-rust flex-shrink-0 mt-1 me-3" size={20} />
                            <div>
                                <div className="fw-bold mb-1 text-dark text-decoration-none">Arrival Time</div>
                                <div className="text-muted small lh-base">Please arrive 10 minutes early to enjoy our curated selection of refreshments and settle in.</div>
                            </div>
                        </div>

                        <div className="d-flex mb-4">
                            <FiAlertCircle className="text-rust flex-shrink-0 mt-1 me-3" size={20} />
                            <div>
                                <div className="fw-bold mb-1 text-dark">Cancellation Policy</div>
                                <div className="text-muted small lh-base">Cancellations must be made 24 hours prior to your visit. Late cancellations may incur a 50% fee.</div>
                            </div>
                        </div>

                        <div className="d-flex">
                            <span className="text-rust mt-1 me-3 flex-shrink-0">🚙</span> 
                            <div>
                                <div className="fw-bold mb-1 text-dark">Parking & Access</div>
                                <div className="text-muted small lh-base">Complimentary valet parking is available at the Artisan Row main entrance.</div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             <div className="text-center pb-5 pt-3">
                 <Link href="/salons" className="btn btn-rust text-white rounded-pill px-5 py-3 fw-bold shadow">Explore More Salons</Link>
             </div>
          </main>
       </>
      )}
    </div>
  );
}
