'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiShare, FiPlusSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallPwaProps {
  variant?: 'floating' | 'inline';
}

export default function InstallPwa({ variant = 'floating' }: InstallPwaProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Listen for the install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallModal(false);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      {variant === 'floating' ? (
        <div className="position-fixed bottom-0 start-0 m-4" style={{ zIndex: 1050 }}>
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInstallModal(true)}
            className="btn btn-rust rounded-pill shadow-lg px-4 py-2 d-flex align-items-center gap-2 border-0"
            style={{ background: '#FF4500', fontWeight: 'bold', color: 'white' }}
          >
            <FiDownload />
            <span className="d-none d-sm-inline">Download App</span>
          </motion.button>
        </div>
      ) : (
        <button 
          onClick={() => setShowInstallModal(true)}
          className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-lg transition-all hover-scale border-0"
          style={{ background: '#FF4500', color: 'white' }}
        >
          <FiDownload className="me-2" /> Download Site to Device
        </button>
      )}

      <AnimatePresence>
        {showInstallModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-4" style={{ zIndex: 2000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-5 shadow-2xl overflow-hidden position-relative"
              style={{ maxWidth: '400px', width: '100%' }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowInstallModal(false)}
                className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2 border-0"
              >
                <FiX size={20} />
              </button>

              <div className="p-5 text-center">
                <div className="bg-rust bg-opacity-10 rounded-circle p-4 d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <img src="/logo.jpg" alt="FindSalon" className="w-100 h-100 object-fit-cover rounded-circle" />
                </div>
                
                <h4 className="fw-bold text-dark mb-3">Install FindSalon</h4>
                <p className="text-muted mb-4 small">Add FindSalon to your home screen for a fast, full-screen experience and offline access.</p>

                {platform === 'ios' ? (
                  <div className="text-start bg-light rounded-4 p-3 mb-4">
                    <p className="small mb-2 fw-bold d-flex align-items-center gap-2">
                      <FiShare className="text-rust" /> 1. Tap the 'Share' button below
                    </p>
                    <p className="small mb-0 fw-bold d-flex align-items-center gap-2">
                      <FiPlusSquare className="text-rust" /> 2. Select 'Add to Home Screen'
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={handleInstallClick}
                    className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale"
                    style={{ background: '#FF4500', color: 'white' }}
                  >
                    {deferredPrompt ? 'Install Now' : 'Show Instructions'}
                  </button>
                )}

                <button 
                  onClick={() => setShowInstallModal(false)}
                  className="btn btn-link text-muted text-decoration-none small mt-3 fw-bold"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
