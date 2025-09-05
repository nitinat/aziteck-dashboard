-- Update RLS policies for holidays table to allow all authenticated users to view company holidays

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view all holidays, users can view their own" ON public.holidays;
DROP POLICY IF EXISTS "Admin can create all holidays, users can create their own" ON public.holidays;
DROP POLICY IF EXISTS "Admin can update all holidays, users can update their own" ON public.holidays;
DROP POLICY IF EXISTS "Admin can delete all holidays, users can delete their own" ON public.holidays;

-- Create new policies that allow all authenticated users to view holidays
CREATE POLICY "All users can view holidays" 
ON public.holidays 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can create all holidays, users can create their own" 
ON public.holidays 
FOR INSERT 
WITH CHECK (
  auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR 
  auth.uid() = user_id
);

CREATE POLICY "Admin can update all holidays, users can update their own" 
ON public.holidays 
FOR UPDATE 
USING (
  auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR 
  auth.uid() = user_id
);

CREATE POLICY "Admin can delete all holidays, users can delete their own" 
ON public.holidays 
FOR DELETE 
USING (
  auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR 
  auth.uid() = user_id
);