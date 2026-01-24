import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getOrCreateSessionId = (): string => {
  const key = "visitor_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

export const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      const sessionId = getOrCreateSessionId();
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from("site_visitors").insert({
        session_id: sessionId,
        page_visited: location.pathname + location.search,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        user_id: user?.id || null,
      });
    };

    trackVisit();
  }, [location.pathname, location.search]);
};
