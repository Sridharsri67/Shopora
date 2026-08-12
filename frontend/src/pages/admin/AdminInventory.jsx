import React, { useEffect, useState } from 'react';
import { getProducts, updateInventory } from '../../services/productService';
import PageTransition from '../../components/PageTransition';
import Button from '../../components/Button';
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
    <PageTransition>
      <div className="space-y-6 py-6 max-w-4xl mx-auto">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Admin</span>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-neutral-900" /> Stock &amp; Inventory Management
          </h1>
        </div>

        {loading ? (
          <div className="py-8 text-center text-neutral-400 animate-pulse text-xs">Loading inventory list...</div>
        ) : (
          <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden divide-y divide-neutral-100 shadow-2xs">
            {products.map((prod) => (
              <div key={prod.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 object-cover rounded-xl bg-neutral-100 border border-neutral-200/60" />
                  <div>
                    <h4 className="font-bold text-neutral-900">{prod.name}</h4>
                    <p className="text-neutral-500 font-light">Category: {prod.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">Stock Qty:</span>
                    <input
                      type="number"
                      min="0"
                      value={quantities[prod.id] !== undefined ? quantities[prod.id] : 0}
                      onChange={(e) =>
                        setQuantities({ ...quantities, [prod.id]: parseInt(e.target.value) || 0 })
                      }
                      className="w-20 bg-white border border-neutral-200 rounded-xl p-2 text-center text-neutral-900 font-bold focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdate(prod.id)}
                    icon={Save}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
