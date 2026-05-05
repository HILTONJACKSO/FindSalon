'use client';

import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiExternalLink, FiSearch, FiZap, FiImage, FiCalendar } from 'react-icons/fi';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAds = async () => {
    try {
      const res = await api.get('/ads/');
      // Handling both paginated and non-paginated responses
      const adsList = Array.isArray(res.data.results) ? res.data.results : (Array.isArray(res.data) ? res.data : []);
      setAds(adsList);
    } catch (err) {
      console.error("Failed to fetch ads", err);
      toast.error("Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleApprove = async (id: number) => {
    const loadingToast = toast.loading("Approving ad campaign...");
    try {
      await api.post(`/ads/${id}/approve/`);
      toast.success("Ad approved and live!", { id: loadingToast });
      fetchAds();
    } catch (err) {
      toast.error("Failed to approve ad", { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this ad campaign permanently?")) {
      const loadingToast = toast.loading("Deleting ad...");
      try {
        await api.delete(`/ads/${id}/`);
        toast.success("Ad deleted", { id: loadingToast });
        fetchAds();
      } catch (err) {
        toast.error("Failed to delete ad", { id: loadingToast });
      }
    }
  };

  const filteredAds = ads.filter(ad => 
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.salon_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-ads">
      <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Ad Management</h4>
            <p className="text-muted small mb-0">Approve and monitor featured campaigns across the platform.</p>
          </div>
          <div className="d-flex gap-3">
            <div className="search-pill bg-sand d-flex align-items-center px-3 py-2 rounded-pill" style={{ minWidth: '300px' }}>
              <FiSearch className="text-muted me-2" />
              <input 
                type="text" 
                placeholder="Search by title or salon..." 
                className="bg-transparent border-0 w-100 shadow-none" 
                style={{ fontSize: '0.9rem', outline: 'none' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="text-muted small fw-bold text-uppercase letter-spaced">
                <th className="border-0 px-3 pb-3">Ad Details</th>
                <th className="border-0 px-3 pb-3">Placement</th>
                <th className="border-0 px-3 pb-3">Duration</th>
                <th className="border-0 px-3 pb-3">Status</th>
                <th className="border-0 px-3 pb-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">Loading ads...</td></tr>
              ) : filteredAds.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">No ad campaigns found.</td></tr>
              ) : filteredAds.map((ad) => (
                <tr key={ad.id} className="border-bottom border-light">
                  <td className="px-3 py-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-sand rounded-3 d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style={{ width: '80px', height: '45px' }}>
                        {ad.image ? <img src={ad.image} className="w-100 h-100 object-fit-cover" /> : <FiImage className="text-muted" />}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{ad.title}</div>
                        <div className="text-rust small fw-bold">{ad.salon_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className="badge bg-dark bg-opacity-10 text-dark rounded-pill px-3 py-1">
                      {ad.placement?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="small text-muted d-flex align-items-center gap-1">
                      <FiCalendar size={12} />
                      {ad.start_date} → {ad.end_date}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    {ad.status === 'ACTIVE' ? (
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-bold">ACTIVE</span>
                    ) : ad.status === 'PENDING' ? (
                      <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-1 fw-bold">PENDING APPROVAL</span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fw-bold">{ad.status}</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      {ad.status === 'PENDING' && (
                        <button 
                          onClick={() => handleApprove(ad.id)} 
                          className="btn btn-success bg-opacity-10 text-success border-0 rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-2"
                        >
                          <FiCheck /> Approve
                        </button>
                      )}
                      <button onClick={() => handleDelete(ad.id)} className="btn btn-light rounded-circle p-2 text-danger" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        .letter-spaced { letter-spacing: 1px; }
      `}</style>
    </div>
  );
}
