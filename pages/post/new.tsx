import PostForm from '@/components/PostForm';

export default function NewPost() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Post</h1>
      <PostForm />
    </div>
  );
}