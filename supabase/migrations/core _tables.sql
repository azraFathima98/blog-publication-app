
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;


CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('free', 'premium')),
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  stripe_current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


INSERT INTO storage.buckets (id, name, public) VALUES ('post_images', 'post_images', true);


CREATE POLICY "Allow public read access to free posts" 
ON posts FOR SELECT 
TO authenticated, anon
USING (visibility = 'free');

CREATE POLICY "Allow read access to premium posts for premium users" 
ON posts FOR SELECT 
TO authenticated
USING (
  visibility = 'premium' AND 
  EXISTS (
    SELECT 1 FROM user_subscriptions 
    WHERE user_subscriptions.user_id = auth.uid() 
    AND user_subscriptions.stripe_current_period_end > NOW()
  )
);

CREATE POLICY "Allow individual insert access" 
ON posts FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow individual update access" 
ON posts FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Allow individual delete access" 
ON posts FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());


CREATE POLICY "Allow individual read access" 
ON user_subscriptions FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Allow individual update access" 
ON user_subscriptions FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());