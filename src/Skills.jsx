import "./style.css";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import htmlLogo from "../assets/html-logo.png";
import cssLogo from "../assets/css-logo.png";
import tailwindLogo from "../assets/tailwindcss-logo.png";
import vanillaLogo from "../assets/js-logo.png";
import reactLogo from "../assets/react-logo.png";
import javaLogo from "../assets/java-logo.png";
import pythonLogo from "../assets/python-logo.png";
import mySqlLogo from "../assets/mysql-logo.png";
import routerLogo from "../assets/react-router-logo.svg";
import motionLogo from "../assets/framer-motion.svg"
import mongoLogo from "../assets/mongodb-logo.png"
import postmanLogo from "../assets/postman-logo.png"

export default function Skills() {
  const allSkills = [
    { name: "HTML", img: htmlLogo },
    { name: "CSS", img: cssLogo },
    { name: "Tailwind CSS", img: tailwindLogo },
    { name: "Vanilla JS", img: vanillaLogo },
    { name: "React.js", img: reactLogo },
    {name: "Framer motion", img: motionLogo},
    {name: "React router", img: routerLogo},
    { name: "Java", img: javaLogo },
    { name: "Python", img: pythonLogo },
    { name: "MySQL", img: mySqlLogo },
    { name: "MongoDB", img: mongoLogo },
    { name: "Postman", img: postmanLogo },
  ];

  const mid = Math.ceil(allSkills.length / 2);
  const skillsGroup1 = allSkills.slice(0, mid);
  const skillsGroup2 = allSkills.slice(mid);

  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });

  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.3 });

  const leftMarqueeRef = useRef(null);
  const rightMarqueeRef = useRef(null);

  const repeatCount = 3;
  const marqueeGroup1 = Array(repeatCount).fill(skillsGroup1).flat();
  const marqueeGroup2 = Array(repeatCount).fill(skillsGroup2).flat();

  const [duration, setDuration] = useState(8);
  const [marqueeWidth, setMarqueeWidth] = useState(0);

  useEffect(() => {
    const updateDuration = () => {
      const width = window.innerWidth;
      if (width < 480) setDuration(5);
      else if (width < 768) setDuration(6.5);
      else setDuration(8);
    };
    updateDuration();
    window.addEventListener("resize", updateDuration);
    return () => window.removeEventListener("resize", updateDuration);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (leftMarqueeRef.current && rightMarqueeRef.current) {
        setMarqueeWidth(leftMarqueeRef.current.scrollWidth / 3);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <section id="skills">
      <motion.h2
        ref={headingRef}
        className="heading"
        initial={{ opacity: 0, y: 80 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        Skills & Expertise
      </motion.h2>

      <motion.div
        ref={gridRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          gridInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="skills-grid"
      >
        {allSkills.map((s) => (
          <div className="skill-item" key={s.name}>
            <div className="skill-icon">
              <img src={s.img} alt={s.name} className={s.img === motionLogo ? "motion-logo" : ""}/>
            </div>
            <p className="skill-name">{s.name}</p>
          </div>
        ))}
      </motion.div>

      <div className="marquee-container">
        <div className="marquee-fade">
          <motion.div
            className="marquee"
            animate={{ x: [0, -marqueeWidth] }}
            transition={{ repeat: Infinity, duration, ease: "linear" }}
            ref={leftMarqueeRef}
          >
            {marqueeGroup1.map((s, i) => (
              <div className="skill-item" key={i}>
                <div className="skill-icon">
                  <img src={s.img} alt={s.name} />
                </div>
                <p className="skill-name">{s.name}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="marquee-fade">
          <motion.div
            className="marquee"
            animate={{ x: [-marqueeWidth, 0] }}
            transition={{ repeat: Infinity, duration, ease: "linear" }}
            ref={rightMarqueeRef}
          >
            {marqueeGroup2.map((s, i) => (
              <div className="skill-item" key={i + "right"}>
                <div className="skill-icon">
                  <img src={s.img} alt={s.name} />
                </div>
                <p className="skill-name">{s.name}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
