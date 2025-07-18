'use client';

import { useEffect, useState } from 'react';
import PostCard from './components/PostCard';
import { supabase } from '../app/lib/supabaseClient';

interface Post {
  id: string;
  description: string;
  image_url: string;
  user_id: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (search = '') => {
    setLoading(true);
    let query = supabase.from('posts').select('*').order('id', { ascending: false });

    if (search.trim() !== '') {
      query = query.ilike('description', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-10 border border-gray-200">
        {/* Hero Section */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight tracking-tight">
            Welcome to <span className="text-blue-600">BlogApp</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Discover amazing content from talented writers. Join our community of readers and creators.
          </p>
        </header>

        {/* Search box */}
        <form
          onSubmit={handleSearch}
          className="mb-10 flex flex-col sm:flex-row justify-center items-center max-w-xl mx-auto gap-3"
        >
          <input
            type="text"
            placeholder="Search posts by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:flex-1 border border-gray-300 rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
          >
            Search
          </button>
        </form>

        {/* Post Cards */}
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading posts...</p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full text-lg">No posts found.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
