import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { validateCoupon } from '../services/couponService';
import CartItem from '../components/CartItem';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { ShoppingBag, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

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
      <PageTransition>
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="h-16 w-16 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-xs text-neutral-500 font-light">Explore our catalog and select items to add to your shopping bag.</p>
          <Link to="/products">
            <Button variant="primary" size="md">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const discountAmount = couponResult ? couponResult.discount : 0;
  const finalTotal = subtotal - discountAmount;

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        couponCode: couponResult?.code || null,
        discount: discountAmount,
        finalTotal,
      },
    });
  };

  return (
    <PageTransition>
      <div className="space-y-8 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Shopping Bag</span>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">Your Items ({cartItems.length})</h1>
          </div>
          <button onClick={clearCart} className="text-xs text-neutral-400 hover:text-red-600 transition-colors">
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Editorial Summary Box */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold text-neutral-900 text-sm tracking-tight">Order Summary</h3>

            {/* Coupon Code Input Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. SAVE10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 uppercase font-bold focus:outline-none focus:border-neutral-900"
                />
                <Button type="submit" variant="secondary" size="sm" loading={validating}>
                  Apply
                </Button>
              </div>

              {couponResult && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Coupon <b>{couponResult.code}</b> applied! (-₹{discountAmount})
                </div>
              )}

              {couponError && (
                <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" /> {couponError}
                </div>
              )}
            </form>

            {/* Pricing Details */}
            <div className="space-y-2.5 border-t border-neutral-200 pt-4 text-xs font-light">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">₹{subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({couponResult?.code})</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="text-emerald-700 font-semibold uppercase text-[11px]">Free Shipping</span>
              </div>

              <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-neutral-200 pt-3">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={handleProceedToCheckout} className="w-full">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
