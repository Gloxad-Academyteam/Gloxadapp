// Where the "Trimester Courses" links go: the LMS for signed-in users, otherwise sign-in, then back to the LMS
export const LMS_HOME = "/lms";

export const trimesterHref = (isAuthenticated: boolean) => (isAuthenticated ? LMS_HOME : `/auth/signin?redirect=${encodeURIComponent(LMS_HOME)}`);
