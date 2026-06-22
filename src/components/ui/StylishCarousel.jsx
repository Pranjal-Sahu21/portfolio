import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils.js";

// ─────────────────────────────────────────────────────────────────────────────
// StylishCarousel
// ─────────────────────────────────────────────────────────────────────────────

const StylishCarousel = ({
  items = [],
  initialIndex = 0,
  slideSize = "clamp(140px, 75vmin, 320px)",
  aspectRatio = "4 / 3",
  rotationDegrees = 28,
  inactiveScale = 0.62,
  yOffsetPercent = 48,
  springBounce = 0.15,
  springDuration = 0.8,
  showArrows = true,
  showDots = true,
  clickToNavigate = true,
  autoPlay = 0,
  className,
  onIndexChange,
  onActiveClick,
  borderRadius = "1rem",
  arrowClassName,
}) => {
  const clampedInitial = Math.max(0, Math.min(initialIndex, items.length - 1));
  const [activeIndex, setActiveIndex] = useState(clampedInitial);
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      setActiveIndex(clamped);
      onIndexChange?.(clamped);
    },
    [items.length, onIndexChange]
  );

  const toPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const toNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // ── keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") toPrev();
      if (e.key === "ArrowRight") toNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toPrev, toNext]);

  // ── touch / swipe ─────────────────────────────────────────────────────────
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? toNext() : toPrev();
    touchStartX.current = null;
  };

  // ── auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1 >= items.length ? 0 : prev + 1;
        onIndexChange?.(next);
        return next;
      });
    }, autoPlay);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, items.length, onIndexChange]);

  // ── spring transition ──────────────────────────────────────────────────────
  const spring = {
    type: "spring",
    bounce: springBounce,
    duration: springDuration,
  };

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col items-center select-none", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Stylish Carousel"
      role="region"
    >
      {/* ── SLIDES CONTAINER ─────────────────────────────────────────────── */}
      <div
        style={{ width: slideSize, aspectRatio }}
        className="relative mt-6"
      >
        {/* Horizontal sliding strip */}
        <motion.div
          className="flex w-fit"
          animate={{ x: `${(-activeIndex * 100) / items.length}%` }}
          transition={spring}
        >
          {items.map((item, i) => {
            const offset = i - activeIndex;
            const isActive = offset === 0;

            return (
              <motion.div
                key={i}
                style={{ width: slideSize, aspectRatio }}
                className="flex-shrink-0 flex flex-col items-center gap-2 will-change-transform"
                animate={{
                  rotate: offset * rotationDegrees,
                  scale: isActive ? 1 : inactiveScale,
                  y: `${offset * yOffsetPercent}%`,
                }}
                transition={spring}
              >
                {/* Title label */}
                <AnimatePresence>
                  {item.title && (
                    <motion.span
                      key={`title-${i}`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs sm:text-sm font-semibold whitespace-nowrap text-foreground/80 tracking-wide"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Card + Image */}
                <div
                  className="relative w-full h-full shadow-2xl bg-input-bg/60 border border-primary/15 backdrop-blur-sm flex items-center justify-center overflow-hidden"
                  style={{ borderRadius }}
                  {...(item.dataAttrs || {})}
                >
                  {/* Inner padding container */}
                  <div className="w-full h-full p-3 flex items-center justify-center">
                    <img
                      src={item.src}
                      alt={item.alt ?? item.title ?? `Slide ${i + 1}`}
                      draggable={false}
                      onClick={() => {
                        if (isActive) {
                          onActiveClick?.(i, item);
                        } else if (clickToNavigate) {
                          goTo(i);
                        }
                      }}
                      className={cn(
                        "w-full h-full object-contain transition-all duration-300 will-change-transform grayscale-0! brightness-100",
                        isActive && onActiveClick && "cursor-pointer",
                        clickToNavigate && !isActive && "cursor-pointer"
                      )}
                      loading="lazy"
                    />
                  </div>

                  {/* Active glow ring */}
                  {isActive && (
                    <motion.div
                      layoutId="glow-ring"
                      className="absolute inset-0 rounded-[inherit] pointer-events-none"
                      style={{
                        boxShadow: "0 0 0 2px hsl(var(--primary, 221 83% 53%) / 0.5)",
                        borderRadius,
                      }}
                      transition={spring}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── CONTROLS ─────────────────────────────────────────────────────── */}
      <div className="mt-8 flex items-center gap-4 px-3 py-2 rounded-full bg-bg/80 border border-primary/20 backdrop-blur-md shadow-lg">
        {/* Prev */}
        {showArrows && (
          <button
            aria-label="Previous slide"
            onClick={toPrev}
            disabled={activeIndex === 0}
            className={cn(
              "p-2 rounded-full transition-all hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed",
              arrowClassName
            )}
          >
            <ChevronLeft className="w-4 h-4 text-light-text" />
          </button>
        )}

        {/* Dots */}
        {showDots && (
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <motion.button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                animate={{
                  width: activeIndex === i ? 28 : 8,
                  opacity: activeIndex === i ? 1 : 0.35,
                }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                className="h-2 rounded-full bg-primary cursor-pointer"
                style={{ minWidth: 8 }}
              />
            ))}
          </div>
        )}

        {/* Next */}
        {showArrows && (
          <button
            aria-label="Next slide"
            onClick={toNext}
            disabled={activeIndex === items.length - 1}
            className={cn(
              "p-2 rounded-full transition-all hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed",
              arrowClassName
            )}
          >
            <ChevronRight className="w-4 h-4 text-light-text" />
          </button>
        )}
      </div>

      {/* Counter */}
      <p className="mt-3 text-xs text-muted-text font-medium tabular-nums">
        {activeIndex + 1} / {items.length}
      </p>
    </div>
  );
};

export default StylishCarousel;
