import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AllProductsSection.css';
import { products } from '../data/products';

export default function AllProductsSection({ onViewHome, onCartOpen, onAddToCart, searchTerm, onSearchClear }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('RECOMMEND');

  // 카테고리 필터링 탭
  const categories = [
    { key: 'ALL', label: '전체상품' },
    { key: 'TONER', label: '토너/에센스' },
    { key: 'CREAM', label: '크림/밤' },
    { key: 'CLEANSING', label: '클렌징/기타' },
  ];

  // 필터링 및 정렬 연산
  const filteredAndSortedProducts = useMemo(() => {
    let list = products;

    // 1. 검색어 필터링
    if (searchTerm) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. 카테고리 필터링
    if (activeCategory !== 'ALL') {
      list = list.filter(p => p.category === activeCategory);
    }

    // 3. 정렬 로직
    return [...list].sort((a, b) => {
      const getFinalPrice = (item) => item.price * (1 - (item.discount || 0) / 100);

      switch (sortBy) {
        case 'RECOMMEND':
          // 가상 추천 지수 순 (ID 기준 및 임의 배열)
          return a.id - b.id;
        case 'BEST':
          // 리뷰가 많은 순
          return b.reviews - a.reviews;
        case 'PRICE_LOW':
          // 실구매 가격 낮은 순
          return getFinalPrice(a) - getFinalPrice(b);
        case 'PRICE_HIGH':
          // 실구매 가격 높은 순
          return getFinalPrice(b) - getFinalPrice(a);
        default:
          return 0;
      }
    });
  }, [activeCategory, sortBy, searchTerm]);

  return (
    <section className="all-products-section">
      
      {/* breadcrumb */}
      <div className="products-breadcrumb">
        <span onClick={onViewHome} className="crumb-home">HOME</span>
        <span className="crumb-arrow">/</span>
        <span className="crumb-current">스킨케어</span>
      </div>

      {/* Header */}
      <div className="products-header">
        <h1 className="products-title">SKIN CARE</h1>
        <p className="products-subtitle">
          미세한 수분막 틈새를 정교하게 메워 빛나는 피부 유리 장벽을 완성하는 Re:Glass 고유의 에센셜 컬렉션.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs-container">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`tab-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Count Bar */}
      <div className="products-utility-bar">
        <div className="product-count">
          {searchTerm ? (
            <div className="search-result-info">
              <span className="search-keyword">"{searchTerm}"</span> 검색 결과 
              총 <span className="highlight">{filteredAndSortedProducts.length}</span>개의 상품
              <button className="clear-search-btn" onClick={onSearchClear} title="검색 필터 해제">
                ✕ 지우기
              </button>
            </div>
          ) : (
            <>총 <span className="highlight">{filteredAndSortedProducts.length}</span>개의 상품이 있습니다.</>
          )}
        </div>
        <div className="product-sorting">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="sort-select"
          >
            <option value="RECOMMEND">추천순</option>
            <option value="BEST">판매인기순</option>
            <option value="PRICE_LOW">낮은가격순</option>
            <option value="PRICE_HIGH">높은가격순</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="products-grid-container">
        <motion.div 
          layout 
          className="products-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProducts.map((product) => {
              const hasDiscount = product.discount > 0;
              const finalPrice = hasDiscount 
                ? product.price * (1 - product.discount / 100) 
                : product.price;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  key={product.id}
                  className="product-card glass-card"
                >
                  {/* Image Area with double-layered Hover swap animation */}
                  <div className="product-image-wrapper">
                    <img 
                      src={product.imgDefault} 
                      alt={product.name} 
                      className="product-image default-img" 
                    />
                    <img 
                      src={product.imgHover} 
                      alt={`${product.name} lifestyle`} 
                      className="product-image hover-img" 
                    />

                    {/* Tag Badges */}
                    <div className="product-badges">
                      {product.tags.map(t => (
                        <span key={t} className={`badge-tag ${t.toLowerCase()}`}>{t}</span>
                      ))}
                    </div>
                    
                    {/* Action buttons hover overlay */}
                    <div className="product-action-overlay">
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="btn-overlay-action" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) onAddToCart(product);
                        }}
                      >
                        장바구니 담기
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="btn-overlay-action outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) onAddToCart(product);
                          if (onCartOpen) onCartOpen();
                        }}
                      >
                        바로구매
                      </motion.button>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.desc}</p>
                    
                    {/* Rating & Review */}
                    <div className="product-meta">
                      <span className="rating-star">★</span>
                      <span className="rating-value">{product.rating}</span>
                      <span className="review-count">({product.reviews})</span>
                    </div>

                    {/* Price with styling */}
                    <div className="product-price-container">
                      {hasDiscount ? (
                        <>
                          <span className="discount-rate">{product.discount}%</span>
                          <span className="final-price">₩ {finalPrice.toLocaleString()}</span>
                          <span className="original-price">₩ {product.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="final-price">₩ {product.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Home Return Section */}
      <div className="products-footer">
        <button className="btn-back-home" onClick={onViewHome}>
          <span className="arrow-left">←</span> 메인 화면으로 돌아가기
        </button>
      </div>
    </section>
  );
}
