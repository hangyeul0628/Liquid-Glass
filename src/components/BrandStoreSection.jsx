import { motion } from 'framer-motion';
import './BrandStoreSection.css';

export default function BrandStoreSection() {
  return (
    <section className="section brandstore-section" id="brandstore">
      <div className="brandstore-container">
        <motion.div 
          className="brandstore-image-pane"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <img src={`${import.meta.env.BASE_URL}images/BRAND STORE 이미지.png`} alt="Brand Flagship Store" className="brandstore-image" />
        </motion.div>
        
        <motion.div 
          className="brandstore-text-pane"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="brandstore-tag">Experience Offline</span>
          <h2 className="brandstore-headline">BRAND STORE</h2>
          <p className="brandstore-desc">
            글래스모피즘 쉴드의 투명하고 맑은 감각을 직접 체험할 수 있는 공간.<br/>
            빛의 산란과 유리의 질감이 빚어내는 리퀴드 글래스 페이드 컨셉의 오프라인 플래그십 스토어로 여러분을 초대합니다.
          </p>
          <div className="brandstore-actions">
            <button className="btn-brandstore outline">스토어 찾기</button>
            <button className="btn-brandstore solid">브랜드 스토리</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
