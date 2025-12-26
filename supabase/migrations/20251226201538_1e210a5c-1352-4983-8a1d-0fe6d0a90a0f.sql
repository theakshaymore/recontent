-- Create function to decrement user credits
CREATE OR REPLACE FUNCTION public.decrement_credits(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET credits_remaining = GREATEST(credits_remaining - 1, 0)
  WHERE id = user_id_param;
END;
$$;