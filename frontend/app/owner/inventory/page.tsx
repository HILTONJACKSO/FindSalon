'use client';

import React from 'react';
import { FiPlus, FiAlertCircle, FiTrendingDown, FiArrowRight, FiMoreHorizontal, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';

import { api } from '@/lib/api';

const ProGate = ({ plan, children, featureName }: { plan: string, children: React.ReactNode, featureName: string }) => {
    if (plan === 'PRO' || plan === 'TRIAL') return <>{children}</>;

    return (
        <div className="position-relative overflow-hidden rounded-5">
            <div className="opacity-25 pointer-events-none filter-blur">
                {children}
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)', zIndex: 10 }}>
                <div className="bg-rust text-white rounded-circle p-3 mb-3 shadow-lg">
                    <FiPlus size={24} />
                </div>
                <h3 className="fw-bold text-dark mb-2">{featureName}</h3>
                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '300px' }}>Track professional supplies, manage retail stock, and get low-inventory alerts with FindSalon Pro.</p>
                <a href="/owner/billing" className="btn btn-dark rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2 shadow-sm transition-all hover-scale">
                    Upgrade to Pro Plan <FiArrowRight size={18} />
                </a>
            </div>
        </div>
    );
};

export default function InventoryPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [salon, setSalon] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Modal and Action State
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [activeActionMenu, setActiveActionMenu] = React.useState<number | null>(null);
  const [isEditing, setIsEditing] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    name: '', description: '', category: '', sku: '', price: '', quantity: '', low_stock_threshold: '10', image: null
  });

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory/');
      setInventory(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/inventory/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSalon = async () => {
      try {
          const res = await api.get('/salons/mine/');
          setSalon(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (err) {
          console.error("Failed to fetch salon", err);
      }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
        const target = e.target as HTMLInputElement;
        setFormData({ ...formData, image: target.files ? target.files[0] : null });
    } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(null);
    setFormData({ name: '', description: '', category: categories.length > 0 ? categories[0].id : '', sku: '', price: '', quantity: '', low_stock_threshold: '10', image: null });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item: any) => {
    setIsEditing(item.id);
    setFormData({
      name: item.name, description: item.description || '', category: item.category, sku: item.sku || '',
      price: item.price.toString(), quantity: item.quantity.toString(), low_stock_threshold: item.low_stock_threshold.toString(), image: item.image || ''
    });
    setShowAddModal(true);
    setActiveActionMenu(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/inventory/${id}/`);
        fetchInventory();
      } catch (error) {
        console.error("Error deleting item", error);
      }
    }
    setActiveActionMenu(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if (key === 'image') {
            if (formData.image instanceof File) {
                data.append('image', formData.image);
            }
        } else {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        }
    });

    try {
      if (isEditing) {
        await api.patch(`/inventory/${isEditing}/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/inventory/', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowAddModal(false);
      fetchInventory();
    } catch (error) {
      console.error("Error saving item", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.post('/inventory/categories/', { name: newCategoryName });
      setNewCategoryName('');
      setShowCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error creating category", error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
    fetchInventory();
    fetchSalon();
    const interval = setInterval(fetchInventory, 10000);
    return () => clearInterval(interval);
  }, []);

  const userPlan = salon?.subscription_plan || 'STARTER';
  const outOfStockCount = inventory.filter(i => i.quantity === 0).length;
  const lowStockCount = inventory.filter(i => i.quantity > 0 && i.quantity <= i.low_stock_threshold).length;

  const processedInventory = inventory.map(item => {
      // Base the percentage off a max capacity of 100 for visual purposes
      const stockLevel = Math.min((item.quantity / 100) * 100, 100); 
      let stockLabel = `In Stock (${item.quantity})`;
      let stockColor = '#9C4A34'; // Rust

      if (item.quantity === 0) {
          stockLabel = `Out of Stock (0)`;
          stockColor = '#E0E0E0';
      } else if (item.quantity <= item.low_stock_threshold) {
          stockLabel = `Low Stock (${item.quantity})`;
          stockColor = '#D4A017'; // Yellow
      }

      return { ...item, stockLevel, stockLabel, stockColor };
  });

  return (
    <div className="pb-5">
      <OwnerHeader onQuickAction={handleOpenAddModal} />

      {/* PAGE HEADER */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-5 mt-2 gap-4">
        <div>
            <nav aria-label="breadcrumb" className="mb-2">
                <ol className="breadcrumb small fw-bold">
                    <li className="breadcrumb-item"><a href="#" className="text-muted text-decoration-none">Dashboard</a></li>
                    <li className="breadcrumb-item active text-rust" aria-current="page">Inventory</li>
                </ol>
            </nav>
            <h1 className="fw-bold mb-2" style={{ fontSize: 'var(--fs-xl)', letterSpacing: '-1.5px' }}>Stockroom Control</h1>
            <p className="text-muted mb-0 small">Manage your salon supplies, professional kits, and retail products.</p>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-3">
          <button 
            onClick={() => {
                if (userPlan === 'STARTER') {
                    window.location.href = '/owner/billing';
                    return;
                }
                handleOpenAddModal();
            }}
            className="btn btn-rust rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
          >
            <FiPlus size={20} /> <span className="small">Add Item</span>
          </button>
        </div>
      </div>

      <ProGate plan={userPlan} featureName="Professional Inventory Suite">
        {/* ALERT HERO CARDS */}
        <div className="row g-4 mb-5">
            <div className="col-12 col-xl-8">
                <div className="rounded-5 p-4 p-md-5 d-flex flex-column flex-md-row align-items-center gap-4 position-relative overflow-hidden border border-3 border-white shadow-sm" style={{ backgroundColor: '#FFF5F5', borderLeft: '12px solid #B23B3B !important' }}>
                    <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-danger flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                        <FiAlertCircle size={32} />
                    </div>
                    <div className="flex-grow-1 text-center text-md-start">
                        <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: 'var(--fs-md)' }}>Urgent: Out of Stock</h4>
                        <p className="mb-0 text-muted small lh-base mx-auto mx-md-0" style={{ maxWidth: '400px' }}>
                            {outOfStockCount} Essential products are currently unavailable and affecting service availability.
                        </p>
                    </div>
                    <button className="btn btn-link text-danger fw-bold text-decoration-underline p-0 border-0 mt-2 mt-md-0">
                        Reorder All
                    </button>
                </div>
            </div>
            <div className="col-12 col-xl-4">
                <div className="rounded-5 p-4 p-md-5 d-flex align-items-center gap-4 border border-3 border-white shadow-sm h-100 position-relative overflow-hidden" style={{ backgroundColor: '#FDF2E3', borderLeft: '12px solid #9C4A34 !important' }}>
                    <div className="bg-rust bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-rust flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                        <FiTrendingDown size={24} />
                    </div>
                    <div>
                        <h6 className="fw-bold mb-1 text-dark">Low Stock Items</h6>
                        <p className="mb-0 text-muted tiny">{lowStockCount} items need attention soon.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="d-flex flex-wrap gap-2 mb-5 overflow-auto pb-2 scrollbar-none align-items-center">
            <button className="btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all btn-rust text-white shadow" style={{ fontSize: '0.85rem' }}>
            All Products
            </button>
            {categories.map((cat) => (
            <button 
                key={cat.id} 
                className="btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all bg-sand text-muted hover-bg-light border-0"
                style={{ fontSize: '0.85rem' }}
            >
                {cat.name}
            </button>
            ))}
            <button onClick={() => setShowCategoryModal(true)} className="btn rounded-pill px-3 py-2 fw-bold text-nowrap transition-all bg-light text-rust border-0 d-flex align-items-center gap-1 hover-scale" style={{ fontSize: '0.85rem' }}>
            <FiPlus size={16} /> Category
            </button>
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white rounded-5 shadow-sm border border-opacity-10 mb-5 overflow-hidden">
            <div className="responsive-table-container">
                <table className="table table-hover mb-0 align-middle" style={{ minWidth: '900px' }}>
                    <thead className="bg-sand bg-opacity-50">
                        <tr>
                            <th className="px-4 py-4 border-0 text-muted small fw-bold letter-spaced" style={{ fontSize: '0.6rem' }}>PRODUCT DETAILS</th>
                            <th className="py-4 border-0 text-muted small fw-bold letter-spaced" style={{ fontSize: '0.6rem' }}>CATEGORY</th>
                            <th className="py-4 border-0 text-muted small fw-bold letter-spaced" style={{ fontSize: '0.6rem' }}>SKU</th>
                            <th className="py-4 border-0 text-muted small fw-bold letter-spaced" style={{ fontSize: '0.6rem' }}>STOCK LEVEL</th>
                            <th className="py-4 border-0 text-muted small fw-bold letter-spaced" style={{ fontSize: '0.6rem' }}>PRICE</th>
                            <th className="py-4 border-0 text-muted small fw-bold letter-spaced text-end px-4" style={{ fontSize: '0.6rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-5 text-muted small fw-bold italic">Loading inventory...</td></tr>
                        ) : processedInventory.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-5 text-muted small fw-bold italic">No products found.</td></tr>
                        ) : processedInventory.map((item) => (
                            <tr key={item.id} className="cursor-pointer transition-all">
                                <td className="px-4 py-4 border-bottom border-light">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-4 overflow-hidden border border-light bg-sand d-flex align-items-center justify-content-center text-rust fw-bold flex-shrink-0" style={{ width: '48px', height: '48px', fontSize: '0.9rem' }}>
                                            {item.image ? <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" /> : item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="fw-bold text-dark text-truncate small">{item.name}</div>
                                            <div className="text-muted tiny text-truncate" style={{ maxWidth: '200px' }}>{item.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 border-bottom border-light">
                                    <span className="badge rounded-pill px-2 py-1 fw-bold text-blue bg-blue bg-opacity-10" style={{ fontSize: '0.55rem', color: '#0066CC', backgroundColor: '#E5EFFF' }}>
                                        {item.category_name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className="py-4 border-bottom border-light text-muted tiny fw-bold">{item.sku || 'N/A'}</td>
                                <td className="py-4 border-bottom border-light" style={{ width: '160px' }}>
                                    <div className="d-flex flex-column gap-1">
                                        <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: '#F0F0F0' }}>
                                            <div className="progress-bar rounded-pill" style={{ width: `${item.stockLevel}%`, backgroundColor: item.stockColor }}></div>
                                        </div>
                                        <span className="fw-bold tiny" style={{ color: item.stockLevel === 0 ? '#B23B3B' : item.stockLevel < 30 ? '#D4A017' : '#9C4A34' }}>
                                            {item.stockLabel}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 border-bottom border-light fw-bold text-dark small">${item.price}</td>
                                <td className="py-4 border-bottom border-light text-end px-4 position-relative">
                                    <button 
                                        className="btn btn-light rounded-circle p-2 border-0 bg-transparent text-muted"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveActionMenu(activeActionMenu === item.id ? null : item.id);
                                        }}
                                    >
                                        <FiMoreHorizontal size={18} />
                                    </button>
                                    {activeActionMenu === item.id && (
                                        <div className="position-absolute bg-white shadow-lg rounded-4 p-2 d-flex flex-column animate-fade-in" style={{ right: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, minWidth: '140px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <button onClick={() => handleOpenEditModal(item)} className="btn btn-sm btn-light bg-transparent text-start mb-1 text-dark d-flex align-items-center gap-2 py-2 px-3 rounded-3">
                                                <FiEdit2 size={14} className="text-muted" /> <span className="small fw-bold">Edit Item</span>
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-light bg-transparent text-start text-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3">
                                                <FiTrash2 size={14} /> <span className="small fw-bold">Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination placeholder */}
            <div className="px-4 py-4 bg-sand bg-opacity-30 d-flex flex-column flex-sm-row justify-content-between align-items-center border-top gap-3">
                <span className="text-muted tiny fw-bold uppercase letter-spaced">Showing {inventory.length} total products</span>
                <div className="d-flex gap-2">
                    {[1, 2, 3].map(n => (
                        <button key={n} className={`btn rounded-circle fw-bold ${n === 1 ? 'btn-rust text-white shadow-sm' : 'btn-light bg-white border-0 opacity-50'}`} style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>{n}</button>
                    ))}
                </div>
            </div>
        </div>
      </ProGate>

      {/* MODALS ... */}


      {/* ADD/EDIT MODAL OVERLAY */}
      {showAddModal && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-3 p-md-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 9999 }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '600px', width: '95%' }}>
                <div className="p-4 p-md-5 position-relative">
                    <button 
                        onClick={() => setShowAddModal(false)} 
                        className="btn btn-light rounded-circle position-absolute border-0 d-flex align-items-center justify-content-center p-2" 
                        style={{ top: '16px', right: '16px', width: '36px', height: '36px', transition: 'all 0.3s ease' }}
                    >
                        <FiX size={18} />
                    </button>
                    <h2 className="fw-bold mb-4" style={{ letterSpacing: '-1px', fontSize: 'var(--fs-md)' }}>{isEditing ? 'Edit Item' : 'New Stock Item'}</h2>
                    
                    <div className="custom-scrollbar pe-1" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3 m-0">
                                <div className="col-12 col-md-6 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>PRODUCT NAME</label>
                                    <input type="text" name="name" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="col-12 col-md-6 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>SKU / CODE</label>
                                    <input type="text" name="sku" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small" value={formData.sku} onChange={handleInputChange} />
                                </div>
                                <div className="col-12 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>CATEGORY</label>
                                    <select name="category" className="form-select rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small" value={formData.category} onChange={handleInputChange} required>
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>DESCRIPTION</label>
                                    <textarea name="description" className="form-control rounded-4 border-0 bg-sand p-3 shadow-none fw-bold small" rows={2} value={formData.description} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="col-4 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>PRICE ($)</label>
                                    <input type="number" step="0.01" name="price" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small text-center" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="col-4 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>QUANTITY</label>
                                    <input type="number" name="quantity" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small text-center" value={formData.quantity} onChange={handleInputChange} required />
                                </div>
                                <div className="col-4 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>LOW LEVEL</label>
                                    <input type="number" name="low_stock_threshold" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small text-center" value={formData.low_stock_threshold} onChange={handleInputChange} required />
                                </div>
                                <div className="col-12 p-1">
                                    <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>IMAGE {isEditing && formData.image && !(formData.image instanceof File) && <span className="text-rust">(Existing)</span>}</label>
                                    <input type="file" accept="image/*" name="image" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small" onChange={handleInputChange} />
                                </div>
                                <div className="col-12 mt-4 p-1">
                                    <button type="submit" disabled={submitting} className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale">
                                        {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add to Stock')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="position-fixed inset-0 z-5 d-flex align-items-center justify-content-center p-3 p-md-4" style={{ backgroundColor: 'rgba(30, 25, 21, 0.8)', backdropFilter: 'blur(10px)', zIndex: 9999 }}>
            <div className="bg-white rounded-5 w-100 shadow-lg overflow-hidden animate-fade-in" style={{ maxWidth: '400px', width: '90%' }}>
                <div className="p-4 p-md-5 position-relative">
                    <button onClick={() => setShowCategoryModal(false)} className="btn btn-light rounded-circle position-absolute border-0 d-flex align-items-center justify-content-center p-2" style={{ top: '16px', right: '16px', width: '36px', height: '36px' }}>
                        <FiX size={18} />
                    </button>
                    <h4 className="fw-bold mb-4" style={{ letterSpacing: '-1px' }}>New Category</h4>
                    <form onSubmit={handleCreateCategory}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted letter-spaced tiny" style={{ fontSize: '0.6rem' }}>CATEGORY NAME</label>
                            <input type="text" className="form-control rounded-pill border-0 bg-sand p-3 shadow-none fw-bold small" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required placeholder="e.g. Premium Shampoos" />
                        </div>
                        <button type="submit" className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm transition-all hover-scale">
                            Create Category
                        </button>
                    </form>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .letter-spaced { letter-spacing: 1px; text-transform: uppercase; }
        .bg-sand { background-color: #FDFBF7; }
        .bg-rust { background-color: #9C4A34; }
        .text-rust { color: #9C4A34; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-scale:hover { transform: translateY(-5px); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
