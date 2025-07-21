import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function PremiumPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div>Please log in to view this page.</div>;
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('is_premium')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return <div>Error loading profile.</div>;
  }

  if (!profile?.is_premium) {
    return <div>You must purchase Premium to view this page.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🎉 Welcome to Premium Content</h1>
      <p className="text-gray-700">Here is your exclusive premium content!</p>
    </div>
  );
}
