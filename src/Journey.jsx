import "./style.css";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Journey() {
  const journeyData = [
    {
      title: "National Institute Of Technology, Rourkela",
      details: ["B.Tech in Computer Science & Engineering", "(2024 - Present)"],
      grade: ["CGPA - 8.48"],
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
    <section id="journey" className="section">
      <motion.h2
        ref={headingRef}
        initial={{ opacity: 0, y: 80 }}
        animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="heading"
      >
        My Journey
      </motion.h2>

      <div className="journey-container" ref={timelineRef}>
        {journeyData.map((journey, index) => {
          const cardRef = useRef(null);
          const isCardInView = useInView(cardRef, {
            once: true,
            margin: "-30% 0px",
          });

          return (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>

              <motion.div
                ref={cardRef}
                className={`journey-card ${index % 2 === 0 ? "left" : "right"}`}
                variants={cardVariants(index)}
                initial="hidden"
                animate={isCardInView ? "visible" : "hidden"}
              >
                <h3 className="journey-title">{journey.title}</h3>
                {journey.details.map((line, i) => (
                  <p
                    className="journey-desc"
                    style={{ color: "#8f8b8bff" }}
                    key={i}
                  >
                    {line}
                  </p>
                ))}
                {journey.grade.map((line, i) => (
                  <p className="journey-grade" key={i}>
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
