-- Update Amit's employee record to use his new user_id
UPDATE employees 
SET user_id = '55dc1f83-f532-40c7-9bf7-b1a908f74897'
WHERE email = 'amitgaikwad1365@gmail.com' AND user_id = '65ed3c65-d276-45fe-9688-6c43d6b91777';

-- Also update any related attendance records
UPDATE attendance_records 
SET user_id = '55dc1f83-f532-40c7-9bf7-b1a908f74897'
WHERE user_id = '65ed3c65-d276-45fe-9688-6c43d6b91777';

-- Also update any related work logs
UPDATE work_logs 
SET user_id = '55dc1f83-f532-40c7-9bf7-b1a908f74897'
WHERE user_id = '65ed3c65-d276-45fe-9688-6c43d6b91777';