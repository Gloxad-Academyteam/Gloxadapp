"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { PiChalkboardTeacher } from "react-icons/pi";
import useAuth from "@hooks/useAuth";

// Creating and managing courses is for tutors only. Students (and admins, who work in /admin) see this
// instead of the form. The server refuses them too; this just stops the screen from looking usable.
const TutorOnly = ({ children }: { children: ReactNode }) => {
  const { authenticatedUser, isLoading } = useAuth();
  if (isLoading) return null;
  if (authenticatedUser?.role === "instructor") return <>{children}</>;

  const isStudent = authenticatedUser?.role === "student";
  return (
    <div className="mx-auto flex w-full max-w-[460px] flex-col items-center px-6 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf2fd] text-[32px] text-[#3e92cc]">
        <PiChalkboardTeacher aria-hidden />
      </span>
      <h2 className="mt-6 text-[22px] font-bold text-[#202127]">This area is for tutors</h2>
      <p className="mt-2 text-[14px] leading-[1.6] text-[#717480]">
        {isStudent ? "Only tutors can create and manage courses. You can keep learning from your dashboard." : "Course authoring is done from a tutor account."}
      </p>
      <Link href={authenticatedUser?.role === "admin" ? "/admin" : "/dashboard"} className="mt-7 inline-flex h-[46px] items-center rounded-full bg-[#07004d] px-8 text-[14px] font-semibold text-white transition hover:bg-[#111456]">
        {authenticatedUser?.role === "admin" ? "Go to admin" : "Back to my learning"}
      </Link>
    </div>
  );
};

export default TutorOnly;
