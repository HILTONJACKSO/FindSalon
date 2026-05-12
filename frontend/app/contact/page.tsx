'use client';

import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

export default function ContactPage() {
  return (
    <div className="contact-page bg-white min-vh-100">
      {/* ELITE HERO SECTION - FLAGSHIP CREAM DESIGN */}
      <section className="position-relative overflow-hidden pt-5" style={{ background: '#FDF9F0', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
        {/* Subtle Grid Pattern Overlay */}
        <div className="position-absolute w-100 h-100 opacity-20" style={{ backgroundImage: `linear-gradient(#E5D5C5 1px, transparent 1px), linear-gradient(90deg, #E5D5C5 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }}></div>
        
        {/* Background Decorative Blob */}
        <div className="position-absolute rounded-circle blur-3xl opacity-30 d-none d-md-block" style={{ width: '600px', height: '600px', background: '#F4E7D3', top: '-10%', right: '-10%', filter: 'blur(120px)', zIndex: 0 }}></div>

        <div className="container position-relative py-5" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="d-inline-flex align-items-center gap-2 mb-3 bg-rust text-white px-3 py-1 rounded-pill shadow-sm">
                  <FiMessageSquare size={14} />
                  <span className="text-uppercase fw-bold small letter-spaced" style={{ fontSize: '0.65rem' }}>Connect With Us</span>
                </div>
                <h1 className="display-3 fw-bold mb-3" style={{ color: '#5D2E17', lineHeight: '1.1' }}>
                  How can we help <br />
                  <span className="font-serif-italic" style={{ color: '#B45309' }}>your aura?</span>
                </h1>
                <p className="lead mt-4 mb-0 opacity-75 mx-auto mx-lg-0" style={{ maxWidth: '480px', color: '#7C4B30' }}>
                  Whether you're a customer seeking beauty or a salon owner looking to grow, our concierge team is here to assist.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5 mt-n5 position-relative" style={{ zIndex: 5 }}>
        <div className="row g-5">
          {/* Contact Form - Refined Design */}
          <div className="col-lg-7">
            <FadeIn>
              <div className="bg-white rounded-5 p-4 p-md-5 shadow-xl border border-light">
                <h3 className="fw-bold mb-5 text-dark font-serif-italic">Send us a Message</h3>
                <form className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted letter-spaced">FIRST NAME</label>
                    <input type="text" className="form-control rounded-pill py-3 px-4 border-0 bg-sand transition-all focus-ring" placeholder="John" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted letter-spaced">LAST NAME</label>
                    <input type="text" className="form-control rounded-pill py-3 px-4 border-0 bg-sand transition-all focus-ring" placeholder="Doe" />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted letter-spaced">EMAIL ADDRESS</label>
                    <input type="email" className="form-control rounded-pill py-3 px-4 border-0 bg-sand transition-all focus-ring" placeholder="john@example.com" />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted letter-spaced">SUBJECT</label>
                    <div className="position-relative">
                      <select className="form-select rounded-pill py-3 px-4 border-0 bg-sand shadow-none appearance-none">
                        <option>General Inquiry</option>
                        <option>Business Partnership</option>
                        <option>Support Request</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted letter-spaced">YOUR MESSAGE</label>
                    <textarea className="form-control rounded-5 py-4 px-4 border-0 bg-sand transition-all focus-ring" rows={5} placeholder="How can we help you today?"></textarea>
                  </div>
                  <div className="col-12 pt-3">
                    <button className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-lg w-100 d-flex align-items-center justify-content-center gap-2 transition-all hover-translate-up">
                      <FiSend /> SEND MESSAGE
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>
          </div>

          {/* Contact Info Sidebar - Luxury Glass Cards */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-4 h-100">
              
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-5 p-5 shadow-lg border border-light">
                  <h4 className="fw-bold mb-5 text-dark font-serif-italic border-bottom pb-3">Contact Details</h4>
                  
                  <div className="d-flex gap-4 mb-5 group">
                    <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0 transition-all hover-scale" style={{ width: '56px', height: '56px' }}>
                      <FiMapPin size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark text-uppercase letter-spaced" style={{ fontSize: '0.75rem' }}>Office Location</h6>
                      <p className="text-muted mb-0 lead" style={{ fontSize: '0.95rem' }}>Tubman Boulevard, Sinkor<br/>FindSalon HQ, Suite 402</p>
                    </div>
                  </div>

                  <div className="d-flex gap-4 mb-5 group">
                    <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0 transition-all hover-scale" style={{ width: '56px', height: '56px' }}>
                      <FiPhone size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark text-uppercase letter-spaced" style={{ fontSize: '0.75rem' }}>Direct Line</h6>
                      <p className="text-muted mb-0 lead" style={{ fontSize: '0.95rem' }}>+231 88 000 0000<br/>+231 77 000 0000</p>
                    </div>
                  </div>

                  <div className="d-flex gap-4 group">
                    <div className="bg-rust bg-opacity-10 text-rust rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0 transition-all hover-scale" style={{ width: '56px', height: '56px' }}>
                      <FiMail size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark text-uppercase letter-spaced" style={{ fontSize: '0.75rem' }}>Email Us</h6>
                      <p className="text-muted mb-0 lead" style={{ fontSize: '0.95rem' }}>concierge@findsalon.com<br/>partners@findsalon.com</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="bg-dark text-white rounded-5 p-5 shadow-xl overflow-hidden position-relative" style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)' }}>
                  <div className="position-relative" style={{ zIndex: 1 }}>
                    <h4 className="fw-bold mb-2 font-serif-italic">Operating Hours</h4>
                    <p className="text-white-50 small mb-5 opacity-70 letter-spaced">CONCIERGE AVAILABILITY</p>
                    
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center border-bottom border-white border-opacity-10 pb-2">
                        <span className="text-white-50 fw-medium">Mon — Fri</span>
                        <span className="fw-bold">9:00 AM — 6:00 PM</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-bottom border-white border-opacity-10 pb-2">
                        <span className="text-white-50 fw-medium">Saturday</span>
                        <span className="fw-bold">10:00 AM — 4:00 PM</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-white-50 fw-medium">Sunday</span>
                        <span className="fw-bold badge bg-rust text-white rounded-pill px-3 py-2">Closed</span>
                      </div>
                    </div>
                  </div>
                  <FiClock className="position-absolute opacity-10" size={180} style={{ bottom: '-40px', right: '-40px', filter: 'blur(1px)' }} />
                </div>
              </FadeIn>

            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .font-serif-italic { font-family: var(--font-serif); font-style: italic; }
        .letter-spaced { letter-spacing: 1.5px; }
        .bg-sand { background-color: #F8F5F0; }
        .focus-ring:focus { 
          background-color: #fff !important;
          box-shadow: 0 0 0 4px rgba(180, 83, 9, 0.1) !important;
          border: 1px solid rgba(180, 83, 9, 0.2) !important;
        }
        .hover-translate-up:hover { transform: translateY(-5px); }
        .hover-scale:hover { transform: scale(1.1); }
        .shadow-xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); }
        .mt-n5 { margin-top: -3rem !important; }
      `}</style>
    </div>
  );
}
