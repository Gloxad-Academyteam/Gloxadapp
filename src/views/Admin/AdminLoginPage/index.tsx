"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { signIn } from "@services/auth";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await signIn({ email, password });
      const user = response.data?.user;

      if (user?.role !== "admin") {
        throw new Error("Unauthorized access. Admin privileges required.");
      }

      queryClient.setQueryData(["auth.me"], { data: user });
      await queryClient.invalidateQueries({ queryKey: ["auth.me"] });

      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] shadow-lg border border-[#e2e8f0] p-8 w-full max-w-[450px]">
        <div className="flex flex-col items-center text-center mb-8">
          <img src="/gloxadlogo.png" alt="Gloxad Academy" className="h-10 object-contain mb-6" />
          <h1 className="text-[24px] font-bold text-[#202127] mb-2">Admin Portal Login</h1>
          <p className="text-[14px] text-[#717480]">Authorized personnel only.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#ffe4e6] border border-[#f43f5e] text-[#e11d48] text-[13px] rounded-[6px]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#202127]">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717480]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@gloxad.com"
                className="w-full h-[48px] rounded-[8px] border border-[#e2e8f0] pl-11 pr-4 text-[15px] outline-none focus:border-[#181C7B] focus:ring-1 focus:ring-[#181C7B]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#202127]">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717480]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-[48px] rounded-[8px] border border-[#e2e8f0] pl-11 pr-4 text-[15px] outline-none focus:border-[#181C7B] focus:ring-1 focus:ring-[#181C7B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-[48px] ${isLoading ? 'bg-[#94a3b8]' : 'bg-[#181C7B] hover:bg-blue-900'} text-white font-bold rounded-[8px] mt-2 transition-colors`}
          >
            {isLoading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
