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
      id: 'ESSENTIAL',
      name: 'Essential',
      price: 15,
      description: 'Perfect for boutique artisans',
      features: ['10 Service Listings', 'Basic Analytics', 'Standard Support', 'Custom Profile']
    },
    {
      id: 'ELITE',
      name: 'Elite',
      price: 20,
      description: 'For high-volume luxury salons',
      features: ['Unlimited Listings', 'Advanced Growth Tools', '24/7 Priority Concierge', 'Featured Placement', 'Premium Branding']
    }
  ];

  const isExpired = new Date(salon?.subscription_expiry) < new Date();

  return (
    <div className="billing-page">
      <div className="mb-5">
        <h2 className="fw-bold text-dark mb-2">Subscription & Billing</h2>
        <p className="text-muted">Manage your Aura Luxe Partner plan and payments.</p>
      </div>

      <div className="row g-4">
        {/* Current Plan Status */}
        <div className="col-12">
          <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <div className="d-flex align-items-center gap-4">
              <div className={`bg-${salon?.subscription_plan === 'TRIAL' ? 'rust' : 'dark'} bg-opacity-10 text-${salon?.subscription_plan === 'TRIAL' ? 'rust' : 'dark'} rounded-4 p-3 d-flex align-items-center justify-content-center`} style={{ width: '64px', height: '64px' }}>
                <FiShield size={32} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h4 className="fw-bold mb-0 text-dark">
                    {salon?.subscription_plan === 'TRIAL' ? 'Free Trial' : salon?.subscription_plan} Plan
                  </h4>
                  {isExpired ? (
                    <span className="badge bg-danger rounded-pill px-3 py-1 small">Expired</span>
                  ) : (
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 small border border-success border-opacity-10">Active</span>
                  )}
                </div>
                <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                  <FiClock /> Valid until {salon?.subscription_expiry ? new Date(salon.subscription_expiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="text-md-end">
                <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '1px' }}>Current Monthly Bill</p>
                <h3 className="fw-bold mb-0 text-dark">${salon?.subscription_plan === 'ELITE' ? '20' : salon?.subscription_plan === 'ESSENTIAL' ? '15' : '0'}.00</h3>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="col-12 mt-5">
          <h4 className="fw-bold mb-4 text-dark">Available Plans</h4>
          <div className="row g-4">
            {plans.map((plan) => (
              <div key={plan.id} className="col-md-6">
                <div className={`bg-white rounded-5 p-5 h-100 shadow-sm border transition-all ${selectedPlan === plan.id ? 'border-rust border-2' : 'border-opacity-10'}`} style={{ position: 'relative' }}>
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
                    <h2 className="fw-bold text-dark mb-0">${plan.price}</h2>
                    <span className="text-muted">/month</span>
                  </div>

                  <ul className="list-unstyled mb-5 d-flex flex-column gap-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="d-flex align-items-center gap-3 text-dark small fw-medium">
                        <FiCheck className="text-rust flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`btn w-100 rounded-pill py-3 fw-bold transition-all ${selectedPlan === plan.id ? 'btn-light disabled' : 'btn-outline-dark'}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Current Plan' : `Choose ${plan.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {selectedPlan && selectedPlan !== salon?.subscription_plan && (
          <div className="col-12 mt-5">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
              <div className="row g-4 align-items-center">
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-3 text-dark">Complete Your Upgrade</h4>
                  <p className="text-muted mb-4">You are upgrading to the <strong className="text-dark">{selectedPlan}</strong> plan for <strong className="text-dark">${selectedPlan === 'ELITE' ? '20' : '15'}.00/month</strong>.</p>
                  
                  <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-sand rounded-4 border border-opacity-10">
                    <div className="bg-warning bg-opacity-20 text-warning rounded-3 p-2">
                        <FiSmartphone size={24} />
                    </div>
                    <div>
                        <h6 className="fw-bold mb-0 text-dark">MTN Mobile Money</h6>
                        <p className="text-muted small mb-0">Liberia's most trusted payment method</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-dark text-uppercase">MTN Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-4 text-muted small fw-bold">+231</span>
                      <input 
                        type="text" 
                        className="form-control border-start-0 rounded-end-pill py-3 shadow-none fw-bold" 
                        placeholder="888 000 0000"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                      />
                    </div>
                    <p className="text-muted small mt-2 ps-3">Ensure your phone is nearby to approve the prompt.</p>
                  </div>

                  <button 
                    className="btn btn-dark w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleSubscribe(selectedPlan)}
                    disabled={paying}
                  >
                    {paying ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>Pay with MTN MoMo <FiArrowRight /></>
                    )}
                  </button>
                </div>
                
                <div className="col-lg-5 offset-lg-1 d-none d-lg-block">
                  <div className="bg-sand rounded-5 p-5 text-center border border-opacity-10">
                    <img src="/momo-qr.png" alt="MTN MoMo" className="img-fluid mb-4 rounded-4 opacity-50" style={{ maxWidth: '200px' }} />
                    <h5 className="fw-bold text-dark mb-2">Secure Payment</h5>
                    <p className="text-muted small mb-0">Payments are encrypted and processed directly via MTN Liberia's secure infrastructure.</p>
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
