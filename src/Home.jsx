import { motion } from "framer-motion";
import "./Home.css";

export default function Home() {
  const firstName = "PRANJAL".split("");
  const lastName = "SAHU".split("");


  return (
    <section className="heroFull" id="home">

      {/* NAME */}
      <div className="heroFull-name">
        {/* FIRST LINE */}
        <motion.div className="heroFull-line">
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
              className="heroFull-letter"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* SECOND LINE */}
        <motion.div className="heroFull-line hero-title">
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
              className="heroFull-letter"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <motion.h2
        className="heroFull-role"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Web Developer
      </motion.h2>

      {/* DESCRIPTION */}
      <motion.p
        className="heroFull-desc"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Crafting fast, interactive, and visually engaging web experiences using
        modern technologies and thoughtful design.
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        className="heroFull-actions"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <a
          href="https://drive.google.com/file/d/1q5mTs7bpgy_7DQ4ctRGj9U4rFr3NLjMQ/view"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          Download CV
        </a>

        <a href="#contact" className="btn-secondary">
          Contact Me
        </a>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <span className="scroll-text">Scroll</span>

        <div className="scroll-line">
          <motion.div
            className="scroll-dot"
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
