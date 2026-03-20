import React from 'react';
import { motion } from 'framer-motion';

function LaylatulQadrAtmosphere() {
    return (
        <div className="laylatul-atmosphere">
            <div className="stars-container">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="night-star"
                        initial={{ opacity: 0.2 }}
                        animate={{ 
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                            duration: Math.random() * 3 + 2, 
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`
                        }}
                    />
                ))}
            </div>
            <div className="aurora-glow" />
            <div className="night-overlay" />
            
            <motion.div 
                className="laylatul-qadr-banner"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <h2 className="text-gold text-glow mb-0">✨ ليلة القدر ✨</h2>
                <p className="text-white text-sm">النقاط مضاعفة (1000 نقطة)</p>
            </motion.div>
        </div>
    );
}

export default LaylatulQadrAtmosphere;
