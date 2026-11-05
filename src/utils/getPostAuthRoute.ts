import type { TUser } from "@services/auth/types_";

const safeRedirectPath = (redirectUrl?: string | null) =>
  redirectUrl?.startsWith("/") && !redirectUrl.startsWith("//") ? redirectUrl : "/dashboard";

const verifyEmailRoute = (email: string, redirectUrl = "/dashboard") =>
  `/auth/verify-otp?email=${encodeURIComponent(email)}&type=verify&redirect=${encodeURIComponent(safeRedirectPath(redirectUrl))}`;

// Tutors must always confirm their email. Students too, unless NEXT_PUBLIC_REQUIRE_STUDENT_EMAIL_VERIFICATION
// is "false" (use that if the auth API doesn't email students a code). Admins are created pre-verified.
const requireStudentVerification = process.env.NEXT_PUBLIC_REQUIRE_STUDENT_EMAIL_VERIFICATION !== "false";

const needsEmailVerification = (user?: Partial<TUser> | null) => {
  if (!user || user.role === "admin" || user.isEmailVerified !== false) return false;
  return user.role === "instructor" || requireStudentVerification;
};

/**
 * Where a signed-in user belongs. `redirectUrl` (e.g. from ?redirect=) is honoured
 * for anyone who has finished onboarding.
 */
const getPostAuthRoute = (user?: Partial<TUser> | null, redirectUrl = "/dashboard") => {
  const safeRedirect = safeRedirectPath(redirectUrl);
  if (!user) {
    return safeRedirect === "/dashboard" ? "/auth/signin" : `/auth/signin?redirect=${encodeURIComponent(safeRedirect)}`;
  }

  if (user.role === "admin") return "/admin";

  if (needsEmailVerification(user)) return verifyEmailRoute(user.email || "", safeRedirect);

  if (user.role === "instructor") {
    const hasCertifications = Array.isArray(user.certifications) && user.certifications.length > 0;
    const status = (user.approvalStatus || "").toLowerCase();
    const isApproved = status === "approved";
    const isPendingReview = status === "pending" && hasCertifications;

    if (!isApproved && !isPendingReview) return "/tutor/onboarding";
  }

  return safeRedirect;
};

export { getPostAuthRoute, needsEmailVerification, safeRedirectPath, verifyEmailRoute };
