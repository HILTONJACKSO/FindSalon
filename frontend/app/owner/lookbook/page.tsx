'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    FiPlus, 
    FiImage, 
    FiTrash2, 
    FiLink,
    FiX,
    FiTag
} from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { usePopup } from '@/context/PopupContext';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function LookbookManagementPage() {
  const { showPopup } = usePopup();
  const [items, setItems] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    service_id: '',
    price: '',
    category: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchServices();
  }, []);

  const fetchItems = async () => {
    try {
        const response = await api.get(`/salons/portfolio/mine/?_t=${Date.now()}`);
        setItems(response.data.results || response.data);
    } catch (error) {
        console.error("Error fetching lookbook items", error);
    } finally {
        setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
        const response = await api.get(`/services/?mine=true&_t=${Date.now()}`);
        setServices(response.data.results || response.data);
    } catch (error) {
        console.error("Error fetching services", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
        // Closing: Reset everything
        setFormData({
            title: '',
            service_id: '',
            price: '',
            category: ''
        });
        setSelectedFile(null);
        setSelectedImagePreview(null);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const svcId = e.target.value;
    const selectedService = services.find(s => s.id.toString() === svcId);
    
    setFormData({
      ...formData,
      service_id: svcId,
      // Auto-fill title and price if they are currently empty, or update them to match the new service
      title: selectedService ? selectedService.name : '',
      price: selectedService ? selectedService.price.toString() : '',
      category: selectedService ? selectedService.category_name || '' : ''
    });
  };

  const handleDeleteItem = async (id: number) => {
    showPopup({
      title: 'Remove Style?',
      message: 'Are you sure you want to remove this look from your portfolio? It will no longer be visible to clients.',
      type: 'CONFIRM',
      confirmLabel: 'Delete Permanently',
      onConfirm: async () => {
        try {
          await api.delete(`/salons/portfolio/${id}/`);
          setItems(items.filter(item => item.id !== id));
          toast.success("Style removed from Lookbook");
        } catch (err) {
          toast.error("Failed to remove style");
        }
      }
    });
  };

  const handleSaveItem = async () => {
    if (!selectedFile) {
        toast.error("Please upload an image for this look.");
        return;
    }
    if (!formData.service_id) {
        toast.error("Please link this look to an existing service.");
        return;
    }

    setIsSaving(true);
    const formDataPayload = new FormData();
    formDataPayload.append('image', selectedFile);
    formDataPayload.append('service', formData.service_id);
    if (formData.title) formDataPayload.append('title', formData.title);
    if (formData.price) formDataPayload.append('price', formData.price);
    if (formData.category) formDataPayload.append('category', formData.category);

    try {
      const res = await api.post('/salons/portfolio/', formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      setItems([res.data, ...items]);
      toast.success('Style added to Lookbook!');
      toggleModal();
    } catch (err: any) {
      console.error("Save error", err);
      toast.error(err.response?.data?.detail || "Failed to add style");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-5">
      <OwnerHeader 
        onQuickAction={toggleModal} 
        actionLabel="Upload Look" 
        searchPlaceholder="Search portfolio..." 
      />

      <div className="mb-5 px-2">
        <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Style Lookbook</h1>
        <p className="text-muted mb-0 lh-base" style={{ maxWidth: '600px' }}>
            Showcase your best work. Upload stunning photos of your styles and link them to your services so clients can "Book the Look" instantly.
        </p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-rust" role="status"></div>
        </div>
      ) : (
        <div className="row g-4 px-2">
          <div className="col-12 col-md-6 col-xl-4" onClick={toggleModal}>
              <div className="bg-white rounded-5 p-5 border border-2 border-dashed border-opacity-20 d-flex flex-column align-items-center justify-content-center text-center h-100 transition-all hover-rust hover-scale cursor-pointer" style={{ minHeight: '350px' }}>
                  <div className="bg-sand rounded-pill p-4 mb-4 text-rust">
                      <FiPlus size={32} />
                  </div>
                  <h5 className="fw-bold mb-2">Add New Style</h5>
                  <p className="text-muted small px-4 mb-0">Upload a photo to inspire your clients.</p>
              </div>
          </div>

          {items.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-xl-4">
                  <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden h-100 transition-all hover-scale position-relative group">
                      <div className="position-relative" style={{ height: '280px' }}>
                          <img src={getImageUrl(item.image) || ''} className="w-100 h-100 object-fit-cover" alt={item.title} />
                          
                          {/* Top Badges */}
                          <div className="position-absolute top-0 start-0 w-100 d-flex justify-content-between p-3" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' }}>
                             <div className="bg-white bg-opacity-75 backdrop-blur rounded-pill px-3 py-1 fw-bold text-dark shadow-sm d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                <FiTag size={12} /> {item.category || 'Style'}
                             </div>
                             {item.price && (
                                <div className="bg-white bg-opacity-75 backdrop-blur rounded-pill px-3 py-1 fw-bold text-rust shadow-sm" style={{ fontSize: '0.75rem' }}>
                                    ${item.price}
                                </div>
                             )}
                          </div>

                          {/* Delete Button (Visible on hover) */}
                          <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="btn btn-danger btn-sm rounded-circle position-absolute top-50 start-50 translate-middle shadow opacity-0 group-hover-opacity-100 transition-all hover-scale"
                              style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                          >
                              <FiTrash2 size={18} />
                          </button>

                          {/* Bottom Info Banner */}
                          <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                              <h5 className="fw-bold text-white mb-1">{item.title}</h5>
                              {item.service && (
                                <div className="d-flex align-items-center gap-1 text-white-50 small fw-medium">
                                    <FiLink size={12} /> Linked to Service
                                </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1050 }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="p-5">
                    <div className="d-flex justify-content-between align-items-start mb-5">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>Upload Look</h2>
                            <p className="text-muted small mb-0">Showcase your artistry to attract visual bookings.</p>
                        </div>
                        <button onClick={toggleModal} className="btn btn-light rounded-circle shadow-sm p-3 d-flex align-items-center justify-content-center">
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="custom-scrollbar pe-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <div className="row g-4 m-0">
                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">STYLE PHOTO</label>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="d-none" 
                                    accept="image/*"
                                />
                                <div 
                                    onClick={handleFileClick}
                                    className="rounded-5 border-2 border-dashed border-opacity-10 bg-sand p-4 text-center cursor-pointer mb-2 transition-all hover-rust overflow-hidden position-relative"
                                    style={{ height: selectedImagePreview ? '300px' : 'auto' }}
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                        {selectedImagePreview ? (
                                            <img src={selectedImagePreview} className="h-100 w-100 object-fit-cover rounded-4 position-absolute top-0 start-0" alt="Preview" />
                                        ) : (
                                            <>
                                                <FiImage size={40} className="mb-2 opacity-50" />
                                                <span className="small fw-bold opacity-75">Click to browse or drag image here</span>
                                                <span className="text-muted" style={{ fontSize: '0.65rem' }}>High quality portrait photos work best</span>
                                            </>
                                        )}
                                    </div>
                                    {selectedImagePreview && (
                                        <div className="position-absolute top-0 end-0 m-3 bg-white rounded-circle p-2 shadow-sm d-flex" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setSelectedImagePreview(null); }}>
                                            <FiTrash2 className="text-danger" size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">LINK TO SERVICE</label>
                                <select 
                                    className="form-select rounded-pill border-0 bg-sand p-3 shadow-none fw-bold"
                                    value={formData.service_id}
                                    onChange={handleServiceChange}
                                >
                                    <option value="" disabled>Select the treatment that creates this look</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name} (${s.price})</option>)}
                                </select>
                                <div className="form-text small mt-2">When clients click this photo, they will be prompted to book this service.</div>
                            </div>

                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">CUSTOM TITLE (OPTIONAL)</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" 
                                    placeholder="e.g. Platinum Blonde Balayage" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div className="col-12 mt-5">
                                <button 
                                    className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale" 
                                    onClick={handleSaveItem}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Uploading...' : 'Publish to Lookbook'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 2px; }
        .backdrop-blur { backdrop-filter: blur(8px); }
        .hover-scale:hover { transform: translateY(-5px); }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-rust:hover { color: #9C4A34 !important; }

        .group:hover .group-hover-opacity-100 { opacity: 1 !important; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #fdfbf7;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 74, 52, 0.2);
            border-radius: 10px;
            transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 74, 52, 0.5);
        }
      `}</style>
    </div>
  );
}
