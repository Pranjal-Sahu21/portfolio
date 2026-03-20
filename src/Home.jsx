import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Home.css";

export default function Home() {
  const firstName = "PRANJAL".split("");
  const lastName = "SAHU".split("");

  const canvasRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
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

    const numStars = 15;
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

    let shootingStar = null;
    let nextShootTime = Date.now() + Math.random() * 4000 + 2000;

    function spawnShootingStar() {
      const fromLeft = Math.random() < 0.5;

      shootingStar = {
        x: fromLeft ? -100 : width + 100,
        y: -100,
        vx: fromLeft ? 5 : -5,
        vy: 5,
        length: 250,
        life: 0,
        maxLife: 300,
      };
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

      if (shootingStar) {
        const { x, y, vx, vy, length, life, maxLife } = shootingStar;

        const opacity = 1 - life / maxLife;

        const trailEndX = x - vx * length;
        const trailEndY = y - vy * length;
        const gradient = ctx.createLinearGradient(x, y, trailEndX, trailEndY);
        gradient.addColorStop(0, `rgba(255,255,255,${opacity})`);
        gradient.addColorStop(0.3, `rgba(255,255,255,${opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(255,255,255,0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(trailEndX, trailEndY);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        shootingStar.x += vx;
        shootingStar.y += vy;
        shootingStar.life += 1;

        if (shootingStar.life > maxLife) {
          shootingStar = null;
          nextShootTime = Date.now() + Math.random() * 5000 + 3000;
        }
      } else if (Date.now() > nextShootTime) {
        spawnShootingStar();
      }

      requestAnimationFrame(drawScene);
    }

    drawScene();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="heroFull" id="home">
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", // 🔥 key change
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

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
