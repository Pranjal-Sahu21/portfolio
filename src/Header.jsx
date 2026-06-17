import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/apple-touch-icon.png";
import { Menu, X, Home, User, Briefcase, Wrench, FolderGit2, Activity, Mail } from "lucide-react";
import { scrollToSection } from "./utils/scrollToSection";
import { useTheme } from "./context/ThemeContext";
import AnimatedThemeToggler from "./components/AnimatedThemeToggler";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const [activeSection, setActiveSection] = useState("home");
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 992;
      setIsDesktop(desktop);
      setScreenHeight(window.innerHeight);
      if (desktop) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "journey", "skills", "projects", "activity", "contact"];

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

  /* NAVBAR EXPANSION (MOBILE) */
  const navbarVariants = {
    hidden: {
      y: -80,
      opacity: 0,
      top: "16px",
      left: "5vw",
      right: "5vw",
      height: 56,
      borderRadius: "28px",
      padding: "12px 24px",
      borderWidth: "1px",
      borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
      backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)",
    },
    collapsed: {
      y: 0,
      opacity: 1,
      top: "16px",
      left: "5vw",
      right: "5vw",
      height: 56,
      borderRadius: "28px",
      padding: "12px 24px",
      borderWidth: "1px",
      borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
      backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)",
      transition: {
        height: { type: "spring", stiffness: 120, damping: 22 },
        borderRadius: { type: "spring", stiffness: 120, damping: 22 },
        backgroundColor: { ease: "easeInOut", duration: 0.2 },
        y: { type: "spring", stiffness: 120, damping: 22 },
        opacity: { type: "spring", stiffness: 120, damping: 22 }
      }
    },
    expanded: {
      y: 0,
      opacity: 1,
      top: "16px",
      left: "5vw",
      right: "5vw",
      height: screenHeight - 32,
      borderRadius: "24px",
      padding: "16px 24px 32px 24px",
      borderWidth: "1px",
      borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
      backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
      transition: {
        height: { type: "spring", stiffness: 120, damping: 22 },
        borderRadius: { type: "spring", stiffness: 120, damping: 22 },
        backgroundColor: { ease: "easeInOut", duration: 0.2 },
        y: { type: "spring", stiffness: 120, damping: 22 },
        opacity: { type: "spring", stiffness: 120, damping: 22 },
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  /* LINKS CONTAINER DISPLAY-BASED ANIMATION */
  const containerVariants = {
    collapsed: {
      opacity: 0,
      pointerEvents: "none",
      transition: {
        opacity: { duration: 0.15 },
      }
    },
    expanded: {
      opacity: 1,
      pointerEvents: "auto",
      transition: {
        opacity: { duration: 0.3 },
        staggerChildren: 0.08,
        delayChildren: 0.15,
      }
    }
  };

  /* LINKS ANIMATION */
  const linkVariants = {
    hidden: { opacity: 0, x: -40 },
    collapsed: { 
      opacity: 0, 
      x: 0,
      transition: { duration: 0.15 }
    },
    expanded: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 150, damping: 18 },
    },
  };

  /* DOCK (DESKTOP) */
  const dockVariants = {
    hidden: { x: 80, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  const navLinks = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "journey", label: "Journey", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      {isDesktop ? (
        /* DESKTOP SIDE VERTICAL DOCK */
        <motion.div
          variants={dockVariants}
          initial="hidden"
          animate="visible"
          className="nav-container fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-[9000] pointer-events-none"
        >
          {/* NAV DOCK */}
          <div className="pointer-events-auto flex flex-col gap-2.5 p-2 bg-bg/60 border border-primary/20 backdrop-blur-md rounded-full shadow-lg items-center">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`group relative flex items-center justify-center p-2.5 rounded-full transition-colors duration-300 cursor-pointer h-10 w-10 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
                      : "bg-transparent text-muted-text hover:text-primary border border-transparent"
                  }`}
                  aria-label={link.label}
                  data-section={link.id}
                >
                  <LinkIcon size={16} />
                </motion.button>
              );
            })}
          </div>

          {/* THEME TOGGLER */}
          <div className="pointer-events-auto relative group" data-section="theme">
            <AnimatedThemeToggler
              theme={theme}
              onThemeChange={toggleTheme}
              className="w-11 h-11 rounded-full bg-bg/60 border border-primary/20 backdrop-blur-md shadow-md flex items-center justify-center text-light-text hover:text-primary transition-colors cursor-pointer"
            />
          </div>
        </motion.div>
      ) : (
        /* MOBILE TOP FLOATING PILL NAVBAR THAT EXPANDS INTO FULLSCREEN */
        <>
          {/* BACKGROUND BLUR OVERLAY */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="fixed inset-0 bg-black/60 z-[9650]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          <motion.nav
            variants={navbarVariants}
            initial="hidden"
            animate={menuOpen ? "expanded" : "collapsed"}
            className="fixed backdrop-blur-md shadow-lg pointer-events-auto flex flex-col overflow-hidden z-[9700]"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* HEADER ROW */}
            <div className="flex justify-between items-center w-full h-8 shrink-0">
              {/* LOGO */}
              <div className="flex items-center gap-3 font-syne font-bold">
                <img 
                  src={logo} 
                  alt="Pranjal Sahu — Home" 
                  className="w-8 h-8 p-0.5 bg-white border border-primary/20 rounded-full shadow-sm" 
                />
              </div>

              {/* RIGHT SIDE CONTAINER FOR TOGGLE & MENU/CLOSE */}
              <div className="flex items-center gap-3">
                {/* THEME TOGGLE BUTTON */}
                <AnimatedThemeToggler
                  theme={theme}
                  onThemeChange={toggleTheme}
                />

                {/* MOBILE MENU TRIGGER */}
                <button 
                  className="cursor-pointer text-light-text flex items-center justify-center p-2 border-none bg-transparent active:scale-95 transition-transform" 
                  onClick={toggleMenu} 
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* EXPANDED MENU LINKS */}
            <AnimatePresence>
              {menuOpen && (
                <motion.ul
                  className="flex flex-col justify-start items-start pl-[4vw] pt-16 gap-[3vh] list-none w-full overflow-y-auto no-scrollbar"
                  variants={containerVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  {navLinks.map((link) => (
                    <motion.li key={link.id} variants={linkVariants}>
                      <a
                        href={`#${link.id}`}
                        data-section={link.id}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.id, () => setMenuOpen(false));
                        }}
                        className={`font-syne font-extrabold text-[clamp(1.6rem,5.5vw,2.4rem)] tracking-tight no-underline transition-all duration-300 hover:translate-x-2.5 hover:text-primary relative after:content-[''] after:block after:w-0 hover:after:w-2/5 after:h-0.5 after:bg-primary after:mt-1.5 after:transition-[width] after:duration-300 ${
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
              )}
            </AnimatePresence>
          </motion.nav>
        </>
      )}
    </>
  );
}
