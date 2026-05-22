import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CartModal.css';

export default function CartModal({ isOpen, onClose, cartItems, updateQuantity, removeItem, onClearCart }) {
  // 실시간 계산 금액
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subTotal >= 50000 || subTotal === 0 ? 0 : 3000;
  const totalAmount = subTotal + shippingFee;

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 구매 완료 처리
  const handleCheckout = () => {
    alert(`🎉 결제가 성공적으로 완료되었습니다!\n총 결제금액: ₩ ${totalAmount.toLocaleString()}원\n맑고 단단한 Re:Glass 장벽 유리막 보호를 곧 집에서 경험해 보세요.`);
    if (onClearCart) onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart-modal-backdrop">
          {/* Backdrop Blur layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="cart-backdrop-overlay"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="cart-modal-box glass-card"
          >
            {/* Header */}
            <div className="cart-header">
              <div className="cart-title-group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <h2>SHOPPING BAG</h2>
              </div>
              <button className="cart-close-btn" onClick={onClose} aria-label="닫기">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Content List */}
            <div className="cart-body">
              {cartItems.length > 0 ? (
                <div className="cart-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.imgSrc} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-prices">
                          <span className="cart-item-price">₩ {(item.price * item.quantity).toLocaleString()}</span>
                          <span className="cart-item-original">₩ {(item.originalPrice * item.quantity).toLocaleString()}</span>
                        </div>
                        
                        {/* Quantity and delete utility */}
                        <div className="cart-item-actions">
                          <div className="qty-selector">
                            <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                          <button className="item-remove-btn" onClick={() => removeItem(item.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cart-empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#cartGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-cart-svg">
                      <defs>
                        <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a3c6c0" />
                          <stop offset="50%" stopColor="#76aba1" />
                          <stop offset="100%" stopColor="#4a9f90" />
                        </linearGradient>
                      </defs>
                      <circle cx="9" cy="21" r="1.5" fill="url(#cartGrad)" stroke="none"/>
                      <circle cx="20" cy="21" r="1.5" fill="url(#cartGrad)" stroke="none"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <p>장바구니가 비어 있습니다.</p>
                  <span>Re:Glass의 맑고 우아한 라인업을 담아보세요.</span>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="summary-row">
                  <span>상품 합계</span>
                  <span className="value">₩ {subTotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>배송비 <span className="shipping-hint">(5만원 이상 무료배송)</span></span>
                  <span className="value">{shippingFee === 0 ? '무료' : `₩ ${shippingFee.toLocaleString()}`}</span>
                </div>
                <div className="summary-total">
                  <span>결제 예정 금액</span>
                  <span className="total-value">₩ {totalAmount.toLocaleString()}</span>
                </div>
                
                <button className="btn-checkout" onClick={handleCheckout}>
                  결제 및 구매하기
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
