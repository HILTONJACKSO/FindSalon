'use client';

import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <div className="contact-page bg-sand min-vh-100">
      {/* Hero Section */}
      <section className="bg-dark text-white py-5 mb-5 position-relative overflow-hidden">
        <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-lg-6">
              <p className="text-rust text-uppercase fw-bold mb-2 small letter-spaced">Connect With Us</p>
              <h1 className="display-3 fw-bold font-serif-italic mb-4">How can we help <br/><span className="text-rust">your aura?</span></h1>
              <p className="lead text-white-50 mb-0">Whether you're a customer seeking beauty or a salon owner looking to grow, our concierge team is here to assist.</p>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 end-0 opacity-10 d-none d-lg-block" style={{ transform: 'translate(10%, 20%)' }}>
          <FiMessageSquare size={600} />
        </div>
      </section>

      <div className="container pb-5">
        <div className="row g-5">
          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
              <h3 className="fw-bold mb-4 text-dark">Send us a Message</h3>
              <form className="row g-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">First Name</label>
                  <input type="text" className="form-control rounded-pill py-3 px-4 border-0 bg-sand shadow-none" placeholder="John" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Last Name</label>
                  <input type="text" className="form-control rounded-pill py-3 px-4 border-0 bg-sand shadow-none" placeholder="Doe" />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <input type="email" className="form-control rounded-pill py-3 px-4 border-0 bg-sand shadow-none" placeholder="john@example.com" />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Subject</label>
                  <select className="form-select rounded-pill py-3 px-4 border-0 bg-sand shadow-none appearance-none">
                    <option>General Inquiry</option>
                    <option>Business Partnership</option>
                    <option>Support Request</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Your Message</label>
                  <textarea className="form-control rounded-4 py-3 px-4 border-0 bg-sand shadow-none" rows={5} placeholder="How can we help you today?"></textarea>
                </div>
                <div className="col-12">
                  <button className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-lg w-100 mt-2 d-flex align-items-center justify-content-center gap-2 transition-all hover-scale">
                    <FiSend /> Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-4 h-100">
              
              <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 flex-grow-1">
                <h4 className="fw-bold mb-4 text-dark">Office Location</h4>
                <div className="d-flex gap-4 mb-5">
                  <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                    <FiMapPin size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Monrovia, Liberia</h6>
                    <p className="text-muted small mb-0">Tubman Boulevard, Sinkor<br/>FindSalon HQ, Suite 402</p>
                  </div>
                </div>

                <div className="d-flex gap-4 mb-5">
                  <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                    <FiPhone size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Direct Line</h6>
                    <p className="text-muted small mb-0">+231 88 000 0000<br/>+231 77 000 0000</p>
                  </div>
                </div>

                <div className="d-flex gap-4">
                  <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                    <FiMail size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Email Us</h6>
                    <p className="text-muted small mb-0">concierge@findsalon.com<br/>partners@findsalon.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-dark text-white rounded-5 p-5 shadow-sm overflow-hidden position-relative">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h4 className="fw-bold mb-3">Operating Hours</h4>
                  <p className="text-white-50 small mb-4">Our support team is available during the following hours:</p>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Mon — Fri</span>
                    <span className="fw-bold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">Saturday</span>
                    <span className="fw-bold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-white-50">Sunday</span>
                    <span className="fw-bold">Closed</span>
                  </div>
                </div>
                <FiClock className="position-absolute opacity-10" size={150} style={{ bottom: '-30px', right: '-30px' }} />
              </div>

            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .letter-spaced { letter-spacing: 1px; }
        .hover-scale:hover { transform: translateY(-3px); }
        .bg-sand { background-color: #fbf9f4; }
      `}</style>
    </div>
  );
}
