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
