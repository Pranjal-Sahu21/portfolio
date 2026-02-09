import "./style.css";
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

  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <motion.h1
        className="heading"
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
          className="contact-card"
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
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <input type="text" name="subject" placeholder="Subject" required />
          <textarea name="message" rows="5" placeholder="Message" required />
          <button className="submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </motion.form>
      )}

      <motion.div
        className="social-icons"
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
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/pranjal-sahu-/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a
          href="https://github.com/Pranjal-Sahu21"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-github"></i>
        </a>
        <a href="tel:+918895596189">
          <i className="fas fa-phone"></i>
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
            className="popup-overlay"
            onClick={() => setIsSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="popup-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="heading">Message Sent!</h2>
              <p className="message-para">Thanks for reaching out — I'll get back to you soon.</p>
              <button className="close-btn" onClick={() => setIsSuccess(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
