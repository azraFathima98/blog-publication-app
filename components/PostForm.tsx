'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'free' | 'premium'>('free');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Not authenticated');
      return;
    }

    const { error: dbError } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        visibility,
        user_id: user.id
      });

    if (dbError) {
      setError(dbError.message);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Visibility</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as 'free' | 'premium')}
          className="w-full p-2 border rounded"
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Publish Post
      </button>
    </form>
  );
}