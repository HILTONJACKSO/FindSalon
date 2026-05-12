'use client';

import React, { useState, useEffect } from 'react';
import { FiSend, FiUsers, FiCheckCircle, FiClock, FiAlertCircle, FiPlus, FiX } from 'react-icons/fi';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/components/shared/Toast';

export default function BroadcastManagement() {
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        target_audience: 'ALL'
    });

    const fetchBroadcasts = async () => {
        try {
            const res = await api.get('/notifications/broadcasts/');
            setBroadcasts(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch broadcasts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/notifications/broadcasts/', formData);
            // After creating, we trigger it immediately for better UX
            await api.post(`/notifications/broadcasts/${res.data.id}/trigger_broadcast/`);
            setShowModal(false);
            setFormData({ title: '', message: '', target_audience: 'ALL' });
            fetchBroadcasts();
            setToast({
                isVisible: true,
                message: "Broadcast sent successfully to the platform!",
                type: 'success'
            });
        } catch (err) {
            console.error("Failed to send broadcast", err);
            setToast({
                isVisible: true,
                message: "Error sending broadcast. Please try again.",
                type: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="d-flex min-vh-50 align-items-center justify-content-center">
                <div className="spinner-border text-rust" role="status"></div>
            </div>
        );
    }

    return (
        <div className="admin-broadcast-page">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1 text-dark">Platform Broadcasts</h2>
                    <p className="text-muted">Send mass notifications to your users and salon owners.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn btn-rust rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                >
                    <FiPlus size={20} /> Create New Broadcast
                </button>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden">
                        <div className="p-4 border-bottom border-opacity-10 bg-light">
                            <h5 className="fw-bold mb-0">Message History</h5>
                        </div>
                        <div className="list-group list-group-flush">
                            {broadcasts.length > 0 ? (
                                broadcasts.map((b) => (
                                    <div key={b.id} className="list-group-item p-4 border-bottom">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <h6 className="fw-bold mb-0">{b.title}</h6>
                                                <span className={`badge rounded-pill px-2 py-1 small ${b.is_sent ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`} style={{ fontSize: '0.65rem' }}>
                                                    {b.is_sent ? 'SENT' : 'DRAFT'}
                                                </span>
                                            </div>
                                            <span className="text-muted small d-flex align-items-center gap-1">
                                                <FiClock size={12} /> {new Date(b.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-muted small mb-3">{b.message}</p>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="d-flex align-items-center gap-1 text-rust small fw-bold">
                                                <FiUsers size={14} /> 
                                                <span>Target: {b.target_audience === 'ALL' ? 'All Users' : b.target_audience === 'OWNERS' ? 'Salon Owners' : 'Customers'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-5 text-center text-muted">
                                    <FiAlertCircle size={48} className="mb-3 opacity-25" />
                                    <p>No broadcasts found. Send your first message!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="bg-rust text-white p-4 rounded-5 shadow-sm mb-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <FiSend /> Broadcast Tips
                        </h5>
                        <ul className="list-unstyled small mb-0 d-flex flex-column gap-3 opacity-90">
                            <li>• Keep messages clear and concise.</li>
                            <li>• Use emojis to grab attention! ✨</li>
                            <li>• Target specific audiences for better engagement.</li>
                            <li>• Messages are delivered instantly to all active accounts.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Create Broadcast Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-5 p-5 shadow-lg w-100" 
                            style={{ maxWidth: '600px' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold mb-0">New Platform Message</h3>
                                <button className="btn btn-link text-dark p-0" onClick={() => setShowModal(false)}><FiX size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Broadcast Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control rounded-pill px-4 py-3 border-opacity-25" 
                                        placeholder="e.g. New Wholesale Supplies Arrived!"
                                        required 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Target Audience</label>
                                    <select 
                                        className="form-select rounded-pill px-4 py-3 border-opacity-25" 
                                        required 
                                        value={formData.target_audience} 
                                        onChange={e => setFormData({...formData, target_audience: e.target.value})}
                                    >
                                        <option value="ALL">All Users</option>
                                        <option value="OWNERS">Salon Owners Only</option>
                                        <option value="CUSTOMERS">Customers Only</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">Message Content</label>
                                    <textarea 
                                        className="form-control rounded-4 px-4 py-3 border-opacity-25" 
                                        rows={4} 
                                        placeholder="Write your announcement here..."
                                        required 
                                        value={formData.message} 
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
                                    <FiSend /> Send Broadcast Now
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Toast 
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />

            <style jsx>{`
                .btn-rust { background-color: #9C4A34; color: white; border: none; }
                .btn-rust:hover { background-color: #833e2b; color: white; }
                .text-rust { color: #9C4A34; }
                .bg-rust { background-color: #9C4A34; }
            `}</style>
        </div>
    );
}
