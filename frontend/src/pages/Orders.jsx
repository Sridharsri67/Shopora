import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-neutral-400 animate-pulse text-xs">Loading order history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Order History</h1>
        <p className="text-xs text-neutral-400 mt-1">Track status and review purchased products</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-8 space-y-3">
          <Package className="w-10 h-10 text-neutral-500 mx-auto" />
          <p className="text-xs text-neutral-400">You haven't placed any orders yet.</p>
          <Link to="/products" className="text-xs text-indigo-400 hover:underline">
            Browse Store
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4 text-xs">
                <div>
                  <span className="text-neutral-500">Order ID: </span>
                  <span className="font-semibold text-white">#{order.id}</span>
                  <span className="text-neutral-500 ml-4">Date: </span>
                  <span className="text-neutral-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {order.paymentStatus}
                  </span>

                  <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full text-[11px] font-medium">
                    Status: {order.status}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-neutral-300">{item.product ? item.product.name : `Product #${item.productId}`} x {item.quantity}</span>
                    <span className="font-semibold text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-neutral-800/80 pt-3 text-xs">
                <Link to={`/orders/${order.id}`} className="text-indigo-400 hover:underline">
                  View Full Details &rarr;
                </Link>
                <div className="text-sm font-bold text-white">
                  Total: ₹{order.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
