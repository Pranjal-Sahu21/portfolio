import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Silk from "./components/Silk/Silk";
import { useTheme } from "./context/ThemeContext";
import Globe3d from "./components/ui/Globe3d";

export default function Home({ showContent = true }) {
  const { theme } = useTheme();
  const nameChars = "PRANJAL".split("");
  const sectionRef = useRef(null);

  // Parallax scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // 1. Staggered vertical parallax translations for each letter in PRANJAL (7 letters)
  const y0 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "115%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "130%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "145%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["0%", "160%"]);
  const y5 = useTransform(scrollYProgress, [0, 1], ["0%", "175%"]);
  const y6 = useTransform(scrollYProgress, [0, 1], ["0%", "190%"]);

  // Staggered opacity fades for each letter
  const op0 = useTransform(scrollYProgress, [0.00, 0.65, 1], [1, 0.4, 0]);
  const op1 = useTransform(scrollYProgress, [0.04, 0.69, 1], [1, 0.4, 0]);
  const op2 = useTransform(scrollYProgress, [0.08, 0.73, 1], [1, 0.4, 0]);
  const op3 = useTransform(scrollYProgress, [0.12, 0.77, 1], [1, 0.4, 0]);
  const op4 = useTransform(scrollYProgress, [0.16, 0.81, 1], [1, 0.4, 0]);
  const op5 = useTransform(scrollYProgress, [0.20, 0.85, 1], [1, 0.4, 0]);
  const op6 = useTransform(scrollYProgress, [0.24, 0.89, 1], [1, 0.4, 0]);

  const letterTransforms = [
    { y: y0, opacity: op0 },
    { y: y1, opacity: op1 },
    { y: y2, opacity: op2 },
    { y: y3, opacity: op3 },
    { y: y4, opacity: op4 },
    { y: y5, opacity: op5 },
    { y: y6, opacity: op6 },
  ];

  // 2. Center text/description moves up as user scrolls
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-90%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.3, 0]);

  // 3. Silk background parallax with oversized bounds to prevent gaps
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full text-light-text flex flex-col justify-between items-center px-4 md:px-8 pt-24 pb-0 overflow-hidden relative select-none"
      id="home"
    >
      {/* Silk Background with oversized bounds to completely eliminate scroll gaps */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute -top-[25%] -bottom-[25%] -left-[10%] -right-[10%] z-0 bg-[var(--bg-silk)] transition-colors duration-300 will-change-transform"
      >
        <Silk
          color={theme === "dark" ? "#272626" : "#ffffff"}
          speed={5}
          scale={1}
          noiseIntensity={1.5}
        />
      </motion.div>

      {showContent && (
        <>
          {/* Center Description Content moving up */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="relative z-10 flex flex-col items-center justify-center my-auto max-w-[320px] sm:max-w-[350px] text-center px-4 will-change-transform"
          >
            {/* Minimal 3D Globe */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.75 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <Globe3d />
            </motion.div>

            {/* Tighter Description */}
            <motion.p
              className="font-inter text-[0.92rem] sm:text-[0.98rem] leading-relaxed text-primary font-medium tracking-tight mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-hover-text="That's what I do!"
            >
              Designing high-performance, change-making web experiences that elevate digital products.
            </motion.p>

            <motion.p
              className="font-inter text-[0.8rem] sm:text-[0.85rem] leading-normal text-muted-text font-normal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              data-hover-text="Yes, I'm currently here!"
            >
              Web Developer & B.Tech CSE Student @ NIT Rourkela.
            </motion.p>
          </motion.div>

          {/* Bottom Display Name: PRANJAL moving down letter-by-letter */}
          <div className="relative z-10 w-full flex justify-center items-end select-none pb-0 pt-6 md:pt-10 overflow-visible">
            <h1
              className="w-full flex justify-between sm:justify-around items-end font-caitog text-[clamp(4.2rem,22vw,22rem)] leading-[0.88] tracking-[-0.02em] text-[#898989] uppercase select-none transition-colors duration-300 py-1"
              data-hover-text="SAY MY NAME!"
            >
              {nameChars.map((char, i) => (
                <motion.span
                  key={i}
                  style={letterTransforms[i] || {}}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    delay: 0.3 + i * 0.05,
                    type: "spring",
                    stiffness: 85,
                    damping: 18,
                  }}
                  className="inline-block will-change-transform py-1"
                >
                  {char}
                </motion.span>
              ))}
              <span className="sr-only">Pranjal</span>
            </h1>
          </div>
        </>
      )}

      {/* Bottom Blur Mask to blur elements as they scroll down / exit */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{
          background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      />
    </section>
  );
}
