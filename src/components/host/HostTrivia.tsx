import React from 'react';
import Leaderboard from '../shared/Leaderboard';
import { useGameStore } from '../../store/gameStore';
import { useTimer } from '../../utils/useTimer';
import { GAME_RULES } from '../../constants';

function HostTrivia() {
    const { players, gameState, nextDay, jumpToMajlis } = useGameStore();
    const timeLeft = useTimer(gameState.endTime);
    
    const isCorrect = (opt) => gameState.isLocked && opt === gameState.currentQuestion?.a;
    const isDanger = timeLeft <= 5;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="glass-panel w-full max-w-[1200px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-gradient text-4xl font-bold">
                        {gameState.status === 'day_trivia' && `اليوم ${gameState.currentDay}`}
                        {gameState.status === 'night_trivia' && `الليلة ${gameState.currentDay} (العشر الأواخر 🌙)`}
                        {gameState.status === 'fitr_trivia' && 'تحدي الفطر السريع ⚡'}
                    </h2>
                    <div className="flex gap-4">
                        <button className="btn" onClick={nextDay}>التالي</button>
                        <button className="btn btn-silver" onClick={jumpToMajlis}>تخطي للمجلس &gt;&gt;</button>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                        <div className="text-right">
                            <h3 className="text-3xl font-bold mb-8">{gameState.currentQuestion?.q || 'بانتظار السؤال...'}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {gameState.currentQuestion?.options.map((opt, i) => (
                                    <div key={i} className={`p-6 rounded-2xl border-2 transition-all ${isCorrect(opt) ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex items-center justify-between text-xl font-bold">
                                            <span>{opt}</span>
                                            {isCorrect(opt) && <span>✅</span>}
                                        </div>

                                        {gameState.isLocked && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {players.filter(p => gameState.playerChoices[p.id] === opt).map(p => (
                                                    <div key={p.id} className="flex items-center gap-1 bg-white/10 py-1 px-2 rounded-full">
                                                        <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full" style={{ border: `2px solid ${p.color}` }} />
                                                        <span className="text-[0.7rem]">{p.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-white/5 rounded-3xl p-8 border border-white/10">
                            <div className={`w-40 h-40 rounded-full border-8 flex items-center justify-center text-6xl font-black mb-4 transition-all duration-300 ${isDanger ? 'border-red-500 text-red-500 animate-pulse shadow-lg shadow-red-500/40' : 'border-gold text-gold shadow-lg shadow-gold/20'}`}>
                                {timeLeft}
                            </div>
                            <p className="text-xl font-bold opacity-80">الوقت المتبقي</p>
                            <p className="text-gold text-sm mt-4 font-bold">⚡ مكافأة السرعة: +{Math.floor((timeLeft / GAME_RULES.TRIVIA_DURATION_SEC) * 50)}</p>
                        </div>
                    </div>

                    <Leaderboard players={players} gameState={gameState} />
                </div>
            </div>
        </div>
    );
}

export default HostTrivia;
