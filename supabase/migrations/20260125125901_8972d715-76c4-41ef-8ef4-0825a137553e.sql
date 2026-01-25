-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Briefcase',
  color_from TEXT NOT NULL DEFAULT 'orange-500',
  color_to TEXT NOT NULL DEFAULT 'orange-600',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sub_services table
CREATE TABLE public.sub_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'FileText',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_features table (for services with feature lists instead of sub-services)
CREATE TABLE public.service_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  feature_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_stats table
CREATE TABLE public.service_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_stats ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active sub-services" ON public.sub_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view features" ON public.service_features
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view stats" ON public.service_stats
  FOR SELECT USING (true);

-- Admin policies for services
CREATE POLICY "Admins can view all services" ON public.services
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert services" ON public.services
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services" ON public.services
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services" ON public.services
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Admin policies for sub_services
CREATE POLICY "Admins can view all sub-services" ON public.sub_services
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert sub-services" ON public.sub_services
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update sub-services" ON public.sub_services
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sub-services" ON public.sub_services
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Admin policies for service_features
CREATE POLICY "Admins can manage features" ON public.service_features
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Admin policies for service_stats
CREATE POLICY "Admins can manage stats" ON public.service_stats
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sub_services_updated_at
  BEFORE UPDATE ON public.sub_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();