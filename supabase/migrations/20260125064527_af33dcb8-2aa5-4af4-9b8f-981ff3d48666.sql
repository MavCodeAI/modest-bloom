-- Fix the overly permissive INSERT policy on notifications
-- Drop the old policy and create a more restrictive one
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Only allow authenticated users to create notifications for themselves
-- Or admins can create notifications for anyone
CREATE POLICY "Users or admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR public.has_role(auth.uid(), 'admin')
  );