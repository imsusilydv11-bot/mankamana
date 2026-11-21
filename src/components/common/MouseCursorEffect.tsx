import { useEffect, useRef } from 'react';

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  hue: 'gold' | 'ivory';
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export function MouseCursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!finePointer.matches || reducedMotion.matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mouseX = -200;
    let mouseY = -200;
    let prevX = -200;
    let prevY = -200;
    let ringX = -200;
    let ringY = -200;
    let ringRadius = 15;
    let targetRingRadius = 15;
    let activeVisible = false;
    let isHoveringInteractive = false;
    let isPressed = false;
    let rotationAngle = 0;

    const particles: SparkleParticle[] = [];
    const ripples: ClickRipple[] = [];
    const trail: TrailPoint[] = [];

    const interactiveSelector =
      'a, button, [role="button"], input, select, textarea, label[for], [data-interactive="true"]';

    const updateInteractiveState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        isHoveringInteractive = false;
        return;
      }
      isHoveringInteractive = Boolean(target.closest(interactiveSelector));
    };

    const spawnParticles = (x: number, y: number, speed: number) => {
      const count = speed > 22 ? 3 : speed > 7 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        if (particles.length >= 65) particles.shift();
        const angle = Math.random() * Math.PI * 2;
        const drift = 0.25 + Math.random() * 0.75;
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * drift,
          vy: Math.sin(angle) * drift - 0.35,
          size: 1.1 + Math.random() * 1.9,
          alpha: 0.7 + Math.random() * 0.25,
          decay: 0.018 + Math.random() * 0.016,
          hue: Math.random() > 0.28 ? 'gold' : 'ivory',
        });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;

      if (!activeVisible) {
        activeVisible = true;
        ringX = e.clientX;
        ringY = e.clientY;
        prevX = e.clientX;
        prevY = e.clientY;
      }

      mouseX = e.clientX;
      mouseY = e.clientY;
      updateInteractiveState(e.target);

      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        trail.push({ x: mouseX, y: mouseY, age: 1 });
        if (trail.length > 14) trail.shift();
        spawnParticles(mouseX, mouseY, dist);
        prevX = mouseX;
        prevY = mouseY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      isPressed = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: isHoveringInteractive ? 48 : 36,
        alpha: 0.55,
      });
      if (ripples.length > 6) ripples.shift();
    };

    const onPointerUp = () => {
      isPressed = false;
    };

    const onPointerLeave = () => {
      activeVisible = false;
      isHoveringInteractive = false;
      isPressed = false;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 2.5);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      if (activeVisible) {
        // Spring-damped follower ring
        const lerpFactor = 1 - Math.pow(0.82, dt);
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;

        targetRingRadius = isPressed ? 11 : isHoveringInteractive ? 24 : 15;
        ringRadius += (targetRingRadius - ringRadius) * (1 - Math.pow(0.8, dt));
        rotationAngle += (isHoveringInteractive ? 0.025 : 0.01) * dt;

        // 1. Subtle ambient golden cursor halo
        const glowRadius = isHoveringInteractive ? 92 : 68;
        const glow = ctx.createRadialGradient(ringX, ringY, 0, ringX, ringY, glowRadius);
        glow.addColorStop(0, isHoveringInteractive ? 'rgba(200, 160, 85, 0.14)' : 'rgba(200, 160, 85, 0.08)');
        glow.addColorStop(0.6, 'rgba(200, 160, 85, 0.025)');
        glow.addColorStop(1, 'rgba(200, 160, 85, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ringX, ringY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Silky fading gold motion ribbon
      if (trail.length > 1) {
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i].age -= 0.075 * dt;
          if (trail[i].age <= 0) {
            trail.splice(i, 1);
          }
        }
        if (trail.length > 1) {
          for (let i = 1; i < trail.length; i++) {
            const p0 = trail[i - 1];
            const p1 = trail[i];
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = `rgba(200, 160, 85, ${Math.max(0, p1.age * 0.28)})`;
            ctx.lineWidth = Math.max(0.6, p1.age * 1.8);
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }
      }

      // 3. Drifting golden sparkle particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 'gold'
            ? `rgba(200, 160, 85, ${p.alpha.toFixed(3)})`
            : `rgba(250, 249, 246, ${(p.alpha * 0.85).toFixed(3)})`;
        ctx.fill();
      }

      // 4. Click ripple waves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.14 * dt + 0.5 * dt;
        r.alpha -= 0.022 * dt;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 160, 85, ${r.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 5. Orbital outer ring & subtle rotating ticks
      if (activeVisible) {
        ctx.save();
        ctx.translate(ringX, ringY);
        ctx.rotate(rotationAngle);

        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isHoveringInteractive
          ? 'rgba(200, 160, 85, 0.75)'
          : 'rgba(200, 160, 85, 0.42)';
        ctx.lineWidth = isHoveringInteractive ? 1.35 : 1;
        ctx.stroke();

        // Four architectural compass ticks on the outer orbital ring
        const tickLen = isHoveringInteractive ? 4 : 2.5;
        ctx.strokeStyle = isHoveringInteractive
          ? 'rgba(219, 182, 109, 0.9)'
          : 'rgba(200, 160, 85, 0.55)';
        ctx.lineWidth = 1;
        for (let k = 0; k < 4; k++) {
          const a = (k * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (ringRadius - 1), Math.sin(a) * (ringRadius - 1));
          ctx.lineTo(Math.cos(a) * (ringRadius + tickLen), Math.sin(a) * (ringRadius + tickLen));
          ctx.stroke();
        }
        ctx.restore();

        // Crisp core golden pinpoint
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, isHoveringInteractive ? 2.8 : 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 160, 85, 0.9)';
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85]"
    />
  );
}
