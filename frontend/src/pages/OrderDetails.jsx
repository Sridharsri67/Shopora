import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import PageTransition from '../components/PageTransition';
import Badge from '../components/Badge';
import { CheckCircle2, Calendar, ArrowLeft } from 'lucide-react';

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
    return <div className="py-20 text-center text-red-600 text-xs font-medium">Order not found.</div>;
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <Link to="/orders" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
        </Link>

        {paymentSuccess && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-4 text-emerald-900 text-xs">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            <div>
              <h4 className="font-bold text-sm">Order Confirmed &amp; Paid</h4>
              <p className="text-[11px] text-emerald-700 font-light mt-0.5">
                Stripe checkout completed successfully. Stock reserved and confirmation email queued via BullMQ.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-1">Invoice</span>
              <h1 className="text-2xl font-extrabold text-neutral-900">Order #{order.id}</h1>
              <p className="text-xs text-neutral-500 font-light mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                Payment: {order.paymentStatus}
              </Badge>
              <Badge variant="dark">
                Status: {order.status}
              </Badge>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">Line Items</h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 text-xs">
                  <div>
                    <h4 className="font-semibold text-neutral-900">{item.product ? item.product.name : `Product #${item.productId}`}</h4>
                    <p className="text-neutral-500 font-light mt-0.5">₹{item.price.toLocaleString()} x {item.quantity}</p>
                  </div>
                  <div className="font-bold text-neutral-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs font-light text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">₹{order.subtotal?.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount</span>
                <span>-₹{order.discount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Total Amount</span>
              <span>₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
