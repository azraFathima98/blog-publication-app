
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('free', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


ALTER TABLE posts ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view public posts" 
ON posts FOR SELECT 
USING (visibility = 'free');

CREATE POLICY "Authors can manage their posts" 
ON posts FOR ALL 
USING (auth.uid() = user_id);