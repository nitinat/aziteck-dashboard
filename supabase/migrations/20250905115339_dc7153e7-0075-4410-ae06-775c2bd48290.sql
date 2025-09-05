-- Update RLS policies for holidays table to restrict create/update/delete to admin only

-- Drop existing policies for insert, update, delete
DROP POLICY IF EXISTS "Admin can create all holidays, users can create their own" ON public.holidays;
DROP POLICY IF EXISTS "Admin can update all holidays, users can update their own" ON public.holidays;
DROP POLICY IF EXISTS "Admin can delete all holidays, users can delete their own" ON public.holidays;

-- Create new policies that only allow admin to modify holidays
CREATE POLICY "Only admin can create holidays" 
ON public.holidays 
FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid);

CREATE POLICY "Only admin can update holidays" 
ON public.holidays 
FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid);

CREATE POLICY "Only admin can delete holidays" 
ON public.holidays 
FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid);