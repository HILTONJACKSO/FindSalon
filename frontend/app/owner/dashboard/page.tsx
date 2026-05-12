'use client';

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCalendar, FiClock, FiUsers, FiArrowRight, FiCheck, FiMoreHorizontal, FiDatabase, FiPlus, FiImage, FiX, FiSave } from 'react-icons/fi';
import { getImageUrl, api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import OwnerHeader from '@/components/owner/OwnerHeader';
import { motion, AnimatePresence } from 'framer-motion';

const PortfolioManager = () => {
    const [items, setItems] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [title, setTitle] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { token, initialized } = useAuthStore();

    useEffect(() => {
        if (!initialized || !token) return;

        const fetchData = async () => {
            try {
                const [portfolioRes, servicesRes] = await Promise.all([
                    api.get('/salons/portfolio/mine/'),
                    api.get('/services/?mine=true')
                ]);
                const portfolioData = portfolioRes.data.results || portfolioRes.data || [];
                setItems(portfolioData);
                setServices(servicesRes.data.results || servicesRes.data || []);
            } catch (err) {
                console.error("Failed to fetch portfolio data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, initialized]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) return;
        
        setIsSaving(true);
        const formData = new FormData();
        formData.append('title', title);
        if (serviceId) formData.append('service', serviceId);
        formData.append('category', category);
        formData.append('image', imageFile);

        try {
            const res = await api.post('/salons/portfolio/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setItems([res.data, ...items]);
            setShowModal(false);
            // Reset form
            setTitle('');
            setServiceId('');
            setCategory('');
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            console.error("Failed to save portfolio item", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="mb-5 bg-white rounded-5 p-4 p-md-5 shadow-sm border border-opacity-10">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
                <div>
                    <h4 className="fw-bold mb-1">Visual Booking / Lookbook</h4>
                    <p className="text-muted small mb-0">Manage the styles displayed in the public Lookbook.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn btn-rust rounded-pill px-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm border-0 transition-all hover-scale"
                >
                    <FiPlus /> <span className="small">Add New Style</span>
                </button>
            </div>

            <div className="row g-3 g-md-4">
                {items.length === 0 ? (
                    <div className="col-12">
                        <div className="bg-sand bg-opacity-50 rounded-5 p-5 text-center border border-dashed border-2 opacity-75">
                            <FiImage size={48} className="mb-3 text-muted opacity-50" />
                            <p className="fw-bold mb-0">No styles uploaded yet.</p>
                            <p className="text-muted small">Showcase your best work to attract more bookings.</p>
                        </div>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="col-6 col-md-4 col-xl-2">
                            <div className="position-relative overflow-hidden rounded-4 shadow-sm group" style={{ height: 'clamp(140px, 20vw, 200px)' }}>
                                <img src={item.image} className="w-100 h-100 object-fit-cover transition-all group-hover:scale-110" alt={item.title} />
                                <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                    <p className="text-white small mb-0 fw-bold text-truncate" style={{ fontSize: '0.7rem' }}>{item.title}</p>
                                    <p className="text-white-50 mb-0" style={{ fontSize: '0.6rem' }}>${item.price}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL IMPLEMENTATION */}
            <AnimatePresence>
                {showModal && (
                    <div className="lookbook-modal-backdrop" style={{ zIndex: 3000 }} onClick={() => setShowModal(false)}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-5 p-4 p-md-5 shadow-2xl" 
                            style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 'auto' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">Add New Style</h4>
                                <button onClick={() => setShowModal(false)} className="btn btn-link text-muted p-0 border-0"><FiX size={24} /></button>
                            </div>
                            
                            <form onSubmit={handleSave}>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Style Photo</label>
                                    <div 
                                        className="rounded-4 border border-dashed border-2 p-4 text-center cursor-pointer hover-bg-sand transition-all position-relative overflow-hidden"
                                        style={{ height: '180px', backgroundColor: '#FDFBF7' }}
                                        onClick={() => document.getElementById('lookbook-image')?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />
                                        ) : (
                                            <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                                                <FiPlus size={28} className="text-rust mb-2" />
                                                <span className="small fw-bold text-muted">Tap to upload photo</span>
                                            </div>
                                        )}
                                        <input type="file" id="lookbook-image" className="d-none" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Style Title</label>
                                    <input type="text" className="form-control rounded-pill py-3 border-0 bg-sand px-4 small" placeholder="e.g., Silk Press Excellence" value={title} onChange={e => setTitle(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Category</label>
                                    <input type="text" className="form-control rounded-pill py-3 border-0 bg-sand px-4 small" placeholder="e.g., Braids, Fades, Nails" value={category} onChange={e => setCategory(e.target.value)} />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted text-uppercase letter-spaced" style={{ fontSize: '0.65rem' }}>Link to Service</label>
                                    <select className="form-select rounded-pill py-3 border-0 bg-sand px-4 cursor-pointer small" value={serviceId} onChange={e => setServiceId(e.target.value)}>
                                        <option value="">Select a service (optional)</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" disabled={isSaving || !imageFile} className="btn btn-rust w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg">
                                    {isSaving ? <span className="spinner-border spinner-border-sm"></span> : <><FiSave /> Save to Lookbook</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

const ProGate = ({ plan, children, featureName }: { plan: string, children: React.ReactNode, featureName: string }) => {
    if (plan === 'PRO' || plan === 'TRIAL') return <>{children}</>;

    return (
        <div className="position-relative overflow-hidden rounded-5 h-100">
            <div className="opacity-25 pointer-events-none filter-blur">
                {children}
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}>
                <div className="bg-rust text-white rounded-circle p-3 mb-3 shadow-lg">
                    <FiDatabase size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-1">{featureName}</h5>
                <p className="text-muted small mb-3">Exclusively available for FindSalon Pro members.</p>
                <a href="/owner/billing" className="btn btn-dark rounded-pill px-4 py-2 small fw-bold d-flex align-items-center gap-2">
                    Upgrade to Pro <FiArrowRight size={14} />
                </a>
            </div>
        </div>
    );
};

export default function OwnerDashboard() {
  const [data, setData] = useState<any>(null);
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { token, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized || !token) return;

    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, salonRes] = await Promise.all([
            api.get('/analytics/overview/'),
            api.get('/salons/mine/')
        ]);
        setData(analyticsRes.data);
        const mySalon = Array.isArray(salonRes.data) ? salonRes.data[0] : salonRes.data;
        setSalon(mySalon);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token, initialized]);

  if (loading) {
      return (
          <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-rust" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          </div>
      );
  }

  const userPlan = salon?.subscription_plan || 'STARTER';

  const kpis = [
    { 
        label: 'Total Revenue', 
        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.kpis?.revenue?.value || 0), 
        growth: `${data?.kpis?.revenue?.growth > 0 ? '+' : ''}${data?.kpis?.revenue?.growth}%`, 
        icon: <FiTrendingUp />, 
        color: 'rust' 
    },
    { 
        label: 'Total Bookings', 
        value: data?.kpis?.bookings?.value || 0, 
        growth: `${data?.kpis?.bookings?.growth > 0 ? '+' : ''}${data?.kpis?.bookings?.growth}%`, 
        icon: <FiCalendar />, 
        color: 'blue' 
    },
    { 
        label: 'Appointments Today', 
        value: data?.kpis?.apps_today || 0, 
        current: 'Today', 
        icon: <FiClock />, 
        color: 'orange' 
    },
    { 
        label: 'New Customers', 
        value: data?.kpis?.new_customers || 0, 
        growth: `+${data?.kpis?.new_customers || 0}`, 
        icon: <FiUsers />, 
        color: 'green' 
    },
  ];

  const recentActivity = (data?.recent_activity || []).map((act: any) => ({
      ...act,
      time: formatDistanceToNow(new Date(act.time), { addSuffix: true }),
      badgeColor: act.status === 'New' ? 'bg-success bg-opacity-10 text-success' : 
                  act.status === 'Completed' ? 'bg-rust bg-opacity-10 text-rust' : 
                  'bg-warning bg-opacity-10 text-warning'
  }));

  // Chart Logic
  const chartData = data?.weekly_growth || [];
  const maxRev = Math.max(...chartData.map((d: any) => d.revenue), 1000);
  const chartPoints = chartData.map((d: any, i: number) => ({
      x: i * (800 / 6),
      y: 280 - (d.revenue / maxRev * 230)
  }));
  
  const linePath = chartPoints.length > 0 ? chartPoints.map((p: any, i: number) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ') : '';
  const areaPath = chartPoints.length > 0 ? `${linePath} L${chartPoints[chartPoints.length-1].x},300 L0,300 Z` : '';

  return (
    <div className="pb-5">
      
      {/* HEADER SECTION */}
      <OwnerHeader />

      {/* PAGE TITLE */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-5 mt-4 gap-4">
        <div>
           <h1 className="fw-bold mb-2" style={{ fontSize: 'var(--fs-xl)', letterSpacing: '-1.5px' }}>Dashboard Overview</h1>
           <p className="text-muted mb-0 small">Welcome back, your salon is performing beautifully today.</p>
        </div>
        <div className="bg-white rounded-4 p-3 shadow-sm d-flex align-items-center justify-content-between gap-3 border border-opacity-10">
            <div className="d-flex flex-column">
                <span className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>PLAN</span>
                <span className="fw-bold text-dark d-flex align-items-center gap-2 small">
                    <span className={`rounded-circle bg-${userPlan === 'PRO' ? 'rust' : 'success'}`} style={{ width: '8px', height: '8px' }}></span> 
                    {userPlan === 'PRO' ? 'FindSalon Pro' : (userPlan === 'TRIAL' ? 'Free Trial' : 'FindSalon Starter')}
                </span>
            </div>
            <div className="border-start ps-3 d-flex flex-column">
                <span className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>BUSINESS DAY</span>
                <span className="fw-bold text-dark small">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
            </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-12 col-md-6 col-xl-3">
            <div className={`rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer position-relative overflow-hidden bg-${kpi.color} text-white`}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="bg-white bg-opacity-20 rounded-pill p-2 p-md-3 text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        {kpi.icon}
                    </div>
                    <span className="fw-bold bg-white text-dark rounded-pill px-2 py-1 shadow-sm" style={{ fontSize: '0.65rem' }}>
                        {kpi.growth || kpi.current}
                    </span>
                </div>
                <div className="text-white-50 small fw-bold mb-1" style={{ fontSize: 'var(--fs-xs)' }}>{kpi.label}</div>
                <h2 className="fw-bold mb-0" style={{ fontSize: 'var(--fs-lg)', letterSpacing: '-1px' }}>{kpi.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS & ACTIVITY ROW */}
      <div className="row g-5 mb-5">
        
        {/* REVENUE GROWTH CHART */}
        <div className="col-12 col-xl-8">
            <ProGate plan={userPlan} featureName="Visual Revenue Analytics">
                <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border border-opacity-10 h-100 overflow-hidden">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                        <div>
                            <h4 className="fw-bold mb-1">Revenue Growth</h4>
                            <p className="text-muted small mb-0">Weekly performance analysis</p>
                        </div>
                        <div className="badge bg-rust text-white rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm w-fit">
                            Live Data <span className="rounded-circle bg-white" style={{ width: '6px', height: '6px' }}></span>
                        </div>
                    </div>

                    <div className="position-relative mt-2 overflow-auto no-scrollbar" style={{ height: '320px' }}>
                        <div style={{ minWidth: '600px', height: '300px' }}>
                            <svg viewBox="0 0 800 300" className="w-100 h-100 overflow-visible">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#9C4A34" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#9C4A34" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={areaPath} fill="url(#chartGradient)" />
                                <path d={linePath} fill="none" stroke="#9C4A34" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                {chartPoints.map((p: any, i: number) => (
                                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#9C4A34" strokeWidth="2" />
                                ))}
                                <g opacity="0.05">
                                    {[0, 60, 120, 180, 240, 300].map(y => (
                                        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="black" />
                                    ))}
                                </g>
                            </svg>
                            <div className="d-flex justify-content-between mt-4 text-muted fw-bold px-0" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                                {chartData.map((d: any, i: number) => (
                                    <span key={i}>{d.day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </ProGate>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="col-12 col-xl-4">
            <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border border-opacity-10 h-100 d-flex flex-column">
                <h4 className="fw-bold mb-5">Recent Activity</h4>
                <div className="d-flex flex-column gap-5 flex-grow-1">
                    {recentActivity.map((act: any) => (
                        <div key={act.id} className="d-flex align-items-center gap-4">
                            <div className="position-relative flex-shrink-0">
                                <div className="rounded-circle overflow-hidden bg-sand border border-white border-2 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    {act.avatar ? (
                                        <img src={getImageUrl(act.avatar)} alt={act.user} className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <span className="fw-bold text-rust small">
                                            {act.user?.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-grow-1 min-w-0">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h6 className="fw-bold mb-0 text-truncate">{act.user}</h6>
                                    {act.status && <span className={`badge rounded-pill px-3 py-1 fw-bold fs-7 ${act.badgeColor}`} style={{ fontSize: '0.6rem' }}>{act.status}</span>}
                                </div>
                                <p className="text-muted small mb-1 text-truncate">{act.action}</p>
                                <span className="text-muted opacity-50" style={{ fontSize: '0.7rem' }}>{act.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-5 pt-4">
                    <button className="btn btn-outline-rust w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                        View All Activity <FiArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* VISUAL BOOKING / PORTFOLIO MANAGER */}
      <PortfolioManager />

      {/* BOTTOM ALERTS / FOOTER ROW */}
      <div className="row g-4">
        <div className="col-12 col-md-8">
            <ProGate plan={userPlan} featureName="Inventory Management">
                <div className="bg-dark rounded-5 p-5 shadow-sm h-100 position-relative overflow-hidden" style={{ backgroundColor: '#1E1915' }}>
                    <div className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3" style={{ backgroundColor: '#FDF2E3', letterSpacing: '1px', fontSize: '0.65rem' }}>INVENTORY ALERT</div>
                    <h3 className="text-white fw-bold mb-0 display-6" style={{ letterSpacing: '-1.5px' }}>{data?.low_stock_count || 0} Items Below Minimum</h3>
                    <div className="position-absolute opacity-25" style={{ bottom: '-50px', right: '-20px', fontSize: '12rem', color: '#FFF' }}>
                        <FiDatabase />
                    </div>
                </div>
            </ProGate>
        </div>
        <div className="col-12 col-md-4">
            <ProGate plan={userPlan} featureName="Premium Analytics">
                <div className="bg-white rounded-5 p-5 shadow-sm h-100 border border-opacity-10 d-flex flex-column justify-content-center">
                    <h4 className="fw-bold mb-2">Top Performing Service</h4>
                    <div className="text-rust fw-bold fs-3 mb-2">{data?.top_service?.name || 'N/A'}</div>
                    <div className="text-muted small fw-bold mt-auto d-flex align-items-center gap-2">
                        <span className="text-dark">{data?.top_service?.percentage || 0}%</span> of total revenue this month
                    </div>
                </div>
            </ProGate>
        </div>
      </div>


      <style jsx>{`
        .fs-7 { font-size: 0.65rem; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: translateY(-5px); }
        .bg-sand { background-color: #FDFBF7; }
        .bg-rust { background-color: #9C4A34; }
        .bg-blue { background-color: #1A3C5A; }
        .bg-orange { background-color: #D68C45; }
        .bg-green { background-color: #2D5A47; }
        .btn-outline-rust {
            border: 2px solid #9C4A34;
            color: #9C4A34;
        }
        .btn-outline-rust:hover {
            background-color: #9C4A34;
            color: white;
        }
        .border-rust { border-color: #9C4A34 !important; }
        .filter-blur { filter: blur(4px); }
      `}</style>
    </div>
  );
}
