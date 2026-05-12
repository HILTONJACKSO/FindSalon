'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = 'success', isVisible, onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <FiCheckCircle className="text-success" size={24} />;
            case 'error': return <FiXCircle className="text-danger" size={24} />;
            default: return <FiInfo className="text-primary" size={24} />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-white border-success border-opacity-25';
            case 'error': return 'bg-white border-danger border-opacity-25';
            default: return 'bg-white border-primary border-opacity-25';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%', scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.9 }}
                    className={`position-fixed bottom-0 start-50 mb-5 p-3 rounded-5 shadow-lg border d-flex align-items-center gap-3 z-3 ${getBgColor()}`}
                    style={{ minWidth: '320px', maxWidth: '90vw' }}
                >
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="flex-grow-1 pe-2">
                        <p className="mb-0 fw-bold text-dark small">{message}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="btn btn-link p-0 text-muted hover-text-dark border-0"
                    >
                        <FiX size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
