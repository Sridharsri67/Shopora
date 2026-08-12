import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, LogOut, Shield, Package, Home, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Shopora</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <Link to="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Home className="w-4 h-4 text-indigo-400" /> Home
            </Link>
            <Link to="/products" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Package className="w-4 h-4 text-indigo-400" /> Products
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="hover:text-white transition-colors">
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-neutral-300 hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Auth State */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg transition-colors">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  {isAdmin && <Shield className="w-3.5 h-3.5 text-purple-400" />}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white px-3 py-1.5 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
