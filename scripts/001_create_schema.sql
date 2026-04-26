-- GuelmaGuide Database Schema for Supabase
-- This script creates all necessary tables with Row Level Security (RLS)

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (links to Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('visitor', 'organizer', 'admin')),
  organizer_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (for displaying organizer info)
CREATE POLICY "profiles_select_all" ON public.profiles 
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- PLACES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.places (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('forest', 'sports', 'relaxation', 'culture', 'nature', 'thermal_baths')),
  theme TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for places
CREATE INDEX IF NOT EXISTS ix_places_name ON public.places(name);
CREATE INDEX IF NOT EXISTS ix_places_category ON public.places(category);
CREATE INDEX IF NOT EXISTS ix_places_latitude ON public.places(latitude);
CREATE INDEX IF NOT EXISTS ix_places_longitude ON public.places(longitude);
CREATE INDEX IF NOT EXISTS ix_places_theme ON public.places(theme);
CREATE INDEX IF NOT EXISTS ix_places_featured ON public.places(featured);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Everyone can read places (public data)
CREATE POLICY "places_select_all" ON public.places 
  FOR SELECT USING (true);

-- Only admins and organizers can insert places
CREATE POLICY "places_insert_admin_organizer" ON public.places 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'organizer')
    )
  );

-- Only admins can update places
CREATE POLICY "places_update_admin" ON public.places 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.activities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  place_id INTEGER NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_time TIMESTAMPTZ NOT NULL,
  max_participants INTEGER NOT NULL CHECK (max_participants > 0),
  mood TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  approval_status TEXT NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for activities
CREATE INDEX IF NOT EXISTS ix_activities_title ON public.activities(title);
CREATE INDEX IF NOT EXISTS ix_activities_place_id ON public.activities(place_id);
CREATE INDEX IF NOT EXISTS ix_activities_organizer_id ON public.activities(organizer_id);
CREATE INDEX IF NOT EXISTS ix_activities_date_time ON public.activities(date_time);
CREATE INDEX IF NOT EXISTS ix_activities_mood ON public.activities(mood);
CREATE INDEX IF NOT EXISTS ix_activities_visibility ON public.activities(visibility);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Everyone can see public approved activities
CREATE POLICY "activities_select_public" ON public.activities 
  FOR SELECT USING (
    visibility = 'public' AND approval_status = 'approved'
  );

-- Organizers can see their own activities (any status)
CREATE POLICY "activities_select_own" ON public.activities 
  FOR SELECT USING (
    organizer_id = auth.uid()
  );

-- Organizers can insert activities
CREATE POLICY "activities_insert_organizer" ON public.activities 
  FOR INSERT WITH CHECK (
    organizer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'organizer')
    )
  );

-- Organizers can update their own activities
CREATE POLICY "activities_update_own" ON public.activities 
  FOR UPDATE USING (organizer_id = auth.uid());

-- Organizers can delete their own activities
CREATE POLICY "activities_delete_own" ON public.activities 
  FOR DELETE USING (organizer_id = auth.uid());

-- ============================================
-- ACTIVITY REGISTRATIONS TABLE (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.activity_registrations (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, activity_id)
);

CREATE INDEX IF NOT EXISTS ix_activity_registrations_user_id ON public.activity_registrations(user_id);
CREATE INDEX IF NOT EXISTS ix_activity_registrations_activity_id ON public.activity_registrations(activity_id);

ALTER TABLE public.activity_registrations ENABLE ROW LEVEL SECURITY;

-- Users can see registrations for public activities
CREATE POLICY "registrations_select_public" ON public.activity_registrations 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.activities 
      WHERE id = activity_id 
      AND visibility = 'public'
    )
  );

-- Users can see their own registrations
CREATE POLICY "registrations_select_own" ON public.activity_registrations 
  FOR SELECT USING (user_id = auth.uid());

-- Authenticated users can register for activities
CREATE POLICY "registrations_insert_own" ON public.activity_registrations 
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can cancel their own registration
CREATE POLICY "registrations_delete_own" ON public.activity_registrations 
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'visitor')
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

-- ============================================
-- UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_places_updated_at ON public.places;
CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
