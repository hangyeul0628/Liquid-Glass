import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BestSellerSection from './components/BestSellerSection';
import BreakSection from './components/BreakSection';
import RebuildSection from './components/RebuildSection';
import ProofSection from './components/ProofSection';
import BrandStoreSection from './components/BrandStoreSection';
import NewsEventSection from './components/NewsEventSection';
import CTASection from './components/CTASection';
import LoginModal from './components/LoginModal';
import AllProductsSection from './components/AllProductsSection';
import CartModal from './components/CartModal';
import ErrorModal from './components/ErrorModal';
import { products } from './data/products';
import AllNewsSection from './components/AllNewsSection';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState('home'); // 'home' | 'products' | 'news'

  // 장바구니 상태 통합 관리 (초기값: 빈 배열)
  const [cartItems, setCartItems] = useState([]);
  
  // 장바구니 담을 때 추가 미크로 토스트 상태
  const [toast, setToast] = useState({ show: false, message: '', img: '' });

  // 검색 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [invalidSearchTerm, setInvalidSearchTerm] = useState('');

  // 검색 검증 및 실행 함수
  const handleSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // products 데이터에 검색어가 매칭되는 아이템이 있는지 유효성 검사
    const isFound = products.some(
      (p) =>
        p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        p.desc.toLowerCase().includes(trimmed.toLowerCase()) ||
        p.category.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (isFound) {
      setSearchTerm(trimmed);
      setView('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setInvalidSearchTerm(trimmed);
      setIsErrorOpen(true);
    }
  };

  // 검색 초기화 함수
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // 수량 변경 함수
  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  // 아이템 삭제 함수
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // 장바구니 비우기 함수
  const clearCart = () => {
    setCartItems([]);
  };

  // 장바구니에 제품 동적 추가 함수
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        imgSrc: product.imgDefault,
        price: product.price * (1 - (product.discount || 0) / 100), // 실구매가 반영
        originalPrice: product.price,
        quantity: 1
      }];
    });

    // 프리미엄 장바구니 추가 알림 토스트 트리거
    setToast({
      show: true,
      message: `"${product.name}" 상품이 장바구니에 담겼습니다.`,
      img: product.imgDefault
    });

    // 2.5초 후 자동 페이드 아웃
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  };

  // 뷰 전환 및 화면 최상단 스크롤 함수 (뷰 전환 시 검색 필터도 초기화)
  const handleViewChange = (newView) => {
    setView(newView);
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <CustomCursor />
      <Navbar 
        view={view} 
        onViewChange={handleViewChange} 
        onLoginOpen={() => setIsLoginOpen(true)} 
        onCartOpen={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onSearch={handleSearch}
      />
      <main>
        {view === 'home' ? (
          <>
            <HeroSection />
            <BestSellerSection 
              onViewAll={() => handleViewChange('products')} 
              onAddToCart={addToCart}
            />
            <BreakSection />
            <RebuildSection />
            <ProofSection />
            <BrandStoreSection />
            <NewsEventSection onViewAll={() => handleViewChange('news')} />
          </>
        ) : view === 'products' ? (
          <AllProductsSection 
            onViewHome={() => handleViewChange('home')} 
            onCartOpen={() => setIsCartOpen(true)} 
            onAddToCart={addToCart}
            searchTerm={searchTerm}
            onSearchClear={handleClearSearch}
          />
        ) : (
          <AllNewsSection onViewHome={() => handleViewChange('home')} />
        )}
        <CTASection onAddToCart={addToCart} />
      </main>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onClearCart={clearCart}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        invalidTerm={invalidSearchTerm}
        onRecommendSearch={handleSearch}
      />

      {/* 프리미엄 장바구니 담기 성공 글래스모피즘 토스트 팝업 */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="cart-toast glass-card"
          >
            <div className="toast-glow" />
            <img src={toast.img} alt="Product Thumbnail" className="toast-thumbnail" />
            <div className="toast-info">
              <span className="toast-tag">SHOPPING BAG</span>
              <p className="toast-msg">{toast.message}</p>
            </div>
            <div className="toast-badge-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
