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
import clogo from "../assets/C.svg";

export default function Skills() {
  const { theme } = useTheme();

  const categories = [
    {
      title: "Languages",
      index: "01",
      tagline: "Syntax & Logic",
      gridClass: "md:col-span-5",
      skillsGridClass: "grid-cols-2",
      skills: [
        { name: "JavaScript", img: vanillaLogo },
        { name: "TypeScript", img: typescriptLogo },
        { name: "Java", img: javaLogo },
        { name: "C", img: clogo },
        {
          name: "Python",
          img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
        },
      ],
    },
    {
      title: "Frontend & Design",
      index: "02",
      tagline: "Interfaces & UX",
      gridClass: "md:col-span-7",
      skillsGridClass: "grid-cols-2 sm:grid-cols-3",
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
      index: "03",
      tagline: "APIs & Architecture",
      gridClass: "md:col-span-7",
      skillsGridClass: "grid-cols-2 sm:grid-cols-3",
      skills: [
        {
          name: "Node.js",
          img: `https://cdn.simpleicons.org/nodedotjs/${theme === "dark" ? "ffffff" : "000000"}`,
        },
        {
          name: "Express.js",
          img: `https://cdn.simpleicons.org/express/${theme === "dark" ? "ffffff" : "000000"}`,
        },
        {
          name: "PostgreSQL",
          img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg",
        },
        { name: "MySQL", img: mySqlLogo },
        { name: "MongoDB", img: mongoLogo },
      ],
    },
    {
      title: "Tools & DevOps",
      index: "04",
      tagline: "Workflows & Infrastructure",
      gridClass: "md:col-span-5",
      skillsGridClass: "grid-cols-2",
      skills: [
        { name: "Git", img: "https://cdn.simpleicons.org/git/f05032" },
        { name: "Docker", img: "https://cdn.simpleicons.org/docker/2496ed" },
        {
          name: "Prisma",
          img: `https://cdn.simpleicons.org/prisma/${theme === "dark" ? "ffffff" : "000000"}`,
        },
        { name: "Drizzle", img: drizzleLogo },
        { name: "Postman", img: postmanLogo },
      ],
    },
  ];

  const getSkillHoverText = (name) => {
    switch (name) {
      case "React.js":
        return "React.js: writing HTML inside JS because why not?";
      case "JavaScript":
        return "JavaScript: where 1 + '1' is '11' and [] + [] is ''.";
      case "TypeScript":
        return "TypeScript: helping me find bugs before production does.";
      case "Java":
        return "Java: public static void main(String[] args)... typing this is a workout.";
      case "C":
        return "C: pointers still give me nightmares sometimes.";
      case "Python":
        return "Python: import antigravity; (Go ahead, try it in your Python shell!)";
      case "HTML":
        return "HTML: yes, it is a programming language (please don't fight me).";
      case "CSS":
        return "CSS: centering a div is my core superpower.";
      case "Tailwind CSS":
        return "Tailwind CSS: because writing index.css files is so last year.";
      case "Next.js":
        return "Next.js: SSR, SSG, ISR... so many letters, but it's great.";
      case "Node.js":
        return "Node.js: running JavaScript outside the browser since 2009.";
      case "Express.js":
        return "Express.js: making server routing look simple.";
      case "PostgreSQL":
        return "PostgreSQL: the database that never breaks under pressure.";
      case "MySQL":
        return "MySQL: the classic database that just gets the job done.";
      case "MongoDB":
        return "MongoDB: storing JSON files directly because schemas are overrated.";
      case "Git":
        return "Git: commit -m 'fixed bugs' is my life story.";
      case "Docker":
        return "Docker: 'But it worked on my machine!' 'Then we'll ship your machine!'";
      case "Prisma":
        return "Prisma: making database queries look like clean TypeScript.";
      case "Drizzle":
        return "Drizzle: type-safe SQL queries without the heavy overhead.";
      case "Postman":
        return "Postman: where I spend hours waiting for a 200 OK.";
      default:
        return `I have coding experience with ${name}!`;
    }
  };

  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });

  return (
    <section
      id="skills"
      className="flex flex-col justify-center items-center py-20 px-5 text-center relative overflow-hidden"
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />

      <motion.h2
        ref={headingRef}
        className="shimmer-text font-syne font-bold mb-16 text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 40 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Skills & Expertise
      </motion.h2>

      <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left px-4">
        {categories.map((category, idx) => {
          const categoryRef = useRef(null);
          const isCategoryInView = useInView(categoryRef, {
            once: true,
            amount: 0.15,
          });

          return (
            <motion.div
              ref={categoryRef}
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              animate={
                isCategoryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
              }
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 20,
                delay: idx * 0.1,
              }}
              className={`flex flex-col bg-input-bg/90 border border-primary/10 dark:border-primary/15 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg transition-all duration-500 hover:border-primary/20 relative overflow-hidden group/card ${category.gridClass}`}
            >
              {/* Category Header */}
              <div className="flex flex-col gap-1 border-b border-primary/10 pb-4 mb-6">
                <div className="flex gap-3 items-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <h3 className="text-primary font-syne font-bold text-xl md:text-2xl mt-1 tracking-tight">
                    {category.title}
                  </h3>
                </div>
              </div>

              {/* Skills Grid */}
              <div
                className={`grid gap-3.5 w-full ${category.skillsGridClass}`}
              >
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group/skill flex items-center gap-3 bg-bg/50 dark:bg-input-bg/40 border border-primary/10 dark:border-primary/5 rounded-xl px-4 py-2.5 sm:py-3 shadow-xs select-none w-full"
                    data-hover-text={getSkillHoverText(skill.name)}
                  >
                    <div className="w-5 h-5 flex items-center justify-center relative flex-shrink-0">
                      <img
                        src={skill.img}
                        alt={skill.name}
                        className="w-5 h-5 object-contain !grayscale transition-all duration-300 group-hover/skill:!grayscale-0"
                      />
                    </div>
                    <span className="text-primary font-space font-medium text-sm truncate">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
