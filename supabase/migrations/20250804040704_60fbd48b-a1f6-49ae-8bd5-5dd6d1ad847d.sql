-- Add foreign key relationship between projects and employees
ALTER TABLE public.projects 
ADD CONSTRAINT projects_employee_id_fkey 
FOREIGN KEY (employee_id) REFERENCES public.employees(id);