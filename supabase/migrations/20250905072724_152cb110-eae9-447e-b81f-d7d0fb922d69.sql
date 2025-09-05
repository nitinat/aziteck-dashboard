-- First, check and drop all existing policies, then create new admin-compatible ones
-- Admin user_id: 65ed3c65-d276-45fe-9688-6c43d6b91777

-- Handle employees table policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own employees" ON employees;
    DROP POLICY IF EXISTS "Users can create their own employees" ON employees;
    DROP POLICY IF EXISTS "Users can update their own employees" ON employees;
    DROP POLICY IF EXISTS "Users can delete their own employees" ON employees;
    DROP POLICY IF EXISTS "Admin can view all employees, users can view their own" ON employees;
    DROP POLICY IF EXISTS "Admin can create all employees, users can create their own" ON employees;
    DROP POLICY IF EXISTS "Admin can update all employees, users can update their own" ON employees;
    DROP POLICY IF EXISTS "Admin can delete all employees, users can delete their own" ON employees;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

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

-- Handle work_logs table policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own work logs" ON work_logs;
    DROP POLICY IF EXISTS "Users can create their own work logs" ON work_logs;
    DROP POLICY IF EXISTS "Users can update their own work logs" ON work_logs;
    DROP POLICY IF EXISTS "Users can delete their own work logs" ON work_logs;
    DROP POLICY IF EXISTS "Admin can view all work logs, users can view their own" ON work_logs;
    DROP POLICY IF EXISTS "Admin can create all work logs, users can create their own" ON work_logs;
    DROP POLICY IF EXISTS "Admin can update all work logs, users can update their own" ON work_logs;
    DROP POLICY IF EXISTS "Admin can delete all work logs, users can delete their own" ON work_logs;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

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

-- Handle attendance_records table policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own attendance records" ON attendance_records;
    DROP POLICY IF EXISTS "Users can create their own attendance records" ON attendance_records;
    DROP POLICY IF EXISTS "Users can update their own attendance records" ON attendance_records;
    DROP POLICY IF EXISTS "Users can delete their own attendance records" ON attendance_records;
    DROP POLICY IF EXISTS "Admin can view all attendance records, users can view their own" ON attendance_records;
    DROP POLICY IF EXISTS "Admin can create all attendance records, users can create their own" ON attendance_records;
    DROP POLICY IF EXISTS "Admin can update all attendance records, users can update their own" ON attendance_records;
    DROP POLICY IF EXISTS "Admin can delete all attendance records, users can delete their own" ON attendance_records;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

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

-- Handle projects table policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
    DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
    DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
    DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
    DROP POLICY IF EXISTS "Admin can view all projects, users can view their own" ON projects;
    DROP POLICY IF EXISTS "Admin can create all projects, users can create their own" ON projects;
    DROP POLICY IF EXISTS "Admin can update all projects, users can update their own" ON projects;
    DROP POLICY IF EXISTS "Admin can delete all projects, users can delete their own" ON projects;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

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