import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import voltMart from "../assets/voltmart.png";
import resuscope from "../assets/ResuScope.png";
import cheeType from "../assets/cheetype.png";
import tasteGpt from "../assets/tastegpt.png";
import crexo from "../assets/crexo-image.png";
import dummistore from "../assets/dummistore-image.png";
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
      title: "DummiStore",
      img: dummistore,
      link: "https://dummistore.netlify.app",
      desc: "Free product API with endpoints for all products, categories, and single items. No authentication needed.",
    },
    {
      title: "Voltmart",
      img: voltMart,
      link: "https://voltmart.netlify.app",
      desc: "A quick-commerce web app (using DummiStore API) with persistent cart/orders/address storage.",
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
  ];

  const marqueeProjects = [...projects, ...projects];

  const [isMobile, setIsMobile] = useState(false);

  const NextArrow = ({ onClick }) => (
    <div onClick={onClick} className="absolute top-1/2 -translate-y-1/2 z-10 w-[42px] h-[42px] flex items-center justify-center bg-card-bg rounded-full cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all duration-200 right-[-10px] md:right-[6px] text-primary">
      <ChevronRight size={18} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div onClick={onClick} className="absolute top-1/2 -translate-y-1/2 z-10 w-[42px] h-[42px] flex items-center justify-center bg-card-bg rounded-full cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all duration-200 left-[-10px] md:left-[6px] text-primary">
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
    <section id="projects" className="min-h-[100svh] flex flex-col justify-center items-center py-[120px] px-5 overflow-hidden relative text-center">
      <motion.h1
        ref={ref}
        className="shimmer-text font-syne font-bold mb-[68px] text-[clamp(2rem,4vw,3rem)]"
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

      <div className="w-full mt-12 relative overflow-visible md:overflow-hidden perspective-[1500px] md:transform md:-rotate-5 before:hidden md:before:block before:content-[''] before:absolute before:top-0 before:left-0 before:w-[10%] before:h-full before:z-[2] before:pointer-events-none before:bg-gradient-to-r before:from-black before:to-transparent after:hidden md:after:block after:content-[''] after:absolute after:top-0 after:right-0 after:w-[10%] after:h-full after:z-[2] after:pointer-events-none after:bg-gradient-to-l after:from-black after:to-transparent" viewport={{ once: true, amount: 0.3 }}>
        {/* DESKTOP MARQUEE */}
        {!isMobile && (
          <motion.div
            className="flex w-max gap-4"
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
                className="flex-[0_0_80%] md:flex-[0_0_90%] max-w-[500px] h-auto aspect-[5/4] bg-[#181818]/90 rounded-2xl p-4 text-center text-white transform rotate-y-40 rotate-x-30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-transform duration-300 ml-[-84px] hover:cursor-none no-underline block project-card-3d"
                style={{ transform: "rotateY(40deg) rotateX(30deg)" }}
              >
                <img src={p.img} alt={p.title} className="w-full object-cover rounded-lg" />
                <h2 className="mt-4 text-[1.4rem] font-syne font-bold shimmer-text">{p.title}</h2>
                <p className="mt-3 text-[0.9rem] leading-[1.625] text-muted-text">{p.desc}</p>
              </a>
            ))}
          </motion.div>
        )}

        {/* MOBILE SLICK SLIDER */}
        {isMobile && (
          <div className="block opacity-100 transform-none h-auto overflow-visible">
            <Slider {...sliderSettings}>
              {projects.map((p, i) => (
                <div key={i} className="flex justify-center p-2">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-[480px] md:max-w-[320px] mx-auto h-[368px] sm:h-[390px] bg-[#181818]/65 rounded-2xl p-3 sm:p-5 transition-all duration-300 no-underline shadow-[0_0_12px_rgba(0,0,0,0.6)] project-card-3d"
                  >
                    <img src={p.img} alt={p.title} className="w-full h-[180px] object-cover rounded-xl" />
                    <h2 className="mt-6 text-lg font-syne font-bold shimmer-text">{p.title}</h2>
                    <p className="mt-3 text-[0.9rem] leading-[1.4] text-muted-text">{p.desc}</p>
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
