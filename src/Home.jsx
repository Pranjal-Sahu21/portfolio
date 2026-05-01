import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Home() {
  const firstName = "PRANJAL".split("");
  const lastName = "SAHU".split("");

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numStars = 22;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      const color = "rgba(200, 200, 200, ";
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        delta: Math.random() * 0.02 + 0.005,
        color,
      });
    }

    function drawScene() {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.opacity += star.delta;
        if (star.opacity > 1 || star.opacity < 0) star.delta *= -1;

        ctx.fillStyle = `${star.color}${Math.floor(star.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(drawScene);
    }

    drawScene();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="h-[100dvh] w-full text-light-text flex flex-col justify-center items-start px-[5vw] overflow-hidden" id="home">
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* NAME */}
      <div className="font-syne font-extrabold text-[clamp(3rem,18vw,8rem)] md:text-[clamp(5rem,14vw,18rem)] leading-[0.85] tracking-[-2px] md:tracking-[-4px] flex flex-wrap">
        {/* FIRST LINE */}
        <motion.div className="flex">
          {firstName.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: i * 0.04,
                type: "spring",
                stiffness: 90,
              }}
              className="inline-block will-change-transform font-syne font-extrabold text-[clamp(2.3rem,10vw,14rem)] tracking-[-1.5px] leading-[0.9] bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(226,88,34,0.2)]"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* SECOND LINE */}
        <motion.div className="flex font-syne font-bold">
          {lastName.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3 + i * 0.04, // slight delay after first line
                type: "spring",
                stiffness: 90,
              }}
              className="inline-block will-change-transform font-syne font-extrabold text-[clamp(2.3rem,10vw,14rem)] tracking-[-1.5px] leading-[0.9] bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(226,88,34,0.2)]"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <motion.h2
        className="mt-[30px] font-space text-[0.9rem] tracking-[1.5px] uppercase bg-[linear-gradient(90deg,var(--primary),var(--accent),var(--primary))] bg-[length:200%_auto] bg-clip-text text-transparent animate-[roleGradient_2s_linear_infinite]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Web Developer
      </motion.h2>

      {/* DESCRIPTION */}
      <motion.p
        className="mt-5 max-w-[500px] font-space text-[1rem] leading-[1.7] text-muted-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Crafting fast, interactive, and visually engaging web experiences using
        modern technologies and thoughtful design.
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        className="mt-10 flex flex-col md:flex-row gap-[15px] md:gap-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <a
          href="https://drive.google.com/file/d/1m48F8yzCEyERcjGU2elYYyuSK0DKVhHn/view?usp=drive_link"
          target="_blank"
          rel="noreferrer"
          className="font-space font-medium tracking-[0.5px] text-[0.95rem] uppercase py-3 px-7 rounded-xl no-underline transition-all duration-300 inline-flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white border-none shadow-[0_8px_25px_rgba(226,88,34,0.25)]"
        >
          Download CV
        </a>

        <button 
          onClick={() => scrollTo("contact")}
          className="font-space font-medium tracking-[0.5px] text-[0.95rem] uppercase py-3 px-7 rounded-xl no-underline transition-all duration-300 inline-flex items-center justify-center border border-primary text-primary bg-transparent cursor-pointer"
        >
          Contact Me
        </button>
      </motion.div>

      <motion.div
        className="absolute top-[85dvh] right-8 md:bottom-[30px] md:right-[40px] flex flex-col items-center gap-2 font-space z-[2]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[0.75rem] tracking-[2px] uppercase text-muted-text">Scroll</span>

        <div className="w-[2px] h-[30px] md:h-[40px] bg-white/20 rounded-[10px] relative overflow-hidden">
          <motion.div
            className="w-full h-2 bg-gradient-to-b from-primary to-accent rounded-[10px]"
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
