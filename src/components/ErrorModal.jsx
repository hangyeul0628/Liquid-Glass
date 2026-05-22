import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ErrorModal.css';

export default function ErrorModal({ isOpen, onClose, invalidTerm, onRecommendSearch }) {
  // 모달이 열려 있을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('error-modal-active');
    } else {
      document.body.classList.remove('error-modal-active');
    }
    return () => {
      document.body.classList.remove('error-modal-active');
    };
  }, [isOpen]);

  const recommendedKeywords = ['쉴드', '앰플', '에센스', '토너', '클렌저'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="error-modal-overlay" onClick={onClose}>
          <motion.div
            className="error-modal-card glass-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 장식 오라 글로우 */}
            <div className="error-glow" />

            {/* 닫기 버튼 */}
            <button className="error-modal-close-btn" onClick={onClose} aria-label="닫기">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* 모달 내용 */}
            <div className="error-modal-header">
              <div className="error-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="error-modal-title">검색 결과가 없습니다</h2>
              <p className="error-modal-subtitle">
                입력하신 검색어에 매칭되는 제품을 찾을 수 없습니다.
              </p>
            </div>

            <div className="error-search-box">
              <span className="invalid-query">"{invalidTerm}"</span>
              <span className="error-desc">는 리그라스 컬렉션에 등록되지 않은 용어입니다.</span>
            </div>

            {/* 추천 검색어 영역 */}
            <div className="recommend-section">
              <p className="recommend-title">이런 키워드로 검색해 보세요!</p>
              <div className="recommend-tags">
                {recommendedKeywords.map((keyword) => (
                  <motion.button
                    key={keyword}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="recommend-tag-btn"
                    onClick={() => {
                      if (onRecommendSearch) {
                        onRecommendSearch(keyword);
                      }
                      onClose();
                    }}
                  >
                    #{keyword}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 확인 버튼 */}
            <button className="error-confirm-btn" onClick={onClose}>
              <span>확인</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
