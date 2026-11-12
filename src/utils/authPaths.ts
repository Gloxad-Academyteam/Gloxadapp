// The sign-in, sign-up and password pages live at short addresses: /login, /signup and so on.
const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-otp"];

export const isAuthPath = (pathname: string) => AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
