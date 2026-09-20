import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";

export type TTestHandlerConfig = {
  route: string;
  method?: "get" | "post" | "put" | "delete" | "patch" | "options";
  response?: any;
  isResponseError?: boolean;
  responseOptions?: {
    status?: number;
  };
};

const createTestServer = (configs: TTestHandlerConfig[]) => {
  const handlers = configs.map((config) => {
    const method = (config.method || "get").toLowerCase() as "get" | "post" | "put" | "delete" | "patch" | "options";
    return http[method](config.route, async () => {
      // Add a small delay to simulate network latency for loading state assertions
      await delay(50);
      
      if (config.isResponseError) {
        const status = config.responseOptions?.status || 500;
        const body = config.response || { message: "Internal Server Error" };
        return HttpResponse.json(body, { status });
      }
      
      return HttpResponse.json(config.response || {});
    });
  });

  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  return server;
};

export default createTestServer;
export type { createTestServer };
