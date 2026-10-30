"use client";

import { useEffect } from "react";

// Registers the service worker that makes the app installable (production only, so dev reloads stay predictable)
const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installing is a bonus, the site works without it
    });
  }, []);
  return null;
};

export default ServiceWorkerRegister;
