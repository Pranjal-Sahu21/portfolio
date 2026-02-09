import "./style.css";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import voltMart from "../assets/voltmart.png";
import resuscope from "../assets/ResuScope.png";
import cheeType from "../assets/cheetype.png";
import tasteGpt from "../assets/tastegpt.png";
import skyLune from "../assets/skylune.png";
import crexo from "../assets/crexo-image.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const projects = [
    {
      title: "Crexo",
      img: crexo,
      link: "https://crexo.netlify.app",
      desc: "AI image generation platform powered by Clipdrop AI, with integrated Razorpay payments for credit-based generation.",
    },
    {
      title: "Voltmart",
      img: voltMart,
      link: "https://voltmart.netlify.app",
      desc: "A quick-commerce web app with smooth navigation and persistent cart/orders/address storage.",
    },
    {
      title: "ResuScope",
      img: resuscope,
      link: "https://resuscope.netlify.app",
      desc: "An AI-powered resume analyzer that evaluates resume-job fit and provides personalized improvement tips.",
    },
    {
      title: "CheeType",
      img: cheeType,
      link: "https://cheetype.netlify.app",
      desc: "An interactive typing test that tracks speed and accuracy in real-time, with customisable test lengths.",
    },
    {
      title: "TasteGPT",
      img: tasteGpt,
      link: "https://tastegpt.netlify.app",
      desc: "Recommends a single recipe based on user-provided ingredients with dark/light mode integration.",
    },
    {
      title: "SkyLune",
      img: skyLune,
      link: "https://skylune.netlify.app",
      desc: "A simple weather app delivering current conditions and a 4-day forecast with live location tracking.",
    },
  ];

  const marqueeProjects = [...projects, ...projects];

  const [isMobile, setIsMobile] = useState(false);

  const NextArrow = ({ onClick }) => (
    <div onClick={onClick} className="slick-arrow-btn slick-next-btn">
      <ChevronRight size={18} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div onClick={onClick} className="slick-arrow-btn slick-prev-btn">
      <ChevronLeft size={18} />
    </div>
  );

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",

    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,

    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="projects" className="section projects-section">
      <motion.h1
        ref={ref}
        className="heading"
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      >
        Featured Projects
      </motion.h1>

      <div className="marquee-wrapper" viewport={{ once: true, amount: 0.3 }}>
        {/* DESKTOP MARQUEE */}
        {!isMobile && (
          <motion.div
            className="marquee desktop-marquee"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: window.innerWidth <= 1024 ? 20 : 40,
            }}
          >
            {marqueeProjects.map((p, i) => (
              <a
                href={p.link}
                key={i}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-3d"
              >
                <img src={p.img} alt={p.title} />
                <h2 className="project-title">{p.title}</h2>
                <p className="project-desc">{p.desc}</p>
              </a>
            ))}
          </motion.div>
        )}

        {/* MOBILE SLICK SLIDER */}
        {isMobile && (
          <div className="mobile-slick-visible">
            <Slider {...sliderSettings}>
              {projects.map((p, i) => (
                <div key={i}>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card"
                  >
                    <img src={p.img} alt={p.title} />
                    <h2 className="project-title">{p.title}</h2>
                    <p className="project-desc">{p.desc}</p>
                  </a>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
}
