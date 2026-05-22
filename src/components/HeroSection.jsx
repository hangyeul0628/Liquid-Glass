import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef(null);
  const orbRef = useRef(null);
  const glareRef = useRef(null);
  const bubbleContainerRef = useRef(null);
  const bubbleRefs = useRef([]);
  const mouseRef = useRef({ x: null, y: null });
  const prevMouseRef = useRef({ x: null, y: null });

  // 1. 마우스 무브 궤적 물방울 State (Fluid Trail)
  const [trailBubbles, setTrailBubbles] = useState([]);
  const trailRefs = useRef({}); // 각 궤적 물방울 엘리먼트에 직접 접근하기 위한 레퍼런스 딕셔너리
  const trailPhysics = useRef({}); // 궤적 물방울의 인메모리 물리 속성 저장

  // 2. 3D Orb 호버 반응형 미세기포 State
  const [microBubbles, setMicroBubbles] = useState([]);
  const orbIntervalRef = useRef(null);

  // 32개의 몽환적인 기본 상승 물방울의 초기 물리 속성 설정 (수량 32개로 상향, 크기 대폭 강화)
  const BUBBLE_COUNT = 20; // 스폰 개수를 줄여 화면을 정돈
  const bubbles = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
      // 대형 물방울 제거 및 은은한 미세 입자로 전환
      const rand = Math.random();
      let type = 'medium';
      let size = Math.floor(Math.random() * 8) + 14; // 14px ~ 22px 크기 하향
      if (rand > 0.6) {
        type = 'small';
        size = Math.floor(Math.random() * 4) + 8; // 8px ~ 12px 크기 하향
      }

      return {
        id: i,
        type,
        size,
        baseLeft: Math.random() * 100, // % 가로 위치
        speed: (Math.random() * 0.7 + 0.5) * (type === 'small' ? 0.75 : 1), // 상승 속도
        amplitude: Math.random() * 20 + 10, // 수평 흔들림 폭 축소
        frequency: Math.random() * 0.003 + 0.0015, // 흔들림 주기
        phase: Math.random() * Math.PI * 2, // 초기 위상
        opacity: type === 'small' ? (Math.random() * 0.12 + 0.08) : (Math.random() * 0.15 + 0.12),
      };
    });
  }, []);

  // 배경 물방울들의 실시간 물리 계산용 인메모리 데이터 Ref
  const bubblePhysics = useRef(
    bubbles.map((b) => ({
      y: Math.random() * 1200 + 100, // 화면 세로에 고르게 최초 분배
      x: 0,
      xOffset: 0, // 마우스 척력으로 밀려난 누적 값 X
      yOffset: 0, // 마우스 척력으로 밀려난 누적 값 Y
      targetXOffset: 0,
      targetYOffset: 0,
    }))
  );

  // 마우스 움직임 추적 및 유동 궤적 물방울 (Fluid Trail) 스폰 로직
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const currX = e.clientX - rect.left;
      const currY = e.clientY - rect.top;

      // 마우스 상대 좌표 (px 단위) 저장
      mouseRef.current = { x: currX, y: currY };

      // 3D Orb 각도 및 Glare 위치 처리
      const relativeX = currX / rect.width - 0.5;
      const relativeY = currY / rect.height - 0.5;

      if (orbRef.current) {
        orbRef.current.style.transform = `
          rotateY(${relativeX * 20}deg)
          rotateX(${-relativeY * 20}deg)
          scale(1.05)
        `;
      }

      if (glareRef.current) {
        glareRef.current.style.left = `${50 + relativeX * 40}%`;
        glareRef.current.style.top = `${50 + relativeY * 40}%`;
      }

      // [핵심] 마우스 궤적 물방울 (Fluid Trail) 생성
      const prevX = prevMouseRef.current.x;
      const prevY = prevMouseRef.current.y;

      if (prevX !== null && prevY !== null) {
        const dx = currX - prevX;
        const dy = currY - prevY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 마우스가 14px 이상 이동했을 때 궤적 물방울 스폰
        if (dist > 14) {
          // 3D Orb 위나 텍스트 블록 안에서는 궤적 물방울 스폰 제외 (상호작용 분리)
          if (!e.target.closest('.hero-product-wrapper') && !e.target.closest('.hero-text-block') && !e.target.closest('button')) {
            const count = 1; // 이동 단위 당 1~2개 생성
            const trailId = Date.now() + Math.random();

            // 마우스 속도 벡터 계산 (유체 관성으로 전달)
            const vx = dx * 0.32;
            const vy = dy * 0.32;
            const size = Math.floor(Math.random() * 16) + 12; // 12px ~ 28px 크고 맑은 물방울

            const newBubble = {
              id: trailId,
              x: currX,
              y: currY,
              size,
            };

            // 인메모리 물리 캐시에 등록 (React 렌더링 오버헤드 방지)
            trailPhysics.current[trailId] = {
              x: currX,
              y: currY,
              vx,
              vy,
              size,
              age: 0,
              maxAge: 90, // 약 1.5초 수명
            };

            setTrailBubbles((prev) => [...prev, newBubble]);
          }
        }
      }

      prevMouseRef.current = { x: currX, y: currY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
      prevMouseRef.current = { x: null, y: null };

      if (orbRef.current) {
        orbRef.current.style.transform = `
          rotateY(0deg)
          rotateX(0deg)
          scale(1)
        `;
      }
      if (glareRef.current) {
        glareRef.current.style.left = '30%';
        glareRef.current.style.top = '25%';
      }
    };

    hero.addEventListener('mousemove', handleMouseMove, { passive: true });
    hero.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 배경 32개 물방울 + 마우스 궤적 물방울 통합 60fps 물리 시뮬레이션
  useEffect(() => {
    let animFrameId;

    const updatePhysics = () => {
      if (!bubbleContainerRef.current) return;
      const containerRect = bubbleContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      const mouse = mouseRef.current;

      // ==========================================
      // PART A: 배경 상승 물방울 32개 물리 연산
      // ==========================================
      const bgPhysics = bubblePhysics.current;
      bgPhysics.forEach((p, i) => {
        const spec = bubbles[i];
        const el = bubbleRefs.current[i];
        if (!el) return;

        // 1. 상승 운동
        p.y -= spec.speed;
        if (p.y < -100) {
          p.y = containerHeight + Math.random() * 100 + 50;
          p.xOffset = 0;
          p.yOffset = 0;
          p.targetXOffset = 0;
          p.targetYOffset = 0;
        }

        // 2. 사인파 가로 잔물결 흔들림
        const waveX = Math.sin(p.y * spec.frequency + spec.phase) * spec.amplitude;
        const currentX = (spec.baseLeft / 100) * containerWidth + waveX;
        const currentY = p.y;

        // 3. 마우스 커서 척력 (Repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = (currentX + p.xOffset) - mouse.x;
          const dy = currentY - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 150; // 더 커진 물방울에 맞게 척력 범위 확장

          if (distance < repelRadius) {
            const force = (1 - distance / repelRadius) * 5.2; // 더 강한 밀어내기 힘
            const angle = Math.atan2(dy, dx);
            
            p.targetXOffset += Math.cos(angle) * force;
            p.targetYOffset += Math.sin(angle) * force * 0.6;
          }
        }

        // 4. 감쇠 진동 및 젤리 복원
        p.xOffset += (p.targetXOffset - p.xOffset) * 0.12;
        p.yOffset += (p.targetYOffset - p.yOffset) * 0.12;
        p.targetXOffset *= 0.92;
        p.targetYOffset *= 0.92;

        const finalX = currentX + p.xOffset;
        const finalY = currentY + p.yOffset;

        el.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
      });

      // ==========================================
      // PART B: 마우스 궤적 물방울 (Fluid Trail) 물리 연산
      // ==========================================
      const activeTrails = trailPhysics.current;
      const finishedIds = [];

      Object.keys(activeTrails).forEach((id) => {
        const p = activeTrails[id];
        const el = trailRefs.current[id];

        p.age += 1;

        if (p.age >= p.maxAge) {
          finishedIds.push(id);
          return;
        }

        // 1. 유체 물리: 관성 마찰 감쇠 및 부력 상승 적용
        p.vx *= 0.93; // 관성 마찰 감쇠 (부드러운 정지)
        p.vy = p.vy * 0.93 - 0.35; // 상승 부력 가속 (-Y 방향)

        p.x += p.vx;
        p.y += p.vy;

        // 2. 수명 주기 수축 및 페이드아웃 계수 연산
        const progress = p.age / p.maxAge;
        const scale = 1 - Math.pow(progress, 3.2); // 뒤로 갈수록 젤리처럼 급격하게 오그라듦
        const opacity = 1 - progress;

        // 3. 직접 DOM 고속 스타일 적용 (리렌더링을 차단한 비단결 60fps)
        if (el) {
          el.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0) scale(${scale})`;
          el.style.opacity = opacity;
        }
      });

      // 수명이 다한 물방울 캐시에서 제거 및 React state 동기화하여 DOM 회수
      if (finishedIds.length > 0) {
        finishedIds.forEach((id) => {
          delete activeTrails[id];
          delete trailRefs.current[id];
        });

        setTrailBubbles((prev) => prev.filter((b) => !finishedIds.includes(b.id.toString())));
      }

      animFrameId = requestAnimationFrame(updatePhysics);
    };

    animFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrameId);
  }, [bubbles]);

  // 3. 3D Orb 마우스 진입 시 뽀글뽀글 미세기포 분수 연출
  const handleOrbMouseEnter = () => {
    if (orbIntervalRef.current) clearInterval(orbIntervalRef.current);

    orbIntervalRef.current = setInterval(() => {
      const count = 2;
      const newMicro = Array.from({ length: count }).map((_, i) => {
        const spawnX = 140 + (Math.random() * 40 - 20); // 280px Orb 중앙 부근 X
        const spawnY = 220 + (Math.random() * 20 - 10); // Orb 하단 부근 Y
        
        const tx = (Math.random() * 80 - 40);
        const ty = -(Math.random() * 160 + 120);
        const size = Math.floor(Math.random() * 4) + 2.5;

        return {
          id: Date.now() + i + Math.random(),
          x: spawnX,
          y: spawnY,
          tx: `${tx}px`,
          ty: `${ty}px`,
          size,
        };
      });

      setMicroBubbles((prev) => {
        const merged = [...prev, ...newMicro];
        if (merged.length > 40) return merged.slice(merged.length - 40);
        return merged;
      });

      setTimeout(() => {
        setMicroBubbles((prev) => prev.slice(count));
      }, 1500);
    }, 180);
  };

  const handleOrbMouseLeave = () => {
    if (orbIntervalRef.current) {
      clearInterval(orbIntervalRef.current);
      orbIntervalRef.current = null;
    }
  };

  // 컴포넌트 언마운트 시 물리 타이머 소거
  useEffect(() => {
    return () => {
      if (orbIntervalRef.current) clearInterval(orbIntervalRef.current);
    };
  }, []);

  // GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-product-orb',
        { scale: 1, opacity: 1 },
        {
          scale: 2.5,
          opacity: 0,
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo('.hero-text-block',
        { y: 0, opacity: 1 },
        {
          y: -80,
          opacity: 0,
          scrollTrigger: {
            trigger: '.hero-section',
            start: '20% top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef} 
      className="section hero-section" 
      id="hero"
    >
      {/* Background Product Video */}
      <div className="hero-bg-image-container">
        <video
          src="/MAIN-V.mp4"
          className="hero-bg-product-video"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-bg-overlay" />
      </div>

      {/* 32개 Rising Water Bubbles + Fluid Trail Container */}
      <div ref={bubbleContainerRef} className="hero-bubbles-container">
        {/* 배경 상승 물방울 */}
        {bubbles.map((bubble, i) => (
          <div
            key={bubble.id}
            ref={(el) => (bubbleRefs.current[i] = el)}
            className={`hero-bubble bubble-${bubble.type}`}
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              opacity: bubble.opacity,
            }}
          />
        ))}

        {/* 실시간 마우스 궤적 물방울 (Fluid Trail) */}
        {trailBubbles.map((tb) => (
          <div
            key={tb.id}
            ref={(el) => {
              if (el) trailRefs.current[tb.id] = el;
            }}
            className="trail-bubble"
            style={{
              width: `${tb.size}px`,
              height: `${tb.size}px`,
            }}
          />
        ))}
      </div>

      {/* Background Gradient Orbs */}
      <div className="hero-bg-orbs">
        <div className="hero-bg-orb orb-1" />
        <div className="hero-bg-orb orb-2" />
        <div className="hero-bg-orb orb-3" />
      </div>



      {/* Text */}
      <motion.div
        className="hero-text-block"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ delay: 1.8, duration: 1.8, ease: [0.16, 1, 0.3, 1] }} /* 영상 선명 노출 후 등장하도록 딜레이 1.8초 부여 */
        style={{ pointerEvents: 'auto' }}
      >
        <motion.p
          className="hero-tag"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.8 }} /* 총 2.1초 딜레이 */
        >
          Liquid Glass Fade™
        </motion.p>
        <motion.h1
          className="hero-headline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 1 }} /* 총 2.4초 딜레이 */
        >
          푸석한 거칠음을 지나,
          <br />
          내 피부에 완벽한
          <br />
          <span className="typography-transparent">유리알 투명도를 박제하다.</span>
        </motion.h1>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }} /* 총 2.8초 딜레이 */
        >
          24시간 수분 보호막 기술로 완성되는, 당신만의 글래스 쉴드
        </motion.p>
        <motion.div
          className="hero-brand-watermark"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ delay: 3.2, duration: 1.2 }} /* 총 3.2초 딜레이 */
        >
          LIQUID GLASS FADE
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Scroll</span>
        <div className="arrow" />
      </motion.div>
    </section>
  );
}


