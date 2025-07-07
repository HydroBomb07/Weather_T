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

  const addTrailPoint = useCallback((x, y, velocity = { x: 0, y: 0 }) => {
    const currentTime = Date.now();
    const point = {
      x,
      y,
      timestamp: currentTime,
      life: 1.0,
      size: Math.random() * 1.5 + 2, // Smaller, more refined particles
      velocity: {
        x: velocity.x * 0.2 + (Math.random() - 0.5) * 0.1,
        y: velocity.y * 0.2 + (Math.random() - 0.5) * 0.1,
      },
      originalX: x,
      originalY: y,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 8 + 3, // Smaller orbit radius
    };

    trailPoints.current.push(point);

    // Reduced trail length for better performance
    if (trailPoints.current.length > 35) {
      trailPoints.current.shift();
    }
  }, []);

  const updateAndRenderTrail = useCallback(() => {
    if (!ctx.current || !canvas.current) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime.current;
    lastTime.current = currentTime;

    // Clear canvas with smoother fade effect
    ctx.current.globalCompositeOperation = "source-over";
    ctx.current.fillStyle = "rgba(0, 0, 0, 0.08)"; // Gentler fade for smoother trails
    ctx.current.fillRect(
      0,
      0,
      canvas.current.width / window.devicePixelRatio,
      canvas.current.height / window.devicePixelRatio,
    );

    // Update trail points with smoother orbital movement
    trailPoints.current = trailPoints.current.filter((point) => {
      // Smoother exponential fade
      point.life *= Math.pow(0.96, deltaTime / 16); // Exponential decay for smoother fade

      // Gentler orbital movement
      point.orbitAngle += deltaTime * 0.0008;
      const fadeBasedOrbit = point.life * point.life; // Quadratic fade for smoother effect
      const orbitX =
        Math.cos(point.orbitAngle) * point.orbitRadius * fadeBasedOrbit;
      const orbitY =
        Math.sin(point.orbitAngle) * point.orbitRadius * fadeBasedOrbit;

      point.x =
        point.originalX + point.velocity.x * (1 - point.life) * 30 + orbitX;
      point.y =
        point.originalY + point.velocity.y * (1 - point.life) * 30 + orbitY;

      point.size *= 0.9995; // Much slower shrink for smoother effect
      point.orbitRadius *= 0.992; // Gradual orbit shrinking

      return point.life > 0.01; // Keep points longer for smoother fade
    });

    if (trailPoints.current.length > 1) {
      ctx.current.globalCompositeOperation = "lighter";

      // Draw smooth connecting curves instead of sharp lines
      for (let i = 0; i < trailPoints.current.length - 2; i++) {
        const current = trailPoints.current[i];
        const next = trailPoints.current[i + 1];
        const after = trailPoints.current[i + 2];

        if (!current || !next || !after) continue;

        // Calculate control points for smooth curves
        const cp1x = current.x + (next.x - current.x) * 0.5;
        const cp1y = current.y + (next.y - current.y) * 0.5;
        const cp2x = next.x + (after.x - current.x) * 0.1;
        const cp2y = next.y + (after.y - current.y) * 0.1;

        const alpha = Math.pow(current.life, 1.5); // Softer alpha curve

        // Soft gradient with more subtle colors
        const gradient = ctx.current.createLinearGradient(
          current.x,
          current.y,
          next.x,
          next.y,
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.4})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(236, 72, 153, ${alpha * 0.2})`);

        // Draw smooth curve with soft glow
        ctx.current.strokeStyle = gradient;
        ctx.current.lineWidth = current.size * alpha * 0.8; // Thinner lines
        ctx.current.lineCap = "round";
        ctx.current.lineJoin = "round";

        // Soft outer glow
        ctx.current.shadowColor = `rgba(139, 92, 246, ${alpha * 0.3})`;
        ctx.current.shadowBlur = 8;

        ctx.current.beginPath();
        ctx.current.moveTo(current.x, current.y);
        ctx.current.quadraticCurveTo(cp1x, cp1y, next.x, next.y);
        ctx.current.stroke();
      }

      // Draw subtle particle glow only for recent points
      trailPoints.current.forEach((point, index) => {
        if (index % 4 === 0 && point.life > 0.3) {
          // Less frequent, only bright points
          const alpha = Math.pow(point.life, 2); // Quadratic fade for softer appearance
          const size = point.size * alpha * 0.7;

          // Single soft glow instead of multiple layers
          const glowGradient = ctx.current.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            size * 2.5,
          );
          glowGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
          glowGradient.addColorStop(0.3, `rgba(139, 92, 246, ${alpha * 0.2})`);
          glowGradient.addColorStop(0.7, `rgba(59, 130, 246, ${alpha * 0.1})`);
          glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

          ctx.current.fillStyle = glowGradient;
          ctx.current.beginPath();
          ctx.current.arc(point.x, point.y, size * 2.5, 0, Math.PI * 2);
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
    let lastMousePos = { x: 0, y: 0 };
    let mouseVelocity = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;

      // Calculate velocity
      if (deltaTime > 0) {
        mouseVelocity.x = (e.clientX - lastMousePos.x) / deltaTime;
        mouseVelocity.y = (e.clientY - lastMousePos.y) / deltaTime;
      }

      // Update main cursor position
      if (mainCursor.current) {
        mainCursor.current.style.left = `${e.clientX - 6}px`;
        mainCursor.current.style.top = `${e.clientY - 6}px`;

        // Scale based on velocity for dynamic effect
        const speed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
        const scale = Math.min(1 + speed * 0.5, 2);
        mainCursor.current.style.transform = `scale(${scale})`;
      }

      if (currentTime - lastTime.current > 6) {
        // Higher frequency for smoother trail
        addTrailPoint(e.clientX, e.clientY, mouseVelocity);
        lastTime.current = currentTime;
      }

      lastMousePos = { x: e.clientX, y: e.clientY };
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
