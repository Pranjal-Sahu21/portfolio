import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

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


  const inputClasses =
    "w-full p-[14px_16px] border border-primary/30 rounded-lg bg-[#181818]/85 text-light-text text-[1rem] font-space transition-all duration-300 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] outline-none focus:border-primary resize-none box-border";

  const socialLinks = [
    { href: "https://www.instagram.com/prsahu_21/", icon: "fab fa-instagram", delay: "0s" },
    { href: "https://www.linkedin.com/in/pranjal-sahu-/", icon: "fab fa-linkedin", delay: "0.2s" },
    { href: "https://github.com/Pranjal-Sahu21", icon: "fab fa-github", delay: "0.4s" },
  ];

  return (
    <section
      id="contact"
      className="min-h-[100svh] flex flex-col justify-center items-center py-[120px] px-5 overflow-hidden text-center"
      ref={ref}
    >
      {/* Heading — kept identical */}
      <motion.h1
        className="shimmer-text font-syne font-bold mb-[68px] text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        Let's work together
      </motion.h1>

      {/* Two-column on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-10 md:gap-12 w-full max-w-[1000px] items-start text-left">

        {/* LEFT — Contact Form */}
        {!isSuccess && (
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-5 md:p-[30px] w-full bg-[#181818]/65 rounded-[14px] shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-shadow duration-200 hover:shadow-[0_0_18px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
          >
            <input type="text" name="name" placeholder="Your Name" className={inputClasses} required />
            <input type="email" name="email" placeholder="Your Email" className={inputClasses} required />
            <input type="text" name="subject" placeholder="Subject" className={inputClasses} required />
            <textarea name="message" rows="5" placeholder="Message" className={inputClasses} required />
            <button
              className="font-syne font-bold text-[1.05rem] py-[14px] px-[24px] bg-gradient-to-r from-primary to-accent text-white border-none rounded-lg cursor-pointer transition-all duration-300 shadow-[0_0_12px_rgba(226,88,34,0.5)] hover:shadow-[0_0_20px_rgba(226,88,34,0.8),0_0_35px_rgba(178,34,34,0.6)] active:scale-[0.95] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {errorMsg && (
              <p className="font-space text-[0.85rem] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-center">
                {errorMsg}
              </p>
            )}
          </motion.form>
        )}

        {/* Divider — vertical on desktop, horizontal on mobile */}
        <div className="hidden md:block w-px bg-white/10 self-stretch mx-2" />
        <div className="block md:hidden h-px bg-white/10 w-full" />

        {/* RIGHT — Contact Details */}
        <motion.div
          className="flex flex-col gap-8 justify-center"
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
        >
          {/* Tagline */}
          <div>
            <h2 className="hidden md:block font-syne font-semibold text-[1.4rem] text-light-text mb-2">Get in Touch</h2>
            <p className="hidden md:block font-space text-muted-text text-[0.95rem] leading-[1.7]">
              Have a project in mind, a question, or just want to say hi? Fill out the form and I'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Info Items */}
          <div className="hidden md:flex flex-col gap-5">
            <a href="mailto:sahupranjal1619@gmail.com" className="flex items-center gap-4 group no-underline">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 shrink-0">
                <i className="fas fa-envelope text-base"></i>
              </div>
              <div>
                <p className="font-syne text-[0.75rem] text-muted-text uppercase tracking-widest mb-0.5">Email</p>
                <p className="font-space text-light-text text-[0.95rem] group-hover:text-primary transition-colors duration-300">sahupranjal1619@gmail.com</p>
              </div>
            </a>

            <a href="tel:+918895596189" className="flex items-center gap-4 group no-underline">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 shrink-0">
                <i className="fas fa-phone text-base"></i>
              </div>
              <div>
                <p className="font-syne text-[0.75rem] text-muted-text uppercase tracking-widest mb-0.5">Phone</p>
                <p className="font-space text-light-text text-[0.95rem] group-hover:text-primary transition-colors duration-300">+91 88955 96189</p>
              </div>
            </a>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-px bg-white/10 w-full"></div>

          {/* Social Icons */}
          <div className="text-center md:text-left -mt-6 md:mt-0">
            <p className="font-syne text-[0.75rem] text-muted-text uppercase tracking-widest mb-4">Find me on</p>
            <div className="flex gap-2 justify-center md:justify-start">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target={s.href.startsWith("tel") ? undefined : "_blank"}
                  rel={s.href.startsWith("tel") ? undefined : "noreferrer"}
                  style={{ animationDelay: s.delay }}
                  className="flex items-center justify-center bg-transparent text-muted-text text-xl"
                >
                  <i className={`${s.icon} w-11 h-11 mt-3 hover:scale-110 transition-all duration-300 hover:text-primary`}></i>
                </a>
              ))}
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
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[999]"
            onClick={() => setIsSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#181818]/90 p-8 w-[90%] max-w-[360px] text-center text-light-text rounded-[14px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-3 text-primary text-[1.25rem] font-semibold shimmer-text font-syne">Message Sent!</h2>
              <p className="text-muted-text mb-6 text-[0.9rem] leading-[1.4] pt-4 font-space">
                Thanks for reaching out — I'll get back to you soon.
              </p>
              <button
                className="font-space py-2.5 px-5 bg-transparent border border-primary text-light-text rounded-md cursor-pointer transition-all duration-200 text-[0.9rem] hover:bg-bg"
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
