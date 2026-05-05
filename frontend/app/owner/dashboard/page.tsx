'use client';

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCalendar, FiClock, FiUsers, FiArrowRight, FiCheck, FiMoreHorizontal, FiDatabase, FiPlus } from 'react-icons/fi';
import { getImageUrl, api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function OwnerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/analytics/overview/');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
      return (
          <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-rust" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          </div>
      );
  }

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 mt-4">
        <div>
           <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Dashboard Overview</h1>
           <p className="text-muted mb-0">Welcome back, your salon is performing beautifully today.</p>
        </div>
            <div className="bg-white rounded-4 p-3 shadow-sm d-flex align-items-center gap-3 border border-opacity-10">
                <div className="d-flex flex-column">
                    <span className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>STATUS</span>
                    <span className="fw-bold text-dark d-flex align-items-center gap-2">
                        <span className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></span> Live
                    </span>
                </div>
                <div className="border-start ps-3 d-flex flex-column">
                    <span className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>BUSINESS DAY</span>
                    <span className="fw-bold text-dark">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="row g-4 mb-5">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-12 col-md-6 col-xl-3">
            <div className={`rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer position-relative overflow-hidden bg-${kpi.color} text-white`}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="bg-white bg-opacity-20 rounded-pill p-3 text-white d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                        {kpi.icon}
                    </div>
                    <span className="fw-bold small bg-white text-dark rounded-pill px-3 py-1 shadow-sm">
                        {kpi.growth || kpi.current}
                    </span>
                </div>
                <div className="text-white-50 small fw-bold mb-1">{kpi.label}</div>
                <h2 className="fw-bold mb-0" style={{ letterSpacing: '-1px' }}>{kpi.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS & ACTIVITY ROW */}
      <div className="row g-5 mb-5">
        
        {/* REVENUE GROWTH CHART */}
        <div className="col-12 col-xl-8">
            <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border border-opacity-10 h-100">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h4 className="fw-bold mb-1">Revenue Growth</h4>
                        <p className="text-muted small mb-0">Weekly performance analysis</p>
                    </div>
                    <div className="badge bg-rust text-white rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm">
                         Live Data <span className="rounded-circle bg-white" style={{ width: '6px', height: '6px' }}></span>
                    </div>
                </div>

                {/* SVG CHART - HIGH FIDELITY SIMULATION */}
                <div className="position-relative mt-2" style={{ height: '300px' }}>
                    <svg viewBox="0 0 800 300" className="w-100 h-100 overflow-visible">
                        {/* Gradients */}
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#9C4A34" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#9C4A34" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        {/* Area Fill */}
                        <path 
                            d={areaPath} 
                            fill="url(#chartGradient)"
                        />
                        
                        {/* Main Line */}
                        <path 
                            d={linePath} 
                            fill="none" 
                            stroke="#9C4A34" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />

                        {/* Data Nodes */}
                        {chartPoints.map((p: any, i: number) => (
                            <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#9C4A34" strokeWidth="2" />
                        ))}

                        {/* Grid Lines Placeholder */}
                        <g opacity="0.05">
                            {[0, 60, 120, 180, 240, 300].map(y => (
                                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="black" />
                            ))}
                        </g>
                    </svg>

                    {/* Labels */}
                    <div className="d-flex justify-content-between mt-4 text-muted fw-bold px-0" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                        {chartData.map((d: any, i: number) => (
                            <span key={i}>{d.day}</span>
                        ))}
                    </div>
                </div>
            </div>
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
                                {act.peak && (
                                    <div className="position-absolute bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ top: '-10px', right: '-10px', width: '40px', height: '40px', fontSize: '0.6rem', textAlign: 'center', fontWeight: 'bold' }}>
                                        {act.peak.replace(' ', '\n')}
                                    </div>
                                )}
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

      {/* BOTTOM ALERTS / FOOTER ROW */}
      <div className="row g-4">
        <div className="col-12 col-md-8">
            <div className="bg-dark rounded-5 p-5 shadow-sm h-100 position-relative overflow-hidden" style={{ backgroundColor: '#1E1915' }}>
                <div className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3" style={{ backgroundColor: '#FDF2E3', letterSpacing: '1px', fontSize: '0.65rem' }}>INVENTORY ALERT</div>
                <h3 className="text-white fw-bold mb-0 display-6" style={{ letterSpacing: '-1.5px' }}>{data?.low_stock_count || 0} Items Below Minimum</h3>
                {/* Visual Flair */}
                <div className="position-absolute opacity-25" style={{ bottom: '-50px', right: '-20px', fontSize: '12rem', color: '#FFF' }}>
                    <FiDatabase />
                </div>
            </div>
        </div>
        <div className="col-12 col-md-4">
            <div className="bg-white rounded-5 p-5 shadow-sm h-100 border border-opacity-10 d-flex flex-column justify-content-center">
                 <h4 className="fw-bold mb-2">Top Performing Service</h4>
                 <div className="text-rust fw-bold fs-3 mb-2">{data?.top_service?.name || 'N/A'}</div>
                 <div className="text-muted small fw-bold mt-auto d-flex align-items-center gap-2">
                     <span className="text-dark">{data?.top_service?.percentage || 0}%</span> of total revenue this month
                 </div>
            </div>
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
      `}</style>
    </div>
  );
}
