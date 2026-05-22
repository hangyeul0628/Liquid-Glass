import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NewsEventSection.css';
import { newsItems } from '../data/newsData';

const NewsEventSection = ({ onViewAll }) => {
  const [activeItem, setActiveItem] = useState(null);

  const handleCardClick = (e, item) => {
    e.preventDefault();
    setActiveItem(item);
  };

  return (
    <section className="news-event-section" id="news-event">
      <div className="section-container">
        <div className="section-header">
          <div className="title-area">
            <span className="sub-title">BRAND STORIES & EVENTS</span>
            <h2 className="main-title">NEWS & EVENT</h2>
          </div>
          <a href="#all-news" className="view-all-btn" onClick={(e) => {
            e.preventDefault();
            if (onViewAll) onViewAll();
          }}>
            VIEW ALL <span className="arrow">+</span>
          </a>
        </div>

        <div className="news-grid">
          {newsItems.map((item) => (
            <article key={item.id} className="news-card">
              <a href="#" className="card-link-wrapper" onClick={(e) => handleCardClick(e, item)}>
                <div className="card-image-holder">
                  <img src={item.image} alt={item.title} className="card-image" />
                  <span className={`category-badge ${item.badgeClass}`}>{item.category}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-summary">{item.summary}</p>
                  <div className="card-footer">
                    <span className="card-date">{item.date}</span>
                    <span className="card-more">READ MORE →</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* 프리미엄 상세 설명 글래스모피즘 모달 페이지 */}
      <AnimatePresence>
        {activeItem && (
          <div className="news-modal-overlay">
            {/* 배경 블러 페이드인 */}
            <motion.div 
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
            />

            {/* 카드 팝업 슬라이드업 */}
            <motion.div 
              className="news-detail-modal glass-card"
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
              {/* 닫기 버튼 */}
              <button className="modal-close-btn" onClick={() => setActiveItem(null)} aria-label="닫기">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="modal-inner">
                {/* 왼쪽: 미디어 배너 이미지 */}
                <div className="modal-image-wrapper">
                  <img src={activeItem.image} alt={activeItem.title} className="modal-banner-image" />
                  <span className={`modal-badge ${activeItem.badgeClass}`}>{activeItem.category}</span>
                </div>

                {/* 오른쪽: 상세 정보 텍스트 */}
                <div className="modal-info-wrapper">
                  <span className="modal-date">{activeItem.date}</span>
                  <h3 className="modal-title">{activeItem.title}</h3>
                  <div className="modal-divider" />
                  
                  {/* 여러 문단으로 나누어 렌더링 */}
                  <div className="modal-content">
                    {activeItem.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>

                  {/* 맞춤형 Action CTA 버튼 */}
                  <div className="modal-actions">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="modal-action-btn"
                      onClick={() => {
                        setActiveItem(null);
                        // 프로모션은 CTA로 스크롤, 뉴스는 제품 섹션 이동 등 시나리오 연결
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
};

export default NewsEventSection;
