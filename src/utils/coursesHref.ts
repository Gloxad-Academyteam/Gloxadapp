// "Our Courses" is for signed-in users: signed-out visitors go to sign-in first, then back to the course list
export const COURSES_HOME = "/courses";

export const coursesHref = (isAuthenticated: boolean, path = COURSES_HOME) =>
  isAuthenticated ? path : `/auth/signin?redirect=${encodeURIComponent(path)}`;
