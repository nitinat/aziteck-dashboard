-- Fix Sanket's employee record ownership
UPDATE employees 
SET user_id = '6c99a14f-1607-41c0-a1f4-11ae03f4f3e7'
WHERE email = 'sanketdeshmane28@gmail.com';

-- Also update any related records for Sanket
UPDATE attendance_records 
SET user_id = '6c99a14f-1607-41c0-a1f4-11ae03f4f3e7'
WHERE employee_id = '2f5599b8-ce7d-43e7-ac73-045197d62f79';

UPDATE work_logs 
SET user_id = '6c99a14f-1607-41c0-a1f4-11ae03f4f3e7'
WHERE employee_id = '2f5599b8-ce7d-43e7-ac73-045197d62f79';

UPDATE leaves 
SET user_id = '6c99a14f-1607-41c0-a1f4-11ae03f4f3e7'
WHERE employee_id = '2f5599b8-ce7d-43e7-ac73-045197d62f79';

UPDATE projects 
SET user_id = '6c99a14f-1607-41c0-a1f4-11ae03f4f3e7'
WHERE employee_id = '2f5599b8-ce7d-43e7-ac73-045197d62f79';