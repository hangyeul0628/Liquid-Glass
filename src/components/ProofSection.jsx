import { useEffect, useRef, useState } from 'react';
import './ProofSection.css';

const reviews = [
  {
    id: 1,
    name: '김지현',
    age: 29,
    badge: '직장인',
    text: '"아침에 바르고 저녁까지 메이크업이 밀리지 않아요. 진짜 유리알처럼 광이 나는 느낌이에요."',
    gauge: 35,
  },
  {
    id: 2,
    name: '이수연',
    age: 31,
    badge: '건성 피부',
    text: '"환절기에 꼭 뜨고 각질이 일었는데, 이 크림 쓰고 나서 트러블 없이 촉촉해요. 가볍고 끈적이지 않아서 좋아요."',
    gauge: 65,
  },
  {
    id: 3,
    name: '박서윤',
    age: 27,
    badge: '뷰티 블로거',
    text: '"성분도 자극 없이 순하고, 발림성이 진짜 좋습니다. 바르자마자 피부가 코팅되는 느낌? 99% 투명도 지수 납득해요."',
    gauge: 99,
  },
];

const clinicalData = [
  { label: '수분 보호막 강화', value: 97, unit: '%' },
  { label: '피부 결 개선', value: 94, unit: '%' },
  { label: '자극 테스트 통과', value: 100, unit: '%' },
];

export default function ProofSection() {
  const sectionRef = useRef(null);
  const [currentGauge, setCurrentGauge] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [counters, setCounters] = useState(clinicalData.map(() => 0));

  useEffect(() => {
    let ctx;
    const initGSAP = async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Sticky cylinder + card scrolling
        const cards = document.querySelectorAll('.proof-review-card');
        
        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
              setActiveCard(i);
              setCurrentGauge(reviews[i].gauge);
            },
            onEnterBack: () => {
              setActiveCard(i);
              setCurrentGauge(reviews[i].gauge);
            },
          });
        });

        // Clinical data counter animation
        const counterObj = { v0: 0, v1: 0, v2: 0 };
        gsap.to(counterObj, {
          v0: clinicalData[0].value,
          v1: clinicalData[1].value,
          v2: clinicalData[2].value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.proof-clinical-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            setCounters([
              Math.round(counterObj.v0),
              Math.round(counterObj.v1),
              Math.round(counterObj.v2),
            ]);
          },
        });

        // Fade in section title
        gsap.fromTo('.proof-header', {
          y: 40,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: '.proof-section',
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
          },
        });
      });
    };
    initGSAP();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section proof-section" id="proof">
      {/* Header */}
      <div className="proof-header">
        <span className="proof-tag">The Proof</span>
        <h2 className="proof-headline">
          자극 없는 네오 내추럴 성분으로 이뤄낸
          <br />
          <span className="proof-highlight">24시간 장벽 박제 효과</span>
        </h2>
        <p className="proof-sub-headline">
          24시간 흐려지지 않는 99% 투명도 지수.
        </p>
      </div>

      <div className="proof-content">
        {/* Left: Sticky Cylinder Gauge */}
        <div className="proof-gauge-wrapper">
          <div className="proof-cylinder">
            <div className="cylinder-glass">
              <div
                className="cylinder-fill"
                style={{ height: `${currentGauge}%` }}
              />
              <div className="cylinder-reflection" />
            </div>
            <div className="cylinder-value">
              <span className="cylinder-number">{currentGauge}</span>
              <span className="cylinder-unit">%</span>
            </div>
            <span className="cylinder-label">투명도 지수</span>
          </div>
        </div>

        {/* Right: Review Cards */}
        <div className="proof-reviews">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className={`proof-review-card glass-card ${activeCard === i ? 'active' : ''}`}
              data-hover
            >
              <div className="review-author">
                <div className="author-avatar">
                  {review.name[0]}
                </div>
                <div className="author-info">
                  <span className="author-name">{review.name}</span>
                  <span className="author-meta">{review.age}세 · {review.badge}</span>
                </div>
              </div>
              <p className="review-text">{review.text}</p>
              <div className="review-gauge-mini">
                <div className="review-gauge-bar">
                  <div
                    className="review-gauge-fill"
                    style={{ width: activeCard >= i ? `${review.gauge}%` : '0%' }}
                  />
                </div>
                <span className="review-gauge-label">투명도 {review.gauge}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Data Grid */}
      <div className="proof-clinical-grid">
        {clinicalData.map((data, i) => (
          <div key={i} className="clinical-card glass-card">
            <span className="clinical-value">
              {counters[i]}<small>{data.unit}</small>
            </span>
            <span className="clinical-label">{data.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
