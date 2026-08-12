import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct } from '../../services/productService';
import PageTransition from '../../components/PageTransition';
import Button from '../../components/Button';
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
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 py-6 max-w-6xl mx-auto">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Admin</span>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">Product Catalog Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Create Form */}
          <form onSubmit={handleCreateProduct} className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 text-xs shadow-xs">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-neutral-700" /> Create New Product
            </h3>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                placeholder="e.g. Mechanical Keyboard"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Monitors">Monitors</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  placeholder="2999"
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Initial Stock</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  placeholder="25"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-neutral-900"
                placeholder="Overview description..."
              />
            </div>

            <Button type="submit" variant="primary" size="md" loading={submitting} className="w-full">
              Create Product
            </Button>
          </form>

          {/* Product List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">Product Catalog ({products.length})</h3>

            {loading ? (
              <div className="py-8 text-center text-neutral-400 animate-pulse text-xs">Loading products...</div>
            ) : (
              <div className="space-y-3">
                {products.map((prod) => (
                  <div key={prod.id} className="flex items-center justify-between bg-white border border-neutral-200/80 p-4 rounded-2xl text-xs gap-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 object-cover rounded-xl bg-neutral-100 border border-neutral-200/60" />
                      <div>
                        <h4 className="font-bold text-neutral-900">{prod.name}</h4>
                        <p className="text-neutral-500 font-light mt-0.5">₹{prod.price} &bull; Stock: {prod.inventory ? prod.inventory.quantity : 0}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete Product"
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
    </PageTransition>
  );
}
