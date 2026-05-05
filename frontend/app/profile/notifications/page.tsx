'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiBell, FiCheck } from 'react-icons/fi';

export default function NotificationsPage() {
  const router = useRouter();

  const settings = [
    { title: 'Email Notifications', desc: 'Receive booking updates via email', enabled: true },
    { title: 'Push Notifications', desc: 'Get real-time alerts on your device', enabled: false },
    { title: 'SMS Alerts', desc: 'Text reminders for your appointments', enabled: true },
  ];

  return (
    <div className="min-vh-100 bg-sand py-5">
      <div className="container" style={{ maxWidth: '600px' }}>
        <button onClick={() => router.back()} className="btn btn-link text-rust fw-bold text-decoration-none d-flex align-items-center gap-2 mb-4 p-0">
          <FiArrowLeft /> Back to Profile
        </button>

        <div className="bg-white rounded-5 shadow-sm p-5 border border-opacity-10">
          <div className="d-flex align-items-center gap-3 mb-5">
             <div className="bg-rust bg-opacity-10 p-3 rounded-circle text-rust">
                <FiBell size={32} />
             </div>
             <div>
                <h2 className="fw-bold mb-0 font-serif-italic">Notifications</h2>
                <p className="text-muted mb-0 small">Customize how we keep you updated.</p>
             </div>
          </div>

          <div className="d-flex flex-column gap-4">
            {settings.map((s, i) => (
              <div key={i} className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">{s.title}</h6>
                  <p className="text-muted small mb-0">{s.desc}</p>
                </div>
                <div className={`form-check form-switch`}>
                  <input className="form-check-input" type="checkbox" checked={s.enabled} readOnly />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
