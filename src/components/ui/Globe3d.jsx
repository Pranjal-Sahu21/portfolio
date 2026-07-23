import React from "react";

/**
 * Globe3d — A true 3D rotating wireframe globe built with pure CSS 3D transforms
 * and SVG rings. Features latitude/longitude lines with depth and rotation.
 */
export default function Globe3d({ className = "" }) {
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
          animation: "spin3d 14s linear infinite"
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
