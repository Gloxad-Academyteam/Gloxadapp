import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const EntropicOrb = () => {
  const [position, setPosition] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    const interval = setInterval(() => {
      // Moves frantically across the entire bounds of the card (0% to 100%)
      setPosition({
        x: `${Math.random() * 100}%`, 
        y: `${Math.random() * 100}%`,
      });
    }, 200); // 200ms for extremely fast, erratic movement like it's trying to break out

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      layoutId="chaotic-orb"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        left: position.x, 
        top: position.y,
        opacity: 1,
        scale: 1 
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ 
        left: { type: "spring", damping: 12, stiffness: 300, mass: 0.5 }, // Snappy, frantic spring
        top: { type: "spring", damping: 12, stiffness: 300, mass: 0.5 },
        layout: { type: "spring", damping: 25, stiffness: 120 }, // Smoother flight when jumping between cards
        opacity: { duration: 0.2 } 
      }}
      // Tiny ball of cyan energy
      className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 blur-[2px] shadow-[0_0_25px_15px_rgba(34,211,238,0.7)] pointer-events-none z-0"
    />
  );
};
