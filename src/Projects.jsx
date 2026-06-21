import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import voltMart from "../assets/voltmart.png";
import cheeType from "../assets/cheetype.png";
import tasteGpt from "../assets/tastegpt.png";
import crexo from "../assets/crexo-image.png";
import dummistore from "../assets/dummistore-image.png";
import genixor from "../assets/genixor-image.png";
import devevent from "../assets/DevEvent.png"
import snip from "../assets/snip.png"

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const containerRef = useRef(null);
  const isContainerInView = useInView(containerRef, { once: true, amount: 0.15 });
  const projects = [
    {
      title: "Genixor",
      img: genixor,
      link: "https://genixor.netlify.app",
      desc: "AI-powered website generator that creates custom sites using OpenAI's Step 3.5 model for prompt enhancing and website generation.",
    },
    {
      title: "Crexo",
      img: crexo,
      link: "https://crexo.netlify.app",
      desc: "AI image generation platform powered by Clipdrop AI, with integrated Razorpay payments for credit-based generation.",
    },
    {
      title: "Snip",
      img: snip,
      link: "https://snip-xi.vercel.app",
      desc: "A modern URL shortener with Next.js, PostgreSQL, and Drizzle ORM featuring custom aliases, fast redirects, and sleek dashboards.",
    },
    {
      title: "DevEvent",
      img: devevent,
      link: "https://dev-events-bay.vercel.app",
      desc: "A Next.js web app for booking spots (using your email) at registered developer events or creating new events.",
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


  const [isMobile, setIsMobile] = useState(false);



  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="projects"
      className="min-h-screen flex flex-col justify-center items-center py-30 px-5 overflow-hidden relative text-center"
    >
      <motion.h2
        ref={ref}
        className="shimmer-text font-syne font-bold mb-17 text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Featured Projects
      </motion.h2>

      <motion.div
        ref={containerRef}
        className="w-full mt-12 relative overflow-visible md:overflow-hidden before:hidden md:before:block before:content-[''] before:absolute before:top-0 before:left-0 before:w-[10%] before:h-full before:z-2 before:pointer-events-none before:bg-linear-to-r before:from-bg before:to-transparent after:hidden md:after:block after:content-[''] after:absolute after:top-0 after:right-0 after:w-[10%] after:h-full after:z-2 after:pointer-events-none after:bg-linear-to-l after:from-bg after:to-transparent"
        initial={{ opacity: 0, y: 50 }}
        animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.15 }}
      >
        {/* DESKTOP SWIPER COVERFLOW CAROUSEL */}
        {!isMobile && (
          <div className="w-full max-w-5xl mx-auto px-5 opacity-100 transform-none h-auto overflow-visible">
            <Swiper
              effect="coverflow"
              grabCursor={true}
              slidesPerView="auto"
              centeredSlides={true}
              loop={true}
              coverflowEffect={{
                rotate: 40,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
              }}
              className="Carousal_003"
              modules={[EffectCoverflow, Pagination]}
            >
              {projects.map((p, i) => (
                <SwiperSlide key={i} className="flex justify-center rounded-2xl overflow-hidden">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/proj block w-full h-full bg-input-bg/75 rounded-2xl p-4 text-center text-light-text no-underline shadow-md border border-primary/5 transition-transform hover:scale-[1.02] duration-300"
                  >
                    <div className="overflow-hidden rounded-xl w-full h-48 relative">
                      <img
                        src={p.img}
                        alt={`Screenshot of ${p.title} — ${p.desc}`}
                        className="w-full h-full object-cover grayscale brightness-90 contrast-[1.05] transition-all duration-500 ease-out group-hover/proj:scale-105 group-hover/proj:grayscale-0 group-hover/proj:brightness-100"
                        loading="lazy"
                      />
                    </div>
                    <h2 className="mt-5 text-xl font-syne font-bold shimmer-text">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-text line-clamp-3">
                      {p.desc}
                    </p>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* MOBILE SWIPER CARDS CAROUSEL */}
        {isMobile && (
          <div className="block opacity-100 transform-none h-auto overflow-visible w-full max-w-lg px-5 mx-auto">
            <Swiper
              effect="cards"
              grabCursor={true}
              loop={true}
              pagination={{
                clickable: true,
              }}
              className="Carousal_002"
              modules={[EffectCards, Pagination]}
            >
              {projects.map((p, i) => (
                <SwiperSlide key={i} className="flex justify-center rounded-2xl overflow-hidden">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/proj block w-full h-full bg-input-bg rounded-2xl p-3.5 sm:p-5 transition-all duration-300 no-underline shadow-md project-card-3d border border-primary/5"
                  >
                    <div className="overflow-hidden rounded-xl w-full h-44 relative">
                      <img
                        src={p.img}
                        alt={`Screenshot of ${p.title} — ${p.desc}`}
                        className="w-full h-full object-cover grayscale brightness-90 contrast-[1.05] transition-all duration-500 ease-out group-hover/proj:scale-105 group-hover/proj:grayscale-0 group-hover/proj:brightness-100"
                        loading="lazy"
                      />
                    </div>
                    <h2 className="mt-4.5 text-[1.15rem] font-syne font-bold shimmer-text text-left leading-snug">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-muted-text line-clamp-3 text-left">
                      {p.desc}
                    </p>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </motion.div>
    </section>
  );
}
