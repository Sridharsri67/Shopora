import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { validateCoupon } from '../services/couponService';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';

export default function Cart() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validating, setValidating] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setValidating(true);
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode, subtotal);
      setCouponResult(res);
    } catch (err) {
      setCouponError(err.response?.data?.message || err.message);
      setCouponResult(null);
    } finally {
      setValidating(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="h-16 w-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-neutral-400">Discover gear and add workspace components to your bag.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const discountAmount = couponResult ? couponResult.discount : 0;
  const finalTotal = subtotal - discountAmount;

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        couponCode: couponResult?.code || null,
        discount: discountAmount,
        finalTotal
      }
    });
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Shopping Cart ({cartItems.length} items)</h1>
        <button onClick={clearCart} className="text-xs text-neutral-400 hover:text-red-400 transition-colors">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary Card */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-semibold text-white text-sm">Order Summary</h3>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon Code (e.g. SAVE10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={validating}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shrink-0"
              >
                Apply
              </button>
            </div>

            {couponResult && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" /> Coupon <b>{couponResult.code}</b> applied! (₹{discountAmount} OFF)
              </div>
            )}

            {couponError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5" /> {couponError}
              </div>
            )}
          </form>

          {/* Pricing Details */}
          <div className="space-y-2 border-t border-neutral-800 pt-4 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Discount ({couponResult?.code})</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-400">
              <span>Shipping</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-white border-t border-neutral-800 pt-3">
              <span>Total Amount</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-xs"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
