'use client';

import React from 'react';
import { FiPlus, FiAlertCircle, FiTrendingDown, FiArrowRight, FiMoreHorizontal, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import OwnerHeader from '@/components/owner/OwnerHeader';

import { api } from '@/lib/api';

export default function InventoryPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [inventory, setInventory] = React.useState<any[]>([]);
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
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="row align-items-center mb-5">
        <div className="col-12 col-md-8">
          <h1 className="fw-bold display-5 mb-2" style={{ letterSpacing: '-1.5px' }}>Inventory</h1>
          <p className="text-muted mb-0">Manage your salon supplies, professional kits, and retail products.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
          <button onClick={handleOpenAddModal} className="btn btn-rust rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ms-md-auto">
            <FiPlus size={20} /> Add Item
          </button>
        </div>
      </div>

      {/* ALERT HERO CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-xl-8">
            <div className="rounded-5 p-4 p-md-5 d-flex align-items-center gap-4 position-relative overflow-hidden border border-3 border-white shadow-sm" style={{ backgroundColor: '#FFF5F5', borderLeft: '12px solid #B23B3B !important' }}>
                <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-danger" style={{ minWidth: '80px', height: '80px' }}>
                    <FiAlertCircle size={40} />
                </div>
                <div className="flex-grow-1">
                    <h3 className="fw-bold mb-1 text-dark">Urgent: Out of Stock</h3>
                    <p className="mb-0 text-muted small lh-base" style={{ maxWidth: '400px' }}>
                        {outOfStockCount} Essential products are currently unavailable and affecting service availability.
                    </p>
                </div>
                <button className="btn btn-link text-danger fw-bold text-decoration-underline p-0 border-0 ms-auto">
                    Reorder All
                </button>
            </div>
        </div>
        <div className="col-12 col-xl-4">
            <div className="rounded-5 p-4 p-md-5 d-flex align-items-center gap-4 border border-3 border-white shadow-sm h-100 position-relative overflow-hidden" style={{ backgroundColor: '#FDF2E3', borderLeft: '12px solid #9C4A34 !important' }}>
                <div className="bg-rust bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-rust" style={{ minWidth: '60px', height: '60px' }}>
                    <FiTrendingDown size={30} />
                </div>
                <div>
                   <h5 className="fw-bold mb-1 text-dark">Low Stock Items</h5>
                   <p className="mb-0 text-muted small">{lowStockCount} items need attention soon.</p>
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
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-sand bg-opacity-50">
              <tr>
                <th className="px-5 py-4 border-0 text-muted small fw-bold letter-spaced">PRODUCT DETAILS</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">CATEGORY</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">SKU</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">STOCK LEVEL</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced">PRICE</th>
                <th className="py-4 border-0 text-muted small fw-bold letter-spaced text-end px-5">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">Loading inventory...</td>
                </tr>
              ) : processedInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">No products found.</td>
                </tr>
              ) : processedInventory.map((item) => (
                <tr key={item.id} className="cursor-pointer transition-all">
                  <td className="px-5 py-4 border-bottom border-light">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-4 overflow-hidden border border-light bg-sand d-flex align-items-center justify-content-center text-rust fw-bold fs-5" style={{ width: '56px', height: '56px' }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" />
                        ) : (
                          item.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{item.name}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light">
                    <span className="badge rounded-pill px-3 py-2 fw-bold text-blue bg-blue bg-opacity-10" style={{ fontSize: '0.65rem', color: '#0066CC', backgroundColor: '#E5EFFF' }}>
                      {item.category_name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-4 border-bottom border-light text-muted small fw-bold">{item.sku}</td>
                  <td className="py-4 border-bottom border-light" style={{ width: '200px' }}>
                    <div className="d-flex flex-column gap-1">
                        <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: '#F0F0F0' }}>
                            <div 
                                className="progress-bar rounded-pill" 
                                style={{ width: `${item.stockLevel}%`, backgroundColor: item.stockColor }}
                            ></div>
                        </div>
                        <span className="fw-bold" style={{ fontSize: '0.65rem', color: item.stockLevel === 0 ? '#B23B3B' : item.stockLevel < 30 ? '#D4A017' : '#9C4A34' }}>
                            {item.stockLabel}
                        </span>
                    </div>
                  </td>
                  <td className="py-4 border-bottom border-light fw-bold text-dark">${item.price}</td>
                  <td className="py-4 border-bottom border-light text-end px-5 position-relative">
                    <button 
                        className="btn btn-light rounded-circle p-2 border-0 bg-transparent text-muted"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenu(activeActionMenu === item.id ? null : item.id);
                        }}
                    >
                        <FiMoreHorizontal size={20} />
                    </button>
                    {activeActionMenu === item.id && (
                        <div className="position-absolute bg-white shadow rounded-3 p-2 d-flex flex-column" style={{ right: '50px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, minWidth: '120px' }}>
                            <button onClick={() => handleOpenEditModal(item)} className="btn btn-sm btn-light bg-transparent text-start mb-1 text-dark d-flex align-items-center gap-2">
                                <FiEdit2 size={14} /> Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-light bg-transparent text-start text-danger d-flex align-items-center gap-2">
                                <FiTrash2 size={14} /> Delete
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
        <div className="px-5 py-4 bg-sand bg-opacity-30 d-flex justify-content-between align-items-center border-top">
          <span className="text-muted small fw-bold">Showing {inventory.length} products</span>
          <div className="d-flex gap-2">
            {[1, 2, 3].map(n => (
              <button key={n} className={`btn rounded-circle fw-bold ${n === 1 ? 'btn-rust text-white shadow' : 'btn-light bg-white border-0 opacity-50'}`} style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{n}</button>
            ))}
          </div>
        </div>
      </div>


      {/* ADD/EDIT MODAL OVERLAY */}
      {showAddModal && (
        <div className="show d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999 }} onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-5 shadow-lg p-5 position-relative" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', opacity: 1, zIndex: 100000 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowAddModal(false)} className="btn btn-light rounded-circle position-absolute border-0" style={{ top: '20px', right: '20px' }}>
                    <FiX size={24} />
                </button>
                <h3 className="fw-bold mb-4">{isEditing ? 'Edit Item' : 'Add New Inventory Item'}</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted">Product Name</label>
                            <input type="text" name="name" className="form-control p-3 bg-light border-0 rounded-4" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-bold text-muted">SKU</label>
                            <input type="text" name="sku" className="form-control p-3 bg-light border-0 rounded-4" value={formData.sku} onChange={handleInputChange} />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Category</label>
                            <select name="category" className="form-select p-3 bg-light border-0 rounded-4" value={formData.category} onChange={handleInputChange} required>
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Description</label>
                            <textarea name="description" className="form-control p-3 bg-light border-0 rounded-4" rows={2} value={formData.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label small fw-bold text-muted">Price ($)</label>
                            <input type="number" step="0.01" name="price" className="form-control p-3 bg-light border-0 rounded-4" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label small fw-bold text-muted">Quantity</label>
                            <input type="number" name="quantity" className="form-control p-3 bg-light border-0 rounded-4" value={formData.quantity} onChange={handleInputChange} required />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label small fw-bold text-muted">Low Threshold</label>
                            <input type="number" name="low_stock_threshold" className="form-control p-3 bg-light border-0 rounded-4" value={formData.low_stock_threshold} onChange={handleInputChange} required />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Product Image {isEditing && formData.image && !(formData.image instanceof File) && <span className="text-success">(Current image exists)</span>}</label>
                            <input type="file" accept="image/*" name="image" className="form-control p-3 bg-light border-0 rounded-4" onChange={handleInputChange} />
                        </div>
                        <div className="col-12 mt-4">
                            <button type="submit" disabled={submitting} className="btn btn-rust w-100 rounded-pill p-3 fw-bold text-white shadow">
                                {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add to Inventory')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="show d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999 }} onClick={() => setShowCategoryModal(false)}>
            <div className="bg-white rounded-5 shadow-lg p-5 position-relative" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#FFFFFF', opacity: 1, zIndex: 100000 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowCategoryModal(false)} className="btn btn-light rounded-circle position-absolute border-0" style={{ top: '20px', right: '20px' }}>
                    <FiX size={24} />
                </button>
                <h4 className="fw-bold mb-4">New Category</h4>
                <form onSubmit={handleCreateCategory}>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted">Category Name</label>
                        <input type="text" className="form-control p-3 bg-light border-0 rounded-4" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required placeholder="e.g. Premium Shampoos" />
                    </div>
                    <button type="submit" className="btn btn-rust w-100 rounded-pill p-3 fw-bold text-white shadow">
                        Create Category
                    </button>
                </form>
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
