-- Fix work logs: assign correct user_id based on employee ownership
-- First, let's update work logs for Amit's employee record (which should stay with his new user_id)
UPDATE work_logs 
SET user_id = '55dc1f83-f532-40c7-9bf7-b1a908f74897'
WHERE employee_id = '57b01f61-e6c4-4d04-aedc-006f11c65cb6';

-- Then update work logs for all other employees to use the original admin user_id
UPDATE work_logs 
SET user_id = '65ed3c65-d276-45fe-9688-6c43d6b91777'
WHERE employee_id != '57b01f61-e6c4-4d04-aedc-006f11c65cb6';