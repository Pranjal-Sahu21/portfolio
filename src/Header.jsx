import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/apple-touch-icon.png";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "./utils/scrollToSection";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const [showHeader, setShowHeader] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 992;
      setIsDesktop(desktop);
      if (desktop) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sections = ["home", "journey", "skills", "projects", "contact"];

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(section);
            break;
          }
        }
      }

      const home = document.getElementById("home");
      if (home) {
        setShowHeader(window.scrollY > home.offsetHeight / 2);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* HEADER */
  const headerVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  /* DRAWER FROM LEFT */
  const drawerVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        staggerChildren: 0.08,
        when: "beforeChildren",
      },
    },
    exit: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  /* LINKS ANIMATION */
  const linkVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 18 },
    },
    exit: { opacity: 0, x: -40 },
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "journey", label: "Journey" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.nav
          className="fixed top-0 left-0 w-full flex justify-between items-center px-[5vw] py-5 bg-[#121212]/60 backdrop-blur-md z-[1000] border-b border-primary/20"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* LOGO */}
          <div className="flex items-center gap-3 font-syne font-bold">
            <img 
              src={logo} 
              alt="logo" 
              className="w-8 h-8 p-0.5 bg-primary rounded-full z-10 shadow-[0_0_10px_rgba(192,192,192,0.6),0_0_20px_rgba(192,192,192,0.4),0_0_40px_rgba(192,192,192,0.2)]" 
            />
          </div>

          {/* DESKTOP */}
          {isDesktop ? (
            <ul className="flex gap-8 list-none">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id, () => setMenuOpen(false))}
                    className={`no-underline bg-transparent font-syne text-[0.9rem] font-bold transition-all duration-300 hover:text-white hover:bg-transparent cursor-pointer relative pb-1 ${activeSection === link.id ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:rounded-full drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "text-[#666666]"}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {/* MOBILE MENU */}
              <div className="cursor-pointer text-light-text z-[1100] flex items-center justify-center" onClick={toggleMenu}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <motion.div
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setMenuOpen(false)}
                    />

                    <motion.ul
                      className="fixed top-0 left-0 h-screen w-full bg-black flex flex-col justify-center items-start pl-[8vw] gap-[25px] list-none z-[1000]"
                      variants={drawerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {navLinks.map((link) => (
                        <motion.li key={link.id} variants={linkVariants}>
                          <a
                            href={`#${link.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection(link.id, () => setMenuOpen(false));
                            }}
                            className={`font-syne font-extrabold text-[clamp(2.5rem,8vw,4rem)] tracking-tight no-underline transition-all duration-300 hover:translate-x-2.5 hover:text-white relative after:content-[''] after:block after:w-0 hover:after:w-2/5 after:h-0.5 after:bg-white after:mt-1.5 after:transition-[width] after:duration-300 ${activeSection === link.id ? "text-white pl-4 border-l-[3px] border-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" : "text-[#555555]"}`}
                          >
                            {link.label}
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
