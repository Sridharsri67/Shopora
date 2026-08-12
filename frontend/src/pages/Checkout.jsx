import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { createCheckoutSession, simulatePaymentSuccess } from '../services/paymentService';
import { CreditCard, CheckCircle, Lock, ShieldCheck } from 'lucide-react';

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
        couponCode
      });

      const orderId = orderRes.order.id;

      // 2. Simulate Payment Completion for Dev / Stripe Checkout
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
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout</h1>
        <p className="text-xs text-neutral-400 mt-1">Review items and confirm your purchase</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Customer Details */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Customer Information
          </h3>

          <div className="text-xs space-y-2 text-neutral-300">
            <div>
              <span className="text-neutral-500 block">Name</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Email Address</span>
              <span className="font-medium">{user?.email}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Stripe Test Mode Payment Ready
            </div>
            <p className="text-[11px] text-neutral-500">
              Payment status will be verified via backend Stripe webhook architecture.
            </p>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm">Items in Order ({cartItems.length})</h3>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="text-neutral-300 line-clamp-1">{item.name} x {item.quantity}</span>
                <span className="font-semibold text-white shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-800 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({couponCode})</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
              <span>Total Payable</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-xs"
          >
            <CreditCard className="w-4 h-4" />
            {loading ? 'Processing Order...' : 'Pay & Complete Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
