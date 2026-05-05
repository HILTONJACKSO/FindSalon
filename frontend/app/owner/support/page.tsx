'use client';

import React, { useState } from 'react';
import { 
    FiHelpCircle, 
    FiMail, 
    FiPhone, 
    FiMessageSquare, 
    FiSearch, 
    FiChevronDown, 
    FiChevronUp,
    FiBookOpen,
    FiVideo,
    FiExternalLink,
    FiSend
} from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';
import toast from 'react-hot-toast';

const faqs = [
    {
        question: "How do I add a new team member?",
        answer: "Go to Team Management in Settings, click 'Add Member', and fill in their details and role. They will receive an invite to join your salon."
    },
    {
        question: "How can I change my subscription plan?",
        answer: "Visit the Billing section in your profile to upgrade or downgrade your current plan. Changes take effect at the start of your next billing cycle."
    },
    {
        question: "How do I set custom prices for different staff members?",
        answer: "When editing a service, you can toggle 'Staff-Specific Pricing' and enter unique rates for each qualified team member."
    },
    {
        question: "What is the policy for booking cancellations?",
        answer: "You can define your own cancellation policy in Settings > Bookings. Clients will be notified of these rules during the checkout process."
    },
    {
        question: "How do I sync my calendar with Google Calendar?",
        answer: "Navigate to Settings > Integrations and select 'Google Calendar'. Follow the authorization prompts to sync your salon bookings in real-time."
    }
];

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success('Support ticket submitted successfully!');
        setSubject('');
        setMessage('');
        setIsSubmitting(false);
    };

    return (
        <div className="pb-5">
            <OwnerHeader />

            {/* PAGE TITLE */}
            <div className="mb-5 animate__animated animate__fadeIn">
                <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Help & Support</h1>
                <p className="text-muted">How can we assist you today? Search our knowledge base or reach out to us directly.</p>
            </div>

            <div className="row g-4 mb-5">
                {/* SEARCH BAR */}
                <div className="col-12">
                    <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 d-flex align-items-center gap-3 transition-all hover-shadow-md">
                        <FiSearch className="text-rust opacity-50" size={24} />
                        <input 
                            type="text" 
                            placeholder="Search for help articles, tutorials, or FAQs..." 
                            className="form-control border-0 shadow-none bg-transparent py-2"
                            style={{ fontSize: '1.1rem' }}
                        />
                        <button className="btn btn-rust rounded-pill px-5 py-3 fw-bold transition-all hover-scale">Search</button>
                    </div>
                </div>
            </div>

            <div className="row g-5">
                {/* LEFT COLUMN: FAQ & HELP ARTICLES */}
                <div className="col-12 col-lg-8">
                    
                    {/* QUICK RESOURCES */}
                    <div className="row g-4 mb-5">
                        <div className="col-12 col-md-4">
                            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer group">
                                <div className="bg-sand rounded-4 p-3 d-inline-block mb-3 transition-all group-hover:bg-rust group-hover:text-white">
                                    <FiBookOpen size={24} className="text-rust" />
                                </div>
                                <h6 className="fw-bold mb-2">Documentation</h6>
                                <p className="text-muted small mb-0">Detailed guides on every feature of Aura Luxe.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer group">
                                <div className="bg-sand rounded-4 p-3 d-inline-block mb-3 transition-all group-hover:bg-rust group-hover:text-white">
                                    <FiVideo size={24} className="text-rust" />
                                </div>
                                <h6 className="fw-bold mb-2">Video Tutorials</h6>
                                <p className="text-muted small mb-0">Step-by-step visual guides for your team.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="bg-white rounded-5 p-4 shadow-sm border border-opacity-10 h-100 transition-all hover-scale cursor-pointer group">
                                <div className="bg-sand rounded-4 p-3 d-inline-block mb-3 transition-all group-hover:bg-rust group-hover:text-white">
                                    <FiExternalLink size={24} className="text-rust" />
                                </div>
                                <h6 className="fw-bold mb-2">Community</h6>
                                <p className="text-muted small mb-0">Connect with other salon owners and share tips.</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ SECTION */}
                    <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
                        <div className="d-flex align-items-center gap-2 mb-5">
                            <span className="bg-rust rounded-pill" style={{ width: '6px', height: '24px' }}></span>
                            <h4 className="fw-bold mb-0">Frequently Asked Questions</h4>
                        </div>
                        
                        <div className="d-flex flex-column gap-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border-bottom border-opacity-10 pb-3">
                                    <button 
                                        onClick={() => toggleFaq(index)}
                                        className="btn w-100 text-start d-flex align-items-center justify-content-between p-0 border-0 mb-2 shadow-none transition-all hover-rust"
                                    >
                                        <span className={`fw-bold ${openFaq === index ? 'text-rust' : 'text-dark'}`}>{faq.question}</span>
                                        {openFaq === index ? <FiChevronUp className="text-rust" /> : <FiChevronDown className="text-muted" />}
                                    </button>
                                    {openFaq === index && (
                                        <div className="animate__animated animate__fadeIn">
                                            <p className="text-muted small mb-0 lh-base">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: CONTACT & TICKET */}
                <div className="col-12 col-lg-4">
                    
                    {/* CONTACT INFO */}
                    <div className="bg-sand rounded-5 p-5 shadow-sm border border-white border-2 mb-5" style={{ backgroundColor: '#ECE5DD' }}>
                        <h5 className="fw-bold text-rust mb-4">Direct Contact</h5>
                        <div className="d-flex flex-column gap-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white rounded-circle p-2 shadow-sm text-rust">
                                    <FiPhone size={18} />
                                </div>
                                <div>
                                    <p className="small text-muted mb-0">Call Us</p>
                                    <p className="fw-bold mb-0">+231 88 000 0000</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white rounded-circle p-2 shadow-sm text-rust">
                                    <FiMail size={18} />
                                </div>
                                <div>
                                    <p className="small text-muted mb-0">Email Support</p>
                                    <p className="fw-bold mb-0">help@auraluxe.com</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white rounded-circle p-2 shadow-sm text-rust">
                                    <FiMessageSquare size={18} />
                                </div>
                                <div>
                                    <p className="small text-muted mb-0">Live Chat</p>
                                    <p className="fw-bold mb-0">Available Mon-Fri</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TICKET FORM */}
                    <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <span className="bg-rust rounded-pill" style={{ width: '4px', height: '18px' }}></span>
                            <h5 className="fw-bold mb-0">Submit a Ticket</h5>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="text-muted small fw-bold mb-2 letter-spaced">SUBJECT</label>
                                <input 
                                    type="text" 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="form-control rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium"
                                    placeholder="Briefly describe the issue"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-muted small fw-bold mb-2 letter-spaced">MESSAGE</label>
                                <textarea 
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="form-control rounded-5 border-0 shadow-sm py-4 px-4 bg-sand fw-medium lh-base text-muted"
                                    placeholder="Tell us more about your problem..."
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale d-flex align-items-center justify-content-center gap-2"
                            >
                                {isSubmitting ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <FiSend /> Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-sand { background-color: #FDFBF7; }
                .text-rust { color: #9C4A34; }
                .bg-rust { background-color: #9C4A34; }
                .btn-rust { background-color: #9C4A34; color: white; border: none; }
                .btn-rust:hover { background-color: #823d2b; color: white; }
                .letter-spaced { letter-spacing: 1px; font-size: 0.65rem; text-transform: uppercase; }
                .animate__fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hover-shadow-md:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                }
                .group:hover .group-hover\:bg-rust {
                    background-color: #9C4A34 !important;
                }
                .group:hover .group-hover\:text-white {
                    color: white !important;
                }
            `}</style>
        </div>
    );
}
