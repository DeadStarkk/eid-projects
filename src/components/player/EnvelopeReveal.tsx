import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

function EnvelopeReveal() {
    const { envelopeReveal, gameState } = useGameStore();
    
    const amount = envelopeReveal?.amount;
    const relativeIndex = envelopeReveal?.relativeIndex;
    const currentRelative = gameState.relativesData?.[relativeIndex];
    const relativeName = currentRelative?.name || 'القريب';

    return (
        <AnimatePresence>
            {envelopeReveal && (
                <motion.div 
                    key="envelope-reveal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="envelope-reveal-overlay"
                >
                    <div className="reveal-container">
                        <motion.div 
                            initial={{ scale: 0.5, y: 100, rotate: -10 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12 }}
                            className="reveal-envelope-wrapper"
                        >
                            {/* Envelope Body */}
                            <div className="reveal-envelope-body">
                                {/* Top Flap (Animated) */}
                                <motion.div 
                                    initial={{ rotateX: 0 }}
                                    animate={{ rotateX: 180 }}
                                    transition={{ delay: 1, duration: 0.8 }}
                                    className="reveal-envelope-flap"
                                />
                                
                                {/* The Money/Gift Content */}
                                <motion.div 
                                    initial={{ y: 0, opacity: 0, scale: 0.5 }}
                                    animate={{ y: -120, opacity: 1, scale: 1.5 }}
                                    transition={{ delay: 1.8, duration: 0.6, type: 'spring' }}
                                    className="reveal-amount-card"
                                >
                                    <div className="reveal-amount-content">
                                        <span className="reveal-currency">⃁</span>
                                        <span className="reveal-value">{amount}</span>
                                        <div className="reveal-sparkles">✨✨✨</div>
                                    </div>
                                </motion.div>

                                <div className="reveal-envelope-front">
                                    <Gift size={48} className="text-gold" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.5 }}
                            className="reveal-footer"
                        >
                            <h2 className="text-gold">عيدية من {relativeName}!</h2>
                            <p className="text-white">تمت إضافة {amount} ⃁ إلى محفظتك 💰</p>
                        </motion.div>
                    </div>
                    
                    {/* Confetti-like particles */}
                    <div className="reveal-particles">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="reveal-particle"
                                initial={{ 
                                    x: '50%', 
                                    y: '50%', 
                                    scale: 0 
                                }}
                                animate={{ 
                                    x: `${Math.random() * 100}%`, 
                                    y: `${Math.random() * 100}%`,
                                    scale: [0, 1, 0],
                                    rotate: Math.random() * 360
                                }}
                                transition={{ 
                                    delay: 1.8 + Math.random() * 0.5, 
                                    duration: 2 
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default EnvelopeReveal;
