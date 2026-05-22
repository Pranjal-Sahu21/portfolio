import { motion } from "framer-motion";
import Silk from "./components/Silk/Silk";
import { scrollToSection } from "./utils/scrollToSection";

export default function Home({ showContent = true }) {
  const firstName = "PRANJAL".split("");
  const lastName = "SAHU".split("");

  return (
    <section
      className="h-dvh w-full text-light-text flex flex-col justify-center items-start px-[5vw] overflow-hidden relative"
      id="home"
    >
      {/* Silk Background */}
      <div className="absolute inset-0 z-0 bg-[#272626]">
        <Silk
          color="#272626ff"
          speed={5}
          scale={1}
          noiseIntensity={1.5}
        />
      </div>

      {showContent && (
        <>
          {/* NAME */}
      <h1 className="relative z-10 font-syne font-extrabold text-[clamp(3rem,18vw,8rem)] md:text-[clamp(5rem,14vw,18rem)] leading-[0.85] tracking-[-2px] md:tracking-[-4px] flex flex-wrap">
        {/* FIRST LINE */}
        <motion.span className="flex" aria-label="Pranjal">
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
              className="inline-block will-change-transform font-syne font-extrabold text-[clamp(2.3rem,10vw,14rem)] tracking-[-1.5px] leading-[0.9] bg-linear-to-br from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(192,192,192,0.2)]"
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
        </motion.span>

        {/* SECOND LINE */}
        <motion.span className="flex font-syne font-bold" aria-label="Sahu">
          {lastName.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3 + i * 0.04, 
                type: "spring",
                stiffness: 90,
              }}
              className="inline-block will-change-transform font-syne font-extrabold text-[clamp(2.3rem,10vw,14rem)] tracking-[-1.5px] leading-[0.9] bg-linear-to-br from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(192,192,192,0.2)]"
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
        <span className="sr-only">Pranjal Sahu</span>
      </h1>

      <motion.h2
        className="relative z-10 mt-7.5 font-space text-[0.9rem] tracking-[1.5px] uppercase bg-[linear-gradient(90deg,var(--primary),var(--accent),var(--primary))] bg-size-[200%_auto] bg-clip-text text-transparent animate-[roleGradient_2s_linear_infinite]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Web Developer
      </motion.h2>

      {/* DESCRIPTION */}
      <motion.p
        className="relative z-10 mt-5 max-w-125 font-space text-[1rem] leading-[1.7] text-muted-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Crafting fast, interactive, and visually engaging web experiences using
        modern technologies and thoughtful design.
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        className="relative z-10 mt-10 flex flex-col md:flex-row gap-3.75 md:gap-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <a
          href="https://drive.google.com/file/d/1jo0rPyhozU-3zV_zyaCFlklMrGaUedwF/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className="font-space font-semibold tracking-[0.5px] text-[0.95rem] uppercase py-3 px-7 rounded-xl no-underline transition-all duration-300 inline-flex items-center justify-center bg-linear-to-br from-primary to-accent text-black border-none shadow-[0_8px_25px_rgba(192,192,192,0.25)]"
        >
          Download CV
        </a>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("contact");
          }}
          className="font-space font-medium tracking-[0.5px] text-[0.95rem] uppercase py-3 px-7 rounded-xl no-underline transition-all duration-300 inline-flex items-center justify-center border border-primary text-primary bg-transparent"
        >
          Contact Me
        </a>
      </motion.div>

      <motion.div
        className="absolute top-[85dvh] right-8 md:bottom-7.5 md:right-10 flex flex-col items-center gap-2 font-space z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[0.75rem] tracking-[2px] uppercase text-muted-text">
          Scroll
        </span>

        <div className="w-0.5 h-7.5 md:h-10 bg-white/20 rounded-[10px] relative overflow-hidden">
          <motion.div
            className="w-full h-2 bg-linear-to-b from-primary to-accent rounded-[10px]"
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
      
        </>
      )}
    </section>
  );
}
