'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setSuccess('Account created! Please check your email to confirm your address.');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f2f5;
        }
        .container {
          max-width: 400px;
          margin: 60px auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        h2 {
          text-align: center;
          margin-bottom: 10px;
          font-size: 24px;
          color: #222;
        }
        p.center-text {
          text-align: center;
          margin-bottom: 20px;
          font-size: 14px;
          color: #555;
        }
        p.center-text a {
          color: #0070f3;
          text-decoration: none;
        }
        p.center-text a:hover {
          text-decoration: underline;
        }
        label {
          display: block;
          margin-bottom: 6px;
          font-weight: bold;
          font-size: 14px;
          color: #333;
        }
        input[type="email"],
        input[type="password"] {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }
        input[type="email"]:focus,
        input[type="password"]:focus {
          border-color: #0070f3;
          outline: none;
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          font-size: 14px;
          color: #333;
        }
        .checkbox-container input[type="checkbox"] {
          margin-right: 8px;
          width: 16px;
          height: 16px;
        }
        .checkbox-container a {
          color: #0070f3;
          text-decoration: none;
        }
        .checkbox-container a:hover {
          text-decoration: underline;
        }
        button {
          width: 100%;
          padding: 12px 0;
          font-size: 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:disabled {
          background-color: #7aa7f7;
          cursor: not-allowed;
        }
        button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        .error-msg, .success-msg {
          margin-bottom: 15px;
          padding: 12px;
          border-radius: 4px;
          font-size: 14px;
        }
        .error-msg {
          background-color: #ffe0e0;
          color: #d8000c;
          border: 1px solid #d8000c;
        }
        .success-msg {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #155724;
        }
      `}</style>

      <div className="container">
        <h2>Create a new account</h2>
        <p className="center-text">
          Or <Link href="/auth/login">sign in to your existing account</Link>
        </p>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <div className="checkbox-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </>
  );
}
