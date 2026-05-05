'use client';

import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiExternalLink, FiSearch, FiFilter } from 'react-icons/fi';
import { api } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminSalons() {
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSalons = async () => {
    try {
      const res = await api.get('/salons/list_all/');
      setSalons(res.data);
    } catch (err) {
      console.error("Failed to fetch salons", err);
      toast.error("Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const handleApprove = async (id: number) => {
    const loadingToast = toast.loading("Approving salon...");
    try {
      await api.post(`/salons/${id}/approve/`);
      toast.success("Salon approved successfully!", { id: loadingToast });
      fetchSalons();
    } catch (err) {
      toast.error("Failed to approve salon", { id: loadingToast });
    }
  };

  const handleDeactivate = async (id: number) => {
    const loadingToast = toast.loading("Deactivating salon...");
    try {
      await api.post(`/salons/${id}/deactivate/`);
      toast.success("Salon deactivated", { id: loadingToast });
      fetchSalons();
    } catch (err) {
      toast.error("Failed to deactivate", { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this salon? This action is irreversible.")) {
      const loadingToast = toast.loading("Deleting salon...");
      try {
        await api.delete(`/salons/${id}/`);
        toast.success("Salon permanently deleted", { id: loadingToast });
        fetchSalons();
      } catch (err) {
        toast.error("Failed to delete salon", { id: loadingToast });
      }
    }
  };

  const filteredSalons = salons.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-salons">
      <div className="bg-white rounded-5 p-5 shadow-sm border border-opacity-10">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
          <h4 className="fw-bold mb-0 text-dark">Salon Directory</h4>
          <div className="d-flex gap-3">
            <div className="search-pill bg-sand d-flex align-items-center px-3 py-2 rounded-pill" style={{ minWidth: '300px' }}>
              <FiSearch className="text-muted me-2" />
              <input 
                type="text" 
                placeholder="Search salons..." 
                className="bg-transparent border-0 w-100 shadow-none" 
                style={{ fontSize: '0.9rem', outline: 'none' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-dark rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
              <FiFilter />
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="text-muted small fw-bold text-uppercase letter-spaced">
                <th className="border-0 px-3 pb-3">Salon Name</th>
                <th className="border-0 px-3 pb-3">Owner</th>
                <th className="border-0 px-3 pb-3">Status</th>
                <th className="border-0 px-3 pb-3">Joined</th>
                <th className="border-0 px-3 pb-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5">Loading salons...</td></tr>
              ) : filteredSalons.map((salon) => (
                <tr key={salon.id} className="border-bottom border-light">
                  <td className="px-3 py-4">
                    <div className="d-flex align-items-center gap-3">
                      <img src={salon.cover_image} className="rounded-3 shadow-sm object-fit-cover" style={{ width: '45px', height: '45px' }} />
                      <div>
                        <div className="fw-bold text-dark">{salon.name}</div>
                        <div className="text-muted small">{salon.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-dark fw-medium">{salon.owner_email || 'Owner'}</div>
                  </td>
                  <td className="px-3 py-4">
                    {!salon.is_approved ? (
                      <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-1 fw-bold">PENDING</span>
                    ) : salon.is_active ? (
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-bold">ACTIVE</span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fw-bold">DEACTIVATED</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-muted small">
                    {new Date(salon.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Link href={`/salons/${salon.id}`} className="btn btn-light rounded-circle p-2" title="View Public Profile">
                        <FiExternalLink />
                      </Link>
                      {!salon.is_approved && (
                        <button onClick={() => handleApprove(salon.id)} className="btn btn-success bg-opacity-10 text-success border-0 rounded-circle p-2" title="Approve Salon">
                          <FiCheck />
                        </button>
                      )}
                      {salon.is_active ? (
                        <button onClick={() => handleDeactivate(salon.id)} className="btn btn-warning bg-opacity-10 text-warning border-0 rounded-circle p-2" title="Deactivate">
                          <FiX />
                        </button>
                      ) : (
                        <button onClick={() => handleApprove(salon.id)} className="btn btn-success bg-opacity-10 text-success border-0 rounded-circle p-2" title="Reactivate">
                          <FiCheck />
                        </button>
                      )}
                      <button onClick={() => handleDelete(salon.id)} className="btn btn-danger bg-opacity-10 text-danger border-0 rounded-circle p-2" title="Delete Permanent">
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
