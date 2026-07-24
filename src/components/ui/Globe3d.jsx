import React, { useState, useEffect, useRef } from "react";

/**
 * Globe3d — A true 3D rotating wireframe globe built with pure CSS 3D transforms
 * and SVG rings. Features latitude/longitude lines with dynamic depth, rotation,
 * and smooth mouse coordinate gaze tracking.
 */
export default function Globe3d({ className = "" }) {
  const [rotateX, setRotateX] = useState(20);
  const [rotateY, setRotateY] = useState(0);
  
  const isHovered = useRef(false);
  const animationFrameId = useRef(null);
  const autoSpinSpeed = 0.5; // degrees per frame
  const currentAutoY = useRef(0);
  const targetX = useRef(20);
  const targetY = useRef(0);

  useEffect(() => {
    // Continuous auto-rotation and interactive lerping loop
    const animate = () => {
      if (!isHovered.current) {
        // Slow continuous spin when not hovered
        currentAutoY.current = (currentAutoY.current + autoSpinSpeed) % 360;
        setRotateX((prev) => prev + (20 - prev) * 0.08); // Spring back to default X tilt
        setRotateY(currentAutoY.current);
      } else {
        // Smoothly interpolate towards target rotations from mouse gaze
        setRotateX((prev) => prev + (targetX.current - prev) * 0.08);
        setRotateY((prev) => {
          const nextY = prev + (targetY.current - prev) * 0.08;
          // Keep base autoY aligned so when we exit hover it doesn't jump
          currentAutoY.current = nextY % 360;
          return nextY;
        });
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // Mouse movement listener globally across viewport
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;

      // Normalized coordinates from -1 to 1 relative to viewport center
      const ndcX = (e.clientX / innerWidth) * 2 - 1;
      const ndcY = (e.clientY / innerHeight) * 2 - 1;

      // Only track interactive mouse moves in the upper half of screen (Hero area)
      if (e.clientY < innerHeight * 0.75) {
        isHovered.current = true;
        targetX.current = 20 - ndcY * 45; // range: -25deg to 65deg tilt
        targetY.current = currentAutoY.current + ndcX * 90; // range: -90deg to 90deg offset from current spin
      } else {
        isHovered.current = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div 
      className={`relative w-10 h-10 ${className}`} 
      style={{ perspective: "400px" }}
    >
      {/* Outer 3D Sphere Container */}
      <div 
        className="w-full h-full relative"
        style={{ 
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          willChange: "transform"
        }}
      >
        {/* Longitude Rings (Vertical) */}
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <div 
            key={`long-${deg}`}
            className="absolute inset-0 rounded-full border border-primary/35 dark:border-primary/50 transition-colors duration-300"
            style={{ 
              transform: `rotateY(${deg}deg)`,
              backfaceVisibility: "visible"
            }}
          />
        ))}

        {/* Equator (Horizontal - Center) */}
        <div 
          className="absolute inset-0 rounded-full border border-primary/30 dark:border-primary/45 transition-colors duration-300"
          style={{ 
            transform: "rotateX(90deg)",
            backfaceVisibility: "visible"
          }}
        />

        {/* Latitude Rings (Horizontal - Top & Bottom Offset) */}
        {/* Top 30deg (Radius: cos(30) = 86.6%, translateZ: sin(30) = 50% = 10px for 20px radius) */}
        <div 
          className="absolute w-[86.6%] h-[86.6%] left-[6.7%] top-[6.7%] rounded-full border border-primary/25 dark:border-primary/40 transition-colors duration-300"
          style={{ 
            transform: "rotateX(90deg) translateZ(10px)",
            backfaceVisibility: "visible"
          }}
        />
        {/* Top 60deg (Radius: cos(60) = 50%, translateZ: sin(60) = 86.6% = 17.3px) */}
        <div 
          className="absolute w-[50%] h-[50%] left-[25%] top-[25%] rounded-full border border-primary/20 dark:border-primary/35 transition-colors duration-300"
          style={{ 
            transform: "rotateX(90deg) translateZ(17.3px)",
            backfaceVisibility: "visible"
          }}
        />

        {/* Bottom 30deg */}
        <div 
          className="absolute w-[86.6%] h-[86.6%] left-[6.7%] top-[6.7%] rounded-full border border-primary/25 dark:border-primary/40 transition-colors duration-300"
          style={{ 
            transform: "rotateX(90deg) translateZ(-10px)",
            backfaceVisibility: "visible"
          }}
        />
        {/* Bottom 60deg */}
        <div 
          className="absolute w-[50%] h-[50%] left-[25%] top-[25%] rounded-full border border-primary/20 dark:border-primary/35 transition-colors duration-300"
          style={{ 
            transform: "rotateX(90deg) translateZ(-17.3px)",
            backfaceVisibility: "visible"
          }}
        />
      </div>
    </div>
  );
}
