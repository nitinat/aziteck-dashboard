-- Add new fields to employees table
ALTER TABLE public.employees 
ADD COLUMN education_degree TEXT DEFAULT '',
ADD COLUMN branch TEXT DEFAULT '',
ADD COLUMN skills TEXT DEFAULT '';

-- Add comments for documentation
COMMENT ON COLUMN public.employees.education_degree IS 'Employee education degree (e.g., Bachelor of Engineering, Master of Science)';
COMMENT ON COLUMN public.employees.branch IS 'Employee education branch (e.g., Computer Science, Electronics)';
COMMENT ON COLUMN public.employees.skills IS 'Employee skills (comma-separated list)';