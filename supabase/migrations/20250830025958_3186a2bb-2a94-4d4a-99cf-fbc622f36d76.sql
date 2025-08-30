-- Create holidays table for holiday management
CREATE TABLE public.holidays (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'company' CHECK (type IN ('company', 'national', 'religious')),
  is_recurring boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Create policies for holiday management
CREATE POLICY "Users can view their own holidays" 
ON public.holidays 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own holidays" 
ON public.holidays 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holidays" 
ON public.holidays 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holidays" 
ON public.holidays 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_holidays_updated_at
BEFORE UPDATE ON public.holidays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();