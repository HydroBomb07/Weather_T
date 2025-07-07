import { useEffect, useCallback } from "react";

export const useCursorTrail = () => {
  const createTrailDot = useCallback((x, y) => {
    const dot = document.createElement("div");
    dot.className = "cursor-trail-dot";
    dot.style.left = `${x - 4}px`;
    dot.style.top = `${y - 4}px`;

    document.body.appendChild(dot);

    setTimeout(() => {
      if (document.body.contains(dot)) {
        document.body.removeChild(dot);
      }
    }, 800);
  }, []);

  useEffect(() => {
    let animationId;
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime > throttleDelay) {
        createTrailDot(e.clientX, e.clientY);
        lastTime = currentTime;
      }
    };

    const handleMouseEnter = () => {
      document.body.style.cursor = "none";
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);

      // Clean up any remaining trail dots
      const trailDots = document.querySelectorAll(".cursor-trail-dot");
      trailDots.forEach((dot) => {
        if (document.body.contains(dot)) {
          document.body.removeChild(dot);
        }
      });
    };
  }, [createTrailDot]);
};
