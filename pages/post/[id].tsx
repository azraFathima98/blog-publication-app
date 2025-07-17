import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <article className="prose lg:prose-xl">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-500 mb-6">
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        <div className="whitespace-pre-line">{post.content}</div>
      </article>
    </div>
  );
}