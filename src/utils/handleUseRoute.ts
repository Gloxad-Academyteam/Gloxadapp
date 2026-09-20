import getBaseUrl from "@constants/base-url";
import getRoutes, { ERouteId } from "@constants/routes";

const ROUTE_SUFFIX = "mocking-disabled";

type THandleUseRouteOptions = {
  disableMockingInDevelopment?: boolean;
  disableMockingInProduction?: boolean;
};

// By default, mocking is disabled in production and enabled in development
// To enable mocking in production, set `disableMockingInProduction` to `false` during the usage of this function
//  .. Eg: `handleUseRoute(ERouteId["auth.login"], { disableMockingInProduction: false })`
const DEFAULT_OPTS: THandleUseRouteOptions = {
  disableMockingInDevelopment: false,
  disableMockingInProduction: true,
};

const handleUseRoute = (
  routesKey: ERouteId,
  opts?: THandleUseRouteOptions | false
) => {
  // Always Use `false` as the `opt` parameter for actual services so this function will not temper with the route
  if (opts === false) {
    opts = {
      disableMockingInDevelopment: false,
      disableMockingInProduction: false,
    };
  } else {
    // Use this in handlers to override the default options and eventually mess up the route if needed
    opts = {
      ...DEFAULT_OPTS,
      ...opts,
    };
  }

  const environment = process.env.NODE_ENV || "development";

  const routes = getRoutes(environment);
  const baseUrl = getBaseUrl(environment);

  let route = routes[routesKey];
  route = `${baseUrl}${route}`;

  // This ensures mocks is always enabled in test environment
  if (environment === "test") {
    return route;
  }

  if (environment === "development" && opts.disableMockingInDevelopment) {
    route = `${route}${ROUTE_SUFFIX}`;
  }

  if (environment === "production" && opts.disableMockingInProduction) {
    route = `${route}${ROUTE_SUFFIX}`;
  }

  return route;
};

export default handleUseRoute;
