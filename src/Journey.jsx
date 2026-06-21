import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import nitRourkelaImg from "../assets/nit_rourkela.png";
import saiSchoolImg from "../assets/sai_school.jpg";
import vikashSchoolImg from "../assets/vikash_school.jpg";

export default function Journey() {
  const journeyData = [
    {
      title: "National Institute Of Technology, Rourkela",
      details: ["B.Tech in Computer Science & Engineering", "(2024 - Present)"],
      grade: ["CGPA - 8.61"],
      hoverText: "I am currently studying Computer Science here!",
      image: nitRourkelaImg,
      locationUrl: "https://maps.google.com/?q=National+Institute+of+Technology+Rourkela",
    },
    {
      title: "SAI International School, Bhubaneswar",
      details: ["12th Boards", "(2022 - 2024)"],
      grade: ["Grade: 92.2%"],
      hoverText: "I completed my senior secondary schooling here!",
      image: saiSchoolImg,
      locationUrl: "https://maps.google.com/?q=SAI+International+School+Bhubaneswar",
    },
    {
      title: "Vikash Convent School, Karanjia",
      details: ["10th Boards", "(2021 - 2022)"],
      grade: ["Grade: 96.2%"],
      hoverText: "I did my matriculation schooling here!",
      image: vikashSchoolImg,
      locationUrl: "https://maps.google.com/?q=Vikash+Convent+School+Karanjia",
    },
  ];

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.3 });

  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDriving, setIsDriving] = useState(false);
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (timelineInView) {
      setHasAnimated(true);
      setIsDriving(true);
      const timer = setTimeout(() => {
        setIsDriving(false);
      }, 2500); // 2.5s matches transition duration
      return () => clearTimeout(timer);
    }
  }, [timelineInView]);

  const cardVariants = (index) => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      y: 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        opacity: { duration: 0.8, ease: "easeInOut" },
      },
    },
  });

  return (
    <section id="journey" className="flex flex-col justify-center items-center pt-[120px] pb-10 px-5 overflow-hidden relative text-center">
      <motion.h2
        ref={headingRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="shimmer-text mb-[68px] font-syne font-bold text-[clamp(2rem,4vw,3rem)]"
      >
        My Journey
      </motion.h2>

      <div 
        className="relative flex flex-col gap-[40px] md:gap-[60px] w-full max-w-[1024px] mx-auto mt-6 before:content-[''] before:absolute before:left-[14px] md:before:left-1/2 before:-translate-x-1/2 before:top-0 before:bottom-0 before:w-4 before:bg-neutral-200 dark:before:bg-neutral-800 before:border before:border-primary/10 before:rounded-full after:content-[''] after:absolute after:left-[14px] md:after:left-1/2 after:-translate-x-1/2 after:top-0 after:bottom-0 after:w-0 after:border-l-[2px] after:border-dashed after:border-neutral-400 dark:after:border-neutral-600 after:opacity-80" 
        ref={timelineRef}
      >
        {/* Animated Space Rover Car */}
        <motion.div
          className="absolute left-[14px] md:left-1/2 z-20 pointer-events-none"
          initial={{ top: "100%" }}
          animate={hasAnimated ? { top: "24px" } : { top: "100%" }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
          }}
          style={{
            x: "-50%",
            y: "-50%",
          }}
        >
          <svg
            width="28"
            height="36"
            viewBox="0 0 32 40"
            className={`text-primary fill-bg ${isDriving ? "animate-rover" : ""}`}
            style={{ overflow: "visible" }}
          >
            {/* Wheels */}
            <rect x="1" y="6" width="4" height="8" rx="1.5" fill="var(--primary)" stroke="var(--bg)" strokeWidth="1" />
            <rect x="27" y="6" width="4" height="8" rx="1.5" fill="var(--primary)" stroke="var(--bg)" strokeWidth="1" />
            <rect x="1" y="26" width="4" height="8" rx="1.5" fill="var(--primary)" stroke="var(--bg)" strokeWidth="1" />
            <rect x="27" y="26" width="4" height="8" rx="1.5" fill="var(--primary)" stroke="var(--bg)" strokeWidth="1" />
            
            {/* Wheel Axles */}
            <line x1="5" y1="10" x2="27" y2="10" stroke="var(--bg)" strokeWidth="2" />
            <line x1="5" y1="30" x2="27" y2="30" stroke="var(--bg)" strokeWidth="2" />
            
            {/* Main Chassis */}
            <rect x="5" y="4" width="22" height="32" rx="4" fill="var(--primary)" stroke="var(--bg)" strokeWidth="2" />
            
            {/* Cabin/Visor */}
            <rect x="9" y="10" width="14" height="12" rx="2" fill="var(--bg)" stroke="var(--primary)" strokeWidth="1" />
            <rect x="10" y="12" width="12" height="8" rx="1" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
            
            {/* Astronaut head inside cabin */}
            <circle cx="16" cy="16" r="3" fill="var(--primary)" stroke="var(--bg)" strokeWidth="1.5" />
            <rect x="14" y="15" width="4" height="2" rx="0.5" fill="var(--bg)" />
            
            {/* Rear Spoiler / Solar Panel */}
            <rect x="8" y="32" width="16" height="3" rx="1" fill="var(--primary)" stroke="var(--bg)" strokeWidth="1" />
            
            {/* Antenna */}
            <line x1="22" y1="8" x2="24" y2="5" stroke="var(--bg)" strokeWidth="1.5" />
            <circle cx="24" cy="5" r="1" fill="var(--bg)" />
          </svg>
        </motion.div>
        {journeyData.map((journey, index) => {
          const cardRef = useRef(null);
          const isCardInView = useInView(cardRef, {
            once: true,
            margin: "-30% 0px",
          });
          const isActive = journey.details.some((d) =>
            d.toLowerCase().includes("present")
          );

          return (
            <div key={index} className="relative w-full">
              <div className="absolute left-[14px] md:left-1/2 -translate-x-1/2 -translate-y-1/2 top-[24px] z-10 flex items-center justify-center w-8 h-8">
                <MapPin size={22} className="text-primary fill-bg" />
                {isActive && (
                  <span className="absolute w-6 h-6 rounded-full bg-primary opacity-40 animate-ping" />
                )}
              </div>

              <motion.div
                ref={cardRef}
                className={`relative w-[calc(100%-20px)] md:w-[49%] bg-input-bg/50 backdrop-blur-md border border-primary/10 rounded-2xl shadow-md text-left p-[15px] md:p-5 ml-[24px] ${index % 2 === 0 ? "md:ml-0 md:self-start" : "md:ml-auto md:self-end"}`}
                variants={cardVariants(index)}
                initial="hidden"
                animate={isCardInView ? "visible" : "hidden"}
                whileHover={{ scale: 1.02 }}
                data-hover-text={journey.hoverText}
              >
                {journey.image && (
                  <a
                    href={journey.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-5 overflow-hidden rounded-xl border border-primary/10 group/img relative aspect-[16/9] w-full"
                  >
                    <img
                      src={journey.image}
                      alt={journey.title}
                      className={`w-full h-full object-cover ${isActive ? '' : 'grayscale'} brightness-90 contrast-[1.05] transition-all duration-500 ease-out group-hover/img:scale-105 ${isActive ? '' : 'group-hover/img:grayscale-0'} group-hover/img:brightness-100`}
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/5 transition-colors duration-500" />
                  </a>
                )}
                <h3 className="font-syne font-medium text-[1.1rem] md:text-[1.25rem] xl:text-[1.2rem] mb-[15px] md:mb-6">{journey.title}</h3>
                {journey.details.map((line, i) => (
                  <p
                    className="text-[#8f8b8bff] text-[0.8rem] md:text-[0.9rem] xl:text-[0.85rem] leading-[1.4] md:leading-[1.6]"
                    key={i}
                  >
                    {line}
                  </p>
                ))}
                {journey.grade.map((line, i) => {
                  let funnyText = "Not bad, right?";
                  if (line.includes("8.61")) {
                    funnyText = "I know it's less, but CSE is hard!";
                  } else if (line.includes("92.2%")) {
                    funnyText = "Chemistry stole my marks!";
                  } else if (line.includes("96.2%")) {
                    funnyText = "My peak academic performance!";
                  }
                  return (
                    <div className="mt-4 flex" key={i}>
                      <span 
                        className="bg-primary/10 text-primary border border-primary/20 text-[0.75rem] md:text-[0.8rem] font-space font-medium px-3 py-1 rounded-full shadow-xs cursor-help"
                        data-hover-text={funnyText}
                      >
                        {line}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
