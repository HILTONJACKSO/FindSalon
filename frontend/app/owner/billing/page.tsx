'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiCheck, FiArrowRight, FiShield, FiCreditCard, FiSmartphone, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BillingPage() {
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [polling, setPolling] = useState(false);
  const [paying, setPaying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [momoNumber, setMomoNumber] = useState('');

  useEffect(() => {
    fetchSalon();
  }, []);

  // Polling logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (polling && paymentId) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/payments/subscriptions/${paymentId}/check-status/`);
          if (res.data.status === 'COMPLETED') {
            setPolling(false);
            setPaying(false);
            toast.success("Subscription activated! Welcome to the elite tier.");
            fetchSalon();
          } else if (res.data.status === 'FAILED') {
            setPolling(false);
            setPaying(false);
            toast.error("Payment failed or was cancelled.");
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [polling, paymentId]);

  const fetchSalon = async () => {
    try {
      const res = await api.get('/salons/mine/');
      const mySalon = Array.isArray(res.data) ? res.data[0] : res.data;
      setSalon(mySalon);
      setSelectedPlan(mySalon?.subscription_plan);
    } catch (err) {
      console.error("Failed to fetch salon", err);
      toast.error("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: string) => {
    if (!momoNumber) {
      toast.error("Please enter your MTN Mobile Money number");
      return;
    }

    setPaying(true);
    const loadingToast = toast.loading(`Initiating MTN MoMo payment for ${plan}...`);

    try {
      const res = await api.post('/payments/subscriptions/subscribe/', {
        plan: plan,
        momo_number: momoNumber
      });

      if (res.data.status === 'PENDING') {
        toast.loading("Prompt sent to your phone. Waiting for approval...", { id: loadingToast });
        setPaymentId(res.data.payment_id);
        setPolling(true);
      }
    } catch (err: any) {
      console.error("Subscription failed", err);
      toast.error(err.response?.data?.detail || "Payment failed to initiate.", { id: loadingToast });
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-rust" role="status"></div>
    </div>
  );

  const plans = [
    {
      id: 'STARTER',
      name: 'FindSalon Starter',
      price: 0,
      description: 'Everything you need to get online',
      features: ['Premium Public Profile', 'Unlimited Digital Bookings', '100% Service Payouts', 'MTN MoMo Integration', 'Basic Appt Dashboard']
    },
    {
      id: 'PRO',
      name: 'FindSalon Pro',
      price: 10,
      description: 'The complete operating system',
      features: ['Visual Revenue Tracking', 'Inventory Management', 'Staff & Stylist Tools', 'Automated SMS Reminders', 'Priority Search Rank']
    }
  ];

  const isExpired = new Date(salon?.subscription_expiry) < new Date();

  return (
    <div className="billing-page pb-5">
      <div className="mb-5 mt-2">
        <h2 className="fw-bold text-dark mb-2" style={{ fontSize: 'var(--fs-lg)', letterSpacing: '-1px' }}>Subscription & Billing</h2>
        <p className="text-muted small">Manage your FindSalon Partner plan and payments.</p>
      </div>

      <div className="row g-4">
        {/* Current Plan Status */}
        <div className="col-12">
          <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <div className="d-flex align-items-center gap-3 gap-md-4 w-100 w-md-auto">
              <div className={`bg-${salon?.subscription_plan === 'TRIAL' ? 'rust' : 'dark'} bg-opacity-10 text-${salon?.subscription_plan === 'TRIAL' ? 'rust' : 'dark'} rounded-4 p-3 d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '56px', height: '56px' }}>
                <FiShield size={28} />
              </div>
              <div>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h5 className="fw-bold mb-0 text-dark">
                    {salon?.subscription_plan === 'TRIAL' ? 'Free Trial' : (salon?.subscription_plan === 'PRO' ? 'FindSalon Pro' : 'FindSalon Starter')}
                  </h5>
                  {isExpired ? (
                    <span className="badge bg-danger rounded-pill px-3 py-1" style={{ fontSize: '0.6rem' }}>Expired</span>
                  ) : (
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 border border-success border-opacity-10" style={{ fontSize: '0.6rem' }}>Active</span>
                  )}
                </div>
                <p className="text-muted small mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.7rem' }}>
                  <FiClock /> Valid until {salon?.subscription_expiry ? new Date(salon.subscription_expiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="text-center text-md-end w-100 w-md-auto pt-3 pt-md-0 border-top border-light border-md-0">
                <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '1px', fontSize: '0.6rem' }}>Monthly Bill</p>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: 'var(--fs-md)' }}>${salon?.subscription_plan === 'PRO' ? '10' : '0'}.00</h3>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="col-12 mt-4 mt-md-5">
          <h4 className="fw-bold mb-4 text-dark" style={{ fontSize: 'var(--fs-md)' }}>Available Plans</h4>
          <div className="row g-4">
            {plans.map((plan) => (
              <div key={plan.id} className="col-12 col-md-6">
                <div className={`bg-white rounded-5 p-4 p-md-5 h-100 shadow-sm border transition-all ${selectedPlan === plan.id ? 'border-rust border-2' : 'border-opacity-10'}`} style={{ position: 'relative' }}>
                  {selectedPlan === plan.id && (
                    <div className="position-absolute top-0 end-0 m-4">
                      <div className="bg-rust text-white rounded-circle p-1 d-flex">
                        <FiCheck size={16} />
                      </div>
                    </div>
                  )}
                  <h5 className="fw-bold text-dark mb-1">{plan.name}</h5>
                  <p className="text-muted small mb-4">{plan.description}</p>
                  
                  <div className="d-flex align-items-baseline gap-1 mb-4">
                    <h2 className="fw-bold text-dark mb-0" style={{ fontSize: 'var(--fs-lg)' }}>${plan.price}</h2>
                    <span className="text-muted small">/month</span>
                  </div>
 
                  <ul className="list-unstyled mb-5 d-flex flex-column gap-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="d-flex align-items-center gap-3 text-dark small fw-medium">
                        <FiCheck className="text-rust flex-shrink-0" />
                        <span style={{ fontSize: '0.75rem' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
 
                  <button 
                    className={`btn w-100 rounded-pill py-3 fw-bold transition-all ${selectedPlan === plan.id ? 'btn-light disabled opacity-50' : 'btn-outline-dark'}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Current Plan' : `Choose ${plan.id}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Payment Form */}
        {selectedPlan && selectedPlan !== salon?.subscription_plan && (
          <div className="col-12 mt-4 mt-md-5">
            <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border border-opacity-10">
              <div className="row g-4 align-items-center">
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-3 text-dark" style={{ fontSize: 'var(--fs-md)' }}>
                    {selectedPlan === 'STARTER' ? 'Activate Your Starter Plan' : 'Complete Your Pro Upgrade'}
                  </h4>
                  <p className="text-muted mb-4 small">
                    You are switching to the <strong className="text-dark">{selectedPlan}</strong> plan for <strong className="text-dark">${selectedPlan === 'PRO' ? '10' : '0'}.00/month</strong>.
                  </p>
                  
                  {selectedPlan === 'PRO' && (
                    <>
                      <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-sand rounded-4 border border-opacity-10">
                        <div className="bg-warning bg-opacity-20 text-warning rounded-3 p-2 flex-shrink-0">
                            <FiSmartphone size={24} />
                        </div>
                        <div>
                            <h6 className="fw-bold mb-0 text-dark small">MTN Mobile Money</h6>
                            <p className="text-muted tiny mb-0">Liberia's most trusted payment method</p>
                        </div>
                      </div>
 
                      <div className="mb-4">
                        <label className="form-label small fw-bold text-dark text-uppercase letter-spaced tiny" style={{ fontSize: '0.6rem' }}>MTN NUMBER</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-3 text-muted small fw-bold">+231</span>
                          <input 
                            type="text" 
                            className="form-control border-start-0 rounded-end-pill py-3 shadow-none fw-bold small" 
                            placeholder="888 000 0000"
                            value={momoNumber}
                            onChange={(e) => setMomoNumber(e.target.value)}
                          />
                        </div>
                        <p className="text-muted tiny mt-2 ps-2">Ensure your phone is nearby to approve the prompt.</p>
                      </div>
                    </>
                  )}
 
                  <button 
                    className="btn btn-dark w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                    onClick={() => handleSubscribe(selectedPlan)}
                    disabled={paying}
                  >
                    {paying ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <span className="small">{selectedPlan === 'PRO' ? 'Pay with MTN MoMo' : 'Activate Now'} <FiArrowRight className="ms-1" /></span>
                    )}
                  </button>
                </div>
                
                <div className="col-lg-5 offset-lg-1 d-none d-lg-block">
                  <div className="bg-sand rounded-5 p-5 text-center border border-opacity-10">
                    <img src="/momo-qr.png" alt="MTN MoMo" className="img-fluid mb-4 rounded-4 opacity-50" style={{ maxWidth: '160px' }} />
                    <h6 className="fw-bold text-dark mb-2">Secure Payment</h6>
                    <p className="text-muted tiny mb-0">Payments are encrypted and processed directly via MTN Liberia's secure infrastructure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: translateY(-5px); }
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .border-rust { border-color: #9C4A34 !important; }
      `}</style>
    </div>
  );
}
