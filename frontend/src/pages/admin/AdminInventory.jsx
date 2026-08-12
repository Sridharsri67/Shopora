import React, { useEffect, useState } from 'react';
import { getProducts, updateInventory } from '../../services/productService';
import { Layers, Save } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await getProducts();
      const list = data.products || [];
      setProducts(list);

      const qMap = {};
      list.forEach((p) => {
        qMap[p.id] = p.inventory ? p.inventory.quantity : 0;
      });
      setQuantities(qMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId) => {
    try {
      const newQty = quantities[productId];
      await updateInventory(productId, newQty);
      alert(`Inventory stock updated to ${newQty} for product #${productId}`);
      fetchInventory();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" /> Admin Inventory Management
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Update stock levels across all catalog items</p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-neutral-500 animate-pulse text-xs">Loading inventory list...</div>
      ) : (
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
          {products.map((prod) => (
            <div key={prod.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 object-cover rounded-lg bg-neutral-950" />
                <div>
                  <h4 className="font-semibold text-white">{prod.name}</h4>
                  <p className="text-neutral-500">Category: {prod.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Stock Qty:</span>
                  <input
                    type="number"
                    min="0"
                    value={quantities[prod.id] !== undefined ? quantities[prod.id] : 0}
                    onChange={(e) =>
                      setQuantities({ ...quantities, [prod.id]: parseInt(e.target.value) || 0 })
                    }
                    className="w-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => handleUpdate(prod.id)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
