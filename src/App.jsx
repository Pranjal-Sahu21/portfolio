import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Home from "./Home";
import Journey from "./Journey";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import DotGrid from "./components/DotGrid/DotGrid";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./index.css";
import Loader from "./Loader";
import { AnimatePresence } from "framer-motion";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const dotRef = useRef(null);

  useEffect(() => {
    const dot = document.querySelector(".cursor-dot");
    if (!dot) return;
    dotRef.current = dot;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = window.innerWidth / 2;
    let dotY = window.innerHeight / 2;

    const delay = 0.08;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.classList.add("show");

      const card = e.target.closest(".project-card-3d");
      const clickable = e.target.closest("a, button, input[type='submit'], input[type='button'], .cursor-pointer");

      if (card) {
        dot.classList.add("button");
        dot.classList.remove("scale-150");
        dot.textContent = "🡕";
      } else if (clickable) {
        dot.classList.add("scale-150");
        dot.classList.remove("button");
        dot.textContent = "";
      } else {
        dot.classList.remove("button", "scale-150");
        dot.textContent = "";
      }
    };

    const handleMouseOut = () => {
      dot.classList.remove("show");
    };

    const handleScroll = () => {
      dot.classList.remove("button");
      dot.textContent = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("scroll", handleScroll);

    let animationId;
    const follow = () => {
      dotX += (targetX - dotX) * delay;
      dotY += (targetY - dotY) * delay;

      dot.style.left = dotX + "px";
      dot.style.top = dotY + "px";

      animationId = requestAnimationFrame(follow);
    };

    follow();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, [showContent]);

  const lenisRef = useRef(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    lenisRef.current = new Lenis({
      duration: 1.2,
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 },
    );
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 80;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", onScroll);

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        if (targetId && lenisRef.current) {
          lenisRef.current.scrollTo(targetId);
        }
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);

    setTimeout(() => {
      setShowContent(true);
    }, 5000);
  }, []);
  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <div className={`min-h-screen w-full relative bg-black ${!showContent ? 'h-screen overflow-hidden' : ''}`}>
        <div className="fixed inset-0 z-0 pointer-events-auto">
          <DotGrid 
            activeColor="#d6d4d4ff" 
            baseColor="#333333" 
            dotSize={2} 
          />
        </div>
        <div className="relative z-10">
          <Header />
          <Home showContent={showContent} />
          <Journey />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
        </div>
      </div>
    </>
  );
}
