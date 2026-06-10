import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const steps = [
    "Preparing your experience...",
    "Almost there...",
  ];

  const displayTime = 2000;
  const totalDuration = displayTime * steps.length;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, displayTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-[100dvh] text-muted-text flex flex-col justify-center items-center z-[9999] overflow-hidden bg-bg"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <motion.div
        className="flex flex-col items-center justify-center mb-8 relative"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Speech Bubble */}
        <motion.div 
          className="absolute bottom-[95%] left-1/2 -translate-x-1/2 md:bottom-[90%] md:left-[55%] md:translate-x-0 mb-3 bg-primary text-bg font-space text-[0.9rem] px-4 py-2.5 rounded-xl shadow-md whitespace-nowrap z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        >
          Welcome to my portfolio
          {/* Caret border/arrow pointing down */}
          <div className="absolute top-[100%] left-1/2 -translate-x-1/2 md:left-[12px] md:translate-x-0 w-0 h-0 border-t-[7px] border-t-primary border-x-[7px] border-x-transparent"></div>
        </motion.div>

        {/* Larger Static Character SVG */}
        <svg viewBox="0 0 40 40" className="w-24 h-24 text-primary" style={{ overflow: "visible" }}>
          <rect x="12" y="18" width="16" height="14" rx="4" fill="currentColor" />
          <circle cx="20" cy="11" r="8" fill="currentColor" />
          <rect x="16" y="9" width="10" height="4" rx="2" fill="var(--bg)" />
          <line x1="15" y1="32" x2="15" y2="38" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
          <line x1="25" y1="32" x2="25" y2="38" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        </svg>
      </motion.div>

      <div style={{ position: "relative", height: "2rem", marginTop: "10px" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={steps[index]}
            className="font-syne text-[clamp(1.25rem,1.5vw,2.5rem)] font-light text-muted-text mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {steps[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-[260px] h-[3px] mt-6 bg-white/10 mt-3 rounded overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        <motion.div
          className="h-full w-0 bg-[linear-gradient(90deg,var(--primary),var(--accent),var(--primary))] bg-[length:200%] animate-[roleGradient_2s_linear_infinite]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: totalDuration / 1000,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
