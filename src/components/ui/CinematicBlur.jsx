import React, { useEffect, useState } from "react";
import GradualBlur from "./GradualBlur";

export const CinematicBlur = ({
  className,
  blurLayers = 8,
  blurMax = 3, // mapped to strength in GradualBlur
  blurSize = 100,
}) => {
  const [bottomOpacity, setBottomOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      const sh = document.documentElement.scrollHeight;
      const ch = document.documentElement.clientHeight;
      const maxScroll = Math.max(sh - ch, 1);

      // Bottom opacity: active everywhere except when we approach maxScroll (within the last 250px)
      let newBottomOpacity = 1;
      if (sy > maxScroll - 250) {
        newBottomOpacity = Math.max(0, (maxScroll - sy) / 250);
      }
      setBottomOpacity(newBottomOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initial check
    handleScroll();

    // Observe body height changes (e.g. dynamic contents or lazy loaded components)
    const observer = new MutationObserver(handleScroll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Top Gradual Blur */}
      <GradualBlur
        target="page"
        position="top"
        height={`${blurSize}px`}
        strength={blurMax}
        divCount={blurLayers}
        curve="bezier"
        exponential={true}
        zIndex={30}
        style={{
          opacity: 1,
        }}
        className={className}
      />

      {/* Bottom Gradual Blur */}
      <GradualBlur
        target="page"
        position="bottom"
        height={`${blurSize}px`}
        strength={blurMax}
        divCount={blurLayers}
        curve="bezier"
        exponential={true}
        zIndex={30}
        style={{
          opacity: bottomOpacity,
          transition: "opacity 0.3s ease-out",
        }}
        className={className}
      />
    </>
  );
};

export default CinematicBlur;
