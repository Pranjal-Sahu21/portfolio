import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "./Loader.css";

export default function Loader() {
  const steps = [
    "Initializing...",
    "Loading Portfolio...",
    "Fetching Projects...",
    "Preparing Experience...",
    "Almost Ready...",
  ];

  const displayTime = 1000;
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
      className="loader"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div style={{ position: "relative", height: "2rem", marginTop: "10px" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={steps[index]}
            className="loader-subtitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {steps[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="loader-bar">
        <motion.div
          className="loader-progress"
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
