"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FiAlertCircle, FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiShield } from "react-icons/fi";
import { signIn, WrongLoginAreaError } from "@services/auth";

const messageFor = (error: any) => {
  if (error instanceof WrongLoginAreaError) return error.message;
  const status = error?.response?.status;
  if (status === 401) return "That email or password is not right.";
  if (status === 429) return "Too many attempts. Wait a few minutes and try again.";
  return error?.response?.data?.error || "We could not sign you in. Check your connection and try again.";
};

const AdminLoginPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      // area "admin" only stores the session once the account is confirmed as an admin
      const { data } = await signIn({ email: email.trim(), password, area: "admin" });
      queryClient.setQueryData(["auth.me"], { data: data.user });
      router.push("/admin");
    } catch (reason) {
      setError(messageFor(reason));
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#0b0d1a] lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#5d5fef]/30 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-[380px] w-[380px] rounded-full bg-[#2f80ed]/20 blur-[120px]" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
            <Image src="/gloxadlogo.png" alt="" width={26} height={26} className="h-6 w-auto object-contain" />
          </span>
          <span className="text-[18px] font-semibold tracking-tight text-white">Gloxad Admin</span>
        </div>
        <div className="relative max-w-[460px]">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/70">
            <FiShield /> Restricted area
          </span>
          <h1 className="text-[40px] font-semibold leading-[1.12] tracking-tight text-white">Run Gloxad Academy from one calm place.</h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-white/60">
            Manage tutors, courses, learners, live classes and revenue. Access is limited to approved administrators and every sign-in is checked.
          </p>
        </div>
        <p className="relative text-[12.5px] text-white/40">© {new Date().getFullYear()} Gloxad Academy</p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-[#f6f7fb] px-5 py-12 sm:px-10 lg:rounded-l-[32px]">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b0d1a]">
              <Image src="/gloxadlogo.png" alt="" width={26} height={26} className="h-6 w-auto object-contain" />
            </span>
            <span className="text-[18px] font-semibold tracking-tight text-[#12142b]">Gloxad Admin</span>
          </div>

          <h2 className="text-[28px] font-semibold tracking-tight text-[#12142b]">Admin sign in</h2>
          <p className="mt-1.5 text-[14.5px] text-[#6b7087]">Use your administrator account. Learner and tutor accounts sign in on the main site.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#f3c9c9] bg-[#fdf1f1] px-3.5 py-3 text-[13.5px] text-[#a42b2b]">
                <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{error}</span>
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#3b3f58]">Email</span>
              <span className="relative block">
                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa0b8]" />
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@gloxad.com"
                  className="h-12 w-full rounded-xl border border-[#dfe2ee] bg-white pl-10 pr-3 text-[14.5px] text-[#12142b] outline-none transition placeholder:text-[#b4b9cc] focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/15"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[#3b3f58]">Password</span>
              <span className="relative block">
                <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa0b8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  className="h-12 w-full rounded-xl border border-[#dfe2ee] bg-white pl-10 pr-11 text-[14.5px] text-[#12142b] outline-none transition placeholder:text-[#b4b9cc] focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8a90a8] hover:bg-[#f0f1f7]"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#12142b] text-[14.5px] font-semibold text-white transition hover:bg-[#1d2040] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking your account..." : "Sign in to admin"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-[13px] text-[#6b7087]">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#12142b]">
              <FiArrowLeft size={14} /> Back to the site
            </Link>
            <Link href="/auth/forgot-password" className="hover:text-[#12142b]">Forgot password?</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;
