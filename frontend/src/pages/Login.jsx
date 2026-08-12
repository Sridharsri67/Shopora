import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-6 shadow-xs">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-center mx-auto">
              <LogIn className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Sign In to Shopora</h2>
            <p className="text-xs text-neutral-500 font-light">Demo Customer: customer@example.com | Pass: password123</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:outline-none focus:border-neutral-900"
                placeholder="customer@example.com"
                required
              />
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
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-neutral-500 font-light">
            Don't have an account?{' '}
            <Link to="/register" className="text-neutral-900 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
