import { useEffect, useState } from "react";
import { DEMO_TOKEN_PREFIX } from "@utils/demoAuth";

// Demo logins have no backend account, so the LMS screens show their sample content instead of calling the API.
// Returns null until the browser has been checked, so server and client render the same first paint.
const useDemoMode = (): boolean | null => {
  const [demo, setDemo] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setDemo(Boolean(localStorage.getItem("token")?.startsWith(DEMO_TOKEN_PREFIX)));
    } catch {
      setDemo(false);
    }
  }, []);
  return demo;
};

export default useDemoMode;
