-- Fix the holidays RLS policy for viewing - use auth.uid() IS NOT NULL instead of auth.role()

-- Drop the current SELECT policy
DROP POLICY IF EXISTS "All users can view holidays" ON public.holidays;

-- Create a new SELECT policy that properly checks for authenticated users
CREATE POLICY "All users can view holidays" 
ON public.holidays 
FOR SELECT 
USING (auth.uid() IS NOT NULL);