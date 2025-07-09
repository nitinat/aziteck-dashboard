-- Add user_id column to employees table to link employees to users
ALTER TABLE public.employees ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for user access to employees
CREATE POLICY "Users can view their own employees" 
ON public.employees 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own employees" 
ON public.employees 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employees" 
ON public.employees 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own employees" 
ON public.employees 
FOR DELETE 
USING (auth.uid() = user_id);