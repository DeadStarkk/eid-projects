import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnvelopeReveal from './EnvelopeReveal';

function PlayerOverlays({ feedback, showLaylatulQadr, scorePopup }) {
    return (
        <>
            {/* Envelope Reveal Animation */}
            <EnvelopeReveal />

            {/* Feedback Flash Overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`feedback-overlay ${feedback.isCorrect ? 'feedback-overlay-correct' : 'feedback-overlay-incorrect'}`}
                    >
                        <motion.div 
                            initial={{ scale: 0.5, rotate: -20 }}
                            animate={{ scale: 1.2, rotate: 0 }}
                            className="feedback-emoji"
                        >
                            {feedback.isCorrect ? '✅' : '❌'}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Laylatul Qadr Bonus Overlay */}
            <AnimatePresence>
                {showLaylatulQadr && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="laylatul-qadr-overlay"
                    >
                        <div className="laylatul-sparkles">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="laylatul-sparkle"
                                    initial={{ 
                                        x: '50%', 
                                        y: '50%', 
                                        scale: 0,
                                        opacity: 0 
                                    }}
                                    animate={{ 
                                        x: `${Math.random() * 100}%`, 
                                        y: `${Math.random() * 100}%`,
                                        scale: [0, 1.5, 0],
                                        opacity: [0, 1, 0],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        delay: Math.random() * 0.5,
                                        repeat: Infinity,
                                        repeatDelay: Math.random()
                                    }}
                                />
                            ))}
                        </div>

                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                            transition={{ duration: 0.8, type: 'spring' }}
                            className="laylatul-content"
                        >
                            <h1 className="laylatul-text">ليلة القدر! ✨</h1>
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="laylatul-points"
                            >
                                +1000 نقطة! 🏆
                            </motion.div>
                        </motion.div>
                        
                        <div className="golden-glow-bg" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Score Popup Notification */}
            <AnimatePresence>
                {scorePopup && (
                    <motion.div 
                        key={scorePopup.id}
                        initial={{ opacity: 0, y: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: -50, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="score-popup-container"
                    >
                        <div className="score-popup">
                            +{scorePopup.points}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default PlayerOverlays;
