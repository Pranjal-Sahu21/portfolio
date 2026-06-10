import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [walkActive, setWalkActive] = useState(true);
  const [bubbleText, setBubbleText] = useState("");

  useEffect(() => {
    // Walk finishes at 1.8 seconds, character says "Hi there!"
    const walkTimer = setTimeout(() => {
      setWalkActive(false);
      setBubbleText("Hi there!");
    }, 1800);

    // Sentence 2 at 3.8 seconds
    const s2Timer = setTimeout(() => {
      setBubbleText("I am Pranjal");
    }, 3800);

    // Sentence 3 at 5.8 seconds
    const s3Timer = setTimeout(() => {
      setBubbleText("Welcome to my portfolio");
    }, 5800);

    return () => {
      clearTimeout(walkTimer);
      clearTimeout(s2Timer);
      clearTimeout(s3Timer);
    };
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
        initial={{ scale: 0.3, opacity: 1, x: "-35vw", y: "-35vh" }}
        animate={
          walkActive
            ? { scale: 1, opacity: 1, x: 0, y: 0 }
            : { scale: 1, opacity: 1, x: 0, y: [0, -8, 0] }
        }
        transition={
          walkActive
            ? { duration: 1.8, ease: "easeOut" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Speech Bubble */}
        <AnimatePresence mode="wait">
          {bubbleText && (
            <motion.div 
              key={bubbleText}
              className="absolute bottom-[95%] left-1/2 -translate-x-1/2 md:bottom-[90%] md:left-[55%] md:translate-x-0 mb-3 bg-primary text-bg font-space text-[0.9rem] px-4 py-2.5 rounded-xl shadow-md whitespace-normal w-max max-w-[240px] sm:max-w-[320px] text-left z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              {bubbleText}
              {/* Caret border/arrow pointing down */}
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 md:left-[12px] md:translate-x-0 w-0 h-0 border-t-[7px] border-t-primary border-x-[7px] border-x-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Larger Static Character SVG */}
        <svg viewBox="0 0 40 40" className="w-24 h-24 text-primary" style={{ overflow: "visible" }}>
          {/* Body */}
          <rect x="12" y="18" width="16" height="14" rx="4" fill="currentColor" />
          {/* Head */}
          <circle cx="20" cy="11" r="8" fill="currentColor" />
          {/* Visor */}
          <rect x="14" y="8" width="12" height="6" rx="2" fill="var(--bg)" class="avatar-visor" />
          {/* Eyes */}
          <circle cx="18" cy="11" r="1.1" fill="currentColor" />
          <circle cx="22" cy="11" r="1.1" fill="currentColor" />
          {/* Arms */}
          <rect x="9.5" y="20" width="3" height="8" rx="1.5" fill="currentColor" className={walkActive ? "avatar-arm left" : ""} />
          <rect x="27.5" y="20" width="3" height="8" rx="1.5" fill="currentColor" className={walkActive ? "avatar-arm right" : ""} />
          {/* Legs */}
          <g className={walkActive ? "avatar-leg left" : ""}>
            <line x1="15" y1="32" x2="15" y2="38" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
            <ellipse cx="15" cy="38" rx="3.5" ry="1.5" fill="currentColor" />
          </g>
          <g className={walkActive ? "avatar-leg right" : ""}>
            <line x1="25" y1="32" x2="25" y2="38" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
            <ellipse cx="25" cy="38" rx="3.5" ry="1.5" fill="currentColor" />
          </g>
        </svg>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-[260px] h-[3px] bg-white/10 mt-3 rounded overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        <motion.div
          className="h-full w-0 bg-[linear-gradient(90deg,var(--primary),var(--accent),var(--primary))] bg-[length:200%] animate-[roleGradient_2s_linear_infinite]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 7.8,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
