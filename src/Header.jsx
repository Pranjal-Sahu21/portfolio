import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Header.css";
import logo from "../assets/apple-touch-icon.png";
import { Menu, X } from "lucide-react";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const [showHeader, setShowHeader] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

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
          className="navRoot"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* LOGO */}
          <div className="navLogo">
            <img src={logo} alt="logo" />
          </div>

          {/* DESKTOP */}
          {isDesktop ? (
            <ul className="navDesktop">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className={activeSection === link.id ? "active" : ""}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {/* MOBILE MENU */}
              <div className="navBurger" onClick={toggleMenu}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <motion.div
                      className="navOverlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setMenuOpen(false)}
                    />

                    <motion.ul
                      className="navDrawer"
                      variants={drawerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {navLinks.map((link) => (
                        <motion.li key={link.id} variants={linkVariants}>
                          <a
                            href={`#${link.id}`}
                            onClick={() => setMenuOpen(false)}
                            className={
                              activeSection === link.id ? "active" : ""
                            }
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
