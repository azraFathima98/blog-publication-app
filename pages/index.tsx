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
    <div className="max-w-6xl mx-auto">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Blog Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          {user ? 'Explore premium content' : 'Start reading or create an account'}
        </p>
        <div className="flex justify-center gap-4">
          {user ? (
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Sign In
              </Link>
               <Link href="/auth/signup" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
                Sign Up
              </Link> 
            </>
          )}
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-64 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map(post => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-3">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 line-clamp-3">
                  {post.content.substring(0, 150)}...
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {!user && (
        <section className="py-12 bg-gray-50 rounded-lg my-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Premium Access</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Unlock exclusive content and features with our premium membership.
          </p>
          <Link href="/subscribe" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-block">
            Learn More
          </Link>
        </section>
      )}
    </div>
  );
}
