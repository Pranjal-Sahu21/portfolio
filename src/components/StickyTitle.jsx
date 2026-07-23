import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * StickyTitle — A sticky section heading that pins to the top of the viewport
 * while the section's content scrolls beneath it. Content passing under the
 * title is blurred and faded via a gradient mask overlay.
 *
 * When the next section's sticky title reaches the same position, this title
 * is naturally pushed upward by CSS sticky stacking.
 *
 * IMPORTANT: The parent <section> must NOT have overflow-hidden, otherwise
 * position: sticky will not work. Move overflow-hidden to an inner content wrapper.
 */
export default function StickyTitle({ children, className = "", blurHeight = "h-16", negativeMargin = "-mb-16" }) {
  const wrapperRef = useRef(null);
  const isInView = useInView(wrapperRef, { once: false, amount: 0.3 });

  return (
    <div
      ref={wrapperRef}
      className="sticky top-0 z-30 w-full pointer-events-none"
    >
      {/* Solid background strip stretching to full viewport width */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 bg-bg transition-colors duration-300 pt-6 px-5 pointer-events-auto flex justify-center">
        {/* The heading itself (remains centered in the same place) */}
        <motion.h2
          className={className}
          style={{ marginBottom: 0 }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {children}
        </motion.h2>
      </div>

      {/* Gradient fade + blur mask stretching to full viewport width */}
      <div
        className={`w-screen relative left-1/2 -translate-x-1/2 ${blurHeight} pointer-events-none ${negativeMargin}`}
        style={{
          background: "linear-gradient(to bottom, var(--bg) 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      />
    </div>
  );
}
