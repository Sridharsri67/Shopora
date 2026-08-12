import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Mail, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-neutral-800 pb-6">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-2xl flex items-center justify-center">
            {user?.name?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <span className="text-neutral-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> System Role
            </span>
            <span className={`font-semibold px-2.5 py-1 rounded-full ${
              isAdmin ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {user?.role}
            </span>
          </div>

          <div className="flex items-center justify-between bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <span className="text-neutral-400 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Account ID
            </span>
            <span className="font-mono text-neutral-300">#{user?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
