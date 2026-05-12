'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiShoppingBag, FiInfo, FiCheckCircle, FiX, FiPlus, FiMinus, FiList } from 'react-icons/fi';
import { api, getImageUrl } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/components/shared/Toast';

export default function WholesaleSupplies() {
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [ordering, setOrdering] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [activeTab, setActiveTab] = useState<'browse' | 'orders'>('browse');

    const fetchData = async () => {
        try {
            const [catRes, prodRes, orderRes] = await Promise.all([
                api.get('/b2b/categories/'),
                api.get('/b2b/items/'),
                api.get('/b2b/orders/')
            ]);
            setCategories(catRes.data.results || catRes.data);
            setProducts(prodRes.data.results || prodRes.data);
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

    const handleOrderClick = (product: any) => {
        setSelectedProduct(product);
        setOrderQuantity(1);
        setShowOrderModal(true);
    };

    const handlePlaceOrder = async () => {
        if (!selectedProduct) return;
        setOrdering(true);
        try {
            await api.post('/b2b/orders/', {
                product: selectedProduct.id,
                quantity: orderQuantity
            });
            setShowOrderModal(false);
            setToast({
                isVisible: true,
                message: `Success! Your order for ${orderQuantity}x ${selectedProduct.name} has been placed.`,
                type: 'success'
            });
            fetchData(); // Refresh stock
        } catch (err) {
            console.error("Failed to place order", err);
            setToast({
                isVisible: true,
                message: "Failed to place order. Please try again.",
                type: 'error'
            });
        } finally {
            setOrdering(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category === parseInt(selectedCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="d-flex min-vh-50 align-items-center justify-content-center">
                <div className="spinner-border text-rust" role="status"></div>
            </div>
        );
    }

    return (
        <div className="pb-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-bold display-5 mb-1" style={{ color: '#1E1915' }}>Wholesale Supplies</h1>
                    <p className="text-muted">Premium salon products at exclusive partner rates.</p>
                </div>
                <div className="bg-rust bg-opacity-10 p-3 rounded-4 d-flex align-items-center gap-3">
                    <div className="bg-rust text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FiInfo size={20} />
                    </div>
                    <div>
                        <h6 className="fw-bold mb-0 text-dark">Partner Exclusive</h6>
                        <p className="text-muted small mb-0">Prices visible to verified salon owners only.</p>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="d-flex gap-4 border-bottom mb-5">
                <button 
                    onClick={() => setActiveTab('browse')}
                    className={`btn border-0 rounded-0 pb-3 fw-bold transition-all ${activeTab === 'browse' ? 'text-rust border-bottom border-rust border-3' : 'text-muted'}`}
                >
                    <FiShoppingBag className="me-2" /> Browse Supplies
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`btn border-0 rounded-0 pb-3 fw-bold transition-all ${activeTab === 'orders' ? 'text-rust border-bottom border-rust border-3' : 'text-muted'}`}
                >
                    <FiList className="me-2" /> My Order History
                    {orders.length > 0 && <span className="ms-2 badge rounded-pill bg-rust small">{orders.length}</span>}
                </button>
            </div>

            {activeTab === 'browse' ? (
                <>
                    {/* Filters & Search */}
                    <div className="row g-4 mb-5">
                        <div className="col-lg-8">
                            <div className="bg-white rounded-pill shadow-sm border p-2 d-flex align-items-center">
                                <FiSearch className="text-muted ms-3" size={20} />
                                <input 
                                    type="text" 
                                    className="form-control border-0 shadow-none bg-transparent py-2" 
                                    placeholder="Search products, brands, or descriptions..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="bg-white rounded-pill shadow-sm border p-2 d-flex align-items-center">
                                <FiFilter className="text-muted ms-3" size={20} />
                                <select 
                                    className="form-select border-0 shadow-none bg-transparent py-2 fw-bold text-dark"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="row g-4">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="col-md-6 col-xl-4" 
                                        key={product.id}
                                    >
                                        <div className="card h-100 border-0 shadow-sm rounded-5 overflow-hidden transition-all hover-translate-up">
                                            <div className="position-relative" style={{ height: '240px' }}>
                                                <img 
                                                    src={getImageUrl(product.image) || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80'} 
                                                    className="w-100 h-100 object-fit-cover" 
                                                    alt={product.name} 
                                                />
                                                <div className="position-absolute top-0 end-0 m-3">
                                                    <span className="badge bg-white text-rust rounded-pill px-3 py-1 shadow-sm fw-bold">
                                                        {product.category_name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="fw-bold text-dark mb-0">{product.name}</h5>
                                                    <span className="fs-5 fw-bold text-rust">${product.wholesale_price}</span>
                                                </div>
                                                <p className="text-muted small mb-4 line-clamp-2">{product.description}</p>
                                                
                                                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-opacity-10">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className={`rounded-circle ${product.stock > 0 ? 'bg-success' : 'bg-danger'} opacity-75`} style={{ width: '8px', height: '8px' }}></div>
                                                        <span className="small text-muted fw-medium">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleOrderClick(product)}
                                                        className="btn btn-dark rounded-pill px-4 btn-sm fw-bold d-flex align-items-center gap-2"
                                                        disabled={product.stock <= 0}
                                                    >
                                                        <FiShoppingBag size={14} /> Order Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <div className="bg-white rounded-5 p-5 shadow-sm border border-dashed border-opacity-20 d-inline-block mx-auto" style={{ maxWidth: '400px' }}>
                                        <FiSearch size={48} className="text-muted mb-3 opacity-20" />
                                        <h5 className="fw-bold">No products found</h5>
                                        <p className="text-muted mb-0">Try adjusting your search or category filters.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                /* Orders History View */
                <div className="bg-white rounded-5 shadow-sm border border-opacity-10 overflow-hidden">
                    <div className="p-4 border-bottom border-opacity-10 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0">My Wholesale Orders</h5>
                        <p className="text-muted small mb-0">Track your recent supply purchases</p>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 border-0">Order ID</th>
                                    <th className="py-3 border-0">Product</th>
                                    <th className="py-3 border-0">Quantity</th>
                                    <th className="py-3 border-0">Total Price</th>
                                    <th className="py-3 border-0">Status</th>
                                    <th className="px-4 py-3 border-0 text-end">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 fw-bold text-muted">#WS-{order.id}</td>
                                        <td>
                                            <div className="fw-bold text-dark">{order.product_name}</div>
                                            <div className="small text-muted">Premium Supply</div>
                                        </td>
                                        <td className="fw-medium">x{order.quantity}</td>
                                        <td className="fw-bold text-rust">${order.total_price}</td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 py-2 ${
                                                order.status === 'DELIVERED' ? 'bg-success bg-opacity-10 text-success' :
                                                order.status === 'SHIPPED' ? 'bg-info bg-opacity-10 text-info' :
                                                order.status === 'PROCESSING' ? 'bg-primary bg-opacity-10 text-primary' :
                                                order.status === 'CANCELLED' ? 'bg-danger bg-opacity-10 text-danger' :
                                                'bg-warning bg-opacity-10 text-warning'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 text-end text-muted small">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5">
                                            <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
                                                <FiList size={40} className="text-muted" />
                                            </div>
                                            <h4 className="fw-bold">No orders yet</h4>
                                            <p className="text-muted">Your wholesale order history will appear here.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Modal */}
            <AnimatePresence>
                {showOrderModal && selectedProduct && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-5 p-5 shadow-lg w-100 mx-3" 
                            style={{ maxWidth: '500px' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold mb-0">Confirm Order</h3>
                                <button className="btn btn-link text-dark p-0" onClick={() => setShowOrderModal(false)}><FiX size={24} /></button>
                            </div>

                            <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-4">
                                <img 
                                    src={getImageUrl(selectedProduct.image) || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80'} 
                                    className="rounded-3" 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                    alt={selectedProduct.name}
                                />
                                <div>
                                    <h6 className="fw-bold mb-1">{selectedProduct.name}</h6>
                                    <p className="text-rust fw-bold mb-0">${selectedProduct.wholesale_price} / unit</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Select Quantity</label>
                                <div className="d-flex align-items-center gap-3">
                                    <button 
                                        className="btn btn-outline-dark rounded-circle p-2 d-flex align-items-center justify-content-center"
                                        style={{ width: '40px', height: '40px' }}
                                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="fs-4 fw-bold text-dark px-3">{orderQuantity}</span>
                                    <button 
                                        className="btn btn-outline-dark rounded-circle p-2 d-flex align-items-center justify-content-center"
                                        style={{ width: '40px', height: '40px' }}
                                        onClick={() => setOrderQuantity(Math.min(selectedProduct.stock, orderQuantity + 1))}
                                    >
                                        <FiPlus />
                                    </button>
                                    <span className="ms-auto text-muted small">Max: {selectedProduct.stock} units</span>
                                </div>
                            </div>

                            <div className="border-top pt-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Unit Price</span>
                                    <span className="fw-medium">${selectedProduct.wholesale_price}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Quantity</span>
                                    <span className="fw-medium">x{orderQuantity}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top">
                                    <span className="fw-bold h5 mb-0">Total Amount</span>
                                    <span className="fw-bold h4 mb-0 text-rust">${(selectedProduct.wholesale_price * orderQuantity).toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={ordering}
                                className="btn btn-rust w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                            >
                                {ordering ? (
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                ) : (
                                    <>
                                        <FiCheckCircle /> Place Wholesale Order
                                    </>
                                )}
                            </button>
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
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .hover-translate-up:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    );
}
