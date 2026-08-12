import React, { useEffect, useState } from 'react';
import { getCoupons, createCoupon, deleteCoupon } from '../../services/couponService';
import { Tag, Plus, Trash2 } from 'lucide-react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(10);
  const [minimumOrder, setMinimumOrder] = useState(500);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await getCoupons();
      setCoupons(res.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCoupon({
        code,
        discountType,
        discountValue: parseFloat(discountValue),
        minimumOrder: parseFloat(minimumOrder)
      });
      setCode('');
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Tag className="w-6 h-6 text-amber-400" /> Admin Coupon Management
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Create discount codes and usage requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <form onSubmit={handleCreateCoupon} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-amber-400" /> Create Coupon
          </h3>

          <div>
            <label className="block text-neutral-400 font-medium mb-1">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white uppercase font-bold focus:outline-none focus:border-amber-500"
              placeholder="e.g. SAVE20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Discount Value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 font-medium mb-1">Minimum Order Amount (₹)</label>
            <input
              type="number"
              value={minimumOrder}
              onChange={(e) => setMinimumOrder(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-amber-600/20"
          >
            {submitting ? 'Creating...' : 'Create Coupon'}
          </button>
        </form>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-white text-sm">Active Coupons ({coupons.length})</h3>

          {loading ? (
            <div className="py-8 text-center text-neutral-500 animate-pulse text-xs">Loading coupons...</div>
          ) : (
            <div className="space-y-3">
              {coupons.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-amber-400 text-sm tracking-wide">{c.code}</span>
                    <span className="text-neutral-400 ml-3">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </span>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Min Order: ₹{c.minimumOrder} &bull; Used: {c.usedCount} times</p>
                  </div>

                  <button onClick={() => handleDelete(c.id)} className="p-2 text-neutral-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
