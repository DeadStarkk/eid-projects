import React from 'react';
import MajlisRelativeSelection from './MajlisRelativeSelection';
import MajlisEnvelopeSelection from './MajlisEnvelopeSelection';
import { useGameStore } from '../../store/gameStore';
import { Clock } from 'lucide-react';
import { useTimer } from '../../utils/useTimer';

function PlayerMajlis() {
    const { player, players, gameState } = useGameStore();
    const timeLeft = useTimer(gameState.endTime);

    if (!player) return null;
    
    const activePlayer = players[gameState.activePlayerIndex] || {};
    const isMyTurn = activePlayer.id === player.id;

    const renderTimer = () => {
        if (gameState.endTime === undefined) return null;
        return (
            <div className={`flex items-center justify-center gap-2 text-2xl font-bold py-2 px-6 rounded-full border-2 mb-6 mx-auto w-fit ${timeLeft < 10 ? 'text-red-500 border-red-500 bg-red-500/10 animate-pulse' : 'text-white border-gold bg-white/10'}`}>
                <Clock size={24} />
                <span>{timeLeft}</span>
            </div>
        );
    };

    if (!isMyTurn) {
        return (
            <div className="glass-panel text-center w-full max-w-md mx-auto p-6 sm:p-8">
                {renderTimer()}
                <h3 className="text-3xl font-bold mb-4 text-gradient">راقب الشاشة الكبيرة</h3>
                <p className="text-lg opacity-80 mb-8">بانتظار دورك في المجلس يا {player.name}...</p>
                <div className="mt-4 flex justify-center">
                    <div className="bg-gold/10 border border-gold/30 p-6 rounded-3xl flex flex-col items-center gap-4 animate-bounce-subtle">
                        {activePlayer.avatar && <img src={activePlayer.avatar} alt="Active" className="w-20 h-20 rounded-full border-2 border-gold shadow-lg shadow-gold/20" />}
                        <p className="text-xl font-bold m-0">دور <span className="text-gold">{activePlayer.name || "أحد الضيوف"}</span></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel text-center w-full max-w-md mx-auto p-6 sm:p-8">
            {renderTimer()}
            <h2 className="text-gradient text-4xl font-bold mb-8">جاء دورك! 🌙</h2>

            {gameState.selectedRelativeIndex === null ? (
                <MajlisRelativeSelection />
            ) : (
                <MajlisEnvelopeSelection />
            )}
        </div>
    );
}

export default PlayerMajlis;

