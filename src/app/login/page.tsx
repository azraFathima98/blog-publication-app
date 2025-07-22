'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) return setError(error.message);

    router.push('/formcreate');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Sign In</h2>

        {error && (
          <div className="mb-6 text-sm text-red-700 bg-red-100 px-4 py-3 rounded-md border border-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3.5 left-3 text-gray-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-xl transition-all duration-200 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account? &quot;Sign up&quot;


          <a
            href="/register"
            className="text-blue-600 hover:text-blue-800 font-medium transition"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
