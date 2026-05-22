import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    targetRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseOver = useCallback((e) => {
    const isInteractive = e.target.closest('button, a, input, select, textarea, label, [data-hover]');
    if (isInteractive && cursorRef.current) {
      cursorRef.current.classList.add('hovering');
    }
  }, []);

  const handleMouseOut = useCallback((e) => {
    const isInteractive = e.target.closest('button, a, input, select, textarea, label, [data-hover]');
    if (isInteractive && cursorRef.current) {
      cursorRef.current.classList.remove('hovering');
    }
  }, []);

  const handleClick = useCallback((e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }, []);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(max-width: 1024px)').matches;
    if (isTouchDevice) return;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('click', handleClick);

    let rafId;
    const previousPos = { x: 0, y: 0 };
    let currentGlowX = 0;
    let currentGlowY = 0;

    const animate = () => {
      // 1. 메인 커서 속도 증가 (0.15 -> 0.3)
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.3;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.3;

      // 2. 물이 흐르는 느낌 (Velocity 기반 스케일 & 회전)
      const velX = posRef.current.x - previousPos.x;
      const velY = posRef.current.y - previousPos.y;
      previousPos.x = posRef.current.x;
      previousPos.y = posRef.current.y;

      const speed = Math.sqrt(velX * velX + velY * velY);
      const angle = Math.atan2(velY, velX) * (180 / Math.PI);
      
      const scaleX = 1 + Math.min(speed * 0.03, 1.5);
      const scaleY = 1 - Math.min(speed * 0.005, 0.3);

      if (cursorRef.current) {
        cursorRef.current.style.left = `${posRef.current.x}px`;
        cursorRef.current.style.top = `${posRef.current.y}px`;
        cursorRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      }
      
      // 3. 물결 꼬리 효과 (Glow가 조금 더 느리게 따라오게 하여 잔상 연출)
      currentGlowX += (targetRef.current.x - currentGlowX) * 0.12;
      currentGlowY += (targetRef.current.y - currentGlowY) * 0.12;
      
      if (glowRef.current) {
        glowRef.current.style.left = `${currentGlowX}px`;
        glowRef.current.style.top = `${currentGlowY}px`;
      }
      
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseOut, handleClick]);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={glowRef} className="cursor-glow" />
    </>
  );
}
