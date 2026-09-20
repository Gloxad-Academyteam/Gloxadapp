import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TProps = {
  children: React.ReactNode;
  /** Kept for backwards compatibility with existing tests; no longer used (Next.js has no MemoryRouter). */
  memoryRouterProps?: unknown;
};

const TestProviders = ({ children }: TProps) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TestProviders;
