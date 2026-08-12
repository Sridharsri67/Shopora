import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Layers, ShoppingBag, Tag, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <LayoutDashboard className="w-7 h-7 text-purple-400" /> Admin Dashboard
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Manage catalog, inventory, coupons, and orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/products"
          className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all group space-y-4"
        >
          <div className="h-10 w-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Products</h3>
            <p className="text-xs text-neutral-400 mt-1">Create, update &amp; delete catalog products</p>
          </div>
          <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
            Manage Products <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/inventory"
          className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all group space-y-4"
        >
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">Inventory</h3>
            <p className="text-xs text-neutral-400 mt-1">Update stock levels &amp; quantities</p>
          </div>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all group space-y-4"
        >
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Orders</h3>
            <p className="text-xs text-neutral-400 mt-1">View global orders &amp; update status</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            Manage Orders <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/coupons"
          className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all group space-y-4"
        >
          <div className="h-10 w-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">Coupons</h3>
            <p className="text-xs text-neutral-400 mt-1">Create discount codes &amp; rules</p>
          </div>
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            Manage Coupons <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
