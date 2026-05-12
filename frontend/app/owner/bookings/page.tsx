'use client';

import React from 'react';
import { 
    FiCalendar, 
    FiBell, 
    FiCheck, 
    FiX, 
    FiChevronLeft, 
    FiChevronRight, 
    FiSearch, 
    FiDownload, 
    FiPlus,
    FiFileText,
    FiLoader
} from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import OwnerHeader from '@/components/owner/OwnerHeader';
import { useAuthStore } from '@/store/authStore';
import { 
    format, 
    isToday, 
    parseISO, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from 'date-fns';

export default function BookingsManagementPage() {
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [staff, setStaff] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<number | null>(null);
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);
  const [selectedStylist, setSelectedStylist] = React.useState('All Stylists');

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/');
      setBookings(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff/');
      setStaff(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  React.useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchStaff()]);
      setLoading(false);
    };
    initFetch();
    const interval = setInterval(fetchBookings, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: number, action: 'accept' | 'reject' | 'complete') => {
    setActionLoading(id);
    try {
      await api.post(`/bookings/${id}/${action}/`);
      await fetchBookings(); // Refresh data
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  // KPI Calculations
  const todayBookings = bookings.filter(b => isToday(parseISO(b.date)));
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const confirmedBookingsCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookingsCount = pendingBookings.length;
  const completedBookingsCount = bookings.filter(b => b.status === 'COMPLETED').length;

  const kpis = [
    { label: "Today's Total Bookings", value: todayBookings.length.toString(), growth: '+12%', icon: <FiCalendar />, color: '#9C4A34' },
    { label: 'New Requests', value: pendingBookingsCount.toString().padStart(2, '0'), tag: 'Action Needed', icon: <FiBell />, color: '#E65C00' },
    { label: 'Pending Actions', value: pendingBookingsCount.toString().padStart(2, '0'), icon: <FiCheck />, color: '#D4A017' },
  ];

  // Calendar Calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // List Calculations
  const displayedBookings = bookings.filter(b => isSameDay(parseISO(b.date), selectedDate));

  return (
    <div className="pb-5">
      <OwnerHeader searchPlaceholder="Search bookings..." />
      
      {/* PAGE HEADER */}
      <div className="mb-5">
        <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb small fw-bold">
                <li className="breadcrumb-item"><a href="#" className="text-muted text-decoration-none">Dashboard</a></li>
                <li className="breadcrumb-item active text-rust" aria-current="page">Bookings</li>
            </ol>
        </nav>
        <div className="d-flex justify-content-between align-items-end">
            <div>
                <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Bookings Management</h1>
                <p className="text-muted mb-0">Manage your salon's daily heartbeat and client journey.</p>
            </div>
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-2">
                    {staff.length > 0 ? (
                        <>
                            {staff.slice(0, 3).map((member, i) => (
                                <div key={member.id} className="rounded-circle border border-2 border-white shadow-sm overflow-hidden bg-sand d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', marginLeft: i > 0 ? '-10px' : '0' }}>
                                    {member.avatar ? (
                                        <img src={getImageUrl(member.avatar)} alt="team" className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <span className="fw-bold text-rust" style={{ fontSize: '0.6rem' }}>
                                            {member.full_name?.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {staff.length > 3 && (
                                <div className="rounded-circle border border-2 border-white shadow-sm bg-sand d-flex align-items-center justify-content-center fw-bold text-muted small" style={{ width: '32px', height: '32px', marginLeft: '-10px', fontSize: '0.65rem' }}>
                                    +{staff.length - 3}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-muted small fw-bold opacity-50">NO STAFF ADDED</div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* KPI SUMMARY */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
            <div key={idx} className="col-12 col-md-4">
                <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 position-relative transition-all hover-scale cursor-pointer">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="rounded-4 p-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color, width: '50px', height: '50px' }}>
                            {kpi.icon}
                        </div>
                        {kpi.growth && <span className="badge rounded-pill bg-warning bg-opacity-10 text-dark fw-bold" style={{ fontSize: '0.65rem' }}>{kpi.growth}</span>}
                        {kpi.tag && <span className="badge rounded-pill bg-rust text-white fw-bold shadow-sm" style={{ fontSize: '0.65rem' }}>{kpi.tag}</span>}
                    </div>
                    <div className="display-6 fw-bold mb-1" style={{ letterSpacing: '-1px' }}>{kpi.value}</div>
                    <div className="text-muted small fw-bold">{kpi.label}</div>
                </div>
            </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="row g-5">
        
        {/* LEFT SIDEBAR CONTROLS */}
        <div className="col-12 col-xl-4">
            
            {/* MINI CALENDAR */}
            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 mb-5 pb-5 position-relative overflow-hidden" style={{ backgroundColor: '#FDFBF7' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                    <h5 className="fw-bold mb-0">{format(currentMonth, 'MMMM yyyy')}</h5>
                    <div className="d-flex gap-3">
                        <FiChevronLeft className="text-muted cursor-pointer" onClick={prevMonth} />
                        <FiChevronRight className="text-muted cursor-pointer" onClick={nextMonth} />
                    </div>
                </div>
                
                <div className="calendar-grid">
                    {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(day => (
                        <div key={day} className="text-center text-muted fw-bold mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>{day}</div>
                    ))}
                    {calendarDays.map((date, i) => {
                        const dayBookings = bookings.filter(b => isSameDay(parseISO(b.date), date));
                        const hasPending = dayBookings.some(b => b.status === 'PENDING');
                        const hasConfirmed = dayBookings.some(b => b.status === 'CONFIRMED');
                        const hasCompleted = dayBookings.some(b => b.status === 'COMPLETED');
                        return (
                            <div 
                                key={i} 
                                onClick={() => setSelectedDate(date)}
                                className={`calendar-day ${isSameDay(date, selectedDate) ? 'active shadow' : ''} ${!isSameMonth(date, currentMonth) ? 'opacity-25' : ''}`}
                            >
                                {format(date, 'd')}
                                {(hasPending || hasConfirmed || hasCompleted) && (
                                    <div className="dot-group">
                                        {hasConfirmed && <span className="dot bg-warning"></span>}
                                        {hasPending && <span className="dot bg-rust"></span>}
                                        {hasCompleted && <span className="dot" style={{ backgroundColor: '#5D6B35' }}></span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                        <span className="rounded-circle bg-warning" style={{ width: '10px', height: '10px' }}></span> Confirmed ({confirmedBookingsCount.toString().padStart(2, '0')})
                    </div>
                    <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                        <span className="rounded-circle bg-rust" style={{ width: '10px', height: '10px' }}></span> Pending ({pendingBookingsCount.toString().padStart(2, '0')})
                    </div>
                    <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                        <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#5D6B35' }}></span> Completed ({completedBookingsCount.toString().padStart(2, '0')})
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 pb-5" style={{ backgroundColor: '#FDFBF7' }}>
                <h6 className="fw-bold mb-4 opacity-75 small letter-spaced" style={{ letterSpacing: '1px' }}>QUICK FILTERS</h6>
                <div className="mb-4">
                    <label className="text-muted small fw-bold mb-2">Stylist</label>
                    <select 
                        value={selectedStylist}
                        onChange={(e) => setSelectedStylist(e.target.value)}
                        className="form-select rounded-4 border-0 shadow-sm py-3 px-4 fw-medium text-muted" 
                        style={{ fontSize: '0.9rem' }}
                    >
                        <option>All Stylists</option>
                        {staff.map(member => (
                            <option key={member.id} value={member.id}>{member.full_name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="text-muted small fw-bold mb-2">Service Type</label>
                    <select className="form-select rounded-4 border-0 shadow-sm py-3 px-4 fw-medium text-muted" style={{ fontSize: '0.9rem' }}>
                        <option>All Services</option>
                    </select>
                </div>
            </div>
        </div>

        {/* FEED AREA (RIGHT) */}
        <div className="col-12 col-xl-8">
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                <h4 className="fw-bold mb-0">Appointments for {format(selectedDate, 'EEEE, MMM d')}</h4>
                <div className="d-flex gap-3">
                    <div className="bg-white p-2 rounded-3 shadow-sm border d-flex align-items-center cursor-pointer hover-scale">
                        <FiSearch size={18} className="text-muted" />
                    </div>
                    <div className="bg-white p-2 rounded-3 shadow-sm border d-flex align-items-center cursor-pointer hover-scale">
                        <FiDownload size={18} className="text-muted" />
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column gap-4">
                {/* AWAITING ACTION SECTION (Global Pending) */}
                {pendingBookings.length > 0 && (
                    <div className="mb-2">
                        <div className="d-flex align-items-center gap-2 mb-3 px-2">
                            <span className="badge bg-rust text-white rounded-pill px-2 py-1" style={{ fontSize: '0.6rem' }}>{pendingBookings.length}</span>
                            <h5 className="fw-bold mb-0 text-rust small letter-spaced">AWAITING ACTION (ALL DATES)</h5>
                        </div>
                        <div className="d-flex flex-column gap-3">
                            {pendingBookings.map((apt) => (
                                <div key={`pending-${apt.id}`} className="bg-white rounded-5 p-4 shadow-sm border border-rust border-opacity-25 position-relative transition-all hover-translate-right" style={{ backgroundColor: '#FFF9F4' }}>
                                    <div className="row align-items-center">
                                        <div className="col-auto">
                                            <div className="rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center bg-sand" style={{ width: '60px', height: '60px' }}>
                                                <span className="fw-bold text-rust">{apt.user_email?.charAt(0).toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="fw-bold mb-0">{apt.user_email}</h6>
                                                    <div className="text-muted small d-flex align-items-center gap-2 mt-1 fw-medium">
                                                        <span className="text-rust fw-bold">{format(parseISO(apt.date), 'MMM d')}</span> · {apt.service_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="d-flex gap-2">
                                                <button 
                                                    disabled={actionLoading === apt.id}
                                                    onClick={() => handleAction(apt.id, 'accept')}
                                                    className="btn btn-rust rounded-pill px-4 py-2 fw-bold text-white shadow-sm small border-0"
                                                >
                                                    {actionLoading === apt.id ? '...' : 'Accept'}
                                                </button>
                                                <button 
                                                    disabled={actionLoading === apt.id}
                                                    onClick={() => handleAction(apt.id, 'reject')}
                                                    className="btn btn-light rounded-pill px-4 py-2 fw-bold text-muted shadow-sm small border-0"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-bottom my-5 opacity-25"></div>
                    </div>
                )}

                {/* DAILY APPOINTMENTS SECTION */}
                <div className="d-flex align-items-center gap-2 mb-1 px-2">
                    <h5 className="fw-bold mb-0 text-dark small letter-spaced">DAILY SCHEDULE: {format(selectedDate, 'MMM d').toUpperCase()}</h5>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <FiLoader className="spinner-border text-rust" />
                        <p className="mt-3 text-muted">Loading bookings...</p>
                    </div>
                ) : displayedBookings.length === 0 ? (
                    <div className="bg-white rounded-5 p-5 text-center shadow-sm border border-opacity-10">
                        <h5 className="fw-bold text-muted">No appointments found</h5>
                        <p className="text-muted small mb-0">No bookings scheduled for {format(selectedDate, 'MMM d')}.</p>
                    </div>
                ) : displayedBookings.map((apt) => (

                    <div key={apt.id} className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 position-relative transition-all hover-translate-right">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <div className="rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center bg-sand" style={{ width: '64px', height: '64px' }}>
                                    <span className="fw-bold text-rust">{apt.user_email?.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="fw-bold mb-0">{apt.user_email}</h5>
                                        <div className="text-muted small d-flex align-items-center gap-2 mt-1 fw-medium">
                                            <FiPlus size={14} className="opacity-50" /> {apt.service_name}
                                        </div>
                                    </div>
                                    <span className={`badge rounded-pill px-3 py-2 fw-bold ${
                                        apt.status === 'PENDING' ? 'bg-rust bg-opacity-10 text-rust' : 
                                        apt.status === 'COMPLETED' ? 'bg-sand text-dark border' : 
                                        apt.status === 'CONFIRMED' ? 'bg-primary bg-opacity-10 text-primary' :
                                        'bg-dark bg-opacity-10 text-muted'
                                    }`} style={{ fontSize: '0.65rem' }}>
                                        <span className="rounded-circle me-2" style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'currentColor' }}></span>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-3 border-start ps-4 d-none d-md-block">
                                <span className="text-muted tiny fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>TIME SLOT</span>
                                <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.85rem' }}>{format(parseISO(`${apt.date}T${apt.start_time}`), 'p')}</div>
                                <div className="d-flex align-items-center gap-2 mt-2">
                                     <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9C4A34' }}></span>
                                     <span className="text-muted small fw-medium">Not Assigned</span>
                                </div>
                            </div>
                            <div className="col-auto text-end ps-4 border-start">                                 {apt.status === 'PENDING' ? (
                                    <div className="d-flex gap-2">
                                        <button 
                                            disabled={actionLoading === apt.id}
                                            onClick={() => handleAction(apt.id, 'accept')}
                                            className="btn btn-rust rounded-pill px-4 py-2 fw-bold text-white shadow-sm small border-0"
                                        >
                                            {actionLoading === apt.id ? '...' : 'Accept'}
                                        </button>
                                        <button 
                                            disabled={actionLoading === apt.id}
                                            onClick={() => handleAction(apt.id, 'reject')}
                                            className="btn btn-light rounded-pill px-4 py-2 fw-bold text-muted shadow-sm small border-0"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                ) : apt.status === 'CONFIRMED' ? (
                                    <div className="d-flex gap-2">
                                        <button 
                                            disabled={actionLoading === apt.id}
                                            onClick={() => handleAction(apt.id, 'complete')}
                                            className="btn btn-rust rounded-pill px-4 py-2 fw-bold text-white shadow-sm small border-0"
                                        >
                                            {actionLoading === apt.id ? '...' : 'Mark as Done'}
                                        </button>
                                        <button 
                                            onClick={() => setSelectedBooking(apt)}
                                            className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold small border-opacity-10"
                                        >
                                            Details
                                        </button>
                                    </div>
                                ) : apt.status === 'COMPLETED' ? (
                                    <button className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold small border-opacity-10">Invoice</button>
                                ) : (
                                    <button 
                                        onClick={() => setSelectedBooking(apt)}
                                        className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold small border-opacity-10 transition-all hover-bg-dark hover-text-white"
                                    >
                                        View Details
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-5">
                <button className="btn btn-link text-rust fw-bold text-decoration-none d-flex align-items-center justify-content-center gap-2 mx-auto">
                    Load More Appointments <FiChevronRight />
                </button>
            </div>
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button className="position-fixed bg-rust text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0 transition-all hover-scale" style={{ bottom: '40px', right: '40px', width: '64px', height: '64px', zIndex: 100 }}>
          <FiPlus size={28} strokeWidth={3} />
      </button>

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card border-0 bg-white shadow-lg rounded-5 p-5 w-100" style={{ maxWidth: '550px' }}>
             <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                   <span className="badge bg-rust bg-opacity-10 text-rust rounded-pill px-3 py-2 fw-bold mb-2" style={{ fontSize: '0.65rem' }}>APPOINTMENT DETAILS</span>
                   <h3 className="fw-bold mb-0">#{selectedBooking.id.toString().padStart(5, '0')}</h3>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <FiX size={20} />
                </button>
             </div>

             <div className="bg-sand rounded-4 p-4 mb-4 border border-opacity-10">
                <div className="row g-3">
                   <div className="col-6">
                      <div className="text-muted small fw-bold mb-1 letter-spaced">CLIENT</div>
                      <div className="fw-bold text-dark">{selectedBooking.user_email}</div>
                   </div>
                   <div className="col-6">
                      <div className="text-muted small fw-bold mb-1 letter-spaced">STATUS</div>
                      <div className={`fw-bold ${selectedBooking.status === 'CONFIRMED' ? 'text-primary' : 'text-rust'}`}>{selectedBooking.status}</div>
                   </div>
                   <div className="col-6">
                      <div className="text-muted small fw-bold mb-1 letter-spaced">DATE</div>
                      <div className="fw-bold text-dark">{format(parseISO(selectedBooking.date), 'MMMM do, yyyy')}</div>
                   </div>
                   <div className="col-6">
                      <div className="text-muted small fw-bold mb-1 letter-spaced">TIME</div>
                      <div className="fw-bold text-dark">{format(parseISO(`${selectedBooking.date}T${selectedBooking.start_time}`), 'p')}</div>
                   </div>
                </div>
             </div>

             <h6 className="fw-bold mb-3 text-uppercase letter-spaced small">Booked Services</h6>
             <div className="d-flex flex-column gap-2 mb-5">
                {(selectedBooking.services_details || []).map((service: any) => (
                  <div key={service.id} className="d-flex justify-content-between align-items-center p-3 bg-white border rounded-4 shadow-xs">
                     <div className="fw-bold small">{service.name}</div>
                     <div className="text-muted small">{service.duration} MIN</div>
                  </div>
                ))}
             </div>

             <div className="d-flex gap-3">
                <a 
                  href={`https://wa.me/${selectedBooking.user_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello! This is Jack Salon regarding your appointment scheduled for ${format(parseISO(selectedBooking.date), 'MMMM do')} at ${format(parseISO(`${selectedBooking.date}T${selectedBooking.start_time}`), 'p')}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-sm text-decoration-none d-flex align-items-center justify-content-center"
                >
                  WhatsApp Client
                </a>
                <button onClick={() => setSelectedBooking(null)} className="btn btn-outline-dark w-100 rounded-pill py-3 fw-bold border-opacity-10">Close</button>
             </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 10px;
        }
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.85rem;
            color: #1E1915;
            cursor: pointer;
            border-radius: 12px;
            position: relative;
            transition: all 0.2s ease;
        }
        .calendar-day:hover {
            background-color: #FFF;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .calendar-day.active {
            background-color: #9C4A34;
            color: white;
        }
        .calendar-day .dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            position: absolute;
            bottom: 6px;
        }
        .dot-group {
            display: flex;
            gap: 2px;
            position: absolute;
            bottom: 6px;
        }
        .dot-group .dot {
            position: static;
            width: 4px;
            height: 4px;
        }
        .tiny { font-size: 0.65rem; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .text-blue { color: #0066CC; }
        .bg-blue { background-color: #0066CC; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .hover-translate-right:hover {
            transform: translateX(10px);
        }
      `}</style>
    </div>
  );
}
