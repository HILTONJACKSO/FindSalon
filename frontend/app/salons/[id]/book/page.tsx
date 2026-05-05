'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiBell, FiHeart, FiCheck, FiX, FiMapPin, FiStar, FiCreditCard, FiSmartphone, FiDollarSign, FiShield, FiCalendar, FiShare2, FiList, FiClock, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import Navbar from '@/components/shared/Navbar';
import { api } from '@/lib/api';

// Define Types
export type ServiceType = { id: string; name: string; description: string; duration: number; price: number; type?: string; };
export type ProfessionalType = { id: string; name: string; title: string; image: string; rating: number; };

export default function BookingWizard() {
  const params = useParams();
  const salonId = params?.id;
  
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalType[]>([]);
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  
  // Date & Time specific state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Payment specific state
  const [paymentMethod, setPaymentMethod] = useState<'saved_card' | 'mobile_money' | 'pay_at_salon'>('pay_at_salon');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  useEffect(() => {
    if (!salonId) return;

    const fetchData = async () => {
      try {
        const [salonRes, servicesRes, staffRes] = await Promise.all([
          api.get(`/salons/${salonId}/`),
          api.get(`/services/?salon=${salonId}`),
          api.get(`/staff/?salon=${salonId}`)
        ]);

        setSalon(salonRes.data);
        const fetchedServices = servicesRes.data.results || servicesRes.data;
        setServices(fetchedServices);
        if (fetchedServices.length > 0) setSelectedServiceId(fetchedServices[0].id);

        const fetchedStaff = (staffRes.data.results || staffRes.data).map((s: any) => ({
          id: s.id,
          name: s.user_name || s.name,
          title: s.role || 'Stylist',
          image: s.user_avatar || s.avatar || null,
          rating: 5.0
        }));
        setProfessionals(fetchedStaff);
        if (fetchedStaff.length > 0) setSelectedProfessionalId(fetchedStaff[0].id);

      } catch (err) {
        console.error("Failed to fetch booking data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [salonId]);

  const selectedService = services.find(s => String(s.id) === String(selectedServiceId));
  const selectedProfessional = professionals.find(p => String(p.id) === String(selectedProfessionalId));

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-rust" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#FDFBF7' }}>
      
      {currentStep < 4 ? (
        <>
      <main className="container-fluid flex-grow-1 px-4 px-xl-5 pt-2 pb-5">
         
         <div className="d-flex justify-content-center align-items-center my-4 pb-3">
             <div className="d-flex flex-column align-items-center" style={{ width: '100px' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm transition-all ${currentStep >= 1 ? (currentStep > 1 ? 'bg-success' : 'bg-rust scale-110') : 'bg-secondary bg-opacity-10'}`} style={{ width: '45px', height: '45px' }}>
                    {currentStep > 1 ? <FiCheck size={20} /> : "01"}
                </div>
                <span className={`small mt-2 fw-bold text-uppercase letter-spaced ${currentStep >= 1 ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>Service</span>
             </div>

             <div className={`flex-grow-1 border-top border-2 mx-2 ${currentStep >= 2 ? 'border-rust' : 'border-secondary border-opacity-10'}`} style={{ maxWidth: '80px', transition: 'border-color 0.5s ease' }}></div>

             <div className="d-flex flex-column align-items-center" style={{ width: '100px' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm transition-all ${currentStep >= 2 ? (currentStep > 2 ? 'bg-success text-white' : 'bg-rust text-white scale-110') : 'bg-secondary bg-opacity-10 text-muted'}`} style={{ width: '45px', height: '45px' }}>
                    {currentStep > 2 ? <FiCheck size={20} /> : "02"}
                </div>
                <span className={`small mt-2 fw-bold text-uppercase letter-spaced ${currentStep >= 2 ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>Schedule</span>
             </div>

             <div className={`flex-grow-1 border-top border-2 mx-2 ${currentStep >= 3 ? 'border-rust' : 'border-secondary border-opacity-10'}`} style={{ maxWidth: '80px', transition: 'border-color 0.5s ease' }}></div>

             <div className="d-flex flex-column align-items-center" style={{ width: '100px' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm transition-all ${currentStep === 3 ? 'bg-rust text-white scale-110' : 'bg-secondary bg-opacity-10 text-muted'}`} style={{ width: '45px', height: '45px' }}>
                    03
                </div>
                <span className={`small mt-2 fw-bold text-uppercase letter-spaced ${currentStep === 3 ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>Review</span>
             </div>
         </div>

         <div className="row g-5 justify-content-center mt-2">
            <div className="col-12 col-lg-7 col-xl-6">
                        {currentStep === 1 && (
                            <div className="mb-4">
                                <Link href={`/salons/${salonId}`} className="text-rust fw-bold text-decoration-none d-inline-flex align-items-center small mb-2 hover-rust">
                                    <FiArrowLeft className="me-2" /> Back to Salon
                                </Link>
                                <p className="text-muted fs-5 mb-5 pe-4">Curating your perfect look. Select the treatments and the artist you wish to guide your transformation.</p>
                                
                                <div className="d-flex justify-content-between align-items-end border-bottom border-dark border-opacity-10 pb-3 mb-4">
                                    <h3 className="fw-bold fs-4 mb-0">Select Service</h3>
                                </div>

                                <div className="d-flex flex-column gap-3 mb-5">
                                    {services.map(service => (
                                        <div 
                                            key={service.id}
                                            className={`d-flex align-items-center p-3 p-md-4 bg-white rounded-5 border-2 shadow-sm transition-all cursor-pointer hover-scale ${selectedServiceId === String(service.id) ? 'border-rust shadow' : 'border-white'}`}
                                            onClick={() => setSelectedServiceId(String(service.id))}
                                        >
                                            <div className="flex-grow-1">
                                                <div className="fw-bold fs-5 mb-1 text-uppercase letter-spaced" style={{ fontSize: '1rem' }}>{service.name}</div>
                                                <div className="text-muted small mb-2" style={{ fontSize: '0.9rem' }}>{service.description}</div>
                                                <div className="fw-bold text-dark d-flex gap-3 small letter-spaced mt-3">
                                                    <span className="bg-sand px-3 py-1 rounded-pill">{service.duration} MIN</span>
                                                    <span className="bg-sand px-3 py-1 rounded-pill">${service.price}</span>
                                                </div>
                                            </div>
                                            <div className="ms-3">
                                                <div className={`rounded-circle d-flex align-items-center justify-content-center border-2 transition-all ${selectedServiceId === String(service.id) ? 'bg-rust border-rust text-white' : 'border-secondary border-opacity-10 bg-light bg-opacity-25 text-muted'}`} style={{ width: '32px', height: '32px' }}>
                                                    {selectedServiceId === String(service.id) ? <FiCheck size={18} /> : <FiChevronRight size={18} />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {services.length === 0 && <p className="text-muted">No services available for this salon.</p>}
                                </div>

                                <div className="d-flex justify-content-between align-items-end border-bottom border-dark border-opacity-10 pb-3 mb-4 mt-5">
                                    <h3 className="fw-bold fs-4 mb-0">Professional</h3>
                                </div>

                                <div className="row g-4">
                                    {professionals.map(pro => (
                                        <div className="col-12 col-md-4 text-center cursor-pointer" key={pro.id} onClick={() => setSelectedProfessionalId(String(pro.id))}>
                                            <div className="position-relative d-inline-block w-100 mb-3 group">
                                                <img 
                                                    src={pro.image || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80'} 
                                                    alt={pro.name} 
                                                    className={`img-fluid rounded-5 transition-all w-100 object-fit-cover shadow-sm ${selectedProfessionalId === String(pro.id) ? 'border-4 border-rust p-1' : 'opacity-75 '}`}
                                                    style={{ height: '200px' }}
                                                />
                                                {selectedProfessionalId === String(pro.id) && (
                                                    <div className="position-absolute bg-rust text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ bottom: '15px', right: '15px', width: '36px', height: '36px', border: '3px solid white' }}>
                                                        <FiCheck size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="fw-bold text-dark text-uppercase letter-spaced" style={{ fontSize: '0.85rem' }}>{pro.name}</div>
                                            <div className="text-muted small fst-italic">{pro.title}</div>
                                        </div>
                                    ))}
                                    {professionals.length === 0 && <p className="text-muted px-3">Assigning the best professional for you.</p>}
                                </div>
                            </div>
                        )}
                
                {currentStep === 2 && (
                    <div>
                        <h1 className="fw-bold mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>When shall we see you?</h1>
                         <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-5 border border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-5">
                               <h4 className="fw-bold mb-0 fs-3">Select Date</h4>
                            </div>
                            
                            <input 
                                type="date" 
                                className="form-control form-control-lg border-0 bg-light rounded-pill px-4" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <h3 className="fw-bold fs-4 mb-4 d-flex align-items-center">Available Time Slots</h3>
                        
                        <div className="row g-3 mb-5">
                            {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
                                <div className="col-6 col-sm-4 col-md-3" key={time}>
                                    <button 
                                        className={`btn w-100 py-3 fw-bold rounded-3 transition-all ${selectedTimeSlot === time ? 'btn-rust text-white shadow' : 'btn-white bg-white border text-dark shadow-sm'}`}
                                        onClick={() => setSelectedTimeSlot(time)}
                                    >
                                        {time}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {currentStep === 3 && (
                    <div>
                        <h1 className="fw-bold mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Payment Method</h1>
                        <div className="bg-white rounded-4 shadow-sm p-2 mb-4 mt-4">
                             <div className="d-flex align-items-center p-4 border-bottom cursor-pointer" onClick={() => setPaymentMethod('pay_at_salon')}>
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
                            />
                            <label className="form-check-label text-muted lh-base">
                                I agree to the Terms of Service and acknowledge the Cancellation Policy.
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div className="col-12 col-lg-5 col-xl-4">
                <div className="position-sticky bg-white rounded-4 shadow-sm border border-secondary border-opacity-10 overflow-hidden" style={{ top: '100px' }}>
                    <div className="p-4 p-md-5">
                        <h3 className="fw-bold fs-4 mb-4">Booking Summary</h3>

                        <div className="mb-4">
                            <div className="text-muted small fw-bold mb-2 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>SALON</div>
                            <div className="fw-bold fs-5 text-dark">{salon?.name || 'Salon'}</div>
                        </div>

                        <div className="mb-4">
                            <div className="text-muted small fw-bold mb-2 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>SERVICE</div>
                            <div className="fw-bold text-dark">{selectedService?.name || 'None selected'}</div>
                            <div className="text-muted small mt-1">{selectedService?.duration} min</div>
                        </div>

                        {selectedProfessional && (
                            <div className="mb-4">
                                <div className="text-muted small fw-bold mb-2 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>PROFESSIONAL</div>
                                <div className="fw-bold text-dark">{selectedProfessional.name}</div>
                            </div>
                        )}

                        {(selectedDate || selectedTimeSlot) && (
                            <div className="row mb-4 border-top pt-4">
                                <div className="col-6">
                                     <div className="text-muted small fw-bold mb-2 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>DATE</div>
                                     <div className="fw-bold text-dark">{selectedDate}</div>
                                </div>
                                <div className="col-6 border-start">
                                     <div className="text-muted small fw-bold mb-2 ps-2 text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>TIME</div>
                                     <div className="fw-bold text-dark ps-2">{selectedTimeSlot || '--:--'}</div>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-between align-items-end mt-4 mb-4 border-top pt-4">
                            <h3 className="fw-bold mb-0">Total</h3>
                            <h3 className="fw-bold mb-0 text-rust">${selectedService?.price || 0}</h3>
                        </div>

                        <button 
                            className="btn btn-rust w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm" 
                            onClick={handleNextStep}
                            disabled={currentStep === 3 && !agreedToTerms || !selectedServiceId || (currentStep === 2 && !selectedTimeSlot)}
                        >
                            {currentStep === 3 ? 'Confirm Booking' : 'Continue'}
                        </button>
                        
                        {currentStep > 1 && (
                            <button className="btn btn-link w-100 text-muted mt-2 text-decoration-none" onClick={handlePrevStep}>Back</button>
                        )}
                    </div>
                </div>
            </div>
         </div>
        </main>
        </>
      ) : (
        <main className="container py-5 text-center" style={{ maxWidth: '600px' }}>
           <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" style={{ width: '80px', height: '80px' }}>
              <FiCheck size={40} strokeWidth={3} />
           </div>
           <h1 className="display-4 fw-bold mb-3">Booking Confirmed!</h1>
           <p className="fs-5 text-muted mb-5">Your appointment at <span className="text-rust fw-bold">{salon?.name}</span> is all set.</p>
           
           <div className="bg-white rounded-4 p-4 shadow-sm border mb-5 text-start">
               <div className="d-flex justify-content-between mb-3">
                   <span className="text-muted">Date \u0026 Time</span>
                   <span className="fw-bold">{selectedDate} at {selectedTimeSlot}</span>
               </div>
               <div className="d-flex justify-content-between mb-3">
                   <span className="text-muted">Service</span>
                   <span className="fw-bold">{selectedService?.name}</span>
               </div>
               <div className="d-flex justify-content-between">
                   <span className="text-muted">Professional</span>
                   <span className="fw-bold">{selectedProfessional?.name}</span>
               </div>
           </div>

           <Link href="/bookings" className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-sm">View My Bookings</Link>
        </main>
      )}

      <style jsx>{`
        .text-rust { color: #9C4A34; }
        .btn-rust { background-color: #9C4A34; color: white; }
        .btn-rust:hover { background-color: #823d2b; color: white; }
        .bg-rust { background-color: #9C4A34; }
        .bg-sand { background-color: #FDFBF7; }
        .letter-spaced { letter-spacing: 1px; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
}
