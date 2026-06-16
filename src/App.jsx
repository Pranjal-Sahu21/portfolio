import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Home from "./Home";
import About from "./About";
import Journey from "./Journey";
import Skills from "./Skills";
import Projects from "./Projects";
import Activity from "./Activity";
import Contact from "./Contact";
import Footer from "./Footer";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./index.css";
import Loader from "./Loader";
import ChatBot from "./components/ChatBot";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function InnerApp() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const dotRef = useRef(null);

  useEffect(() => {
    const dot = document.querySelector(".cursor-avatar");
    if (!dot) return;
    dotRef.current = dot;

    const speechBubble = dot.querySelector(".avatar-speech");

    const scrollDialogues = [
      "Okay, it feels dizzy...",
      "Stop playing with me!",
      "Aaaah, too fast!",
      "Wheee! Stop spinning!",
      "My head is turning!",
      "Whoa, dizzy dizzy!",
      "Hold on, I'm gonna barf!",
      "I am not a fidget spinner!",
      "I'm spinning out of control!"
    ];

    const clickDialogues = [
      "Ouch!",
      "Hey, watch it!",
      "Stop squishing me!",
      "That tickles!",
      "Don't click me!",
      "Boing!",
      "Hey, that hurts!",
      "Stop poking me!",
      "Oof!",
      "Phew, keep your cursor away!"
    ];

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = window.innerWidth / 2;
    let dotY = window.innerHeight / 2;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    const delay = 0.08;

    let currentHoverText = "";
    let currentClickText = "";
    let currentScrollText = "";
    let clickTimeout;

    const updateSpeechBubble = () => {
      let activeText = "";
      if (currentClickText) {
        activeText = currentClickText;
      } else if (currentScrollText) {
        activeText = currentScrollText;
      } else if (currentHoverText) {
        activeText = currentHoverText;
      }

      if (activeText) {
        dot.classList.add("has-speech");
        if (speechBubble) speechBubble.textContent = activeText;
      } else {
        dot.classList.remove("has-speech");
      }
    };

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.classList.add("show");

      const isRightSide = e.clientX > window.innerWidth - 220 || e.target.closest(".nav-container");
      if (isRightSide) {
        dot.classList.add("speech-left");
      } else {
        dot.classList.remove("speech-left");
      }

      const card = e.target.closest(".project-card-3d");
      const clickable = e.target.closest("a, button, input[type='submit'], input[type='button'], .cursor-pointer");
      const isNav = e.target.closest(".nav-container") || e.target.closest("nav");
      const hoverTextElem = e.target.closest("[data-hover-text]");

      if (card) {
        dot.classList.add("hover-project");
        dot.classList.remove("hover-clickable");
      } else if (clickable && !isNav) {
        dot.classList.add("hover-clickable");
        dot.classList.remove("hover-project");
      } else {
        dot.classList.remove("hover-project", "hover-clickable");
      }

      // Speech bubble logic
      currentHoverText = "";
      const sectionElem = e.target.closest("[data-section]");
      const sectionId = sectionElem ? sectionElem.getAttribute("data-section") : null;

      if (hoverTextElem) {
        currentHoverText = hoverTextElem.getAttribute("data-hover-text");
      } else if (sectionId) {
        if (sectionId === "home") {
          currentHoverText = "Back to the beginning";
        } else if (sectionId === "about") {
          currentHoverText = "Get to know me a bit better";
        } else if (sectionId === "journey") {
          currentHoverText = "Explore my coding journey";
        } else if (sectionId === "skills") {
          currentHoverText = "Check out my technical skills";
        } else if (sectionId === "projects") {
          currentHoverText = "See what I have built";
        } else if (sectionId === "activity") {
          currentHoverText = "Check out my coding stats";
        } else if (sectionId === "contact") {
          currentHoverText = "Let's get in touch";
        } else if (sectionId === "theme") {
          const isLight = document.documentElement.classList.contains("light");
          currentHoverText = isLight ? "Join the Dark Side..." : "Return to the Light Side...";
        }
      } else if (clickable) {
        const text = clickable.textContent.trim().toLowerCase();
        const href = clickable.getAttribute("href") || "";

        if (text === "download cv" || href.includes("drive.google.com")) {
          currentHoverText = "Check out my resume!";
        } else if (text === "contact me" || href === "#contact") {
          currentHoverText = "Let's chat!";
        } else if (e.target.closest(".project-card-3d") || href.includes("netlify.app")) {
          currentHoverText = "Checkout this project! 🡕";
        } else if (href.includes("instagram.com")) {
          currentHoverText = "Instagram: @prsahu_21";
        } else if (href.includes("linkedin.com")) {
          currentHoverText = "LinkedIn: Pranjal Sahu";
        } else if (href.includes("github.com")) {
          currentHoverText = "GitHub: @Pranjal-Sahu21";
        } else if (href.includes("leetcode.com")) {
          currentHoverText = "LeetCode: @Pranjal_1619";
        } else if (clickable.closest("#contact") && clickable.tagName.toLowerCase() === "button") {
          currentHoverText = "Send the message";
        } else if (href.startsWith("mailto:")) {
          currentHoverText = "Drop an email";
        } else if (href.startsWith("tel:")) {
          currentHoverText = "Give a call";
        } else if (href.includes("google.com/maps") || href.includes("maps.google.com")) {
          currentHoverText = "Find my location";
        } else if (isNav) {
          if (href.startsWith("#")) {
            const sectionName = href.replace("#", "");
            currentHoverText = `Go to ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`;
          }
        }
      }

      updateSpeechBubble();
    };

    let isScrolling = false;
    const handleMouseOut = () => {
      if (!isScrolling) {
        dot.classList.remove("show");
      }
    };

    let scrollTimeout;
    const handleScroll = () => {
      dot.classList.remove("hover-project");

      dot.classList.add("scrolling");
      dot.classList.add("show");
      dot.classList.remove("idle");
      isScrolling = true;

      // Select random scroll text if not already active
      if (!currentScrollText) {
        currentScrollText = scrollDialogues[Math.floor(Math.random() * scrollDialogues.length)];
      }
      updateSpeechBubble();

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        dot.classList.remove("scrolling");
        isScrolling = false;
        currentScrollText = "";
        updateSpeechBubble();
      }, 500);
    };

    const handleMouseDown = (e) => {
      // Don't react to click if the cursor is over clickable elements like a, button, etc.
      const clickable = e.target.closest("a, button, input, textarea, .cursor-pointer");
      if (clickable) return;

      dot.classList.add("clicking");
      currentClickText = clickDialogues[Math.floor(Math.random() * clickDialogues.length)];
      updateSpeechBubble();

      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        currentClickText = "";
        updateSpeechBubble();
      }, 1200);
    };

    const handleMouseUp = () => {
      dot.classList.remove("clicking");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    let animationId;
    const follow = () => {
      dotX += (targetX - dotX) * delay;
      dotY += (targetY - dotY) * delay;

      dot.style.left = dotX + "px";
      dot.style.top = dotY + "px";

      const vx = dotX - lastX;
      const vy = dotY - lastY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      lastX = dotX;
      lastY = dotY;

      // Handle horizontal flip
      if (Math.abs(vx) > 0.1) {
        if (vx < 0) {
          dot.classList.add("face-left");
        } else {
          dot.classList.remove("face-left");
        }
      }

      // Handle running state vs idle bobbing state
      if (speed > 0.15) {
        dot.classList.remove("idle");
        // Run faster -> swing legs faster
        const runSpeed = Math.max(0.15, Math.min(0.6, 3.5 / speed));
        dot.style.setProperty("--run-speed", `${runSpeed}s`);
      } else {
        dot.classList.add("idle");
      }

      animationId = requestAnimationFrame(follow);
    };

    follow();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationId);
      clearTimeout(scrollTimeout);
      clearTimeout(clickTimeout);
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
    }, 7800);

    setTimeout(() => {
      setShowContent(true);
    }, 8800);
  }, []);
  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <div className={`min-h-screen w-full relative bg-bg transition-colors duration-300 ${!showContent ? 'h-screen overflow-hidden' : ''}`}>

        <div className="relative z-10">
          <AnimatePresence>
            {showContent && <Header />}
          </AnimatePresence>
          <main id="main-content">
            <Home showContent={showContent} />
            <About />
            <Journey />
            <Skills />
            <Projects />
            <Activity />
            <Contact />
          </main>
          <Footer />
          {showContent && <ChatBot />}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}
