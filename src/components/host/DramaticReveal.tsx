import React from 'react';
import Confetti from 'react-confetti';
import { useGameStore } from '../../store/gameStore';

function DramaticReveal({ playerName, amount, relativeIndex }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { animationFinished } = useGameStore();

    React.useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 1000);
        
        // Notify server that reveal is finished after 6 seconds
        const finishTimer = setTimeout(() => {
            animationFinished('reveal');
        }, 6000);

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [animationFinished]);

    return (
        <div className="reveal-overlay">
            <div className="reveal-container">
                <h1 className="reveal-player-name">{playerName} حصل على...</h1>
                <div className={`reveal-envelope ${isOpen ? 'open' : ''}`}>
                    <div className="reveal-envelope-flap"></div>
                    <div className="reveal-envelope-content">
                        <div className="reveal-amount">
                            <span className="reveal-sar">⃁</span>
                            {amount}
                        </div>
                    </div>
                </div>
                <div className="reveal-glow-ring"></div>
            </div>
            {isOpen && <Confetti recycle={false} numberOfPieces={300} gravity={0.3} />}
        </div>
    );
}

export default DramaticReveal;
