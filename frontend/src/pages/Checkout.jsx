import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { simulatePaymentSuccess } from '../services/paymentService';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const couponCode = location.state?.couponCode || null;
  const discount = location.state?.discount || 0;
  const finalTotal = location.state?.finalTotal || subtotal;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setLoading(true);
    setError('');

    try {
      // 1. Create Order on Backend
      const orderRes = await createOrder({
        items: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
        couponCode,
      });

      const orderId = orderRes.order.id;

      // 2. Simulate Payment Completion for Dev / Stripe Checkout Session
      await simulatePaymentSuccess(orderId);

      clearCart();
      navigate(`/orders/${orderId}?payment=success`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Checkout</span>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">Review &amp; Confirm Order</h1>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Customer Info Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-neutral-600" /> Customer Information
            </h3>

            <div className="text-xs space-y-2 text-neutral-700 font-light">
              <div>
                <span className="text-neutral-400 block">Name</span>
                <span className="font-semibold text-neutral-900">{user?.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Email Address</span>
                <span className="font-semibold text-neutral-900">{user?.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Stripe Verified Checkout
              </div>
              <p className="text-[11px] text-neutral-500 font-light">
                Encrypted end-to-end payment processing with raw webhook signature validation.
              </p>
            </div>
          </div>

          {/* Items Summary Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">Order Summary ({cartItems.length} items)</h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-xs font-light">
                  <span className="text-neutral-700 line-clamp-1">{item.name} x {item.quantity}</span>
                  <span className="font-semibold text-neutral-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs font-light">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handlePlaceOrder}
              loading={loading}
              className="w-full"
              icon={CreditCard}
            >
              Complete Secure Purchase
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
