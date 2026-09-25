// Id should be same across all environments
enum ERouteId {
  "courses.list" = "courses.list",
  "courses.search" = "courses.search",
  "courses.because-you-viewed" = "courses.because-you-viewed",
  "report.send" = "report.send",
  "vote.up" = "vote.up",
  "vote.down" = "vote.down",
  "auth.login" = "auth.login",
  "auth.signup" = "auth.signup",
  "auth.logout" = "auth.logout",
  "auth.me" = "auth.me",
  "auth.forget.passwd" = "auth.forget.passwd",
  "auth.verify.otp" = "auth.verify.otp",
  "auth.reset.passwd" = "auth.reset.passwd",
  "auth.updateProfile" = "auth.updateProfile",
  "auth.verify.email" = "auth.verify.email",
  "auth.resend.verification" = "auth.resend.verification",
  "auth.refresh" = "auth.refresh",
}

// Path can be different for each environment
type TRoutePath = string;
type TRoute = Record<ERouteId, TRoutePath>;

const devRoutes: TRoute = {
  "courses.list": "/courses",
  "courses.search": "/courses",
  "courses.because-you-viewed": "/courses/because-you-viewed",
  "report.send": "/report",
  "vote.up": "/vote/up",
  "vote.down": "/vote/down",
  "auth.login": "/auth/signin",
  "auth.signup": "/auth/signup",
  "auth.logout": "/auth/signout",
  "auth.me": "/auth/me",
  "auth.forget.passwd": "/auth/forget-passwd",
  "auth.verify.otp": "/auth/verify-otp",
  "auth.reset.passwd": "/auth/reset-passwd",
  "auth.updateProfile": "/auth/update-profile",
  "auth.verify.email": "/auth/verify-email",
  "auth.resend.verification": "/auth/resend-verification",
  "auth.refresh": "/auth/refresh",
};
const prodRoutes: TRoute = {
  "courses.list": "/courses",
  "courses.search": "/courses",
  "courses.because-you-viewed": "/courses/because-you-viewed",
  "report.send": "/report",
  "vote.up": "/vote/up",
  "vote.down": "/vote/down",
  "auth.login": "/auth/signin",
  "auth.signup": "/auth/signup",
  "auth.logout": "/auth/signout",
  "auth.me": "/auth/me",
  "auth.forget.passwd": "/auth/forget-passwd",
  "auth.verify.otp": "/auth/verify-otp",
  "auth.reset.passwd": "/auth/reset-passwd",
  "auth.updateProfile": "/auth/update-profile",
  "auth.verify.email": "/auth/verify-email",
  "auth.resend.verification": "/auth/resend-verification",
  "auth.refresh": "/auth/refresh",
};

const getRoutes = (env: string) => {
  if (env === "development") {
    return devRoutes;
  }

  if (env === "production") {
    return prodRoutes;
  }

  if (env === "test") {
    return prodRoutes;
  }

  throw new Error(
    "Invalid environment! Set NODE_ENV to development, production"
  );
};

export type { TRoutePath, TRoute };

export { ERouteId };

export default getRoutes;
