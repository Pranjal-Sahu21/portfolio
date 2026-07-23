import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import About from "./About";
import Journey from "./Journey";
import Skills from "./Skills";
import Certifications from "./Certifications";
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
import { ThemeProvider } from "./context/ThemeContext";
import { StatsProvider } from "./context/StatsContext";
import { RESUME_LINK } from "./utils";


function InnerApp() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);

  const dotRef = useRef(null);

  useEffect(() => {
    const dot = document.querySelector(".cursor-avatar");
    if (!dot) return;
    dotRef.current = dot;

    const speechBubble = dot.querySelector(".avatar-speech");

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

    let clickTimestamps = [];
    let isLeavingOrDisappeared = false;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = window.innerWidth / 2;
    let dotY = window.innerHeight / 2;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    const delay = 0.08;

    let currentHoverText = "";
    let currentClickText = "";
    let clickTimeout;

    const updateSpeechBubble = () => {
      let activeText = "";
      if (currentClickText) {
        activeText = currentClickText;
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
      if (isLeavingOrDisappeared) return;
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
      const isOverChart = e.target.closest("canvas") && !e.target.closest("#about");
      const sectionElem = e.target.closest("[data-section]");
      const sectionId = sectionElem ? sectionElem.getAttribute("data-section") : null;

      if (isOverChart) {
        currentHoverText = "";
      } else if (hoverTextElem) {
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
        } else if (sectionId === "certifications") {
          currentHoverText = "Browse my certifications";
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

        if (text === "download cv" || href === RESUME_LINK || href.includes("1tKWvaG2YOVkODYJuIEg1eZFmE3GWVSCk") || href.includes("1_KrL-UboRRlkNhiWVrA_wacuLGYufBQm")) {
          currentHoverText = "Check out my resume!";
        } else if (href.includes("1B_VNAmS_5NawDiHcQus9MqH4Mu9RFziI") || text.includes("react developer")) {
          currentHoverText = "HackerRank React: Validated my frontend skills in JavaScript, React, and CSS!";
        } else if (href.includes("1-_KRuUd5orE4Qv5zhPW9IL7RuWSzPZpc") || text.includes("mongodb architecture")) {
          currentHoverText = "GFG MongoDB: Learned database architecture, document modeling, sharding, and scaling!";
        } else if (href.includes("1QmKNku0u8CmGdIGmbH7Q0vhv2pTB5VLo") || text.includes("dsa certification")) {
          currentHoverText = "GFG DSA: Mastered 15+ core data structures and complex algorithms topics!";
        } else if (href.includes("1MFq0v7G2bw7nRwYhCozQrYqAKbA-SPuG") || text.includes("node.js developer")) {
          currentHoverText = "Udemy Node: Learned 10+ backend technologies including Node, Docker, ORMs, and Cloud Deployment!";
        } else if (href.includes("1nIBOc97mW8YOuxfXODMgBjUZa39Q0mAF") || text.includes("sql (intermediate)")) {
          currentHoverText = "HackerRank SQL: Confirmed my proficiency in relational queries and database commands!";
        } else if (href.includes("1V93UXpsTA7oosK5Wnbgv_pMrIsqSfmnf") || text.includes("postgresql developer")) {
          currentHoverText = "Simplilearn Postgres: Learned PostgreSQL database design, administration, and querying!";
        } else if (href.includes("drive.google.com")) {
          currentHoverText = "Check out my credential!";
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
      if (isLeavingOrDisappeared) return;
      if (!isScrolling) {
        dot.classList.remove("show");
      }
    };

    let scrollTimeout;
    const handleScroll = () => {
      if (isLeavingOrDisappeared) return;
      dot.classList.remove("hover-project");
      dot.classList.add("show");
      dot.classList.remove("idle");
      isScrolling = true;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 500);
    };

    const handleMouseDown = (e) => {
      if (isLeavingOrDisappeared) return;

      const now = Date.now();
      clickTimestamps.push(now);
      clickTimestamps = clickTimestamps.filter((t) => now - t < 1000);

      if (clickTimestamps.length >= 3) {
        isLeavingOrDisappeared = true;
        clearTimeout(clickTimeout);
        currentClickText = "Okay, then I'm leaving";
        currentHoverText = "";
        updateSpeechBubble();

        setTimeout(() => {
          dot.style.display = "none";
        }, 1800);
        return;
      }

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
      if (isLeavingOrDisappeared) return;
      dot.classList.remove("clicking");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    let animationId;
    const follow = () => {
      if (isLeavingOrDisappeared && dot.style.display === "none") {
        return;
      }
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
      autoRaf: false,
    });

    // Prevent Lenis from setting overflow: clip on html (breaks position: sticky)
    document.documentElement.style.removeProperty("overflow");

    function raf(time) {
      lenisRef.current.raf(time);
      // Continuously undo Lenis overflow: clip on <html> — it breaks position: sticky
      if (document.documentElement.style.overflow) {
        document.documentElement.style.removeProperty("overflow");
      }
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
    }, 8100);
  }, []);
  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <div className={`min-h-screen w-full relative bg-bg transition-colors duration-300 ${!showContent ? 'h-screen overflow-hidden' : ''}`}>

        {/* Main Content Wrapper (Scrolls normally, has solid bg and high z-index) */}
        <div className="relative z-20 bg-bg transition-colors duration-300">
          <main id="main-content">
            <Home showContent={showContent} />
            <About />
            <Journey />
            <Skills />
            <Certifications />
            <Projects />
            <Activity />
            <Contact />
          </main>
          <Footer />
        </div>

        {/* Parallax Name Container (Fixed behind the main content) */}
        {showContent && (
          <div className="fixed bottom-0 left-0 right-0 h-[25vh] md:h-[50vh] z-10 bg-bg flex items-center justify-center overflow-hidden select-none pointer-events-none transition-colors duration-300">
            <h1
              onMouseEnter={() => setIsTextHovered(true)}
              onMouseLeave={() => setIsTextHovered(false)}
              className="font-caitog text-[clamp(3rem,24vw,24rem)] tracking-tight leading-none select-none uppercase transition-all duration-500 ease-out cursor-default pointer-events-auto mt-24 md:mt-36"
              style={{
                WebkitTextStroke: "2.5px var(--primary)",
                color: isTextHovered ? "var(--primary)" : "transparent",
                opacity: isTextHovered ? 0.35 : 0.15,
              }}
            >
              Pranjal
            </h1>
          </div>
        )}

        {/* Scroll Spacer (Extends page height to reveal the fixed element) */}
        {showContent && (
          <div className="h-[25vh] md:h-[50vh] relative z-0 pointer-events-none" />
        )}

        {/* ChatBot (Fixed on screen, sits on top) */}
        {showContent && <ChatBot />}

        {/* Viewport Bottom Blur Mask (similar style as below section titles) */}
        {showContent && (
          <div
            className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none z-[9990] transition-colors duration-300"
            style={{
              background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)",
              maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          />
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StatsProvider>
        <InnerApp />
      </StatsProvider>
    </ThemeProvider>
  );
}
