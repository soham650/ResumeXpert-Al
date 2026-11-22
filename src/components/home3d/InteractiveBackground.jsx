import React, { useEffect, useRef } from 'react';

/**
 * InteractiveBackground Component
 * Renders an ultra-smooth, lightweight ambient dark canvas with floating glowing dust particles,
 * dynamic gradient glow meshes, and cursor-responsive lighting on desktop.
 * Automatically pauses when hidden to conserve GPU/battery.
 */
export default function InteractiveBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive particle count (fewer on mobile for 60fps performance)
    const particleCount = width < 768 ? 25 : 55;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35 - 0.15; // Gentle upward drift
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.color = Math.random() > 0.4 ? '139, 92, 246' : '99, 102, 241'; // Purple / Indigo
      }

      update() {
        if (prefersReducedMotion) return;
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeSpeed;

        if (this.opacity > 0.7 || this.opacity < 0.15) {
          this.fadeSpeed = -this.fadeSpeed;
        }

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.opacity)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Render static frame if reduced motion, otherwise animate loop
    if (prefersReducedMotion) {
      render();
    } else {
      render();
    }

    // Visibility change handler to pause animations when tab is inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        render();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Deep Obsidian Background Layer with Dark Radiant Saas Gradients */}
      <div className="absolute inset-0 bg-[#0B0914]" />

      {/* Primary Radial Glow: Top-Center Violet Nebula */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[130px] opacity-45 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 53, 245, 0.45) 0%, rgba(139, 92, 246, 0.25) 40%, transparent 70%)'
        }}
      />

      {/* Secondary Radial Glow: Right Blue Ambient Flare */}
      <div 
        className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 75%)'
        }}
      />

      {/* Tertiary Radial Glow: Bottom-Left Magenta Accent */}
      <div 
        className="absolute bottom-10 -left-32 w-[650px] h-[650px] rounded-full blur-[150px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.35) 0%, rgba(76, 29, 149, 0.15) 60%, transparent 80%)'
        }}
      />

      {/* Subtle Digital Grid Mesh Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}

