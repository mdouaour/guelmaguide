-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'visitor' CHECK (role IN ('visitor', 'organizer', 'admin')),
  organizer_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create places table
CREATE TABLE IF NOT EXISTS public.places (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  category TEXT NOT NULL DEFAULT 'landmark',
  theme TEXT NOT NULL DEFAULT 'cultural',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  place_id INTEGER REFERENCES public.places(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_time TIMESTAMPTZ NOT NULL,
  max_participants INTEGER DEFAULT 10,
  mood TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity participants junction table
CREATE TABLE IF NOT EXISTS public.activity_participants (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Places policies (public read, admin write)
CREATE POLICY "places_select_all" ON public.places FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "places_insert_admin" ON public.places FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "places_update_admin" ON public.places FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Activities policies
CREATE POLICY "activities_select_all" ON public.activities FOR SELECT TO authenticated, anon USING (
  visibility = 'public' OR organizer_id = auth.uid()
);
CREATE POLICY "activities_insert_auth" ON public.activities FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "activities_update_own" ON public.activities FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "activities_delete_own" ON public.activities FOR DELETE USING (auth.uid() = organizer_id);

-- Activity participants policies
CREATE POLICY "participants_select_all" ON public.activity_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "participants_insert_own" ON public.activity_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "participants_delete_own" ON public.activity_participants FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, organizer_verified)
  VALUES (
    NEW.id,
    NEW.email,
    'visitor',
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
