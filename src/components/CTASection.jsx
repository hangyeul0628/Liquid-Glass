import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './CTASection.css';

const ctaOptions = [
  {
    id: 'button-option-1',
    label: '완벽한 유리알 장벽 시작하기',
    desc: '정품 50ml',
    price: '₩48,000',
    popular: false,
    product: {
      id: 101,
      name: '완벽한 유리알 장벽 크림 (정품 50ml)',
      price: 48000,
      discount: 0,
      imgDefault: '/images/new_best1.jpg'
    }
  },
  {
    id: 'button-option-2',
    label: '3일 체험 키트 무상으로 받기',
    desc: '무료 체험',
    price: 'FREE',
    popular: true,
    product: {
      id: 102,
      name: '글래스모피즘 3일 체험 키트',
      price: 0,
      discount: 0,
      imgDefault: '/images/trial_kit_banner.png'
    }
  },
  {
    id: 'button-option-3',
    label: '내 피부에 맑은 투명도 박제하기',
    desc: '세트 구성',
    price: '₩89,000',
    popular: false,
    product: {
      id: 103,
      name: '내 피부에 맑은 투명도 박제 세트 (크림+에센스)',
      price: 89000,
      discount: 0,
      imgDefault: '/images/clinical_test_banner.png'
    }
  },
];

export default function CTASection({ onAddToCart }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx;
    const initGSAP = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Blur clear-up on enter
        gsap.fromTo('.cta-section', {
          filter: 'blur(20px)',
        }, {
          filter: 'blur(0px)',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          },
        });

        // Gradient color shift
        gsap.fromTo('.cta-bg-gradient', {
          background: 'linear-gradient(135deg, rgba(163,198,192,0.3) 0%, rgba(163,198,192,0.1) 100%)',
        }, {
          background: 'linear-gradient(135deg, rgba(255,158,128,0.2) 0%, rgba(163,198,192,0.1) 50%, rgba(255,158,128,0.15) 100%)',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 50%',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        // Cards stagger in
        gsap.fromTo('.cta-option-card', {
          y: 60,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.cta-options',
            start: 'top 75%',
            end: 'top 45%',
            scrub: 1,
          },
        });
      });
    };
    initGSAP();
    return () => ctx?.revert();
  }, []);

  // Button hover magnetic effect
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    const glassLayer = btn.querySelector('.btn-glass-layer');
    if (glassLayer) {
      glassLayer.style.left = `${e.clientX - rect.left}px`;
      glassLayer.style.top = `${e.clientY - rect.top}px`;
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
  };

  return (
    <section ref={sectionRef} className="section cta-section" id="cta">
      <div className="cta-bg-gradient" />

      {/* Decorative Orbs */}
      <div className="cta-bg-orbs">
        <div className="cta-orb cta-orb-1" />
        <div className="cta-orb cta-orb-2" />
      </div>

      <div className="cta-content">
        <motion.div
          className="cta-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="cta-tag">Ritual Certificate</span>
          <h2 className="cta-headline">
            오늘부터, 당신의 일상에
            <br />
            <span className="cta-headline-highlight">깨지지 않는 맑음</span>을
            <br />
            선물하세요.
          </h2>
          <p className="cta-sub">
            글래스모피즘 쉴드 앰플 크림으로 시작하는 나만의 투명 피부 리추얼
          </p>
        </motion.div>

        <div className="cta-options">
          {ctaOptions.map((option) => (
            <div
              key={option.id}
              className={`cta-option-card glass-card ${option.popular ? 'popular' : ''}`}
            >
              {option.popular && (
                <div className="popular-badge">BEST</div>
              )}
              <span className="option-price">{option.price}</span>
              <span className="option-desc">{option.desc}</span>
              <button
                id={option.id}
                className="cta-button"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => onAddToCart && onAddToCart(option.product)}
                data-hover
              >
                <div className="btn-glass-layer" />
                <span>{option.label}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="cta-trust">
          <span className="trust-item">피부과 테스트 완료</span>
          <span className="trust-divider">·</span>
          <span className="trust-item">비건 인증</span>
          <span className="trust-divider">·</span>
          <span className="trust-item">무료 배송</span>
        </div>
      </div>
    </section>
  );
}
