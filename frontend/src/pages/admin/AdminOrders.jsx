import React, { useEffect, useState } from 'react';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../../services/orderService';
import { ShoppingBag } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrdersAdmin();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-400" /> Admin Global Orders
        </h1>
        <p className="text-xs text-neutral-400 mt-1">View customer orders and update status progression</p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-neutral-500 animate-pulse text-xs">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-neutral-500">Order ID: </span>
                  <span className="font-bold text-white">#{order.id}</span>
                  <span className="text-neutral-500 ml-4">Customer: </span>
                  <span className="text-neutral-300 font-semibold">{order.user?.name || `User #${order.userId}`} ({order.user?.email})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    Payment: {order.paymentStatus}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 text-white text-xs rounded-lg px-2.5 py-1 font-medium focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-neutral-300">
                    <span>{item.product ? item.product.name : `Product #${item.productId}`} x {item.quantity}</span>
                    <span className="font-semibold text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-3 flex justify-between items-center text-xs">
                <span className="text-neutral-500">Date: {new Date(order.createdAt).toLocaleString()}</span>
                <span className="text-sm font-bold text-white">Total: ₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
