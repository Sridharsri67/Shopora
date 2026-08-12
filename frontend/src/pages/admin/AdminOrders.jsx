import React, { useEffect, useState } from 'react';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../../services/orderService';
import PageTransition from '../../components/PageTransition';
import Badge from '../../components/Badge';
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
    <PageTransition>
      <div className="space-y-6 py-6 max-w-5xl mx-auto">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Admin</span>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-neutral-900" /> Global Customer Orders
          </h1>
        </div>

        {loading ? (
          <div className="py-8 text-center text-neutral-400 animate-pulse text-xs">Loading orders...</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 text-xs shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div>
                    <span className="text-neutral-400">Order ID: </span>
                    <span className="font-bold text-neutral-900">#{order.id}</span>
                    <span className="text-neutral-400 ml-4">Customer: </span>
                    <span className="text-neutral-900 font-semibold">{order.user?.name || `User #${order.userId}`} ({order.user?.email})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                      Payment: {order.paymentStatus}
                    </Badge>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-white border border-neutral-200 text-neutral-900 text-xs rounded-xl px-2.5 py-1.5 font-semibold focus:outline-none focus:border-neutral-900"
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

                {/* Line Items */}
                <div className="space-y-2 font-light">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-neutral-700">
                      <span>{item.product ? item.product.name : `Product #${item.productId}`} x {item.quantity}</span>
                      <span className="font-semibold text-neutral-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-100 pt-3 flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Date: {new Date(order.createdAt).toLocaleString()}</span>
                  <span className="text-base font-bold text-neutral-900">Total: ₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
