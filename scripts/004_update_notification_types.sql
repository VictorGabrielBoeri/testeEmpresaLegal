-- Update notification_logs table to support additional notification types
-- This fixes the constraint violation error by allowing more notification types

-- Drop the existing constraint
ALTER TABLE public.notification_logs 
DROP CONSTRAINT IF EXISTS notification_logs_notification_type_check;

-- Add updated constraint with more notification types
ALTER TABLE public.notification_logs 
ADD CONSTRAINT notification_logs_notification_type_check 
CHECK (notification_type IN (
  'candidate_result',
  'manager_report', 
  'creative_insights',
  'system_report',
  'scheduled_report'
));

-- Add comment for documentation
COMMENT ON COLUMN public.notification_logs.notification_type IS 
'Type of notification: candidate_result, manager_report, creative_insights, system_report, scheduled_report';
