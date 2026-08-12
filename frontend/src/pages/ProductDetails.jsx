import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { createReview, getProductReviews } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Star, Layers, Check, ArrowLeft, MessageSquare } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // New review form
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
    return <div className="py-20 text-center text-neutral-400 animate-pulse">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-red-400">Product not found.</p>
        <button onClick={() => navigate('/products')} className="text-xs text-indigo-400 hover:underline">
          &larr; Back to Catalog
        </button>
      </div>
    );
  }

  const stock = product.inventory ? product.inventory.quantity : 0;
  const isOutOfStock = stock <= 0;

  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      {/* Main product view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight">{product.name}</h1>
            <div className="text-2xl font-bold text-white mt-2">₹{product.price.toLocaleString()}</div>
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed border-t border-b border-neutral-800/80 py-4">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span>Stock Status:</span>
              <span className={`font-semibold ${isOutOfStock ? 'text-red-400' : 'text-emerald-400'}`}>
                {isOutOfStock ? 'Out of Stock' : `${stock} units available`}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {added ? 'Added to Shopping Bag' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <section className="border-t border-neutral-800 pt-12 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" /> Customer Reviews ({reviews.length})
          </h2>
        </div>

        {/* Add review form */}
        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Write a Review</h3>
            {reviewError && <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{reviewError}</div>}

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 ${star <= rating ? 'text-amber-400' : 'text-neutral-600'}`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Share your feedback on performance, build quality..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="text-xs text-neutral-500">Sign in to leave a review for this product.</p>
        )}

        {/* Reviews listing */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-neutral-500 italic">No reviews yet for this product.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-neutral-900/30 border border-neutral-800/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300">{rev.user?.name || 'Customer'}</span>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-400">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
