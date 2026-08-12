import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { createReview } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { ShoppingBag, Star, Layers, Check, ArrowLeft, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const fetchProductAndReviews = async () => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      setProduct(data.product);
      setReviews(data.product?.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setReviewSubmitting(true);
    setReviewError('');
    try {
      await createReview(id, { rating, comment });
      setComment('');
      fetchProductAndReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-neutral-400 animate-pulse text-xs">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-neutral-900 font-semibold">Product not found.</p>
        <button onClick={() => navigate('/products')} className="text-xs text-neutral-600 hover:underline">
          &larr; Return to Catalog
        </button>
      </div>
    );
  }

  const stock = product.inventory ? product.inventory.quantity : 0;
  const isOutOfStock = stock <= 0;

  return (
    <PageTransition>
      <div className="space-y-16 py-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* Product Details Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="aspect-square bg-neutral-100 border border-neutral-200 rounded-3xl overflow-hidden shadow-2xs">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="neutral">{product.category}</Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-3 tracking-tight">{product.name}</h1>
              <div className="text-3xl font-bold text-neutral-900 mt-2">₹{product.price.toLocaleString()}</div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed font-light border-t border-b border-neutral-200/80 py-4">
              {product.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <Layers className="w-4 h-4 text-neutral-400" />
              <span>Stock Status:</span>
              <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-emerald-700'}`}>
                {isOutOfStock ? 'Out of Stock' : `${stock} units in stock`}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full ${added ? 'bg-emerald-800' : ''}`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Shopping Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="border-t border-neutral-200 pt-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2 tracking-tight">
              <MessageSquare className="w-5 h-5 text-neutral-400" /> Customer Reviews ({reviews.length})
            </h2>
          </div>

          {/* Add Review Form */}
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900">Leave a Product Review</h3>
              {reviewError && (
                <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{reviewError}</div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 ${star <= rating ? 'text-neutral-900' : 'text-neutral-300'}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Share your experience regarding performance, build quality, and durability..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                required
              />

              <Button type="submit" variant="primary" size="sm" loading={reviewSubmitting}>
                Submit Review
              </Button>
            </form>
          ) : (
            <p className="text-xs text-neutral-500">Sign in to share your product feedback.</p>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No customer reviews yet for this item.</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-neutral-200/80 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">{rev.user?.name || 'Verified Customer'}</span>
                    <div className="flex text-neutral-900">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
