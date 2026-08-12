import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, User, LogOut, Menu, X, LayoutDashboard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { label: 'Shop', path: '/products' },
    { label: 'Electronics', path: '/products?category=Electronics' },
    { label: 'Audio', path: '/products?category=Audio' },
    { label: 'Monitors', path: '/products?category=Monitors' },
    { label: 'Accessories', path: '/products?category=Accessories' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-nav border-b border-neutral-200/80 shadow-xs py-3.5'
            : 'bg-white border-b border-neutral-100 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-extrabold tracking-widest text-lg sm:text-xl text-neutral-900 font-mono">
              SHOPORA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-xs font-medium tracking-wider uppercase transition-colors relative py-1 ${
                    active ? 'text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Icon with Motion Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalCount}
                  className="absolute top-1 right-1 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {totalCount}
                </motion.span>
              )}
            </Link>

            {/* Auth Dropdown / Buttons */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3 border-l border-neutral-200 pl-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors rounded-lg"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3 border-l border-neutral-200 pl-4">
                <Link
                  to="/login"
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-neutral-900 hover:bg-neutral-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay Drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-white border border-neutral-200 rounded-2xl p-4 w-full max-w-xl shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Search Shopora Catalog</span>
                <button onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-neutral-900 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Type mechanical keyboard, noise cancelling, 4K monitor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 pl-10 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                  autoFocus
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              </form>

              <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1">
                <span>Press Enter to search</span>
                <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">ESC to exit</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white flex flex-col justify-between p-6 md:hidden"
          >
            <div className="space-y-8 pt-16">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Navigation</span>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="block text-xl font-bold text-neutral-900 hover:text-neutral-500 transition-colors py-1 flex items-center justify-between"
                  >
                    {link.label}
                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                  </Link>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-6 space-y-3">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className="block text-sm font-semibold text-neutral-900 py-1">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/orders" className="block text-sm font-medium text-neutral-700 py-1">
                      My Orders
                    </Link>
                    <Link to="/profile" className="block text-sm font-medium text-neutral-700 py-1">
                      My Profile ({user?.name})
                    </Link>
                    <button
                      onClick={logout}
                      className="block text-sm font-medium text-red-600 py-1 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/login"
                      className="text-center text-xs font-semibold border border-neutral-200 py-3 rounded-xl text-neutral-900"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="text-center text-xs font-semibold bg-neutral-900 text-white py-3 rounded-xl"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-[11px] text-neutral-400 border-t border-neutral-100 pt-4">
              &copy; Shopora E-Commerce Platform
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
