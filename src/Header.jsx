import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/apple-touch-icon.png";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "./utils/scrollToSection";
import { useTheme } from "./context/ThemeContext";
import AnimatedThemeToggler from "./components/AnimatedThemeToggler";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
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
    const sections = ["home", "journey", "skills", "projects", "activity", "contact"];

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
    { id: "activity", label: "Activity" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* Outer Centering Wrapper for floating navbar */}
      <div className="fixed top-4 left-0 w-full flex justify-center z-[9000] px-[5vw] pointer-events-none">
        <motion.nav
          className="w-full max-w-[1100px] flex justify-between items-center px-6 py-3 bg-bg/60 backdrop-blur-md border border-primary/20 rounded-full shadow-lg transition-colors duration-300 pointer-events-auto"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* LOGO */}
          <div className="flex items-center gap-3 font-syne font-bold">
            <img 
              src={logo} 
              alt="Pranjal Sahu — Home" 
              className="w-8 h-8 p-0.5 bg-white border border-primary/20 rounded-full z-10 shadow-sm" 
            />
          </div>

          {/* RIGHT SIDE CONTAINER FOR NAV & TOGGLE */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* DESKTOP */}
            {isDesktop ? (
              <ul className="flex gap-8 list-none m-0 p-0">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id, () => setMenuOpen(false))}
                      className={`no-underline bg-transparent font-syne text-[0.9rem] font-bold transition-all duration-300 hover:text-primary hover:bg-transparent cursor-pointer relative pb-1 ${
                        activeSection === link.id
                          ? "text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
                          : "text-muted-text"
                      }`}
                      {...(activeSection === link.id ? { "aria-current": "page" } : {})}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* THEME TOGGLE BUTTON */}
            <AnimatedThemeToggler
              theme={theme}
              onThemeChange={toggleTheme}
            />

            {/* MOBILE MENU TRIGGER */}
            {!isDesktop && (
              <div className="cursor-pointer text-light-text z-[9999] flex items-center justify-center" onClick={toggleMenu}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            )}
          </div>
        </motion.nav>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && !isDesktop && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.ul
              className="fixed top-0 left-0 h-screen w-full bg-bg flex flex-col justify-center items-start pl-[8vw] gap-[25px] list-none z-[1000] transition-colors duration-300"
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
                    className={`font-syne font-extrabold text-[clamp(2.5rem,8vw,4rem)] tracking-tight no-underline transition-all duration-300 hover:translate-x-2.5 hover:text-primary relative after:content-[''] after:block after:w-0 hover:after:w-2/5 after:h-0.5 after:bg-primary after:mt-1.5 after:transition-[width] after:duration-300 ${
                      activeSection === link.id
                        ? "text-primary pl-4 border-l-[3px] border-primary"
                        : "text-[#555555]"
                    }`}
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
  );
}
