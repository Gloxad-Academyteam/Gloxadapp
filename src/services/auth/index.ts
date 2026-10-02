import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";
import handleUseRoute from "@utils/handleUseRoute";
import { ERouteId } from "@constants/routes";
import { TUser } from "./types_";
import { matchDemoLogin, getDemoUserFromToken, DEMO_TOKEN_PREFIX } from "@utils/demoAuth";

const signUpServiceRoute = handleUseRoute(ERouteId["auth.signup"], {
  disableMockingInProduction: false,
});

const signInServiceRoute = handleUseRoute(ERouteId["auth.login"], {
  disableMockingInProduction: false,
});

const signOutServiceRoute = handleUseRoute(ERouteId["auth.logout"], {
  disableMockingInProduction: false,
});

const getMeServiceRoute = handleUseRoute(ERouteId["auth.me"], {
  disableMockingInProduction: false,
});

const updateProfileServiceRoute = handleUseRoute(ERouteId["auth.updateProfile"], {
  disableMockingInProduction: false,
});

const forgetPasswdServiceRoute = handleUseRoute(
  ERouteId["auth.forget.passwd"],
  false
);

const verifyOtpServiceRoute = handleUseRoute(
  ERouteId["auth.verify.otp"],
  false
);

const resetPasswdServiceRoute = handleUseRoute(
  ERouteId["auth.reset.passwd"],
  false
);

const verifyEmailServiceRoute = handleUseRoute(
  ERouteId["auth.verify.email"],
  false
);

const resendVerificationServiceRoute = handleUseRoute(
  ERouteId["auth.resend.verification"],
  false
);

const updatePasswordServiceRoute = handleUseRoute(
  ERouteId["auth.update.password"],
  false
);

/**
 * The auth API (Render) doesn't name fields identically on every endpoint
 * (e.g. /me uses `isVerified`, `bio` and `socials`; signup uses `isEmailVerified`,
 * `biography` and `socialLinks`). Map them to one shape in one place.
 */
function normalizeUser(user: any): TUser {
  if (!user) return user;
  const isEmailVerified = user.isEmailVerified ?? user.isVerified;
  return {
    ...user,
    _id: user._id ?? user.id,
    name: user.name ?? [user.firstName, user.lastName].filter(Boolean).join(" "),
    avatar: user.avatar ?? user.avatarUrl ?? "",
    biography: user.biography ?? user.bio,
    socialLinks: user.socialLinks ?? user.socials,
    ...(isEmailVerified !== undefined && { isEmailVerified }),
  };
}

async function forgetPasswd({
  email,
}: {
  email: string;
}): Promise<TService<true>> {
  await axiosInstance.post(forgetPasswdServiceRoute, {
    email,
  });
  return { data: true };
}

async function verifyOtp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<TService<true>> {
  await axiosInstance.post(verifyOtpServiceRoute, {
    email,
    otp,
  });
  return { data: true };
}

async function verifyEmail({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<TService<TUser | null>> {
  const { data } = await axiosInstance.post(verifyEmailServiceRoute, {
    email,
    otp,
  });

  // Signed in (signup returns a session): the API returns the now-verified user
  if (!localStorage.getItem("token")) return { data: null };
  if (data?.user) return { data: normalizeUser(data.user) };
  try {
    return await getMe();
  } catch {
    return { data: null };
  }
}

async function resendVerification({
  email,
}: {
  email: string;
}): Promise<TService<true>> {
  await axiosInstance.post(resendVerificationServiceRoute, {
    email,
  });
  return { data: true };
}

async function resetPasswd({
  email,
  newPassword,
  otp,
}: {
  email: string;
  newPassword: string;
  otp: string;
}): Promise<TService<true>> {
  await axiosInstance.post(resetPasswdServiceRoute, {
    email,
    newPassword,
    otp,
  });

  // Clear any existing session so the user is forced to use their new password
  localStorage.removeItem("token");

  return { data: true };
}

async function signIn({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<TService<any>> {
  // Demo accounts skip the backend entirely (see utils/demoAuth.ts)
  const demo = matchDemoLogin(email, password);
  if (demo) {
    localStorage.setItem("token", demo.token);
    return { data: { token: demo.token, user: demo.user } };
  }

  const response = await axiosInstance.post(signInServiceRoute, {
    email,
    password,
    rememberMe,
  });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  return { data: { ...response.data, user: normalizeUser(response.data?.user) } };
}

async function signUp({
  email,
  password,
  firstName,
  lastName,
  username,
  university,
  level,
  skills,
  role,
  areaOfExpertise,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  university?: string;
  level?: string;
  skills?: string;
  role?: string;
  areaOfExpertise?: string;
}): Promise<TService<any>> {
  const response = await axiosInstance.post(signUpServiceRoute, {
    email,
    password,
    firstName,
    lastName,
    username,
    university,
    level,
    skills,
    role,
    areaOfExpertise,
  });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  // New accounts always start unverified, whatever field name the API uses
  const user = normalizeUser(response.data?.user);
  if (user && user.isEmailVerified === undefined) user.isEmailVerified = false;

  return { data: { ...response.data, user } };
}

async function signOut(): Promise<TService<true>> {
  if (localStorage.getItem("token")?.startsWith(DEMO_TOKEN_PREFIX)) {
    localStorage.removeItem("token");
    return { data: true };
  }
  await axiosInstance.post(signOutServiceRoute);
  localStorage.removeItem("token");
  return { data: true };
}

async function getMe(): Promise<TService<TUser>> {
  const demoUser = getDemoUserFromToken(localStorage.getItem("token"));
  if (demoUser) return { data: demoUser };

  const { data } = await axiosInstance.get(getMeServiceRoute);

  return { data: normalizeUser(data.user) };
}

async function updateProfile(payload: {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  avatar?: string;
  university?: string;
  level?: string;
  skills?: string | string[];
  biography?: string;
  title?: string;
  phoneNumber?: string;
  socialLinks?: any;
  notificationPreferences?: any;
}): Promise<TService<TUser>> {
  const { data } = await axiosInstance.put(updateProfileServiceRoute, payload);
  return { data: normalizeUser(data.user) };
}

async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<TService<true>> {
  await axiosInstance.post(updatePasswordServiceRoute, {
    currentPassword,
    newPassword,
  });
  return { data: true };
}

export {
  signIn,
  signInServiceRoute,
  getMe,
  getMeServiceRoute,
  signOut,
  signUp,
  forgetPasswd,
  signUpServiceRoute,
  verifyOtp,
  verifyEmail,
  verifyEmailServiceRoute,
  resendVerification,
  resendVerificationServiceRoute,
  verifyOtpServiceRoute,
  resetPasswd,
  resetPasswdServiceRoute,
  forgetPasswdServiceRoute,
  updateProfile,
  updateProfileServiceRoute,
  updatePassword,
  updatePasswordServiceRoute,
};
