import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('login-modal-active');
    } else {
      document.body.classList.remove('login-modal-active');
    }
    return () => {
      document.body.classList.remove('login-modal-active');
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="login-modal-card glass-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* 모달 헤더 */}
            <div className="modal-header">
              <h2 className="modal-title">
                <span className="brand-prefix">Re:</span>Glass
              </h2>
              <p className="modal-subtitle">당신의 피부를 투명한 유리알처럼 복원할 시간</p>
            </div>

            {/* 로그인 폼 */}
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label htmlFor="email">이메일 주소</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  required
                  className="modal-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="modal-input"
                />
              </div>

              <div className="form-actions">
                <label className="remember-me">
                  <input type="checkbox" className="modal-checkbox" />
                  <span>로그인 유지</span>
                </label>
                <a href="#" className="forgot-password">비밀번호를 잊으셨나요?</a>
              </div>

              <button type="submit" className="modal-login-btn">
                <span>로그인</span>
              </button>
            </form>

            {/* 소셜 로그인 */}
            <div className="divider">
              <span>또는 간편 로그인</span>
            </div>

            <div className="social-login-group">
              <button className="social-btn kakao">
                <span className="social-icon kakao-icon" />
                <span>카카오톡으로 시작</span>
              </button>
              <button className="social-btn google">
                <span className="social-icon google-icon" />
                <span>Google 계정으로 시작</span>
              </button>
            </div>

            {/* 푸터 */}
            <div className="modal-footer">
              <span>아직 리그라스 회원이 아니신가요?</span>
              <a href="#" className="signup-link">회원가입</a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
