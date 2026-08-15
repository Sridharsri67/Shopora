import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-6 shadow-xs">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-center mx-auto">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Create Account</h2>
            <p className="text-xs text-neutral-500 font-light">Join Shopora E-Commerce</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:outline-none focus:border-neutral-900"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:outline-none focus:border-neutral-900"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:outline-none focus:border-neutral-900 font-medium"
              >
                <option value="CUSTOMER">Customer (Shopping)</option>
                <option value="VENDOR">Vendor (Product Management)</option>
                <option value="DELIVERY">Delivery Partner (Order Processing)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:outline-none focus:border-neutral-900"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Register Account
            </Button>
          </form>

          <p className="text-center text-xs text-neutral-500 font-light">
            Already have an account?{' '}
            <Link to="/login" className="text-neutral-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
