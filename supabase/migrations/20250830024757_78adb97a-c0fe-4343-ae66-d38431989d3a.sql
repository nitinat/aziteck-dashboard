-- Add work_location column to attendance_records table
ALTER TABLE public.attendance_records 
ADD COLUMN work_location text NOT NULL DEFAULT 'WFO';

-- Add a check constraint to ensure work_location is either WFO or WFH
ALTER TABLE public.attendance_records 
ADD CONSTRAINT check_work_location CHECK (work_location IN ('WFO', 'WFH'));