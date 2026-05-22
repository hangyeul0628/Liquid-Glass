import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './BreakSection.css';

export default function BreakSection() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx;
    const initGSAP = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      // Crack path data
      const crackPaths = [
        // Main vertical crack
        [
          { x: 0.5, y: 0 },
          { x: 0.48, y: 0.15 },
          { x: 0.52, y: 0.3 },
          { x: 0.46, y: 0.45 },
          { x: 0.5, y: 0.6 },
          { x: 0.54, y: 0.75 },
          { x: 0.48, y: 0.9 },
          { x: 0.5, y: 1 },
        ],
        // Branch crack left
        [
          { x: 0.48, y: 0.15 },
          { x: 0.35, y: 0.25 },
          { x: 0.25, y: 0.35 },
          { x: 0.15, y: 0.3 },
        ],
        // Branch crack right
        [
          { x: 0.52, y: 0.3 },
          { x: 0.65, y: 0.4 },
          { x: 0.75, y: 0.45 },
          { x: 0.85, y: 0.42 },
        ],
        // Small branch left-bottom
        [
          { x: 0.46, y: 0.45 },
          { x: 0.35, y: 0.55 },
          { x: 0.3, y: 0.65 },
        ],
        // Small branch right-bottom
        [
          { x: 0.54, y: 0.75 },
          { x: 0.65, y: 0.8 },
          { x: 0.72, y: 0.85 },
        ],
      ];

      const progressRef = { value: 0 };

      const drawCracks = (progress) => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        crackPaths.forEach((path, pathIndex) => {
          const pathDelay = pathIndex * 0.1;
          const pathProgress = Math.max(0, Math.min(1, (progress - pathDelay) / (1 - pathDelay)));

          if (pathProgress <= 0) return;

          const pointsToDraw = Math.floor(pathProgress * (path.length - 1)) + 1;

          // Main crack line
          context.beginPath();
          context.strokeStyle = `rgba(30, 58, 52, ${0.3 + progress * 0.4})`;
          context.lineWidth = pathIndex === 0 ? 2.5 : 1.5;
          context.lineCap = 'round';
          context.lineJoin = 'round';

          for (let i = 0; i < pointsToDraw && i < path.length; i++) {
            const px = path[i].x * canvas.width;
            const py = path[i].y * canvas.height;
            if (i === 0) context.moveTo(px, py);
            else context.lineTo(px, py);
          }
          context.stroke();

          // Glow around cracks
          context.beginPath();
          context.strokeStyle = `rgba(163, 198, 192, ${0.1 + progress * 0.15})`;
          context.lineWidth = pathIndex === 0 ? 8 : 5;
          context.filter = 'blur(4px)';

          for (let i = 0; i < pointsToDraw && i < path.length; i++) {
            const px = path[i].x * canvas.width;
            const py = path[i].y * canvas.height;
            if (i === 0) context.moveTo(px, py);
            else context.lineTo(px, py);
          }
          context.stroke();
          context.filter = 'none';
        });
      };

      ctx = gsap.context(() => {
        gsap.to(progressRef, {
          value: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.break-section',
            start: 'top center',
            end: 'bottom center',
            scrub: 1.5,
            onUpdate: (self) => {
              drawCracks(self.progress);
            },
          },
        });

        // Background gets murkier
        gsap.to('.break-section', {
          backgroundColor: 'rgba(200, 195, 190, 1)',
          scrollTrigger: {
            trigger: '.break-section',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        });

        // Floating Orbs Parallax Scroll Motion
        gsap.to('.orb-1', {
          y: -150,
          x: 60,
          scrollTrigger: {
            trigger: '.break-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          }
        });
        gsap.to('.orb-2', {
          y: 120,
          x: -70,
          scrollTrigger: {
            trigger: '.break-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.2,
          }
        });
        gsap.to('.orb-3', {
          y: -80,
          x: -50,
          scrollTrigger: {
            trigger: '.break-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        });

        // Text animation
        gsap.fromTo('.break-text-block', {
          y: 60,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: '.break-section',
            start: 'top 60%',
            end: 'top 30%',
            scrub: 1,
          },
        });
      });
    };
    initGSAP();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section break-section" id="break">
      {/* Background Floating Orbs */}
      <div className="break-bg-orb orb-1" />
      <div className="break-bg-orb orb-2" />
      <div className="break-bg-orb orb-3" />

      {/* Frosted Glass Texture Overlay */}
      <div className="break-texture-overlay" />

      {/* Crack Canvas */}
      <canvas ref={canvasRef} className="break-crack-canvas" />

      {/* Content */}
      <div className="break-text-block">
        <span className="break-tag">The Break</span>
        <h2 className="break-headline">
          밀리고, 뜨고, 빛을 잃은 얼굴.
          <br />
          <span className="break-highlight">당신의 수분 보호막</span>에
          <br />
          미세한 균열이 시작됐기 때문입니다.
        </h2>
        <p className="break-sub">
          외부 자극과 건조함에 무방비로 노출된 피부. 보이지 않는 균열이 피부 장벽을 무너뜨리고 있습니다.
        </p>
      </div>
    </section>
  );
}
