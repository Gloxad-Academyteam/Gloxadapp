// Two phone mock-ups on a slate gradient, standing in for the Teacher Dashboard illustration
const rows = [78, 64, 70, 56, 74, 60, 68, 52, 72, 58];

const TeacherDashboardArt = () => (
  <div
    aria-hidden
    className="relative flex h-full w-full items-center justify-center overflow-hidden pr-[2%]"
    style={{ background: "linear-gradient(135deg, #7f9ea3 0%, #5a7a7f 45%, #34484b 100%)" }}
  >
    <span className="absolute -left-10 top-1/4 h-[140%] w-24 rotate-[28deg] bg-black/10 blur-xl" />
    <span className="absolute left-1/3 top-[10%] h-[150%] w-20 rotate-[28deg] bg-black/10 blur-xl" />

    <div className="relative z-10 aspect-[9/17] w-[31%] rounded-[8px] bg-white p-[5%] shadow-[0_18px_36px_-12px_rgba(0,0,0,0.55)]">
      <div className="h-[7%] rounded-[3px] bg-[#40595d]" />
      <div className="mt-[8%] flex flex-col gap-[5.5%]">
        {rows.map((width, index) => (
          <div key={index} className="flex items-center gap-[6%]">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#9fb1b4]" />
            <span className="h-[5px] rounded-full bg-[#d7dfe0]" style={{ width: `${width}%` }} />
          </div>
        ))}
      </div>
    </div>

    <div className="relative z-20 ml-[7%] mt-[16%] aspect-[9/16] w-[26%] rounded-[8px] bg-white p-[5%] shadow-[0_18px_36px_-12px_rgba(0,0,0,0.55)]">
      <div className="h-[8%] rounded-[3px] bg-[#40595d]" />
      <div className="mt-[10%] grid grid-cols-6 gap-[3px]">
        {Array.from({ length: 30 }, (_, index) => (
          <span key={index} className={`aspect-square rounded-[1.5px] ${index === 8 ? "bg-[#5a7a7f]" : "bg-[#e2e8e9]"}`} />
        ))}
      </div>
      <div className="mt-[12%] flex flex-col gap-[7%]">
        {[70, 52, 62].map((width) => (
          <span key={width} className="h-[4px] rounded-full bg-[#d7dfe0]" style={{ width: `${width}%` }} />
        ))}
      </div>
    </div>
  </div>
);

export default TeacherDashboardArt;
