import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import htmlLogo from "../assets/html-logo.png";
import cssLogo from "../assets/css-logo.png";
import tailwindLogo from "../assets/tailwindcss-logo.png";
import vanillaLogo from "../assets/js-logo.png";
import reactLogo from "../assets/react-logo.png";
import javaLogo from "../assets/java-logo.png";
import mySqlLogo from "../assets/mysql-logo.png";
import drizzleLogo from "../assets/drizzle-logo.png"
import nextLogo from "../assets/next-js.png"
import mongoLogo from "../assets/mongodb-logo.png";
import postmanLogo from "../assets/postman-logo.png";
import typescriptLogo from "../assets/typescript-logo.webp";

export default function Skills() {
  const allSkills = [
    { name: "HTML", img: htmlLogo },
    { name: "CSS", img: cssLogo },
    { name: "Tailwind CSS", img: tailwindLogo },
    { name: "JavaScript", img: vanillaLogo },
    { name: "TypeScript", img: typescriptLogo },
    { name: "React.js", img: reactLogo },
    { name: "Next.js", img: nextLogo },
    { name: "Java", img: javaLogo },
    {
      name: "PostgreSQL",
      img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg",
    },
    { name: "MongoDB", img: mongoLogo },
    { name: "MySQL", img: mySqlLogo },
    { name: "Prisma", img: "https://cdn.simpleicons.org/prisma/ffffff" },
    { name: "Drizzle", img: drizzleLogo },
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

  const [duration, setDuration] = useState(20);
  const [marqueeWidth, setMarqueeWidth] = useState(0);

  useEffect(() => {
    const updateDuration = () => {
      const width = window.innerWidth;
      if (width < 480) setDuration(12);
      else if (width < 768) setDuration(16);
      else setDuration(20);
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

  const getLogoScale = (img) => {
    if (img === cssLogo || img == htmlLogo || img == nextLogo || img == vanillaLogo || img == javaLogo) return "scale-[1.25]";
    if (img === mySqlLogo || img === tailwindLogo || img == drizzleLogo || img == postmanLogo || img == mongoLogo) return "scale-120";
    return "";
  };

  return (
    <section id="skills" className="min-h-[100dvh] flex flex-col justify-center items-center py-10 px-5 text-center">
      <motion.h2
        ref={headingRef}
        className="shimmer-text font-syne font-bold mb-12 text-[clamp(2rem,4vw,3rem)]"
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
        className="hidden lg:grid mt-6 grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-8 w-full max-w-[1200px] justify-items-center"
      >
        {allSkills.map((s, i) => (
          <div 
            className="w-[140px] h-[160px] flex flex-col justify-start items-center p-2.5 transition-transform duration-300 hover:scale-110 " 
            key={s.name}
            style={{ animationDelay: i % 2 === 0 ? '0.2s' : '0.6s' }}
          >
            <div className="w-16 h-16 flex justify-center items-center mb-2.5">
              <img
                src={s.img}
                alt={s.name}
                className={`w-full h-full object-contain ${getLogoScale(s.img)}`}
              />
            </div>
            <p className="text-[1rem] text-muted-text text-center">{s.name}</p>
          </div>
        ))}
      </motion.div>

      <div className="flex lg:hidden flex-col gap-12 overflow-hidden w-full mt-8">
        <div className="relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <motion.div
            className="flex gap-12"
            animate={{ x: [0, -marqueeWidth] }}
            transition={{ repeat: Infinity, duration, ease: "linear" }}
            ref={leftMarqueeRef}
          >
            {marqueeGroup1.map((s, i) => (
              <div 
                className="inline-flex flex-col items-center mr-6" 
                key={i}
                style={{ animationDelay: i % 2 === 0 ? '0.2s' : '0.6s' }}
              >
                <div className="flex justify-center items-center mb-2.5">
                  <img 
                    src={s.img} 
                    alt={s.name} 
                    className={`w-[50px] h-[50px] object-contain ${getLogoScale(s.img)}`} 
                  />
                </div>
                <p className="text-[1rem] text-muted-text font-medium text-center">{s.name}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <motion.div
            className="flex gap-12"
            animate={{ x: [-marqueeWidth, 0] }}
            transition={{ repeat: Infinity, duration, ease: "linear" }}
            ref={rightMarqueeRef}
          >
            {marqueeGroup2.map((s, i) => (
              <div 
                className="inline-flex flex-col items-center mr-6 " 
                key={i + "right"}
                style={{ animationDelay: i % 2 === 0 ? '0.2s' : '0.6s' }}
              >
                <div className="flex justify-center items-center mb-2.5">
                  <img 
                    src={s.img} 
                    alt={s.name} 
                    className={`w-[50px] h-[50px] object-contain ${getLogoScale(s.img)}`} 
                  />
                </div>
                <p className="text-[1rem] text-muted-text font-medium text-center">{s.name}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
