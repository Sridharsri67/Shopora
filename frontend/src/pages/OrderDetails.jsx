import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { CheckCircle2, Package, Calendar, Tag, ArrowLeft } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get('payment') === 'success';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      setOrder(res.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-neutral-400 animate-pulse text-xs">Loading order details...</div>;
  }

  if (!order) {
    return <div className="py-20 text-center text-red-400 text-xs">Order not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Link to="/orders" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
      </Link>

      {paymentSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-bold">Payment Verified &amp; Confirmed!</h4>
            <p className="text-[11px] text-neutral-300">
              Stripe session completed. Inventory updated and confirmation email queued.
            </p>
          </div>
        </div>
      )}

      <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Order #{order.id}</h1>
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className={`px-3 py-1 rounded-full font-semibold border ${
              order.paymentStatus === 'PAID'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              Payment: {order.paymentStatus}
            </span>
            <span className="bg-neutral-800 text-white px-3 py-1 rounded-full font-medium">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Order items */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-sm">Ordered Items</h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80 text-xs">
                <div>
                  <h4 className="font-semibold text-white">{item.product ? item.product.name : `Product #${item.productId}`}</h4>
                  <p className="text-neutral-400 mt-0.5">₹{item.price.toLocaleString()} x {item.quantity}</p>
                </div>
                <div className="font-bold text-white">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs text-neutral-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal?.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Coupon Discount</span>
              <span>-₹{order.discount?.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
            <span>Total Amount</span>
            <span>₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
