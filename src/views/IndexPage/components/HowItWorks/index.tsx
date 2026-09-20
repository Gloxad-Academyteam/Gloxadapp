import { LuSearch, LuBookOpen, LuMessageCircle, LuTrophy } from "react-icons/lu";
import ScrollReveal from "@components/ScrollReveal";

const steps = [
  { title: "Find a Course", icon: LuSearch, description: "Browse and select a verified course tailored to your career ambitions." },
  { title: "Enroll & Learn", icon: LuBookOpen, description: "Learn at your own pace with interactive video lessons and materials." },
  { title: "Join Discussions", icon: LuMessageCircle, description: "Engage in live Q&A, submit assignments, and get instructor guidance." },
  { title: "Complete & Get Certified", icon: LuTrophy, description: "Complete your final project and earn a shareable, verified certificate." },
];

const HowItWorks = () => {
  return (
    <div className="relative z-10 w-full overflow-visible">
      <ScrollReveal className="mx-auto w-full max-w-[1272px] px-5 md:px-10 lg:px-0">
        <div className="relative overflow-hidden flex flex-col rounded-[24px] lg:rounded-[32px] bg-gradient-to-br from-[#181C7B] via-[#121666] to-[#0A0D46] px-6 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16 shadow-2xl border border-white/10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left max-w-[680px]">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest text-white uppercase mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Simple 4-Step Process
            </span>
            <h2 className="text-[26px] md:text-[34px] lg:text-[38px] font-extrabold text-white leading-[1.15] tracking-tight">
              How It Works: Your Learning Journey
            </h2>
            <p className="mt-3 text-[15px] text-white/80 leading-relaxed font-normal">
              <span className="sm:hidden">Four simple steps to real-world skills.</span>
              <span className="hidden sm:inline">Our platform makes acquiring real-world skills straightforward and structured. Follow these steps to kickstart your growth today!</span>
            </p>
          </div>

          <div className="relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="group relative overflow-hidden flex flex-col justify-between rounded-[20px] bg-white/5 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:border-white/20"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/15 border border-white/25 text-white transition-transform duration-300 group-hover:scale-105">
                      <step.icon className="text-[22px] text-white" />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-wider text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-white tracking-tight mb-2">{step.title}</h3>
                  <p className="text-[13px] leading-[1.6] text-white/75 font-normal line-clamp-2 sm:line-clamp-none">{step.description}</p>
                </div>

                <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-white/50 text-xs font-medium">
                  <span>Phase {index + 1}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default HowItWorks;
