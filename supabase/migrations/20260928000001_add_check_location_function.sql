CREATE OR REPLACE FUNCTION public.check_attendance_location(
    p_event_id uuid,
    p_user_lat double precision,
    p_user_lng double precision
) RETURNS boolean AS $$
DECLARE
    v_is_within_distance boolean;
BEGIN
    SELECT ST_Distance(
        ST_MakePoint(p_user_lng, p_user_lat)::geography,
        event_geo_location
    ) <= 30 INTO v_is_within_distance
    FROM public.events
    WHERE id = p_event_id;

    RETURN COALESCE(v_is_within_distance, true);
END;
$$ LANGUAGE plpgsql STABLE;
