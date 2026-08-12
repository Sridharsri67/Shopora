import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import PageTransition from '../components/PageTransition';
import Badge from '../components/Badge';
import { Package, ArrowRight } from 'lucide-react';

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
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Order History</span>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">My Orders ({orders.length})</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 border border-neutral-200 rounded-3xl p-8 space-y-3">
            <Package className="w-10 h-10 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-900">You haven't placed any orders yet.</p>
            <Link to="/products" className="text-xs text-neutral-600 font-medium hover:underline inline-flex items-center gap-1">
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 text-xs">
                  <div>
                    <span className="text-neutral-400">Order ID: </span>
                    <span className="font-bold text-neutral-900">#{order.id}</span>
                    <span className="text-neutral-400 ml-4">Date: </span>
                    <span className="text-neutral-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                      Payment: {order.paymentStatus}
                    </Badge>
                    <Badge variant="dark">
                      Status: {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-neutral-700 font-light">
                        {item.product ? item.product.name : `Product #${item.productId}`} x {item.quantity}
                      </span>
                      <span className="font-bold text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-neutral-100 pt-4 text-xs">
                  <Link to={`/orders/${order.id}`} className="text-neutral-900 font-semibold hover:underline">
                    View Full Invoice &rarr;
                  </Link>
                  <div className="text-base font-bold text-neutral-900">
                    Total: ₹{order.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
