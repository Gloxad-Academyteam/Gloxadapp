import type { TUser } from "@services/auth/types_";

const verifyEmailRoute = (email: string) =>
  `/auth/verify-otp?email=${encodeURIComponent(email)}&type=verify`;

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
  if (!user) return "/auth/signin";

  if (user.role === "admin") return "/admin";

  if (needsEmailVerification(user)) return verifyEmailRoute(user.email || "");

  if (user.role === "instructor") {
    const hasCertifications = Array.isArray(user.certifications) && user.certifications.length > 0;
    const status = (user.approvalStatus || "").toLowerCase();
    const isApproved = status === "approved";
    const isPendingReview = status === "pending" && hasCertifications;

    if (!isApproved && !isPendingReview) return "/tutor/onboarding";
  }

  return redirectUrl || "/dashboard";
};

export { getPostAuthRoute, needsEmailVerification, verifyEmailRoute };
