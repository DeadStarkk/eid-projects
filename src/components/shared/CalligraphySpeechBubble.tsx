import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CalligraphySpeechBubble({ message, isVisible, position = 'top' }) {
    if (!message) return null;

    const bubbleVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { type: 'spring', damping: 15, stiffness: 300 }
        },
        exit: { opacity: 0, scale: 0.8, y: 10, transition: { duration: 0.2 } }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`speech-bubble bubble-${position}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={bubbleVariants}
                    style={{
                        position: 'absolute',
                        zIndex: 100,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="bubble-content">
                        <p className="calligraphy-text">{message}</p>
                    </div>
                    <div className="bubble-tail" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CalligraphySpeechBubble;
