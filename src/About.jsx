import { motion, useInView as realUseInView } from "framer-motion";
const useInView = () => true;
import { useRef, useState, useEffect } from "react";
import StickyTitle from "./components/StickyTitle";
import { useTheme } from "./context/ThemeContext";
import asciiArtDark from "../assets/ascii_art_dark.txt?raw";
import asciiArtLight from "../assets/ascii_art_light.txt?raw";

// Canvas-based ASCII art renderer to prevent browser minimum font size scaling issues on mobile
function AsciiCanvas({ asciiText, theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lines = asciiText.split("\n").map(l => l.replace("\r", "")).filter(l => l.length > 0);
    if (lines.length === 0) return;

    const numChars = lines[0].length;
    const numLines = lines.length;

    // Use 10x20 cell size for crisp high-resolution rendering
    const cellW = 10;
    const cellH = 20;

    canvas.width = numChars * cellW;
    canvas.height = numLines * cellH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Color based on theme: light text on dark card, or dark text on light card
    ctx.fillStyle = theme === "dark" ? "#f4f4f5" : "#09090b";
    ctx.font = "bold 15px monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    lines.forEach((line, y) => {
      for (let x = 0; x < line.length; x++) {
        ctx.fillText(line[x], x * cellW, y * cellH);
      }
    });
  }, [asciiText, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto object-contain select-none max-h-[460px] block mx-auto"
      style={{ aspectRatio: "4/5" }}
    />
  );
}

// Count Up Animation Component
function Counter({ value, suffix = "", duration = 1.8 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    const totalMilliseconds = duration * 1000;
    const startTime = performance.now();

    let animationFrameId;

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= totalMilliseconds) {
        setCount(end);
        return;
      }

      const progress = elapsedTime / totalMilliseconds;
      const easeProgress = progress * (2 - progress); // Ease out quad
      const currentCount = Math.floor(easeProgress * (end - start) + start);

      setCount(currentCount);
      animationFrameId = requestAnimationFrame(updateCount);
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const { theme } = useTheme();
  const asciiArt = theme === "dark" ? asciiArtDark : asciiArtLight;

  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, amount: 0.15 });

  const [githubContributions, setGithubContributions] = useState(900);
  const [leetcodeSolved, setLeetcodeSolved] = useState(900);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://github-contributions-api.jogruber.de/v4/pranjal-sahu21");
        if (res.ok) {
          const data = await res.json();
          const total = Object.values(data.total).reduce((a, b) => a + b, 0);
          if (total > 0) {
            const rounded = Math.floor(total / 100) * 100;
            setGithubContributions(rounded);
          }
        }
      } catch (e) {
        console.error("Error fetching GH contributions:", e);
      }

      try {
        const res = await fetch("https://leetcode-api-faisalshohag.vercel.app/Pranjal_1619");
        if (res.ok) {
          const data = await res.json();
          const total = data.totalSolved;
          if (total > 0) {
            const rounded = Math.floor(total / 100) * 100;
            setLeetcodeSolved(rounded);
          }
        }
      } catch (e) {
        console.error("Error fetching LeetCode solved:", e);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      value: 15,
      suffix: "+",
      label: "Projects Completed",
      hoverText: "Most of them actually compile on my machine!",
    },
    {
      value: githubContributions,
      suffix: "+",
      label: "GitHub Contributions",
      hoverText: "Commit messages and green heatmap boxes.",
    },
    {
      value: leetcodeSolved,
      suffix: "+",
      label: "LeetCode Solved",
      hoverText: "My brain cells paid the price for these green blocks.",
    },
    {
      value: 999,
      suffix: "+",
      label: "Cups of Coffee",
      hoverText: "Powered entirely by caffeine and panic.",
    },
  ];

  return (
    <section
      id="about"
      className="flex flex-col justify-center items-center py-24 px-5 text-center relative bg-bg"
    >
      <StickyTitle className="shimmer-text font-bebas tracking-tighter mb-14 text-[clamp(3.8rem,9.5vw,7.5rem)] leading-none uppercase">
        About Me
      </StickyTitle>

      <div
        ref={contentRef}
        className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch text-left px-4 mt-16"
      >
        {/* Left Column: Portrait ASCII Art */}
        <motion.div
          className="md:col-span-5 flex justify-center items-center w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <div
            className="w-full max-w-[400px] bg-input-bg/50 backdrop-blur-md border border-primary/10 rounded-2xl p-4 shadow-md select-none hover:scale-[1.02] transition-all duration-300 overflow-hidden flex justify-center items-center"
            data-hover-text="Yes, that's actually me! Converted to highly detailed text-based ASCII art."
          >
            <AsciiCanvas asciiText={asciiArt} theme={theme} />
          </div>
        </motion.div>

        {/* Right Column: Bio & Counter Stats */}
        <motion.div
          className="md:col-span-7 flex flex-col justify-start md:justify-between gap-6 md:gap-0 w-full py-1 md:h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
        >
          {/* Bio paragraph */}
          <div className="flex flex-col gap-4">
            <p className="font-space text-lg text-primary font-semibold">
              B.Tech Computer Science student @ NIT Rourkela
            </p>
            <p className="font-space text-[0.95rem] leading-[1.7] text-muted-text">
              I specialize in crafting fast, clean, and highly interactive web applications. My work combines clean layouts with functional engineering and thoughtful user experiences, focusing on modern web standards, semantic integrity, and performance.
            </p>
            <p className="font-space text-[0.95rem] leading-[1.7] text-muted-text">
              I love translating complex architectural problems into efficient, structured, and elegant code. With hands-on experience in building full-stack applications, API design, and database optimization, I strive to create robust software systems that grow seamlessly with user needs.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-input-bg/50 backdrop-blur-md border border-primary/10 border-l-4 border-l-neutral-500 rounded-2xl p-4 shadow-md hover:border-l-accent transition-all duration-300"
                data-hover-text={stat.hoverText}
              >
                <div className="text-primary text-3xl font-bold font-syne mb-1.5">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-muted-text text-[0.7rem] sm:text-[0.75rem] uppercase tracking-wider font-space font-medium leading-none">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
