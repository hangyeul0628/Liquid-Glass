import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RebuildSection.css';

const base = import.meta.env.BASE_URL;

export default function RebuildSection() {
  const scratchCanvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchParticles, setScratchParticles] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const frostedImageRef = useRef(null);
  
  // 마우스 스크래치 끊김 방지를 위한 이전 좌표 기록용 Ref
  const lastXRef = useRef(null);
  const lastYRef = useRef(null);

  // Preload frosted overlay image
  useEffect(() => {
    const img = new Image();
    img.src = `${base}images/frosted_rough_surface.png`;
    img.onload = () => {
      frostedImageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Scratch & Reveal interaction
  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    const resizeAndDraw = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Draw loaded frosted image to fit the canvas perfectly
      if (frostedImageRef.current) {
        ctx.drawImage(frostedImageRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback frosted texture
        ctx.fillStyle = 'rgba(200, 195, 190, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Add a slight frosted glass shimmer noise overlay
      for (let i = 0; i < canvas.width * canvas.height * 0.015; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.12})`;
        ctx.fillRect(x, y, 1, 1);
      }
    };
    resizeAndDraw();

    // Resize handler
    window.addEventListener('resize', resizeAndDraw);

    // 마우스의 이전 좌표부터 현재 좌표까지 선형 보간하여 촘촘하게 긁어내는 함수
    const scratch = (startX, startY, endX, endY) => {
      const brushRadius = 38;
      ctx.globalCompositeOperation = 'destination-out';

      // 두 좌표 사이의 거리 계산
      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 거리 기준 약 5px 단위로 촘촘히 쪼개서 보간 원들을 드로잉 (끊김 방지 핵심)
      const steps = Math.max(1, Math.ceil(distance / 5));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = startX + dx * t;
        const cy = startY + dy * t;

        // 투명 브러시 그라데이션 생성 (가장자리를 부드럽게 깎아냄)
        const grad = ctx.createRadialGradient(cx, cy, brushRadius * 0.3, cx, cy, brushRadius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, brushRadius, 0, Math.PI * 2);
        ctx.fill();

        // 파티클 생성은 보간 좌표마다 약 15%의 확률로 은은하게 조율 (렉 발생 억제)
        if (Math.random() < 0.15) {
          spawnParticles(cx, cy);
        }
      }

      // Check reveal percentage
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] < 100) transparent++;
      }
      const totalPixels = canvas.width * canvas.height;
      const pct = transparent / totalPixels;

      // 40% 이상 복원 시 우아하게 클리어 완료 처리
      if (pct > 0.40 && !isRevealed) {
        setIsRevealed(true);
      }
    };

    const spawnParticles = (x, y) => {
      const newParticles = Array.from({ length: 3 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3.5;
        return {
          id: Math.random() + Date.now(),
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2, // slight upward float
          size: 3 + Math.random() * 5,
          color: Math.random() > 0.3 ? 'rgba(163, 198, 192, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          opacity: 1,
        };
      });

      setScratchParticles((prev) => [...prev, ...newParticles].slice(-40)); // cap at 40 max particles for performance
    };

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onStart = (e) => {
      if (isRevealed) return;
      isDrawing = true;
      const pos = getPos(e);
      lastXRef.current = pos.x;
      lastYRef.current = pos.y;
      scratch(pos.x, pos.y, pos.x, pos.y);
    };

    const onMove = (e) => {
      if (!isDrawing || isRevealed) return;
      e.preventDefault();
      const pos = getPos(e);
      
      const startX = lastXRef.current !== null ? lastXRef.current : pos.x;
      const startY = lastYRef.current !== null ? lastYRef.current : pos.y;

      scratch(startX, startY, pos.x, pos.y);

      lastXRef.current = pos.x;
      lastYRef.current = pos.y;
    };

    const onEnd = () => {
      isDrawing = false;
      lastXRef.current = null;
      lastYRef.current = null;
    };

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('mouseleave', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('resize', resizeAndDraw);
      canvas.removeEventListener('mousedown', onStart);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onEnd);
      canvas.removeEventListener('mouseleave', onEnd);
      canvas.removeEventListener('touchstart', onStart);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onEnd);
    };
  }, [imageLoaded, isRevealed]);

  // Handle drag particles physics animation
  useEffect(() => {
    if (scratchParticles.length === 0) return;

    const interval = setInterval(() => {
      setScratchParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.08, // gravity
            opacity: p.opacity - 0.045,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [scratchParticles]);

  // GSAP animations
  useEffect(() => {
    let ctx;
    const initGSAP = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Liquid wipe effect
        gsap.fromTo('.rebuild-wipe', {
          scaleY: 0,
          transformOrigin: 'top center',
        }, {
          scaleY: 1,
          scrollTrigger: {
            trigger: '.rebuild-section',
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        });

        // Floating Orbs Parallax Scroll Motion for RebuildSection
        gsap.to('.rebuild-orb-1', {
          y: -140,
          x: 50,
          scrollTrigger: {
            trigger: '.rebuild-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          }
        });
        gsap.to('.rebuild-orb-2', {
          y: 100,
          x: -60,
          scrollTrigger: {
            trigger: '.rebuild-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.4,
          }
        });
        gsap.to('.rebuild-orb-3', {
          y: -70,
          x: -40,
          scrollTrigger: {
            trigger: '.rebuild-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          }
        });

        // Text slide in
        gsap.fromTo('.rebuild-text-content', {
          x: -60,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: '.rebuild-section',
            start: 'top 50%',
            end: 'top 20%',
            scrub: 1,
          },
        });

        // Particles fill animation
        gsap.fromTo('.rebuild-particles .particle', {
          scale: 0,
          opacity: 0,
        }, {
          scale: 1,
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.rebuild-section',
            start: 'top 40%',
            end: 'center center',
            scrub: 1,
          },
        });
      });
    };
    initGSAP();
    return () => ctx?.revert();
  }, []);

  const decorativeParticles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 6 + Math.random() * 14,
  }));

  return (
    <section ref={sectionRef} className="section rebuild-section" id="rebuild">
      {/* Background Floating Orbs */}
      <div className="rebuild-bg-orb rebuild-orb-1" />
      <div className="rebuild-bg-orb rebuild-orb-2" />
      <div className="rebuild-bg-orb rebuild-orb-3" />

      {/* Liquid Wipe Overlay */}
      <div className="rebuild-wipe" />

      <div className="rebuild-container">
        {/* Left: Text */}
        <div className="rebuild-text-content">
          <span className="rebuild-tag">The Rebuild</span>
          <h2 className="rebuild-headline">
            틈새를 메우는
            <br />
            <span className="rebuild-highlight">마이크로 젤-클레이 포뮬러.</span>
            <br />
            무게감 없는 투명 유리막으로
            <br />
            코팅합니다.
          </h2>
          <p className="rebuild-sub">
            미세한 장벽 틈새를 빈틈없이 채우고, 무게감 없는 투명 보호막으로
            피부를 감싸 24시간 끊김 없는 수분 장벽을 완성합니다.
          </p>

          {/* Comparison */}
          <div className="rebuild-compare">
            <div className="compare-item compare-before">
              <div className="compare-bar">
                <div className="compare-fill" style={{ width: '35%' }} />
              </div>
              <span className="compare-label">일반 크림 흡수율</span>
              <span className="compare-value">35%</span>
            </div>
            <div className="compare-item compare-after">
              <div className="compare-bar">
                <div className="compare-fill accent" style={{ width: '92%' }} />
              </div>
              <span className="compare-label">글래스 쉴드 흡수율</span>
              <span className="compare-value">92%</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Scratch & Reveal Area */}
        <div className="rebuild-interactive">
          <div className="rebuild-reveal-area">
            
            {/* Beneath layer: Clear glass skin image with floating particles */}
            <div className="rebuild-clean-surface">
              <img 
                src={`${base}images/clear_glass_skin.png`}
                alt="Clear Radiant Glass Skin" 
                className="clean-skin-image" 
              />
              
              {/* Sparkling overlay wipe animation when completely revealed */}
              <div className={`rebuild-glow-wave ${isRevealed ? 'trigger-glow' : ''}`} />
              
              {/* Floating beauty bubbles and sparkles on clean skin */}
              <div className="rebuild-particles">
                {decorativeParticles.map((p) => (
                  <div
                    key={p.id}
                    className="particle"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                    }}
                  />
                ))}
              </div>
              
              {isRevealed && (
                <div className="clean-glass-label-wrapper">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="clean-glass-label"
                  >
                    <span>99.8% 장벽 유리막 복원 완료</span>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Drag physical sparkling particles (dynamic rendering via React) */}
            <div className="scratch-particles-container">
              {scratchParticles.map((p) => (
                <div
                  key={p.id}
                  className="scratch-sparkle"
                  style={{
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    background: p.color,
                    opacity: p.opacity,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>

            {/* Frosted scratch-off canvas layer */}
            <canvas 
              ref={scratchCanvasRef} 
              className={`scratch-canvas ${isRevealed ? 'fully-cleared' : ''}`}
              data-hover 
            />

            {/* Instruction hand swipe hint */}
            {!isRevealed && imageLoaded && (
              <div className="scratch-hint">
                <div className="hint-hand-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3m-2-5v5M8 9V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6v-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>드래그하여 맑은 장벽 복원하기</span>
              </div>
            )}

            {!imageLoaded && (
              <div className="scratch-loader">
                <div className="loader-ring" />
                <span>장벽 쉴드 텍스처 불러오는 중...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
