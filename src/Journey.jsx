import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Journey() {
  const journeyData = [
    {
      title: "National Institute Of Technology, Rourkela",
      details: ["B.Tech in Computer Science & Engineering", "(2024 - Present)"],
      grade: ["CGPA - 8.61"],
    },
    {
      title: "SAI International School, Bhubaneswar",
      details: ["12th Boards", "(2022 - 2024)"],
      grade: ["Grade: 92.2%"],
    },
    {
      title: "Vikash Convent School, Karanjia",
      details: ["10th Boards", "(2021 - 2022)"],
      grade: ["Grade: 96.2%"],
    },
  ];

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.3 });

  const timelineRef = useRef(null);
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
    <section id="journey" className="min-h-[100svh] flex flex-col justify-center items-center pt-[120px] pb-10 px-5 overflow-hidden relative text-center">
      <motion.h2
        ref={headingRef}
        initial={{ opacity: 0, y: 80 }}
        animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="shimmer-text mb-[68px] font-syne font-bold text-[clamp(2rem,4vw,3rem)]"
      >
        My Journey
      </motion.h2>

      <div className="relative flex flex-col gap-[40px] md:gap-[60px] w-full max-w-[1024px] mx-auto mt-6 before:content-[''] before:absolute before:left-[12px] md:before:left-1/2 before:-translate-x-0 md:before:-translate-x-1/2 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 before:rounded-sm" ref={timelineRef}>
        {journeyData.map((journey, index) => {
          const cardRef = useRef(null);
          const isCardInView = useInView(cardRef, {
            once: true,
            margin: "-30% 0px",
          });

          return (
            <div key={index} className="relative w-full">
              <div className="absolute left-[4px] md:left-1/2 translate-x-0 md:-translate-x-1/2 w-5 h-5 bg-primary rounded-full border-4 border-bg z-10"></div>

              <motion.div
                ref={cardRef}
                className={`relative w-[calc(100%-20px)] md:w-[49%] bg-input-bg/90 rounded-[10px] shadow-md text-left p-[15px] md:p-5 transition-transform duration-300 hover:scale-[1.02] ml-[24px] ${index % 2 === 0 ? "md:ml-0 md:self-start" : "md:ml-auto md:self-end"}`}
                variants={cardVariants(index)}
                initial="hidden"
                animate={isCardInView ? "visible" : "hidden"}
              >
                <h3 className="font-syne font-medium text-[1.1rem] md:text-[1.25rem] xl:text-[1.2rem] mb-[15px] md:mb-6">{journey.title}</h3>
                {journey.details.map((line, i) => (
                  <p
                    className="text-[#8f8b8bff] text-[0.8rem] md:text-[0.9rem] xl:text-[0.85rem] leading-[1.4] md:leading-[1.6]"
                    key={i}
                  >
                    {line}
                  </p>
                ))}
                {journey.grade.map((line, i) => (
                  <p className="mt-6 text-[0.8rem] md:text-[0.9rem] xl:text-[0.85rem]" key={i}>
                    {line}
                  </p>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
