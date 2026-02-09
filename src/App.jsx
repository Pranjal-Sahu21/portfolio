import { useEffect, useRef } from "react";
import Header from "./Header";
import Home from "./Home";
import Journey from "./Journey";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./style.css";

export default function App() {
  const dot = document.querySelector(".cursor-dot");
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  let dotX = 0,
    dotY = 0;

  const delay = 0.06;
  const offsetX = -6;
  const offsetY = -2;

  window.addEventListener("load", () => {
    dotX = window.innerWidth / 2;
    dotY = window.innerHeight / 2;
    dot.style.left = dotX + "px";
    dot.style.top = dotY + "px";
  });

  window.addEventListener("scroll", () => {
    dot.classList.remove("button");
    dot.textContent = "";
  });

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX + offsetX;
    targetY = e.clientY + offsetY;
    dot.classList.add("show");
  });

  window.addEventListener("mouseout", () => {
    dot.classList.remove("show");
  });

  function follow() {
    dotX += (targetX - dotX) * delay;
    dotY += (targetY - dotY) * delay;

    dot.style.left = dotX + "px";
    dot.style.top = dotY + "px";

    requestAnimationFrame(follow);
  }

  follow();

  document.addEventListener(
    "mouseenter",
    (e) => {
      if (e.target.closest(".project-card-3d")) {
        dot.classList.add("button", "show");
        dot.textContent = "🡕";
      }
    },
    true
  );

  document.addEventListener(
    "mouseleave",
    (e) => {
      if (e.target.closest(".project-card-3d")) {
        dot.classList.remove("button");
        dot.textContent = "";
      }
    },
    true
  );

  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".project-card-3d");
    if (card) {
      dot.classList.add("button");
      dot.textContent = "🡕";
    } else {
      dot.classList.remove("button");
      dot.textContent = "";
    }
  });

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
      { threshold: 0.1 }
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

  return (
    <>
      <Header />
      <Home />
      <Journey />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
