import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import { Package, Layers, ShoppingBag, Tag, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  return (
    <PageTransition>
      <div className="space-y-8 py-6 max-w-6xl mx-auto">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Admin Operations</span>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1 flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-neutral-900" /> Admin Dashboard
          </h1>
        </div>

        {/* Analytic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/products"
            className="bg-white border border-neutral-200 p-6 rounded-3xl hover:border-neutral-900 transition-all group space-y-4 shadow-2xs"
          >
            <div className="h-10 w-10 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base group-hover:text-neutral-600 transition-colors">Products</h3>
              <p className="text-xs text-neutral-500 font-light mt-1">Create, edit &amp; delete catalog items</p>
            </div>
            <span className="text-xs text-neutral-900 font-semibold flex items-center gap-1">
              Manage Products <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/inventory"
            className="bg-white border border-neutral-200 p-6 rounded-3xl hover:border-neutral-900 transition-all group space-y-4 shadow-2xs"
          >
            <div className="h-10 w-10 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base group-hover:text-neutral-600 transition-colors">Inventory</h3>
              <p className="text-xs text-neutral-500 font-light mt-1">Update stock levels &amp; quantities</p>
            </div>
            <span className="text-xs text-neutral-900 font-semibold flex items-center gap-1">
              Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white border border-neutral-200 p-6 rounded-3xl hover:border-neutral-900 transition-all group space-y-4 shadow-2xs"
          >
            <div className="h-10 w-10 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base group-hover:text-neutral-600 transition-colors">Global Orders</h3>
              <p className="text-xs text-neutral-500 font-light mt-1">View orders &amp; change status</p>
            </div>
            <span className="text-xs text-neutral-900 font-semibold flex items-center gap-1">
              Manage Orders <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/coupons"
            className="bg-white border border-neutral-200 p-6 rounded-3xl hover:border-neutral-900 transition-all group space-y-4 shadow-2xs"
          >
            <div className="h-10 w-10 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base group-hover:text-neutral-600 transition-colors">Coupons</h3>
              <p className="text-xs text-neutral-500 font-light mt-1">Create discount codes &amp; rules</p>
            </div>
            <span className="text-xs text-neutral-900 font-semibold flex items-center gap-1">
              Manage Coupons <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
