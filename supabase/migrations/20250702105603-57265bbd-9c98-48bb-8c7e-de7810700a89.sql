-- Create kpi_history table for tracking KPI values over time
CREATE TABLE public.kpi_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.kpi_history ENABLE ROW LEVEL SECURITY;

-- Create policies for kpi_history
CREATE POLICY "Team can view all kpi history" 
ON public.kpi_history 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create kpi history entries" 
ON public.kpi_history 
FOR INSERT 
WITH CHECK (auth.uid() = updated_by);

-- Create indexes for better performance
CREATE INDEX idx_kpi_history_kpi_id ON public.kpi_history(kpi_id);
CREATE INDEX idx_kpi_history_recorded_at ON public.kpi_history(recorded_at DESC);
CREATE INDEX idx_kpi_history_kpi_date ON public.kpi_history(kpi_id, recorded_at DESC);

-- Create function to automatically create history entry when KPI is updated
CREATE OR REPLACE FUNCTION public.create_kpi_history_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create history if current_value actually changed
  IF OLD.current_value IS DISTINCT FROM NEW.current_value THEN
    INSERT INTO public.kpi_history (kpi_id, value, updated_by)
    VALUES (NEW.id, NEW.current_value, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically track KPI changes
CREATE TRIGGER kpi_history_trigger
  AFTER UPDATE ON public.kpis
  FOR EACH ROW
  EXECUTE FUNCTION public.create_kpi_history_entry();

-- Insert initial history entries for existing KPIs (if any)
INSERT INTO public.kpi_history (kpi_id, value, updated_by)
SELECT 
  id, 
  current_value, 
  (SELECT id FROM public.profiles LIMIT 1) -- Use first available profile as default
FROM public.kpis 
WHERE current_value IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM public.kpi_history WHERE kpi_id = kpis.id
);