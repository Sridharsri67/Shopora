import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct } from '../../services/productService';
import { Plus, Trash2, Package } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [quantity, setQuantity] = useState(20);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProduct({
        name,
        description,
        price: parseFloat(price),
        category,
        quantity: parseInt(quantity),
        imageUrl
      });
      setName('');
      setDescription('');
      setPrice('');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Product Management</h1>
        <p className="text-xs text-neutral-400 mt-1">Create, view, and remove store products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create Form */}
        <form onSubmit={handleCreateProduct} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-purple-400" /> Create New Product
          </h3>

          <div>
            <label className="block text-neutral-400 font-medium mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. Mechanical Keyboard"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-400 font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Electronics">Electronics</option>
              <option value="Audio">Audio</option>
              <option value="Monitors">Monitors</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                placeholder="2999"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Initial Stock</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                placeholder="25"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 font-medium mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="Short product overview..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/20"
          >
            {submitting ? 'Creating...' : 'Create Product'}
          </button>
        </form>

        {/* Product List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-white text-sm">Product List ({products.length})</h3>

          {loading ? (
            <div className="py-8 text-center text-neutral-500 animate-pulse text-xs">Loading products...</div>
          ) : (
            <div className="space-y-3">
              {products.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl text-xs gap-4">
                  <div className="flex items-center gap-3">
                    <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 object-cover rounded-lg bg-neutral-950" />
                    <div>
                      <h4 className="font-semibold text-white">{prod.name}</h4>
                      <p className="text-neutral-400 mt-0.5">₹{prod.price} &bull; Stock: {prod.inventory ? prod.inventory.quantity : 0}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
