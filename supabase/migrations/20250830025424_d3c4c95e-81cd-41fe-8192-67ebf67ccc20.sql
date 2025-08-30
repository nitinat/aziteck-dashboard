-- Create leaves table for leave management
CREATE TABLE public.leaves (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  leave_type text NOT NULL CHECK (leave_type IN ('Earned', 'Casual', 'Sick')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by uuid,
  approved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;

-- Create policies for leave management
CREATE POLICY "Users can view their own leaves" 
ON public.leaves 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leaves" 
ON public.leaves 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaves" 
ON public.leaves 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leaves" 
ON public.leaves 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leaves_updated_at
BEFORE UPDATE ON public.leaves
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();