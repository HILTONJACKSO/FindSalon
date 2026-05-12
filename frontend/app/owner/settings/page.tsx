'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    FiHome, 
    FiClock, 
    FiUsers, 
    FiBell, 
    FiMapPin,
    FiCamera,
    FiSearch,
    FiHelpCircle,
    FiArrowRight,
    FiUser,
    FiPlus,
    FiX,
    FiShield,
    FiDollarSign
} from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Business Profile');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [salonId, setSalonId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileAvatarRef = useRef<HTMLInputElement>(null);
  const [salonImages, setSalonImages] = useState<any[]>([]);

  // Deposit Settings
  const [requireDeposit, setRequireDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('0.00');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !salonId) {
      if (!salonId) toast.error('Please save your salon details first before uploading images.');
      return;
    }

    const toastId = toast.loading('Uploading brand imagery...');
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('salon', salonId.toString());
        return api.post('/salons/images/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      });

      const results = await Promise.all(uploadPromises);
      const newImages = results.map(res => res.data);
      setSalonImages(prev => [...prev, ...newImages]);
      toast.success('Imagery uploaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Failed to upload one or more images.', { id: toastId });
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to remove this image?')) return;

    try {
      await api.delete(`/salons/images/${imageId}/`);
      setSalonImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image removed');
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to remove image');
    }
  };
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [mapAddress, setMapAddress] = useState('Monrovia, Liberia');
  const [openingHours, setOpeningHours] = useState('');

  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await api.get('/salons/mine/');
        if (res.data && res.data.length > 0) {
          const salon = res.data[0];
          setSalonId(salon.id);
          setName(salon.name);
          setDescription(salon.description);
          setAddress(salon.address);
          setMapAddress(salon.address || 'Monrovia, Liberia');
          setOpeningHours(salon.opening_hours);
          setSalonImages(salon.images || []);
          setSelectedCategory(salon.category?.toString() || '');
          setRequireDeposit(salon.require_deposit || false);
          setDepositAmount(salon.deposit_amount?.toString() || '0.00');
        }
      } catch (err) {
        console.error('Failed to fetch salon', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get('/salons/categories/');
        setCategories(res.data.results || res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile/');
        setFirstName(res.data.first_name || '');
        setLastName(res.data.last_name || '');
        setPhone(res.data.phone || '');
        setAvatar(res.data.avatar || null);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };

    fetchSalon();
    fetchCategories();
    fetchProfile();
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check if there is a tab in the URL
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
        setActiveTab(tab.replace('+', ' '));
    }
  }, []);

  const handleCreateCategory = async () => {
// ... existing category creation logic ...
  };

  const handleSave = async () => {
    if (activeTab === 'Owner Profile') {
        return handleProfileSave();
    }
    
    // 1. COMPREHENSIVE PRE-SAVE VALIDATION
    const missingFields = [];
    if (!name.trim()) missingFields.push('Salon Name');
    if (!address.trim()) missingFields.push('Business Address');
    if (!description.trim()) missingFields.push('Business Description');
    if (!selectedCategory) missingFields.push('Business Category');

    if (missingFields.length > 0) {
        toast.error(`Please complete the following before saving: ${missingFields.join(', ')}`, {
            duration: 5000,
            icon: '📝'
        });
        return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        description,
        address,
        opening_hours: openingHours,
        category: selectedCategory || null,
        require_deposit: requireDeposit,
        deposit_amount: parseFloat(depositAmount) || 0
      };

      if (salonId) {
        await api.patch(`/salons/${salonId}/`, payload);
        toast.success('Business Profile updated successfully!');
      } else {
        const res = await api.post('/salons/', payload);
        setSalonId(res.data.id);
        toast.success('Your Salon has been created successfully!');
      }
    } catch (err: any) {
      console.error('Failed to save settings', err);
      
      // 2. INTELLIGENT BACKEND ERROR REPORTING
      const backendErrors = err.response?.data;
      if (backendErrors && typeof backendErrors === 'object') {
          // If we have a dictionary of errors, show the first one or a summary
          const fieldNames = Object.keys(backendErrors);
          const firstField = fieldNames[0];
          const firstError = backendErrors[firstField];
          const displayField = firstField.replace('_', ' ').toUpperCase();
          
          toast.error(`${displayField}: ${Array.isArray(firstError) ? firstError[0] : firstError}`, {
              duration: 6000
          });
      } else {
          toast.error(err.response?.data?.detail || 'System encountered an error. Please verify all fields and try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('phone', phone);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await api.patch('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFirstName(res.data.first_name);
      setLastName(res.data.last_name);
      setPhone(res.data.phone);
      setAvatar(res.data.avatar);
      setAvatarFile(null);
      
      toast.success('Owner Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to save profile', err);
      toast.error(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { label: 'Owner Profile', icon: <FiUser /> },
    { label: 'Business Profile', icon: <FiHome /> },
    { label: 'Operating Hours', icon: <FiClock /> },
    { label: 'Team Management', icon: <FiUsers /> },
    { label: 'Notifications', icon: <FiBell /> },
  ];

  return (
    <div className="pb-5">
      {/* HEADER SECTION */}
      <header className="d-flex align-items-center justify-content-between mb-5">
        <div className="position-relative d-none d-md-block" style={{ width: '350px' }}>
          <FiSearch className="position-absolute translate-middle-y text-muted opacity-50" style={{ top: '50%', left: '16px' }} size={18} />
          <input 
            type="text" 
            placeholder="Search settings..." 
            className="form-control rounded-pill border-0 shadow-sm ps-5 py-3 bg-sand"
            style={{ fontSize: '0.9rem' }}
          />
        </div>
        <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-3 text-muted">
                <FiBell size={20} className="cursor-pointer hover-rust transition-all" />
                <FiHelpCircle size={20} className="cursor-pointer hover-rust transition-all" />
            </div>
            <div className="rounded-circle overflow-hidden bg-sand border border-white border-2 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                {avatar ? (
                  <img src={avatar.startsWith('http') ? avatar : getImageUrl(avatar)} alt="Profile" className="w-100 h-100 object-fit-cover" />
                ) : (
                  <span className="fw-bold text-rust small">
                    {(firstName?.[0] || '') + (lastName?.[0] || '')}
                  </span>
                )}
            </div>
        </div>
      </header>

      {/* PAGE TITLE */}
      <div className="row align-items-center mb-5">
        <div className="col-12 col-md-8">
            <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Settings</h1>
            <p className="text-muted mb-0">Manage your salon brand, team, and operational preferences.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
            <button onClick={handleSave} disabled={isSaving || loading} className="btn btn-rust rounded-pill px-5 py-3 fw-bold shadow-sm transition-all hover-scale">
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </div>

      <div className="row g-5">
        
        {/* SETTINGS NAVIGATION (LEFT) */}
        <div className="col-12 col-lg-3">
            <div className="bg-white rounded-5 p-3 shadow-sm border border-opacity-10 d-flex flex-column gap-2 sticky-top" style={{ top: '30px' }}>
                {tabs.map((tab) => (
                    <button 
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`btn text-start px-4 py-3 rounded-4 d-flex align-items-center gap-3 border-0 transition-all ${activeTab === tab.label ? 'bg-sand text-rust fw-bold' : 'text-muted hover-bg-sand'}`}
                    >
                        <span className={activeTab === tab.label ? 'text-rust' : 'opacity-50'}>{tab.icon}</span>
                        <span style={{ fontSize: '0.9rem' }}>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* SETTINGS CONTENT (RIGHT) */}
        <div className="col-12 col-lg-9">
            
            {activeTab === 'Business Profile' && (
                <>
                    {/* BUSINESS IDENTITY CARD */}
                    <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 mb-5">
                        <div className="d-flex align-items-center gap-2 mb-5">
                            <span className="bg-rust rounded-pill" style={{ width: '6px', height: '24px' }}></span>
                            <h4 className="fw-bold mb-0">Business Identity</h4>
                        </div>

                        <div className="row g-4 mb-5">
                            <div className="col-12 col-md-6">
                                <label className="text-muted small fw-bold mb-2 letter-spaced">SALON NAME</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-control rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="text-muted small fw-bold mb-2 letter-spaced">BUSINESS CATEGORY</label>
                                <div className="d-flex gap-2">
                                    <select 
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="form-select rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium text-muted"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); setShowCategoryModal(true); }}
                                        className="btn btn-rust rounded-4 px-3 shadow-sm"
                                    >
                                        <FiPlus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="text-muted small fw-bold mb-2 letter-spaced">SALON DESCRIPTION</label>
                            <textarea 
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-control rounded-5 border-0 shadow-sm py-4 px-4 bg-sand fw-medium lh-base text-muted"
                            ></textarea>
                        </div>

                        <div>
                            <label className="text-muted small fw-bold mb-3 letter-spaced">BRAND IMAGERY</label>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="d-none" accept="image/*" />
                            <div className="d-flex flex-wrap gap-4">
                                {salonImages.map((img, i) => (
                                    <div key={img.id} className="position-relative group">
                                        <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '120px', height: '120px' }}>
                                            {getImageUrl(img.image) && (
                                                <img src={getImageUrl(img.image) as string} className="w-100 h-100 object-fit-cover" />
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 shadow-sm border border-white border-2 transition-all hover-scale"
                                            style={{ width: '28px', height: '28px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transform: 'translate(25%, -25%)' }}
                                        >
                                            <small className="fw-bold" style={{ fontSize: '1rem', marginTop: '-2px' }}>&times;</small>
                                        </button>
                                    </div>
                                ))}
                                <div onClick={() => fileInputRef.current?.click()} className="rounded-circle border border-2 border-dashed border-opacity-20 d-flex flex-column align-items-center justify-content-center cursor-pointer transition-all hover-rust hover-scale bg-sand" style={{ width: '120px', height: '120px', color: '#9C4A34' }}>
                                    <FiCamera size={24} className="mb-2" />
                                    <span className="fw-bold" style={{ fontSize: '0.65rem' }}>Upload New</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LOCATION CARD */}
                    <div className="row g-4">
                        <div className="col-12 col-xl-6">
                            <div className="bg-sand rounded-5 p-5 shadow-sm border border-white border-2 h-100" style={{ backgroundColor: '#ECE5DD' }}>
                                <h6 className="fw-bold text-rust mb-3 letter-spaced">LOCATION BRANDING</h6>
                                <p className="text-muted small lh-base mb-5" style={{ maxWidth: '300px' }}>
                                    Your physical address defines your localized SEO. Ensure it's accurate to help clients find your sanctuary.
                                </p>
                                <input 
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="form-control rounded-pill px-4 py-3 fw-bold text-dark mb-4 shadow-sm border-0" 
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <button 
                                    onClick={(e) => { e.preventDefault(); setMapAddress(address); }}
                                    className="btn btn-link p-0 text-decoration-none fw-bold text-rust d-flex align-items-center gap-2 small"
                                >
                                    Update on Map <FiArrowRight />
                                </button>
                            </div>
                        </div>
                        <div className="col-12 col-xl-6">
                            <div className="bg-white rounded-5 shadow-sm border border-opacity-10 h-100 overflow-hidden position-relative min-h-300">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0" 
                                    style={{ border: 0, minHeight: '300px' }}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress || 'Liberia')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'Owner Profile' && (
                <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
                    <div className="d-flex align-items-center gap-2 mb-5">
                        <span className="bg-rust rounded-pill" style={{ width: '6px', height: '24px' }}></span>
                        <h4 className="fw-bold mb-0">Owner Account Profile</h4>
                    </div>

                    <div className="d-flex flex-column align-items-center mb-5">
                        <div className="position-relative mb-3">
                            <div className="rounded-circle overflow-hidden shadow-sm border border-white border-4" style={{ width: '150px', height: '150px' }}>
                                <img src={avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"} className="w-100 h-100 object-fit-cover" />
                            </div>
                            <button 
                                onClick={() => profileAvatarRef.current?.click()}
                                className="btn btn-rust rounded-circle position-absolute bottom-0 end-0 p-3 shadow-lg border border-white border-4"
                                style={{ transform: 'translate(10%, 10%)' }}
                            >
                                <FiCamera size={20} className="text-white" />
                            </button>
                            <input type="file" ref={profileAvatarRef} onChange={handleAvatarChange} className="d-none" accept="image/*" />
                        </div>
                        <p className="text-muted small fw-bold letter-spaced mt-2">ACCOUNT AVATAR</p>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-md-6">
                            <label className="text-muted small fw-bold mb-2 letter-spaced">FIRST NAME</label>
                            <input 
                                type="text" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="form-control rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="text-muted small fw-bold mb-2 letter-spaced">LAST NAME</label>
                            <input 
                                type="text" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="form-control rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium"
                                placeholder="Last Name"
                            />
                        </div>
                        <div className="col-12">
                            <label className="text-muted small fw-bold mb-2 letter-spaced">PHONE NUMBER</label>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="form-control rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium"
                                placeholder="+231 00 000 000"
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Operating Hours' && (
                <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10 mb-5">
                    <div className="d-flex align-items-center gap-2 mb-5">
                        <span className="bg-rust rounded-pill" style={{ width: '6px', height: '24px' }}></span>
                        <h4 className="fw-bold mb-0">Operating Hours</h4>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        <input 
                            type="text" 
                            value={openingHours} 
                            onChange={(e) => setOpeningHours(e.target.value)} 
                            className="form-control rounded-4 border-0 shadow-sm py-3 px-4 bg-sand fw-medium text-muted"
                            placeholder="e.g. 09:00 - 18:00 or Mon-Fri 9AM-5PM"
                        />
                    </div>
                </div>
            )}


        </div>
      </div>

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="show d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999 }} onClick={() => setShowCategoryModal(false)}>
            <div className="bg-white rounded-5 shadow-lg p-5 position-relative" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#FFFFFF', opacity: 1, zIndex: 100000 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowCategoryModal(false)} className="btn btn-light rounded-circle position-absolute border-0" style={{ top: '20px', right: '20px' }}>
                    <FiX size={24} />
                </button>
                <h4 className="fw-bold mb-4">New Business Category</h4>
                <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Category Name</label>
                    <input 
                        type="text" 
                        className="form-control p-3 bg-light border-0 rounded-4 fw-bold" 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)} 
                        required 
                        placeholder="e.g. Luxury Spa & Wellness" 
                    />
                </div>
                <button 
                    onClick={handleCreateCategory}
                    className="btn btn-rust w-100 rounded-pill p-3 fw-bold text-white shadow transition-all hover-scale"
                >
                    Create Category
                </button>
            </div>
        </div>
      )}

      <style jsx>{`
        .bg-sand { background-color: #FDFBF7; }
        .text-rust { color: #9C4A34; }
        .bg-rust { background-color: #9C4A34; }
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .letter-spaced { font-size: 0.65rem; }
        .min-h-300 { min-height: 300px; }
        .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .grayscale { filter: grayscale(100%) sepia(30%) brightness(95%); }
        .hover-bg-sand:hover { background-color: #FDFBF7; }
        
        /* Custom Switch Styling to match design */
        .custom-switch:checked {
            background-color: #9C4A34;
            border-color: #9C4A34;
        }
      `}</style>
    </div>
  );
}
