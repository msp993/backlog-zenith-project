-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'pm', 'developer', 'qa')) DEFAULT 'developer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backlog_items table
CREATE TABLE public.backlog_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_story TEXT,
  acceptance_criteria TEXT,
  priority TEXT CHECK (priority IN ('P1', 'P2', 'P3', 'P4', 'P5', 'P6')) DEFAULT 'P3',
  status TEXT CHECK (status IN ('pendiente', 'en_proceso', 'qa', 'completado', 'pausado')) DEFAULT 'pendiente',
  business_value TEXT CHECK (business_value IN ('alto', 'medio', 'bajo')) DEFAULT 'medio',
  story_points INTEGER,
  assignee_id UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bugs table
CREATE TABLE public.bugs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('alto', 'medio', 'bajo')) DEFAULT 'medio',
  effort_points INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('reportado', 'en_proceso', 'qa', 'resuelto', 'cerrado')) DEFAULT 'reportado',
  assignee_id UUID REFERENCES public.profiles(id),
  related_backlog_item UUID REFERENCES public.backlog_items(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kpis table
CREATE TABLE public.kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  current_value DECIMAL,
  target_value DECIMAL,
  unit TEXT,
  category TEXT CHECK (category IN ('conversion', 'acquisition', 'quality', 'time', 'satisfaction')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backlog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create RLS policies for backlog_items
CREATE POLICY "Team can view all backlog items" ON public.backlog_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can create backlog items" ON public.backlog_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Team can update backlog items" ON public.backlog_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Team can delete backlog items" ON public.backlog_items FOR DELETE TO authenticated USING (true);

-- Create RLS policies for bugs
CREATE POLICY "Team can view all bugs" ON public.bugs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can create bugs" ON public.bugs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Team can update bugs" ON public.bugs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Team can delete bugs" ON public.bugs FOR DELETE TO authenticated USING (true);

-- Create RLS policies for kpis
CREATE POLICY "Team can view all kpis" ON public.kpis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage kpis" ON public.kpis FOR ALL TO authenticated USING (true);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_backlog_items_updated_at BEFORE UPDATE ON public.backlog_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bugs_updated_at BEFORE UPDATE ON public.bugs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON public.kpis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_backlog_items_assignee ON public.backlog_items(assignee_id);
CREATE INDEX idx_backlog_items_status ON public.backlog_items(status);
CREATE INDEX idx_backlog_items_priority ON public.backlog_items(priority);
CREATE INDEX idx_bugs_assignee ON public.bugs(assignee_id);
CREATE INDEX idx_bugs_status ON public.bugs(status);
CREATE INDEX idx_bugs_related_backlog ON public.bugs(related_backlog_item);

-- Enable real-time for all tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.backlog_items REPLICA IDENTITY FULL;
ALTER TABLE public.bugs REPLICA IDENTITY FULL;
ALTER TABLE public.kpis REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.backlog_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bugs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kpis;

-- Insert sample KPIs
INSERT INTO public.kpis (name, description, current_value, target_value, unit, category) VALUES
('Tasa de conversión a suscripción mensual', 'Porcentaje de usuarios que se convierten a suscripción mensual', 15.5, 25.0, '%', 'conversion'),
('Costo de adquisición por cliente (CAC)', 'Costo promedio para adquirir un nuevo cliente', 45.0, 35.0, 'EUR', 'acquisition'),
('Tiempo promedio por etapa del proceso', 'Tiempo promedio que toma completar cada etapa', 3.2, 2.5, 'días', 'time'),
('Calidad del formulario entregado', 'Puntuación de calidad de los formularios completados', 8.3, 9.0, 'puntos', 'quality'),
('Relevancia del matching percibida', 'Nivel de satisfacción con la relevancia del matching', 7.8, 8.5, 'puntos', 'satisfaction');