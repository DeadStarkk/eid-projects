import React from 'react';
import { useTimer } from '../../utils/useTimer';
import { GAME_RULES } from '../../constants';

function PlayerTrivia({ player, gameState, onAnswer }) {
    const timeLeft = useTimer(gameState.endTime);
    const hasAnswered = gameState.answeredPlayers?.includes(player.id);
    const isLocked = gameState.isLocked || hasAnswered;
    const isDanger = timeLeft <= 5;

    return (
        <div className="glass-panel w-full max-w-md mx-auto p-6 sm:p-8 flex flex-col items-center">
            <h3 className="text-gradient text-3xl font-bold mb-6">أجب بسرعة! ⚡</h3>

            <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`text-2xl font-bold py-2 px-6 rounded-full border-2 ${isDanger ? 'text-red-500 border-red-500 bg-red-500/10 animate-pulse' : 'text-white border-gold bg-white/10'}`}>
                    {timeLeft} ثانية
                </div>
                <div className="text-gold font-bold bg-gold/10 py-2 px-4 rounded-full">⚡ +{Math.floor((timeLeft / GAME_RULES.TRIVIA_DURATION_SEC) * 50)}</div>
            </div>

            <div className="flex flex-col gap-3 w-full">
                {gameState.currentQuestion?.options.map((opt, i) => (
                    <button
                        key={i}
                        className="btn text-xl p-4 sm:p-6 transition-all duration-300 text-center w-full shadow-md hover:shadow-lg"
                        disabled={isLocked}
                        onClick={() => onAnswer(opt)}
                        style={{
                            background: hasAnswered ? 'rgba(255,255,255,0.1)' : 'var(--primary)',
                            opacity: isLocked ? 0.7 : 1,
                            cursor: isLocked ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {hasAnswered && !gameState.isLocked && (
                <div className="mt-8 text-center text-gold bg-gold/10 p-4 rounded-xl border border-gold/30 w-full animate-fade-in-up">
                    <h3 className="text-xl font-bold mb-2">تم استلام إجابتك! 👍</h3>
                    <p className="opacity-80">انتظر حتى ينتهي الوقت...</p>
                </div>
            )}
        </div>
    );
}

export default PlayerTrivia;
