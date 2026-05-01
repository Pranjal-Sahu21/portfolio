import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

export default function Contact() {
  const ref = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(formRef.current);

    fetch("https://formspree.io/f/movnrvqz", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          setIsSuccess(true);
          setIsSubmitting(false);
          formRef.current.reset();
        } else {
          setIsSubmitting(false);
          alert("Failed to send message. Please try again.");
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        alert("Failed to send message. Please try again.");
      });
  };

  const inputClasses = "w-full p-[14px_16px] mb-3 border border-primary/30 rounded-lg bg-[#282828]/85 text-light-text text-[1rem] font-space transition-all duration-300 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] outline-none focus:border-primary resize-none box-border";

  return (
    <section id="contact" className="min-h-[100svh] flex flex-col justify-center items-center py-[120px] px-5 overflow-hidden text-center" ref={ref}>
      <motion.h1
        className="shimmer-text font-syne font-bold mb-[68px] text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        Let's work together
      </motion.h1>

      {!isSuccess && (
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-5 md:p-[30px] w-full max-w-[500px] bg-[#181818]/65 rounded-[14px] shadow-[0_0_10px_rgba(0,0,0,0.5)] animate-[floaty_6s_ease-in-out_infinite] transition-transform duration-200 hover:shadow-[0_0_12px_rgba(0,0,0,0.6)] transform-style-3d perspective-800"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.2,
          }}
        >
          <input type="text" name="name" placeholder="Your Name" className={inputClasses} required />
          <input type="email" name="email" placeholder="Your Email" className={inputClasses} required />
          <input type="text" name="subject" placeholder="Subject" className={inputClasses} required />
          <textarea name="message" rows="5" placeholder="Message" className={inputClasses} required />
          <button className="font-syne font-bold text-[1.05rem] py-[14px] px-[24px] bg-gradient-to-r from-primary to-accent text-white border-none rounded-lg cursor-pointer transition-all duration-300 shadow-[0_0_12px_rgba(226,88,34,0.5)] hover:shadow-[0_0_20px_rgba(226,88,34,0.8),0_0_35px_rgba(178,34,34,0.6)] active:scale-[0.95] active:translate-y-[2px] active:shadow-[0_0_8px_rgba(226,88,34,0.6),inset_0_0_6px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </motion.form>
      )}

      <motion.div
        className="flex gap-8 justify-center mt-10"
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 0.4,
        }}
      >
        <a
          href="https://www.instagram.com/prsahu_21/"
          target="_blank"
          rel="noreferrer"
          className="text-2xl text-light-text transition-colors duration-300 hover:text-primary animate-[floaty_4s_ease-in-out_infinite]"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/pranjal-sahu-/"
          target="_blank"
          rel="noreferrer"
          className="text-2xl text-light-text transition-colors duration-300 hover:text-primary animate-[floaty_4s_ease-in-out_infinite]"
          style={{ animationDelay: '0.2s' }}
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a
          href="https://github.com/Pranjal-Sahu21"
          target="_blank"
          rel="noreferrer"
          className="text-2xl text-light-text transition-colors duration-300 hover:text-primary animate-[floaty_4s_ease-in-out_infinite]"
          style={{ animationDelay: '0.4s' }}
        >
          <i className="fab fa-github"></i>
        </a>
        <a href="tel:+918895596189" className="text-2xl text-light-text transition-colors duration-300 hover:text-primary animate-[floaty_4s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }}>
          <i className="fas fa-phone text-[18px]"></i>
        </a>
      </motion.div>

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
              <p className="text-muted-text mb-6 text-[0.9rem] leading-[1.4] pt-4 font-space">Thanks for reaching out — I'll get back to you soon.</p>
              <button className="font-space py-2.5 px-5 bg-transparent border border-primary text-light-text rounded-md cursor-pointer transition-all duration-200 text-[0.9rem] hover:bg-bg" onClick={() => setIsSuccess(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
