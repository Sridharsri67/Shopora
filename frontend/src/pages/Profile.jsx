import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import Badge from '../components/Badge';
import { User, Shield, Mail } from 'lucide-react';

export default function Profile() {
  const { user, isAdmin } = useAuth();

  return (
    <PageTransition>
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
            <div className="h-16 w-16 rounded-2xl bg-neutral-900 text-white font-bold text-2xl flex items-center justify-center">
              {user?.name?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{user?.name}</h1>
              <p className="text-xs text-neutral-500 font-light flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60">
              <span className="text-neutral-500 font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-neutral-700" /> Account Role
              </span>
              <Badge variant={isAdmin ? 'dark' : 'neutral'}>
                {user?.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60">
              <span className="text-neutral-500 font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-700" /> Account ID
              </span>
              <span className="font-mono text-neutral-900">#{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
