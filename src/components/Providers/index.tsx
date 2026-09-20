"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IconContext } from "react-icons";
import { ToastContainer } from "react-toastify";
import { ReactLenis } from "@studio-freight/react-lenis";
import ScrollManager from "@components/ScrollManager";
import ScrollToTopButton from "@components/ScrollToTopButton";
import "react-toastify/dist/ReactToastify.css";

type TProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: TProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 min — data stays "fresh", no refetch on revisit
            gcTime: 10 * 60 * 1000, // 10 min — keep unused cache before garbage-collecting
            refetchOnWindowFocus: false, // Don't refetch just because user alt-tabbed
            retry: 1, // Only retry once on failure (not 3 times)
            refetchOnReconnect: true, // Do refetch when network reconnects
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.1, smoothWheel: true }}>
        <ScrollManager />
        <ToastContainer />
        <IconContext.Provider
          value={{
            size: "20px",
            className: "react-icon",
          }}
        >
          {children}
          <ScrollToTopButton />
        </IconContext.Provider>
      </ReactLenis>
    </QueryClientProvider>
  );
};

export default Providers;
