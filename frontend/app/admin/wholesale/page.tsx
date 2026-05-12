'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiShoppingBag, FiPackage, FiDollarSign, FiSearch, FiX, FiClipboard } from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import { motion } from 'framer-motion';
import Toast from '@/components/shared/Toast';

export default function WholesaleManagement() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [activeTab, setActiveTab] = useState<'items' | 'orders'>('items');
    
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        wholesale_price: '',
        stock: '',
        description: '',
        is_active: true
    });

    const [categoryData, setCategoryData] = useState({
        name: '',
        description: ''
    });

    const fetchData = async () => {
        try {
            const [prodRes, catRes, orderRes] = await Promise.all([
                api.get('/b2b/items/'),
                api.get('/b2b/categories/'),
                api.get('/b2b/orders/')
            ]);
            setProducts(prodRes.data.results || prodRes.data);
            setCategories(catRes.data.results || catRes.data);
            setOrders(orderRes.data.results || orderRes.data);
        } catch (err) {
            console.error("Failed to fetch wholesale data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('wholesale_price', formData.wholesale_price);
            data.append('stock', formData.stock);
            data.append('description', formData.description);
            data.append('is_active', String(formData.is_active));
            data.append('slug', formData.name.toLowerCase().replace(/ /g, '-'));
            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/b2b/items/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setShowModal(false);
            setImageFile(null);
            setFormData({ name: '', category: '', wholesale_price: '', stock: '', description: '', is_active: true });
            fetchData();
            setToast({
                isVisible: true,
                message: `Success! ${formData.name} has been added to inventory.`,
                type: 'success'
            });
        } catch (err) {
            console.error("Failed to create product", err);
            setToast({
                isVisible: true,
                message: "Error creating product. Please check your data.",
                type: 'error'
            });
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/b2b/categories/', {
                ...categoryData,
                slug: categoryData.name.toLowerCase().replace(/ /g, '-')
            });
            setShowCategoryModal(false);
            setCategoryData({ name: '', description: '' });
            fetchData();
            setToast({
                isVisible: true,
                message: `Success! Category '${categoryData.name}' created.`,
                type: 'success'
            });
        } catch (err) {
            console.error("Failed to create category", err);
            setToast({
                isVisible: true,
                message: "Failed to create category. Please try again.",
                type: 'error'
            });
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/b2b/items/${id}/`);
            fetchData();
            setToast({ isVisible: true, message: "Product deleted successfully.", type: 'success' });
        } catch (err) {
            console.error("Failed to delete product", err);
        }
    };

    const updateOrderStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/b2b/orders/${id}/`, { status: newStatus });
            fetchData();
            setToast({
                isVisible: true,
                message: `Order #WS-${id} status updated to ${newStatus}.`,
                type: 'success'
            });
        } catch (err) {
            console.error("Failed to update status", err);
            setToast({
                isVisible: true,
                message: "Failed to update order status.",
                type: 'error'
            });
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="d-flex min-vh-50 align-items-center justify-content-center">
                <div className="spinner-border text-rust" role="status"></div>
            </div>
        );
    }

    return (
        <div className="admin-wholesale-page">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Wholesale Inventory</h2>
                    <p className="text-muted">Manage B2B products for salon owners.</p>
                </div>
                <div className="d-flex gap-3">
                    <button 
                        onClick={() => setShowCategoryModal(true)}
                        className="btn btn-outline-dark rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                    >
                        <FiPlus size={20} /> Manage Categories
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="btn btn-rust rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                    >
                        <FiPlus size={20} /> Add New Product
                    </button>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="d-flex gap-4 border-bottom mb-5">
                <button 
                    onClick={() => setActiveTab('items')}
                    className={`btn border-0 rounded-0 pb-3 fw-bold transition-all ${activeTab === 'items' ? 'text-rust border-bottom border-rust border-3' : 'text-muted'}`}
                >
                    <FiPackage className="me-2" /> Products & Inventory
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`btn border-0 rounded-0 pb-3 fw-bold transition-all ${activeTab === 'orders' ? 'text-rust border-bottom border-rust border-3' : 'text-muted'}`}
                >
                    <FiClipboard className="me-2" /> Wholesale Orders
                    {orders.length > 0 && <span className="ms-2 badge rounded-pill bg-rust small">{orders.length}</span>}
                </button>
            </div>

            {activeTab === 'items' ? (
                <>
                    {/* Stats Overview */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-4">
                            <div className="bg-white p-4 rounded-5 shadow-sm border border-opacity-10">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <div className="bg-rust bg-opacity-10 p-3 rounded-circle text-rust">
                                        <FiShoppingBag size={24} />
                                    </div>
                                    <h6 className="fw-bold mb-0 text-muted">Total Products</h6>
                                </div>
                                <h2 className="fw-bold mb-0">{products.length}</h2>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-white p-4 rounded-5 shadow-sm border border-opacity-10">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                                        <FiPackage size={24} />
                                    </div>
                                    <h6 className="fw-bold mb-0 text-muted">In Stock</h6>
                                </div>
                                <h2 className="fw-bold mb-0">{products.reduce((acc, p) => acc + p.stock, 0)}</h2>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-white p-4 rounded-5 shadow-sm border border-opacity-10">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                                        <FiDollarSign size={24} />
                                    </div>
                                    <h6 className="fw-bold mb-0 text-muted">Inventory Value</h6>
                                </div>
                                <h2 className="fw-bold mb-0">${products.reduce((acc, p) => acc + (p.wholesale_price * p.stock), 0).toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden">
                        <div className="p-4 border-bottom border-opacity-10 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Active Listings</h5>
                            <div className="bg-light rounded-pill px-3 py-1 d-flex align-items-center gap-2" style={{ maxWidth: '300px' }}>
                                <FiSearch className="text-muted" />
                                <input 
                                    type="text" 
                                    className="form-control border-0 bg-transparent shadow-none p-1" 
                                    placeholder="Search inventory..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Product</th>
                                        <th className="py-3 border-0">Category</th>
                                        <th className="py-3 border-0">Price</th>
                                        <th className="py-3 border-0">Stock</th>
                                        <th className="py-3 border-0">Status</th>
                                        <th className="px-4 py-3 border-0 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img 
                                                        src={getImageUrl(p.image) || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80'} 
                                                        className="rounded-3 shadow-sm" 
                                                        style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                                                        alt={p.name}
                                                    />
                                                    <div className="fw-bold text-dark">{p.name}</div>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-light text-dark rounded-pill px-3 border">{p.category_name}</span></td>
                                            <td className="fw-bold text-rust">${p.wholesale_price}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className={`rounded-circle ${p.stock > 10 ? 'bg-success' : 'bg-danger'}`} style={{ width: '6px', height: '6px' }}></div>
                                                    {p.stock} units
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 ${p.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                                    {p.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button className="btn btn-light btn-sm rounded-circle p-2 border"><FiEdit2 size={16} /></button>
                                                    <button 
                                                        onClick={() => deleteProduct(p.id)}
                                                        className="btn btn-light btn-sm rounded-circle p-2 border text-danger"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                /* Orders View */
                <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden">
                    <div className="p-4 border-bottom border-opacity-10">
                        <h5 className="fw-bold mb-0">Incoming Wholesale Orders</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 border-0">Order ID</th>
                                    <th className="py-3 border-0">Salon Partner</th>
                                    <th className="py-3 border-0">Product</th>
                                    <th className="py-3 border-0">Qty</th>
                                    <th className="py-3 border-0">Total</th>
                                    <th className="py-3 border-0">Status</th>
                                    <th className="px-4 py-3 border-0 text-end">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 fw-bold text-muted">#WS-{order.id}</td>
                                        <td>
                                            <div className="fw-bold text-dark">{order.owner_email}</div>
                                            <div className="small text-muted">Salon Owner</div>
                                        </td>
                                        <td><span className="fw-medium">{order.product_name}</span></td>
                                        <td>x{order.quantity}</td>
                                        <td className="fw-bold text-rust">${order.total_price}</td>
                                        <td>
                                            <select 
                                                className={`form-select form-select-sm rounded-pill px-3 border-0 fw-bold ${
                                                    order.status === 'DELIVERED' ? 'bg-success bg-opacity-10 text-success' :
                                                    order.status === 'CANCELLED' ? 'bg-danger bg-opacity-10 text-danger' :
                                                    order.status === 'SHIPPED' ? 'bg-info bg-opacity-10 text-info' :
                                                    'bg-warning bg-opacity-10 text-warning'
                                                }`}
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-4 text-end text-muted small">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">
                                            No wholesale orders found yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-5 p-5 shadow-lg w-100 overflow-y-auto" style={{ maxWidth: '600px', maxHeight: '90vh' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold mb-0">Add Wholesale Product</h3>
                            <button className="btn btn-link text-dark p-0" onClick={() => setShowModal(false)}><FiX size={24} /></button>
                        </div>
                        <form onSubmit={handleProductSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Product Name</label>
                                <input type="text" className="form-control rounded-pill px-4 py-3 border-opacity-25" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Category</label>
                                    <select className="form-select rounded-pill px-4 py-3 border-opacity-25" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Wholesale Price ($)</label>
                                    <input type="number" step="0.01" className="form-control rounded-pill px-4 py-3 border-opacity-25" required value={formData.wholesale_price} onChange={e => setFormData({...formData, wholesale_price: e.target.value})} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Product Image</label>
                                <input 
                                    type="file" 
                                    className="form-control rounded-pill px-4 py-2 border-opacity-25" 
                                    accept="image/*"
                                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                                />
                                <p className="text-muted small mt-1 ms-3">Recommended: Square image, 500x500px</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Initial Stock</label>
                                <input type="number" className="form-control rounded-pill px-4 py-3 border-opacity-25" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Description</label>
                                <textarea className="form-control rounded-4 px-4 py-3 border-opacity-25" rows={3} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            <button type="submit" className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm">Save Product</button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Manage Category Modal */}
            {showCategoryModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-5 p-5 shadow-lg w-100" style={{ maxWidth: '500px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold mb-0">Create Category</h3>
                            <button className="btn btn-link text-dark p-0" onClick={() => setShowCategoryModal(false)}><FiX size={24} /></button>
                        </div>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Category Name</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-pill px-4 py-3 border-opacity-25" 
                                    placeholder="e.g. Hair Care, Skin Care"
                                    required 
                                    value={categoryData.name} 
                                    onChange={e => setCategoryData({...categoryData, name: e.target.value})} 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Description (Optional)</label>
                                <textarea 
                                    className="form-control rounded-4 px-4 py-3 border-opacity-25" 
                                    rows={2} 
                                    value={categoryData.description} 
                                    onChange={e => setCategoryData({...categoryData, description: e.target.value})}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-sm">Create Category</button>
                        </form>

                        <div className="mt-5 pt-4 border-top">
                            <h6 className="fw-bold text-muted small mb-3 text-uppercase">Existing Categories</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {categories.map(c => (
                                    <span key={c.id} className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-medium">
                                        {c.name}
                                    </span>
                                ))}
                                {categories.length === 0 && <p className="text-muted small">No categories created yet.</p>}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

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
                .hover-bg-espresso:hover { background-color: #1E1915; color: white; }
            `}</style>
        </div>
    );
}
