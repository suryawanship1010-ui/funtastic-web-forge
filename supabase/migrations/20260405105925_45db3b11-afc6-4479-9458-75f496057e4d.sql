
-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active departments" ON public.departments FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all departments" ON public.departments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Job requirements table (normalized)
CREATE TABLE public.job_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_post_id UUID NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  requirement_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view requirements" ON public.job_requirements FOR SELECT USING (true);
CREATE POLICY "Admins can manage requirements" ON public.job_requirements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Job-Department mapping (many-to-many)
CREATE TABLE public.job_departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_post_id UUID NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  UNIQUE(job_post_id, department_id)
);

ALTER TABLE public.job_departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view job departments" ON public.job_departments FOR SELECT USING (true);
CREATE POLICY "Admins can manage job departments" ON public.job_departments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for departments updated_at
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
