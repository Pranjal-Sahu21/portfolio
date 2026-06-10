import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github, Send } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const form = formRef.current;
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("https://formspree.io/f/movnrvqz", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setIsSuccess(true);
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json?.error || "Something went wrong. Please try again.");
      }
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { href: "https://www.instagram.com/prsahu_21/", icon: Instagram },
    { href: "https://www.linkedin.com/in/pranjal-sahu-/", icon: Linkedin },
    { href: "https://github.com/Pranjal-Sahu21", icon: Github },
  ];

  return (
    <section
      id="contact"
      className="min-h-[100svh] flex flex-col justify-center items-center py-24 px-5 overflow-hidden text-center relative"
      ref={ref}
    >
      {/* Heading */}
      <motion.h2
        className="shimmer-text font-syne font-bold mb-16 text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        Let's work together
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 w-full max-w-[1100px] items-stretch text-left px-4">
        
        {/* RIGHT (on desktop) — Contact Form */}
        <motion.div
          className="flex flex-col justify-between w-full lg:order-2 lg:py-8 lg:px-4 lg:h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col justify-between gap-6 w-full h-full"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-muted-text font-space text-[0.7rem] uppercase tracking-wider pl-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="bg-transparent border-t-0 border-x-0 border-b border-primary/15 hover:border-primary/30 focus:border-primary px-1 py-3 text-primary text-sm font-space placeholder-neutral-500/70 transition-all duration-300 w-full outline-none rounded-none"
                  data-hover-text="What should I call you?"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-muted-text font-space text-[0.7rem] uppercase tracking-wider pl-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  className="bg-transparent border-t-0 border-x-0 border-b border-primary/15 hover:border-primary/30 focus:border-primary px-1 py-3 text-primary text-sm font-space placeholder-neutral-500/70 transition-all duration-300 w-full outline-none rounded-none"
                  data-hover-text="Where can I write back to you?"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="subject" className="text-muted-text font-space text-[0.7rem] uppercase tracking-wider pl-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Message Subject"
                  className="bg-transparent border-t-0 border-x-0 border-b border-primary/15 hover:border-primary/30 focus:border-primary px-1 py-3 text-primary text-sm font-space placeholder-neutral-500/70 transition-all duration-300 w-full outline-none rounded-none"
                  data-hover-text="Subject: 'I want to hire you!' (highly recommended)"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="text-muted-text font-space text-[0.7rem] uppercase tracking-wider pl-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Type your message here..."
                  className="bg-transparent border-t-0 border-x-0 border-b border-primary/15 hover:border-primary/30 focus:border-primary px-1 py-3 text-primary text-sm font-space placeholder-neutral-500/70 transition-all duration-300 w-full outline-none resize-none rounded-none"
                  data-hover-text="Write away! I'm all ears (or whatever is inside this helmet!)."
                  required
                />
              </div>
            </div>

            <button
              className="font-syne font-bold text-sm sm:text-base py-3.5 px-6 bg-primary text-bg border-none rounded-xl cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-xs"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send Message
                  <Send size={15} />
                </>
              )}
            </button>
            {errorMsg && (
              <p className="font-space text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center mt-2 leading-relaxed">
                {errorMsg}
              </p>
            )}
          </form>
        </motion.div>

        {/* LEFT (on desktop) — Contact Details */}
        <motion.div
          className="flex flex-col justify-between w-full lg:order-1 lg:p-8 lg:bg-input-bg/40 lg:border lg:border-primary/5 lg:rounded-2xl lg:shadow-md lg:h-full"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
        >
          <div className="flex flex-col gap-8 w-full">
            {/* Tagline */}
            <div className="hidden lg:flex flex-col gap-3.5">
              <h3 className="font-syne font-bold text-2xl text-primary">Get in Touch</h3>
              <p className="font-space text-muted-text text-sm leading-relaxed">
                Have an idea, project, or open position? Drop a line and let's create something extraordinary together.
              </p>
            </div>

            {/* Contact Info Items */}
            <div className="hidden lg:flex flex-col gap-4">
              <a 
                href="mailto:sahupranjal1619@gmail.com" 
                className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-primary/30 rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 hover:border-l-primary hover:bg-primary/[0.06] dark:hover:bg-primary/[0.08] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 group no-underline"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 border border-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/10 shrink-0">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <p className="font-syne text-[0.65rem] text-muted-text uppercase tracking-widest leading-none mb-1">Email</p>
                  <p className="font-space text-primary text-sm sm:text-base leading-none">sahupranjal1619@gmail.com</p>
                </div>
              </a>

              <a 
                href="tel:+918895596189" 
                className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-primary/30 rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 hover:border-l-primary hover:bg-primary/[0.06] dark:hover:bg-primary/[0.08] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 group no-underline"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 border border-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/10 shrink-0">
                  <Phone size={18} />
                </div>
                <div className="text-left">
                  <p className="font-syne text-[0.65rem] text-muted-text uppercase tracking-widest leading-none mb-1">Phone</p>
                  <p className="font-space text-primary text-sm sm:text-base leading-none">+91 88955 96189</p>
                </div>
              </a>

              <a 
                href="https://maps.google.com/?q=Rourkela,+Odisha,+India" 
                target="_blank"
                rel="noreferrer"
                className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-primary/30 rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 hover:border-l-primary hover:bg-primary/[0.06] dark:hover:bg-primary/[0.08] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 group no-underline"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5 border border-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/10 shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="text-left">
                  <p className="font-syne text-[0.65rem] text-muted-text uppercase tracking-widest leading-none mb-1">Location</p>
                  <p className="font-space text-primary text-sm sm:text-base leading-none">Rourkela, Odisha, India</p>
                </div>
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col gap-3 text-center lg:text-left mt-6 lg:mt-0">
            <p className="font-syne text-[0.65rem] text-muted-text uppercase tracking-widest leading-none">Find me on</p>
            <div className="flex gap-3 mt-1 justify-center lg:justify-start">
              {socialLinks.map((s, idx) => {
                const SocialIcon = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 text-muted-text hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-xs"
                  >
                    <SocialIcon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-bg/75 backdrop-blur-md flex items-center justify-center z-[9999]"
            onClick={() => setIsSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-input-bg/95 border border-primary/10 p-8 w-[90%] max-w-[380px] text-center text-primary rounded-2xl shadow-xl flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
                <Mail size={22} />
              </div>
              <h2 className="text-xl font-bold font-syne shimmer-text leading-none">Message Sent!</h2>
              <p className="text-muted-text text-sm font-space leading-relaxed">
                Thank you for reaching out. I have received your message and will get back to you shortly.
              </p>
              <button
                className="font-space py-2.5 px-6 bg-primary text-bg font-semibold rounded-xl cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-sm mt-2 w-full"
                onClick={() => setIsSuccess(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
