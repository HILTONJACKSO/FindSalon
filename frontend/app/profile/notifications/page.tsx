'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiBell, FiClock, FiCheckCircle, FiInfo, FiTag } from 'react-icons/fi';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await api.patch(`/notifications/${id}/`, { is_read: true });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'APPROVAL': return <FiCheckCircle className="text-success" />;
            case 'BROADCAST': return <FiBell className="text-rust" />;
            case 'PROMOTION': return <FiTag className="text-warning" />;
            default: return <FiInfo className="text-primary" />;
        }
    };

    if (loading) {
        return (
            <div className="d-flex min-vh-100 align-items-center justify-content-center bg-sand">
                <div className="spinner-border text-rust" role="status"></div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-sand py-5">
            <div className="container" style={{ maxWidth: '800px' }}>
                <button onClick={() => router.back()} className="btn btn-link text-rust fw-bold text-decoration-none d-flex align-items-center gap-2 mb-4 p-0">
                    <FiArrowLeft /> Back to Profile
                </button>

                <div className="bg-white rounded-5 shadow-sm p-5 border border-opacity-10 mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-rust bg-opacity-10 p-3 rounded-circle text-rust">
                                <FiBell size={32} />
                            </div>
                            <div>
                                <h2 className="fw-bold mb-0 font-serif-italic">Notifications</h2>
                                <p className="text-muted mb-0 small">Updates from FindSalon and your favorite artists.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden">
                    <AnimatePresence mode='popLayout'>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <motion.div 
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 border-bottom border-opacity-10 transition-all ${!notification.is_read ? 'bg-rust bg-opacity-5 border-start border-4 border-rust' : 'hover-bg-light'}`}
                                    style={{ borderColor: !notification.is_read ? '#9C4A34' : 'rgba(0,0,0,0.05)' }}
                                >
                                    <div className="d-flex gap-4">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm ${!notification.is_read ? 'bg-white' : 'bg-light'}`} style={{ width: '48px', height: '48px' }}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className={`fw-bold mb-0 ${!notification.is_read ? 'text-dark' : 'text-muted'}`}>{notification.title}</h6>
                                                <span className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                                    <FiClock size={12} /> {new Date(notification.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`mb-2 small ${!notification.is_read ? 'text-dark' : 'text-muted-dark'}`} style={{ lineHeight: '1.6' }}>
                                                {notification.message}
                                            </p>
                                            {!notification.is_read && (
                                                <button 
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="btn btn-link text-rust p-0 fw-bold text-decoration-none"
                                                    style={{ fontSize: '0.7rem' }}
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-5 text-center py-5">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                                    <FiBell size={40} className="text-muted opacity-50" />
                                </div>
                                <h4 className="fw-bold mb-2">Your inbox is clear</h4>
                                <p className="text-muted mx-auto" style={{ maxWidth: '300px' }}>We'll notify you here about your bookings, deals, and platform news.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: #FDFBF7;
                }
                .text-muted-dark {
                    color: #666;
                }
                .bg-rust { background-color: #9C4A34; }
                .text-rust { color: #9C4A34; }
            `}</style>
        </div>
    );
}
