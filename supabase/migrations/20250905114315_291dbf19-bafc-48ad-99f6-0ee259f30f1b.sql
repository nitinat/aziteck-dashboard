-- Update RLS policies for projects table to allow employees to see their assigned projects

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view all projects, users can view their own" ON public.projects;
DROP POLICY IF EXISTS "Admin can create all projects, users can create their own" ON public.projects;
DROP POLICY IF EXISTS "Admin can update all projects, users can update their own" ON public.projects;
DROP POLICY IF EXISTS "Admin can delete all projects, users can delete their own" ON public.projects;

-- Create new policies that allow users to see projects they're assigned to
CREATE POLICY "Admin can view all projects, users can view assigned projects" 
ON public.projects 
FOR SELECT 
USING (
  auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR 
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE employees.id = projects.employee_id 
    AND employees.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can create all projects, users can create their own" 
ON public.projects 
FOR INSERT 
WITH CHECK (
  auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR 
  auth.uid() = user_id
);

CREATE POLICY "Admin can update all projects, users can update assigned projects" 
ON public.projects 
FOR UPDATE 
USING (
  auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR 
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE employees.id = projects.employee_id 
    AND employees.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can delete all projects, users can delete assigned projects" 
ON public.projects 
FOR DELETE 
USING (
  auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR 
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.employees 
    WHERE employees.id = projects.employee_id 
    AND employees.user_id = auth.uid()
  )
);