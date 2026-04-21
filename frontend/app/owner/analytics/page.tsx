'use client';

import React from 'react';
import { 
    FiTrendingUp, 
    FiBriefcase, 
    FiUsers, 
    FiTarget, 
    FiDownload, 
    FiCalendar, 
    FiChevronDown,
    FiPieChart,
    FiBarChart2,
    FiActivity
} from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function AnalyticsPage() {
  const kpis = [
    { label: 'Net Revenue', value: '$48,240.00', growth: '+15.4%', icon: <FiTrendingUp />, color: '#9C4A34' },
    { label: 'Average Ticket', value: '$142.50', growth: '+5.2%', icon: <FiBriefcase />, color: '#0066CC' },
    { label: 'Occupancy Rate', value: '78.4%', growth: '+12.1%', icon: <FiActivity />, color: '#5D6B35' },
    { label: 'Retention Rate', value: '64.2%', growth: '+2.4%', icon: <FiTarget />, color: '#D4A017' },
  ];

  const categories = [
    { name: 'Hair & Styling', value: 45, color: '#9C4A34' },
    { name: 'Skin & Facial', value: 25, color: '#0066CC' },
    { name: 'Nail Artistry', value: 20, color: '#D4A017' },
    { name: 'Therapy & Massage', value: 10, color: '#5D6B35' },
  ];

  return (
    <div className="pb-5">
      <OwnerHeader />

      {/* PAGE HEADER */}
      <div className="row align-items-center mb-5 mt-2">
        <div className="col-12 col-md-8">
            <nav aria-label="breadcrumb" className="mb-2">
                <ol className="breadcrumb small fw-bold">
                    <li className="breadcrumb-item"><a href="#" className="text-muted text-decoration-none">Dashboard</a></li>
                    <li className="breadcrumb-item active text-rust" aria-current="page">Analytics</li>
                </ol>
            </nav>
            <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Strategic Intelligence</h1>
            <p className="text-muted mb-0">Harnessing performance data to drive salon excellence.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
            <div className="d-flex gap-3 justify-content-md-end">
                <div className="bg-white rounded-pill px-4 py-3 fw-bold shadow-sm border border-opacity-10 text-dark d-flex align-items-center gap-3 cursor-pointer">
                    <FiCalendar className="text-rust" /> <span>Oct 1 - Oct 31, 2023</span> <FiChevronDown className="opacity-25" />
                </div>
                <button className="btn btn-rust rounded-circle p-3 shadow-sm d-flex align-items-center justify-content-center">
                    <FiDownload size={22} />
                </button>
            </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
            <div key={idx} className="col-12 col-md-6 col-xl-3">
                <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer overflow-hidden position-relative">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color, width: '45px', height: '45px' }}>
                            {kpi.icon}
                        </div>
                        <span className="badge rounded-pill px-3 py-1 fw-bold fs-7 bg-success bg-opacity-10 text-success" style={{ fontSize: '0.65rem' }}>{kpi.growth}</span>
                    </div>
                    <div className="text-muted small fw-bold mb-1 letter-spaced">{kpi.label}</div>
                    <h2 className="fw-bold mb-0" style={{ letterSpacing: '-1px' }}>{kpi.value}</h2>
                    {/* Tiny visual deco graph */}
                    <div className="position-absolute bottom-0 start-0 w-100 opacity-25" style={{ height: '30px' }}>
                        <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
                            <path d="M0,30 Q25,10 50,20 T100,5" fill="none" stroke={kpi.color} strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="row g-5 mb-5">
        
        {/* REVENUE FORECAST CHART */}
        <div className="col-12 col-xl-8">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h4 className="fw-bold mb-1">Financial Trajectory</h4>
                        <p className="text-muted small mb-0">Actual revenue vs projected growth analysis.</p>
                    </div>
                    <div className="d-flex gap-4">
                        <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                            <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#9C4A34' }}></span> Actual
                        </div>
                        <div className="d-flex align-items-center gap-2 small fw-bold text-muted opacity-50">
                            <span className="rounded-circle border border-2" style={{ width: '10px', height: '10px', borderStyle: 'dashed' }}></span> Forecast
                        </div>
                    </div>
                </div>

                <div className="position-relative mt-2" style={{ height: '350px' }}>
                    <svg viewBox="0 0 800 350" className="w-100 h-100 overflow-visible">
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#9C4A34" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#9C4A34" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Grid */}
                        <g opacity="0.03">
                            {[70, 140, 210, 280].map(y => <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="black" />)}
                        </g>
                        {/* Shaded Area */}
                        <path d="M0,300 Q100,280 200,220 T400,180 T600,120 T800,80 L800,350 L0,350 Z" fill="url(#revGrad)" />
                        {/* Actual Line */}
                        <path d="M0,300 Q100,280 200,220 T400,180 T600,120 T800,80" fill="none" stroke="#9C4A34" strokeWidth="4" strokeLinecap="round" />
                        {/* Forecast Dots */}
                        <path d="M600,120 L800,50" fill="none" stroke="#9C4A34" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
                        
                        {/* Points */}
                        {[0, 200, 400, 600, 800].map((x, i) => (
                            <circle key={i} cx={x} cy={300 - i*55} r="5" fill="white" stroke="#9C4A34" strokeWidth="3" />
                        ))}
                    </svg>
                    <div className="d-flex justify-content-between mt-4 text-muted tiny fw-bold px-4 letter-spaced">
                        <span>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span>WEEK 4</span><span>CURRENT</span>
                    </div>
                </div>
            </div>
        </div>

        {/* CATEGORY SPLIT */}
        <div className="col-12 col-xl-4">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100 d-flex flex-column">
                <h4 className="fw-bold mb-5">Service Portfolio</h4>
                
                <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative mb-5">
                    <svg viewBox="0 0 200 200" width="220" height="220">
                        <circle cx="100" cy="100" r="80" fill="transparent" stroke="#F0F0F0" strokeWidth="25" />
                        <circle cx="100" cy="100" r="80" fill="transparent" stroke="#9C4A34" strokeWidth="25" strokeDasharray="502" strokeDashoffset="120" strokeLinecap="round" transform="rotate(-90 100 100)" />
                        <circle cx="100" cy="100" r="80" fill="transparent" stroke="#0066CC" strokeWidth="25" strokeDasharray="502" strokeDashoffset="420" strokeLinecap="round" transform="rotate(45 100 100)" />
                    </svg>
                    <div className="position-absolute text-center">
                        <div className="text-muted tiny fw-bold letter-spaced">TOTAL</div>
                        <div className="fw-bold fs-4">$48.2k</div>
                    </div>
                </div>

                <div className="d-flex flex-column gap-4">
                    {categories.map((c, i) => (
                        <div key={i} className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <span className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: c.color }}></span>
                                <span className="small fw-bold text-dark">{c.name}</span>
                            </div>
                            <span className="text-muted small fw-bold">{c.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>

      {/* HEATMAP GRID */}
      <div className="row g-5">
        <div className="col-12 col-xl-7">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 h-100">
                <div className="d-flex justify-content-between align-items-center mb-5">
                     <div>
                        <h4 className="fw-bold mb-1">Peak Utilization Heatmap</h4>
                        <p className="text-muted small mb-0">Optimizing labor costs by identifying highest demand zones.</p>
                     </div>
                     <div className="text-rust d-flex align-items-center gap-2 tiny fw-bold letter-spaced">
                        LEGEND: HIGH <span className="rounded-pill bg-rust" style={{ width: '30px', height: '8px' }}></span> LOW
                     </div>
                </div>

                <div className="table-responsive border-0">
                    <div className="d-flex gap-1 mb-2 ps-5">
                        {['9A','11A','1P','3P','5P','7P','9P'].map(t => <div key={t} className="flex-grow-1 text-center tiny fw-bold text-muted opacity-50">{t}</div>)}
                    </div>
                    {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day, idx) => (
                        <div key={day} className="d-flex align-items-center gap-1 mb-1">
                            <div className="tiny fw-bold text-muted opacity-50 pe-3" style={{ width: '40px' }}>{day}</div>
                            {[...Array(12)].map((_, i) => {
                                // Deterministic intensity based on index to avoid hydration mismatch
                                const intensity = ((idx * 7) + (i * 3)) % 10 / 10;
                                return (
                                    <div 
                                        key={i} 
                                        className="flex-grow-1 rounded-2" 
                                        style={{ 
                                            height: '35px', 
                                            backgroundColor: '#9C4A34', 
                                            opacity: intensity > 0.8 ? 0.9 : intensity > 0.5 ? 0.4 : 0.05 
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* BOTTOM INSIGHTS */}
        <div className="col-12 col-xl-5">
            <div className="bg-dark rounded-5 p-5 shadow-sm h-100 position-relative overflow-hidden" style={{ backgroundColor: '#1E1915' }}>
                <h4 className="text-white fw-bold mb-5 letter-spaced">Executive Briefing</h4>
                <div className="d-flex flex-column gap-5">
                    <div className="d-flex align-items-start gap-4">
                        <div className="text-rust"><FiTrendingUp size={24} /></div>
                        <div>
                            <h6 className="text-white fw-bold mb-2">Revenue Growth Potential</h6>
                            <p className="small text-muted opacity-75 mb-0">Upselling skin treatments during hair sessions could increase net margin by 8.4%.</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-start gap-4">
                        <div className="text-rust"><FiPieChart size={24} /></div>
                        <div>
                            <h6 className="text-white fw-bold mb-2">Market Positioning</h6>
                            <p className="small text-muted opacity-75 mb-0">Your retention rate is 12% higher than comparable premium salons in the area.</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-start gap-4">
                        <div className="text-rust"><FiActivity size={24} /></div>
                        <div>
                            <h6 className="text-white fw-bold mb-2">Staff Efficiency</h6>
                            <p className="small text-muted opacity-75 mb-0">Aura Luxe has maintained 98% appointment punctuality throughout Q3.</p>
                        </div>
                    </div>
                </div>
                {/* Visual Accent */}
                <div className="position-absolute bottom-0 end-0 opacity-10" style={{ transform: 'translate(40%, 40%)' }}>
                    <FiBarChart2 size={300} />
                </div>
            </div>
        </div>
      </div>

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 1.5px; text-transform: uppercase; }
        .tiny { font-size: 0.65rem; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-scale:hover { transform: translateY(-5px); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .text-blue { color: #0066CC; }
        .bg-blue { background-color: #0066CC; }
      `}</style>
    </div>
  );
}
