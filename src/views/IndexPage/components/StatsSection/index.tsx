import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { mockStats } from "@constants/mockData";
import ScrollReveal from "@components/ScrollReveal";

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000; // ms
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-bold text-headline-large md:text-display-medium text-primary-1">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section
      className="rounded-[20px] py-[40px] px-[20px] md:py-[60px] md:px-[40px]"
      style={{
        background: "linear-gradient(135deg, #030069 0%, #1D7DB6 100%)",
      }}
    >
      <ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px] md:gap-[40px]">
          {mockStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-[8px]"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-body-large text-primary-5 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default StatsSection;
