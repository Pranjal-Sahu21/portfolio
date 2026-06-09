import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "./context/ThemeContext";

import htmlLogo from "../assets/html-logo.png";
import cssLogo from "../assets/css-logo.png";
import tailwindLogo from "../assets/tailwindcss-logo.png";
import vanillaLogo from "../assets/js-logo.png";
import reactLogo from "../assets/react-logo.png";
import javaLogo from "../assets/java-logo.png";
import mySqlLogo from "../assets/mysql-logo.png";
import drizzleLogo from "../assets/drizzle-logo.png";
import nextLogo from "../assets/next-js.png";
import mongoLogo from "../assets/mongodb-logo.png";
import postmanLogo from "../assets/postman-logo.png";
import typescriptLogo from "../assets/typescript-logo.webp";

export default function Skills() {
  const { theme } = useTheme();
  
  const categories = [
    {
      title: "Languages",
      skills: [
        { name: "JavaScript", img: vanillaLogo },
        { name: "TypeScript", img: typescriptLogo },
        { name: "Java", img: javaLogo },
        { name: "C++", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg" },
        { name: "Python", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
      ],
    },
    {
      title: "Frontend & Design",
      skills: [
        { name: "HTML", img: htmlLogo },
        { name: "CSS", img: cssLogo },
        { name: "Tailwind CSS", img: tailwindLogo },
        { name: "React.js", img: reactLogo },
        { name: "Next.js", img: nextLogo },
      ],
    },
    {
      title: "Backend & Databases",
      skills: [
        { name: "Node.js", img: `https://cdn.simpleicons.org/nodedotjs/${theme === "dark" ? "ffffff" : "000000"}` },
        { name: "Express.js", img: `https://cdn.simpleicons.org/express/${theme === "dark" ? "ffffff" : "000000"}` },
        { name: "PostgreSQL", img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" },
        { name: "MySQL", img: mySqlLogo },
        { name: "MongoDB", img: mongoLogo },
      ],
    },
    {
      title: "Tools & DevOps",
      skills: [
        { name: "Git", img: "https://cdn.simpleicons.org/git/f05032" },
        { name: "Docker", img: "https://cdn.simpleicons.org/docker/2496ed" },
        { name: "Prisma", img: `https://cdn.simpleicons.org/prisma/${theme === "dark" ? "ffffff" : "000000"}` },
        { name: "Drizzle", img: drizzleLogo },
        { name: "Postman", img: postmanLogo },
      ],
    },
  ];

  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });

  return (
    <section id="skills" className="min-h-[100dvh] flex flex-col justify-center items-center py-20 px-5 text-center relative overflow-hidden">
      <motion.h2
        ref={headingRef}
        className="shimmer-text font-syne font-bold mb-16 text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 80 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        Skills & Expertise
      </motion.h2>

      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left px-4">
        {categories.map((category, idx) => {
          const categoryRef = useRef(null);
          const isCategoryInView = useInView(categoryRef, { once: true, amount: 0.15 });

          return (
            <motion.div
              ref={categoryRef}
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isCategoryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: idx * 0.1 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-primary font-syne font-bold text-lg md:text-xl border-b border-primary/10 pb-2.5 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {category.title}
              </h3>
              <div className="flex flex-wrap sm:flex-col gap-3 w-full">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ scale: 1.03, x: 4 }}
                    className="flex items-center gap-3 bg-input-bg/40 border border-primary/5 hover:border-primary/20 rounded-xl px-4 py-2.5 sm:py-3 shadow-xs select-none transition-all duration-300 w-auto sm:w-full"
                  >
                    <img
                      src={skill.img}
                      alt={skill.name}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-primary font-space font-medium text-sm">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
