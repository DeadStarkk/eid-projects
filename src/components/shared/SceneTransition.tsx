import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SceneTransition = ({ status, children }) => {
  const [showSunrise, setShowSunrise] = useState(false);
  const [showMoonrise, setShowMoonrise] = useState(false);

  useEffect(() => {
    if (status === 'day_trivia') {
      setShowSunrise(true);
      const timer = setTimeout(() => setShowSunrise(false), 3000);
      return () => clearTimeout(timer);
    }
    if (status === 'night_trivia') {
      setShowMoonrise(true);
      const timer = setTimeout(() => setShowMoonrise(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <>
      <div className="relative w-full flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 1, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSunrise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="sunrise-overlay"
          >
            <motion.div
              initial={{ y: '100vh', scale: 0.5, opacity: 0 }}
              animate={{ y: '30vh', scale: 1.5, opacity: 1 }}
              exit={{ y: '-20vh', opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="sun-element"
            />
          </motion.div>
        )}
        {showMoonrise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="moonrise-overlay"
          >
            <div className="starfield" />
            <motion.div 
               initial={{ y: '100vh', scale: 0.5, rotate: -30 }}
               animate={{ y: '20vh', scale: 1.2, rotate: 0 }}
               exit={{ y: '-20vh', opacity: 0 }}
               transition={{ duration: 3, ease: "easeOut" }}
               className="crescent-moon" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SceneTransition;
