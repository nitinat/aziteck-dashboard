-- Update RLS policies to allow admin to see all data while regular users see only their own
-- Admin user_id: 65ed3c65-d276-45fe-9688-6c43d6b91777

-- Drop existing policies and create new ones for employees table
DROP POLICY IF EXISTS "Users can view their own employees" ON employees;
DROP POLICY IF EXISTS "Users can create their own employees" ON employees;
DROP POLICY IF EXISTS "Users can update their own employees" ON employees;
DROP POLICY IF EXISTS "Users can delete their own employees" ON employees;

CREATE POLICY "Admin can view all employees, users can view their own" 
ON employees FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all employees, users can create their own" 
ON employees FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all employees, users can update their own" 
ON employees FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all employees, users can delete their own" 
ON employees FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

-- Update policies for work_logs table
DROP POLICY IF EXISTS "Users can view their own work logs" ON work_logs;
DROP POLICY IF EXISTS "Users can create their own work logs" ON work_logs;
DROP POLICY IF EXISTS "Users can update their own work logs" ON work_logs;
DROP POLICY IF EXISTS "Users can delete their own work logs" ON work_logs;

CREATE POLICY "Admin can view all work logs, users can view their own" 
ON work_logs FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all work logs, users can create their own" 
ON work_logs FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all work logs, users can update their own" 
ON work_logs FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all work logs, users can delete their own" 
ON work_logs FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

-- Update policies for attendance_records table
DROP POLICY IF EXISTS "Users can view their own attendance records" ON attendance_records;
DROP POLICY IF EXISTS "Users can create their own attendance records" ON attendance_records;
DROP POLICY IF EXISTS "Users can update their own attendance records" ON attendance_records;
DROP POLICY IF EXISTS "Users can delete their own attendance records" ON attendance_records;

CREATE POLICY "Admin can view all attendance records, users can view their own" 
ON attendance_records FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all attendance records, users can create their own" 
ON attendance_records FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all attendance records, users can update their own" 
ON attendance_records FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all attendance records, users can delete their own" 
ON attendance_records FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

-- Update policies for projects table
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

CREATE POLICY "Admin can view all projects, users can view their own" 
ON projects FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all projects, users can create their own" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all projects, users can update their own" 
ON projects FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all projects, users can delete their own" 
ON projects FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

-- Update policies for notifications table
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can create their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

CREATE POLICY "Admin can view all notifications, users can view their own" 
ON notifications FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all notifications, users can create their own" 
ON notifications FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all notifications, users can update their own" 
ON notifications FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all notifications, users can delete their own" 
ON notifications FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

-- Update policies for holidays table
DROP POLICY IF EXISTS "Users can view their own holidays" ON holidays;
DROP POLICY IF EXISTS "Users can create their own holidays" ON holidays;
DROP POLICY IF EXISTS "Users can update their own holidays" ON holidays;
DROP POLICY IF EXISTS "Users can delete their own holidays" ON holidays;

CREATE POLICY "Admin can view all holidays, users can view their own" 
ON holidays FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all holidays, users can create their own" 
ON holidays FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all holidays, users can update their own" 
ON holidays FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all holidays, users can delete their own" 
ON holidays FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

-- Update policies for leaves table
DROP POLICY IF EXISTS "Users can view their own leaves" ON leaves;
DROP POLICY IF EXISTS "Users can create their own leaves" ON leaves;
DROP POLICY IF EXISTS "Users can update their own leaves" ON leaves;
DROP POLICY IF EXISTS "Users can delete their own leaves" ON leaves;

CREATE POLICY "Admin can view all leaves, users can view their own" 
ON leaves FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all leaves, users can create their own" 
ON leaves FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all leaves, users can update their own" 
ON leaves FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all leaves, users can delete their own" 
ON leaves FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

-- Update policies for user_settings table
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can create their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON user_settings;

CREATE POLICY "Admin can view all settings, users can view their own" 
ON user_settings FOR SELECT 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can create all settings, users can create their own" 
ON user_settings FOR INSERT 
WITH CHECK (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can update all settings, users can update their own" 
ON user_settings FOR UPDATE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all settings, users can delete their own" 
ON user_settings FOR DELETE 
USING (auth.uid() = '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid OR auth.uid() = user_id);