import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AllNewsSection.css';
import { newsItems } from '../data/newsData';

export default function AllNewsSection({ onViewHome }) {
  const [activeItem, setActiveItem] = useState(null);

  const handleCardClick = (e, item) => {
    e.preventDefault();
    setActiveItem(item);
  };

  return (
    <section className="all-news-section">
      {/* 브레드크럼 */}
      <div className="news-breadcrumb">
        <span onClick={onViewHome} className="crumb-home">HOME</span>
        <span className="crumb-arrow">/</span>
        <span className="crumb-current">브랜드 소식</span>
      </div>

      {/* 헤더 영역 */}
      <div className="news-header">
        <h1 className="news-title">BRAND STORIES</h1>
        <p className="news-subtitle">
          Re:Glass의 최신 소식과 특별한 프로모션, 오프라인 이벤트 정보를 가장 먼저 만나보세요.
        </p>
      </div>

      {/* 뉴스 카드 그리드 */}
      <div className="news-grid-container">
        <div className="all-news-grid">
          {newsItems.map((item) => (
            <article key={item.id} className="all-news-card glass-card">
              <a href="#" className="news-card-link" onClick={(e) => handleCardClick(e, item)}>
                <div className="news-image-holder">
                  <img src={item.image} alt={item.title} className="news-card-image" />
                  <span className={`news-category-badge ${item.badgeClass}`}>{item.category}</span>
                </div>
                <div className="news-card-body">
                  <span className="news-date">{item.date}</span>
                  <h3 className="news-card-title">{item.title}</h3>
                  <p className="news-card-summary">{item.summary}</p>
                  <div className="news-card-footer">
                    <span className="read-more-text">READ ARTICLE</span>
                    <span className="arrow-icon">→</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* 하단 메인으로 이동 버튼 */}
      <div className="news-footer">
        <button className="btn-back-home" onClick={onViewHome}>
          <span className="arrow-left">←</span> 메인 화면으로 돌아가기
        </button>
      </div>

      {/* 상세 보기 프리미엄 모달 */}
      <AnimatePresence>
        {activeItem && (
          <div className="all-news-modal-overlay">
            <motion.div 
              className="all-news-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
            />

            <motion.div 
              className="all-news-detail-modal glass-card"
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: 'spring', stiffness: 300, damping: 26 }
              }}
              exit={{ 
                opacity: 0, 
                y: 40, 
                scale: 0.96,
                transition: { duration: 0.3 }
              }}
            >
              {/* 상단 붉은/푸른 오라 글로우 효과 데코레이션 */}
              <div className="modal-glow-decoration" />

              <button className="modal-close-btn" onClick={() => setActiveItem(null)} aria-label="닫기">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="modal-inner">
                {/* 모달 이미지 */}
                <div className="modal-image-wrapper">
                  <img src={activeItem.image} alt={activeItem.title} className="modal-banner-image" />
                  <span className={`modal-badge ${activeItem.badgeClass}`}>{activeItem.category}</span>
                </div>

                {/* 모달 텍스트 상세내용 */}
                <div className="modal-info-wrapper">
                  <span className="modal-date">{activeItem.date}</span>
                  <h3 className="modal-title">{activeItem.title}</h3>
                  <div className="modal-divider" />
                  
                  <div className="modal-content">
                    {activeItem.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>

                  {/* 하단 Action */}
                  <div className="modal-actions">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="modal-action-btn"
                      onClick={() => {
                        setActiveItem(null);
                        onViewHome();
                        // 렌더링 스크롤 유도를 위해 딜레이 추가
                        setTimeout(() => {
                          if (activeItem.id === 1) {
                            const el = document.getElementById('cta');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          } else if (activeItem.id === 2) {
                            const el = document.getElementById('bestseller');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            const el = document.getElementById('brandstore');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 150);
                      }}
                    >
                      {activeItem.ctaText}
                    </motion.button>
                    
                    <button className="modal-back-btn" onClick={() => setActiveItem(null)}>
                      목록으로 돌아가기
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
