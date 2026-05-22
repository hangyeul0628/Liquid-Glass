import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

export default function Navbar({ view, onViewChange, onLoginOpen, onCartOpen, cartCount, onSearch }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchClick = () => {
    if (!searchOpen) {
      setSearchOpen(true);
    } else {
      if (searchQuery.trim()) {
        handleSearchSubmit();
      } else {
        setSearchOpen(false);
      }
    }
  };

  // 영리한 네비게이션 앵커 및 뷰 복합 핸들러
  const handleNavClick = (e, targetView, anchorId) => {
    if (targetView === 'home') {
      if (view !== 'home') {
        // 전체 제품 화면에 있을 경우 홈 뷰로 전환 후 스크롤 이동
        onViewChange('home');
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        // 이미 홈 뷰인 경우 바로 부드러운 앵커 스크롤
        e.preventDefault();
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (targetView === 'products') {
      e.preventDefault();
      onViewChange('products');
    } else if (targetView === 'news') {
      e.preventDefault();
      onViewChange('news');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* 왼쪽: 브랜드명 */}
        <a 
          href="#" 
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault();
            onViewChange('home');
          }}
        >
          <span className="brand-text">
            <span className="brand-prefix">Re:</span>Glass
          </span>
        </a>

        {/* 가운데: 메뉴 */}
        <ul className="navbar-menu">
          <li>
            <a 
              href="#bestseller" 
              onClick={(e) => handleNavClick(e, 'home', 'bestseller')}
            >
              베스트셀러
            </a>
          </li>
          <li>
            <a 
              href="#brandstore" 
              onClick={(e) => handleNavClick(e, 'home', 'brandstore')}
            >
              브랜드 소개
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={view === 'products' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'products')}
            >
              제품
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={view === 'news' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, 'news')}
            >
              이벤트
            </a>
          </li>
        </ul>

        {/* 오른쪽: 검색, 장바구니 & 로그인 */}
        <div className="navbar-actions">
          <div className={`search-wrapper ${searchOpen ? 'open' : ''}`}>
            <input
              type="text"
              className="search-input"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="search-btn"
              onClick={handleSearchClick}
              aria-label="검색"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>

          {/* 프리미엄 장바구니 쉴드 버튼 */}
          <a
            href="#"
            className="cart-btn"
            onClick={(e) => {
              e.preventDefault();
              if (onCartOpen) onCartOpen();
            }}
            aria-label="장바구니"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 1.45, 0.85, 1.15, 1], opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="cart-badge"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </a>

          <a
            href="#"
            className="login-btn"
            onClick={(e) => {
              e.preventDefault();
              onLoginOpen();
            }}
          >
            로그인
          </a>
        </div>
      </div>
    </nav>
  );
}
