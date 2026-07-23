import React from "react";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github, ArrowUp } from "lucide-react";
import { scrollToSection } from "./utils/scrollToSection";
import logo from "../assets/apple-touch-icon.png";
import { RESUME_LINK } from "./utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com/Pranjal-Sahu21", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/pranjal-sahu-/", icon: Linkedin, label: "LinkedIn" },
    { href: "https://www.instagram.com/prsahu_21/", icon: Instagram, label: "Instagram" },
  ];

  const quickLinks = [
    { id: "certifications", label: "Certifications" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <footer className="w-full py-16 px-6 md:px-12 bg-input-bg/60 border-t border-primary/10 backdrop-blur-md relative z-20" role="contentinfo">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Pranjal Sahu — Logo" 
              className="w-8 h-8 p-0.5 bg-white border border-primary/20 rounded-full shadow-sm select-none" 
            />
            <h3 className="font-bebas text-2xl text-primary tracking-wide">PRANJAL SAHU</h3>
          </div>
          <p className="font-inter text-muted-text text-[0.95rem] leading-relaxed max-w-sm">
            Crafting fast, interactive, and visually engaging web experiences with modern tech stacks. Focused on clean layouts and thoughtful engineering.
          </p>
          <div className="mt-1">
            <a 
              href={RESUME_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/30 rounded-xl font-space text-[0.8rem] uppercase tracking-wider font-semibold shadow-xs hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 no-underline cursor-pointer"
            >
              View Resume
            </a>
          </div>
          <div className="flex gap-3 mt-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 text-muted-text hover:text-primary hover:bg-primary/10 hover:border-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="font-inter font-bold text-sm uppercase tracking-widest text-primary pl-0.5">Quick Links</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  className="font-inter text-muted-text hover:text-primary text-[0.95rem] no-underline transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <h4 className="font-inter font-bold text-sm uppercase tracking-widest text-primary pl-0.5">Contact</h4>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:sahupranjal1619@gmail.com"
              className="flex items-center gap-3 text-muted-text hover:text-primary text-[0.95rem] no-underline transition-colors duration-200"
            >
              <Mail size={16} className="text-primary/70 shrink-0" />
              <span className="font-inter truncate">sahupranjal1619@gmail.com</span>
            </a>
            <a
              href="tel:+918895596189"
              className="flex items-center gap-3 text-muted-text hover:text-primary text-[0.95rem] no-underline transition-colors duration-200"
            >
              <Phone size={16} className="text-primary/70 shrink-0" />
              <span className="font-inter">+91 88955 96189</span>
            </a>
            <div className="flex items-center gap-3 text-muted-text text-[0.95rem]">
              <MapPin size={16} className="text-primary/70 shrink-0" />
              <span className="font-inter">Rourkela, Odisha, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-[1100px] mx-auto border-t border-primary/10 pt-8 flex justify-center items-center">
        <p className="font-inter text-xs text-muted-text m-0 text-center">
          &copy; {currentYear} Pranjal Sahu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
