'use client';

import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  visibility: string;
};

export default function Home() {
  const user = useUser();
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('visibility', 'free')
          .order('created_at', { ascending: false })
          .limit(3);

        if (fetchError) {
          throw fetchError;
        }

        setFeaturedPosts((data as Post[]) ?? []);
      } catch (err: any) {
        console.error('Fetch posts error', err);
        setError(err.message || 'Failed to load featured posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <style>{`
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 15px;
          font-family: Arial, sans-serif;
          color: #222;
        }
        .text-center {
          text-align: center;
        }
        .section {
          padding-top: 48px;
          padding-bottom: 48px;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 24px;
          color: #111;
        }
        h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 24px;
          color: #111;
        }
        p.lead {
          font-size: 1.125rem;
          color: #666;
          margin-bottom: 32px;
        }
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          text-decoration: none;
          display: inline-block;
          transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
          background-color: #1e40af;
        }
        .btn-outline {
          background-color: transparent;
          border: 2px solid #2563eb;
          color: #2563eb;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          text-decoration: none;
          display: inline-block;
          transition: background-color 0.3s ease;
          margin-left: 12px;
        }
        .btn-outline:hover {
          background-color: #eff6ff;
        }
        .flex-center {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .post-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.3s ease;
        }
        .post-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .post-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .post-date {
          font-size: 0.875rem;
          color: #888;
          margin-bottom: 12px;
        }
        .post-excerpt {
          font-size: 1rem;
          color: #444;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .loading-placeholder {
          background-color: #eee;
          border-radius: 8px;
          height: 160px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .error-message {
          color: #b91c1c;
          text-align: center;
          margin-top: 24px;
          font-weight: 600;
        }
        .premium-section {
          background-color: #f3f4f6;
          padding: 48px 24px;
          border-radius: 12px;
          margin-top: 48px;
          text-align: center;
        }
        .premium-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .premium-text {
          margin-bottom: 24px;
          font-size: 1rem;
          color: #555;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .btn-premium {
          background-color: #7c3aed;
          color: white;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.3s ease;
          display: inline-block;
        }
        .btn-premium:hover {
          background-color: #5b21b6;
        }
      `}</style>

      <div className="container">
        <section className="section text-center">
          <h1>Welcome to Our Blog Platform</h1>
          <p className="lead">{user ? 'Explore premium content' : 'Start reading or create an account'}</p>
          <div className="flex-center">
            {user ? (
              <Link href="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="btn-primary">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-outline">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="section">
          <h2>Featured Posts</h2>
          {loading ? (
            <div className="grid-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="loading-placeholder" />
              ))}
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="grid-3">
              {featuredPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="post-card"
                >
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-date">{new Date(post.created_at).toLocaleDateString()}</p>
                  <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {!user && (
          <section className="premium-section">
            <h2 className="premium-title">Get Premium Access</h2>
            <p className="premium-text">
              Unlock exclusive content and features with our premium membership.
            </p>
            <Link href="/subscribe" className="btn-premium">
              Learn More
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
