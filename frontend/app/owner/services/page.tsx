'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    FiPlus, 
    FiClock, 
    FiEdit2, 
    FiTrash2, 
    FiLayers,
    FiImage,
    FiCheckSquare
} from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { usePopup } from '@/context/PopupContext';
import OwnerHeader from '@/components/owner/OwnerHeader';

export default function ServicesManagementPage() {
  const { showPopup } = usePopup();
  const [activeCategory, setActiveCategory] = useState<any>('All');
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    staff: 1,
    description: ''
  });

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
        // HYPER-SCALE CACHE BUSTING: Ensure fresh data on every load
        const response = await api.get(`/services/categories/?mine=true&_t=${Date.now()}`);
        setCategories(response.data.results || response.data);
    } catch (error) {
        console.error("Error fetching categories", error);
    }
  };

  const fetchServices = async () => {
    try {
        // HYPER-SCALE CACHE BUSTING: Ensure fresh data on every load
        const response = await api.get(`/services/?mine=true&_t=${Date.now()}`);
        setServices(response.data.results || response.data);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching services", error);
        setLoading(false);
    }
  };




  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
        // Opening: we don't reset if we're editing, handled in handleEditClick
    } else {
        // Closing: Reset everything
        setFormData({
            name: '',
            category: categories.length > 0 ? categories[0].id : '',
            price: '',
            duration: '',
            staff: 1,
            description: ''
        });
        setSelectedFile(null);
        setSelectedImagePreview(null);
        setEditingServiceId(null);
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

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/services/${id}/`, { is_active: !currentStatus });
      setServices(services.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      toast.success("Availability updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteService = async (id: number) => {
    showPopup({
      title: 'Remove Treatment?',
      message: 'Are you sure you want to delete this treatment? This action will permanently remove it from your service menu.',
      type: 'CONFIRM',
      confirmLabel: 'Delete Permanently',
      onConfirm: async () => {
        try {
          await api.delete(`/services/${id}/`);
          setServices(services.filter(s => s.id !== id));
          toast.success("Service removed successfully");
        } catch (err) {
          toast.error("Failed to delete service");
        }
      }
    });
  };

  const handleEditClick = (svc: any) => {
    setFormData({
        name: svc.name,
        category: svc.category,
        price: svc.price.toString(),
        duration: svc.duration.toString(),
        staff: svc.max_staff || 1,
        description: svc.description || ''
    });
    setSelectedImagePreview(svc.image);
    setEditingServiceId(svc.id);
    setIsModalOpen(true);
  };

  const handleSaveService = async () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.category) {
        toast.error("Please fill in all required fields.");
        return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('name', formData.name);
    formDataPayload.append('price', formData.price);
    formDataPayload.append('duration', formData.duration);
    formDataPayload.append('category', formData.category);
    formDataPayload.append('max_staff', formData.staff.toString());
    formDataPayload.append('description', formData.description);
    formDataPayload.append('is_active', 'true');
    
    if (selectedFile) {
        formDataPayload.append('image', selectedFile);
    }

    try {
      if (editingServiceId) {
          const res = await api.patch(`/services/${editingServiceId}/`, formDataPayload, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          setServices(services.map(s => s.id === editingServiceId ? res.data : s));
      } else {
          const res = await api.post('/services/', formDataPayload, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          setServices([res.data, ...services]);
      }
      toast.success(editingServiceId ? 'Treatment updated!' : 'Treatment created!');
      toggleModal();
    } catch (err: any) {
      console.error("Save error", err);
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save service");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
        await api.post('/services/categories/', { name: newCategoryName });
        setNewCategoryName('');
        setShowCategoryModal(false);
        toast.success('Category created successfully!');
        fetchCategories();
    } catch (error) {
        console.error("Error creating category", error);
        toast.error('Failed to create category');
    }
  };

  const servicesToDisplay = activeCategory === 'All' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="pb-5">
      <OwnerHeader 
        onQuickAction={toggleModal} 
        actionLabel="Add Service" 
        searchPlaceholder="Search services..." 
      />

      <div className="mb-5 px-2">
        <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Services Management</h1>
        <p className="text-muted mb-0 lh-base" style={{ maxWidth: '600px' }}>
            Manage your salon's treatment menu and pricing. Adjust durations, staff assignments, and availability in real-time.
        </p>
      </div>

      <div className="d-flex gap-3 mb-5 px-2 overflow-auto scrollbar-none pb-2 align-items-center">
        <button 
            onClick={() => setActiveCategory('All')}
            className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${activeCategory === 'All' ? 'btn-rust text-white shadow' : 'bg-white text-muted hover-bg-light shadow-sm border-0'}`}
            style={{ fontSize: '0.85rem' }}
        >
            All Services
        </button>
        {categories.map((cat) => (
            <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${activeCategory === cat.id ? 'btn-rust text-white shadow' : 'bg-white text-muted hover-bg-light shadow-sm border-0'}`}
                style={{ fontSize: '0.85rem' }}
            >
                {cat.name}
            </button>
        ))}
        <button onClick={() => setShowCategoryModal(true)} className="btn rounded-pill px-3 py-2 fw-bold text-nowrap transition-all bg-light text-rust border-0 d-flex align-items-center gap-1 hover-scale" style={{ fontSize: '0.85rem' }}>
          <FiPlus size={16} /> Category
        </button>
      </div>

      <div className="row g-4 px-2">
        <div className="col-12 col-md-6 col-xl-4" onClick={toggleModal}>
            <div className="bg-white rounded-5 p-5 border border-2 border-dashed border-opacity-20 d-flex flex-column align-items-center justify-content-center text-center h-100 transition-all hover-rust hover-scale cursor-pointer" style={{ minHeight: '350px' }}>
                <div className="bg-sand rounded-pill p-4 mb-4 text-rust">
                    <FiPlus size={32} />
                </div>
                <h5 className="fw-bold mb-2">Add New Service</h5>
                <p className="text-muted small px-4 mb-0">Introduce a new luxury treatment to your portfolio.</p>
            </div>
        </div>

        {servicesToDisplay.map((svc) => (
            <div key={svc.id} className="col-12 col-md-6 col-xl-4">
                <div className={`bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden h-100 transition-all hover-scale ${!svc.is_active ? 'grayscale' : ''}`}>
                    <div className="position-relative" style={{ height: '220px' }}>
                        <img src={getImageUrl(svc.image) || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'} className="w-100 h-100 object-fit-cover" alt={svc.name} />
                        <div className="position-absolute top-0 end-0 m-3 bg-white bg-opacity-75 backdrop-blur rounded-pill px-3 py-1 fw-bold text-dark shadow-sm" style={{ fontSize: '0.75rem' }}>
                            ${svc.price}
                        </div>
                        {!svc.is_active && (
                            <div className="position-absolute inset-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                                <h4 className="fw-bold text-white letter-spaced mb-0">INACTIVE</h4>
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">{svc.name}</h5>
                            <div className="form-check form-switch m-0">
                                <input 
                                    className="form-check-input custom-switch cursor-pointer" 
                                    type="checkbox" 
                                    checked={svc.is_active} 
                                    onChange={() => handleToggleActive(svc.id, svc.is_active)}
                                />
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3 text-muted small mb-4 fw-medium">
                            <div className="d-flex align-items-center gap-1">
                                <FiClock size={14} className="opacity-50" /> {svc.duration} MIN
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <FiLayers className="opacity-50" /> {svc.category_name}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-opacity-10">
                            <div className="text-muted small">
                                {svc.max_staff} Staff max
                            </div>
                            <div className="d-flex gap-3 text-muted">
                                <FiEdit2 className="cursor-pointer hover-rust transition-all" size={18} onClick={() => handleEditClick(svc)} />
                                <FiTrash2 className="cursor-pointer hover-danger transition-all text-danger opacity-50 hover-opacity-100" size={18} onClick={() => handleDeleteService(svc.id)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1050 }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="p-5">
                    <div className="d-flex justify-content-between align-items-start mb-5">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>{editingServiceId ? 'Edit Treatment' : 'New Treatment'}</h2>
                            <p className="text-muted small mb-0">{editingServiceId ? 'Refine the details of this service offering.' : 'Define the details of your luxury service offering.'}</p>
                        </div>
                        <button onClick={toggleModal} className="btn btn-light rounded-circle shadow-sm p-3 d-flex align-items-center justify-content-center">
                            <FiPlus style={{ transform: 'rotate(45deg)' }} size={20} />
                        </button>
                    </div>

                    <div className="custom-scrollbar pe-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <div className="row g-4 m-0">
                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">SERVICE COVER IMAGE</label>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="d-none" 
                                    accept="image/*"
                                />
                                <div 
                                    onClick={handleFileClick}
                                    className="rounded-5 border-2 border-dashed border-opacity-10 bg-sand p-4 text-center cursor-pointer mb-2 transition-all hover-rust overflow-hidden"
                                    style={{ height: selectedImagePreview ? '150px' : 'auto' }}
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                        {selectedImagePreview ? (
                                            <img src={getImageUrl(selectedImagePreview) || selectedImagePreview} className="h-100 w-auto object-fit-contain" alt="Preview" />
                                        ) : (
                                            <>
                                                <FiImage size={40} className="mb-2 opacity-50" />
                                                <span className="small fw-bold opacity-75">Click to browse or drag image here</span>
                                                <span className="text-muted" style={{ fontSize: '0.65rem' }}>PNG, JPG or WEBP (Max 5MB)</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">SERVICE NAME</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" 
                                    placeholder="e.g. Signature Tattoo" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold letter-spaced">DESCRIPTION</label>
                                <textarea 
                                    className="form-control rounded-4 border-0 bg-sand p-3 shadow-none fw-bold" 
                                    placeholder="Describe this treatment..." 
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">CATEGORY</label>
                                <select 
                                    className="form-select rounded-pill border-0 bg-sand p-3 shadow-none fw-bold"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">PRICE (USD)</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" 
                                    placeholder="$0.00" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">DURATION (MIN)</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" 
                                    placeholder="60" 
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold letter-spaced">MAX STAFF</label>
                                <input 
                                    type="number" 
                                    className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold" 
                                    value={formData.staff}
                                    onChange={(e) => setFormData({...formData, staff: Number(e.target.value)})}
                                />
                            </div>
                            <div className="col-12 mt-5">
                                <button className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale" onClick={handleSaveService}>
                                    {editingServiceId ? 'Save Changes' : 'Create Treatment Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1100 }} onClick={() => setShowCategoryModal(false)}>
            <div className="bg-white rounded-5 shadow-lg p-5 position-relative" style={{ width: '100%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowCategoryModal(false)} className="btn btn-light rounded-circle position-absolute border-0 d-flex align-items-center justify-content-center p-2" style={{ top: '20px', right: '20px' }}>
                    <FiPlus style={{ transform: 'rotate(45deg)' }} size={20} />
                </button>
                <h4 className="fw-bold mb-4">New Category</h4>
                <form onSubmit={handleCreateCategory}>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted letter-spaced">CATEGORY NAME</label>
                        <input type="text" className="form-control p-3 bg-sand border-0 rounded-4 fw-bold" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required placeholder="e.g. Ink Art" />
                    </div>
                    <button type="submit" className="btn btn-rust w-100 rounded-pill p-3 fw-bold text-white shadow">
                        Create Category
                    </button>
                </form>
            </div>
        </div>
      )}

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 2px; }
        .grayscale { filter: grayscale(100%); }
        .grayscale img { opacity: 0.6; }
        .backdrop-blur { backdrop-filter: blur(8px); }
        .hover-scale:hover { transform: translateY(-5px); }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        
        .custom-switch:checked {
            background-color: #9C4A34;
            border-color: #9C4A34;
        }
        .hover-rust:hover { color: #9C4A34 !important; }
        .hover-danger:hover { color: #dc3545 !important; opacity: 1 !important; }

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
