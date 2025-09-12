-- Fix claim_employee_account to avoid ambiguous column and ensure proper aliasing
CREATE OR REPLACE FUNCTION public.claim_employee_account()
RETURNS TABLE (
  claimed_employee_id uuid,
  updated_employees integer,
  updated_attendance integer,
  updated_work_logs integer,
  updated_leaves integer,
  updated_projects integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce((auth.jwt() ->> 'email'), ''));
  v_emp_id uuid;
  v_admin uuid := '65ed3c65-d276-45fe-9688-6c43d6b91777'::uuid;
BEGIN
  IF v_uid IS NULL OR v_email = '' THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Find employee row by email that is unclaimed, admin-owned, or already owned by this user
  SELECT e.id INTO v_emp_id
  FROM public.employees e
  WHERE lower(e.email) = v_email
    AND (e.user_id IS NULL OR e.user_id = v_admin OR e.user_id = v_uid)
  ORDER BY e.created_at ASC
  LIMIT 1;

  IF v_emp_id IS NULL THEN
    RETURN;
  END IF;

  -- Assign ownership
  WITH upd AS (
    UPDATE public.employees e
    SET user_id = v_uid
    WHERE e.id = v_emp_id
    RETURNING 1
  )
  SELECT COUNT(*)::int FROM upd INTO updated_employees;

  -- Propagate user_id to related tables
  WITH a AS (
    UPDATE public.attendance_records ar SET user_id = v_uid WHERE ar.employee_id = v_emp_id RETURNING 1
  ), w AS (
    UPDATE public.work_logs wl SET user_id = v_uid WHERE wl.employee_id = v_emp_id RETURNING 1
  ), l AS (
    UPDATE public.leaves lv SET user_id = v_uid WHERE lv.employee_id = v_emp_id RETURNING 1
  ), p AS (
    UPDATE public.projects pr SET user_id = v_uid WHERE pr.employee_id = v_emp_id RETURNING 1
  )
  SELECT
    (SELECT COUNT(*)::int FROM a),
    (SELECT COUNT(*)::int FROM w),
    (SELECT COUNT(*)::int FROM l),
    (SELECT COUNT(*)::int FROM p)
  INTO updated_attendance, updated_work_logs, updated_leaves, updated_projects;

  claimed_employee_id := v_emp_id;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_employee_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_employee_account() TO authenticated;