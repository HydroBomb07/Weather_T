import { useEffect, useCallback, useRef } from "react";

export const useCursorTrail = () => {
  const trailPoints = useRef([]);
  const animationId = useRef(null);
  const lastTime = useRef(0);
  const canvas = useRef(null);
  const ctx = useRef(null);
  const mainCursor = useRef(null);

  const initCanvas = useCallback(() => {
    // Create main cursor element
    mainCursor.current = document.createElement("div");
    mainCursor.current.className = "cursor-main";
    document.body.appendChild(mainCursor.current);

    // Create canvas for smooth trail rendering
    canvas.current = document.createElement("canvas");
    canvas.current.style.position = "fixed";
    canvas.current.style.top = "0";
    canvas.current.style.left = "0";
    canvas.current.style.pointerEvents = "none";
    canvas.current.style.zIndex = "9999";
    canvas.current.style.mixBlendMode = "screen";

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.current.width = window.innerWidth * window.devicePixelRatio;
      canvas.current.height = window.innerHeight * window.devicePixelRatio;
      canvas.current.style.width = window.innerWidth + "px";
      canvas.current.style.height = window.innerHeight + "px";

      if (ctx.current) {
        ctx.current.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    ctx.current = canvas.current.getContext("2d");
    ctx.current.scale(window.devicePixelRatio, window.devicePixelRatio);
    document.body.appendChild(canvas.current);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (canvas.current && document.body.contains(canvas.current)) {
        document.body.removeChild(canvas.current);
      }
      if (mainCursor.current && document.body.contains(mainCursor.current)) {
        document.body.removeChild(mainCursor.current);
      }
    };
  }, []);

  const addTrailPoint = useCallback((x, y) => {
    const currentTime = Date.now();
    const point = {
      x,
      y,
      timestamp: currentTime,
      life: 1.0,
      size: Math.random() * 3 + 2,
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
    };

    trailPoints.current.push(point);

    // Limit trail length for performance
    if (trailPoints.current.length > 50) {
      trailPoints.current.shift();
    }
  }, []);

  const updateAndRenderTrail = useCallback(() => {
    if (!ctx.current || !canvas.current) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime.current;
    lastTime.current = currentTime;

    // Clear canvas with fade effect
    ctx.current.globalCompositeOperation = "source-over";
    ctx.current.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

    // Update trail points
    trailPoints.current = trailPoints.current.filter((point) => {
      // Update point properties
      point.life -= deltaTime * 0.003; // Fade over time
      point.x += point.velocity.x;
      point.y += point.velocity.y;
      point.size *= 0.99; // Shrink over time

      return point.life > 0;
    });

    if (trailPoints.current.length > 1) {
      // Create gradient trail effect
      ctx.current.globalCompositeOperation = "lighter";

      // Draw connecting lines with gradient
      for (let i = 0; i < trailPoints.current.length - 1; i++) {
        const current = trailPoints.current[i];
        const next = trailPoints.current[i + 1];

        if (!current || !next) continue;

        // Create gradient for the line segment
        const gradient = ctx.current.createLinearGradient(
          current.x,
          current.y,
          next.x,
          next.y,
        );

        const currentAlpha = current.life * 0.8;
        const nextAlpha = next.life * 0.8;

        gradient.addColorStop(0, `rgba(59, 130, 246, ${currentAlpha})`);
        gradient.addColorStop(
          0.3,
          `rgba(139, 92, 246, ${(currentAlpha + nextAlpha) / 2})`,
        );
        gradient.addColorStop(
          0.7,
          `rgba(236, 72, 153, ${(currentAlpha + nextAlpha) / 2})`,
        );
        gradient.addColorStop(1, `rgba(245, 158, 11, ${nextAlpha})`);

        // Draw line with glow effect
        ctx.current.strokeStyle = gradient;
        ctx.current.lineWidth =
          Math.max(current.size, next.size) * current.life;
        ctx.current.lineCap = "round";
        ctx.current.lineJoin = "round";

        // Outer glow
        ctx.current.shadowColor = `rgba(139, 92, 246, ${current.life * 0.8})`;
        ctx.current.shadowBlur = 15;

        ctx.current.beginPath();
        ctx.current.moveTo(current.x, current.y);
        ctx.current.lineTo(next.x, next.y);
        ctx.current.stroke();

        // Inner bright line
        ctx.current.shadowBlur = 5;
        ctx.current.shadowColor = `rgba(255, 255, 255, ${current.life * 0.6})`;
        ctx.current.lineWidth =
          Math.max(current.size, next.size) * current.life * 0.3;
        ctx.current.stroke();
      }

      // Draw glowing particles at trail points
      trailPoints.current.forEach((point, index) => {
        if (index % 3 === 0) {
          // Every 3rd point for performance
          const alpha = point.life;
          const size = point.size * alpha;

          // Outer glow
          const glowGradient = ctx.current.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            size * 3,
          );
          glowGradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.8})`);
          glowGradient.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.4})`);
          glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

          ctx.current.fillStyle = glowGradient;
          ctx.current.beginPath();
          ctx.current.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
          ctx.current.fill();

          // Core particle
          const coreGradient = ctx.current.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            size,
          );
          coreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          coreGradient.addColorStop(0.8, `rgba(139, 92, 246, ${alpha * 0.8})`);
          coreGradient.addColorStop(1, "rgba(139, 92, 246, 0)");

          ctx.current.fillStyle = coreGradient;
          ctx.current.beginPath();
          ctx.current.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.current.fill();
        }
      });

      // Reset shadow
      ctx.current.shadowBlur = 0;
    }

    animationId.current = requestAnimationFrame(updateAndRenderTrail);
  }, []);

  useEffect(() => {
    const cleanupCanvas = initCanvas();

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime.current > 8) {
        // Higher frequency for smoother trail
        addTrailPoint(e.clientX, e.clientY);
        lastTime.current = currentTime;
      }
    };

    const handleMouseEnter = () => {
      document.body.style.cursor = "none";
      // Start animation loop
      if (!animationId.current) {
        updateAndRenderTrail();
      }
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "default";
      // Keep animation running to fade out trail
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Start animation loop
    updateAndRenderTrail();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);

      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }

      cleanupCanvas();
    };
  }, [initCanvas, addTrailPoint, updateAndRenderTrail]);
};
