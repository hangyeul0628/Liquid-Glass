import { motion } from 'framer-motion';
import './BestSellerSection.css';

export default function BestSellerSection({ onViewAll, onAddToCart }) {
  const bestSellers = [
    {
      id: 1,
      name: "글래스모피즘 쉴드 앰플 크림 오리지널",
      desc: "24시간 수분 장벽 지속, 시그니처 앰플 크림",
      price: 42000,
      discount: 10,
      tag: "BEST 1",
      imgSrc: "/images/new_best1.jpg",
      imgDefault: "/images/new_best1.jpg",
      imgHover: "/images/new_best1.jpg"
    },
    {
      id: 2,
      name: "글래스모피즘 쉴드 인텐시브 리페어 밤",
      desc: "극건성 피부를 위한 고농축 리페어 솔루션",
      price: 55000,
      discount: 0,
      tag: "BEST 2",
      imgSrc: "/images/new_best2.jpg",
      imgDefault: "/images/new_best2.jpg",
      imgHover: "/images/new_best2.jpg"
    },
    {
      id: 3,
      name: "글래스모피즘 수분 부스팅 에센스",
      desc: "세안 후 첫 단계, 투명도 부스팅 에센스",
      price: 38000,
      discount: 20,
      tag: "BEST 3",
      imgSrc: "/images/new_best3.jpg",
      imgDefault: "/images/new_best3.jpg",
      imgHover: "/images/new_best3.jpg"
    }
  ];

  return (
    <section className="section bestseller-section" id="bestseller">
      <div className="bestseller-header">
        <span className="bestseller-tag">Top Ranked</span>
        <h2 className="bestseller-headline">BEST SELLER</h2>
        <p className="bestseller-sub">
          가장 많은 사랑을 받은 글래스모피즘 쉴드의 베스트 아이템을 만나보세요.
        </p>
      </div>

      <div className="bestseller-grid">
        {bestSellers.map((item, index) => (
          <motion.div
            key={item.id}
            className="bestseller-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="bestseller-image-wrapper">
              <img 
                src={item.imgDefault} 
                alt={item.name} 
                className="bestseller-image default-img" 
              />
              <img 
                src={item.imgHover} 
                alt={`${item.name} lifestyle`} 
                className="bestseller-image hover-img" 
              />
              <div className="bestseller-badge">{item.tag}</div>
              
              {/* 호버 시 나타나는 액션 레이어 */}
              <div className="bestseller-hover-layer">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="btn-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddToCart) onAddToCart(item);
                  }}
                >
                  장바구니 담기
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="btn-action outline" 
                  onClick={onViewAll}
                >
                  상세보기
                </motion.button>
              </div>
            </div>

            <div className="bestseller-info">
              <h3 className="bestseller-name">{item.name}</h3>
              <p className="bestseller-desc">{item.desc}</p>
              <div className="bestseller-price">
                {item.discount > 0 ? (
                  <>
                    <span className="bestseller-discount">{item.discount}%</span>
                    <span>₩ {(item.price * (1 - item.discount / 100)).toLocaleString()}</span>
                  </>
                ) : (
                  <span>₩ {item.price.toLocaleString()}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="bestseller-footer">
        <button className="bestseller-more-btn" onClick={onViewAll}>
          전체 상품 보기 <span className="arrow-right">→</span>
        </button>
      </div>
    </section>
  );
}
