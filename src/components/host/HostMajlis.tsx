import { Gift, Clock, SkipForward, WifiOff } from 'lucide-react';
import Confetti from 'react-confetti';
import DramaticReveal from './DramaticReveal';
import MajlisSidebar from './MajlisSidebar';
import CalligraphySpeechBubble from '../shared/CalligraphySpeechBubble';
import Tilt from 'react-parallax-tilt';
import { useGameStore } from '../../store/gameStore';
import { useTimer } from '../../utils/useTimer';

const ENVELOPE_COLORS = ['#FFD700', '#4CAF50', '#F44336'];

function HostMajlis({ players, gameState, flyingMoney, isTense, revealState }) {
    const { skipPlayer } = useGameStore();
    const timeLeft = useTimer(gameState.endTime);
    const activePlayer = players[gameState.activePlayerIndex];
    const selectedRelative = gameState.selectedRelativeIndex !== null ? gameState.relativesData[gameState.selectedRelativeIndex] : null;

    const isDisconnected = activePlayer?.disconnected;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            {revealState && (
                <DramaticReveal 
                    playerName={revealState.playerName} 
                    amount={revealState.amount} 
                    relativeIndex={revealState.relativeIndex} 
                />
            )}
            {flyingMoney.length > 0 && <Confetti recycle={false} numberOfPieces={200} gravity={0.3} />}

            {flyingMoney.map(m => (
                <div key={m.id} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold text-6xl font-black z-[10000] animate-bounce">+{m.amount} ⃁</div>
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 w-full max-w-[1400px] h-[85vh]">
                {/* Players Sidebar */}
                <MajlisSidebar players={players} activePlayerIndex={gameState.activePlayerIndex} />

                {/* Main Majlis Stage */}
                <div className="glass-panel flex-1 text-right overflow-y-auto">
                    <div className="flex flex-row items-start justify-between mb-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-gradient text-5xl font-bold m-0">مجلس العيدية 🌙</h1>
                            {activePlayer && (
                                <div className="flex items-center justify-start gap-4">
                                    <img src={activePlayer.avatar} alt={activePlayer.name} className={`w-12 h-12 rounded-full border-2 ${isDisconnected ? 'grayscale border-white/20' : 'border-gold shadow-lg shadow-gold/20'}`} />
                                    <div className="flex flex-col text-right">
                                        <h2 className="m-0 text-2xl">دور <span className="text-gold">{activePlayer.name}</span></h2>
                                        {isDisconnected && (
                                            <span className="text-red-400 text-sm flex items-center gap-2">
                                                <WifiOff size={14} /> اللاعب غير متصل
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 items-end">
                            {gameState.endTime !== undefined && (
                                <div className={`flex items-center gap-4 py-2 px-6 rounded-full font-bold text-2xl shadow-lg transition-all duration-300 ${timeLeft < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-gold border border-gold/30'}`}>
                                    <Clock size={24} />
                                    <span>{timeLeft}</span>
                                </div>
                            )}
                            <button 
                                className="btn btn-ghost flex items-center gap-2 opacity-60 hover:opacity-100"
                                onClick={skipPlayer}
                                title="تخطي اللاعب"
                            >
                                <SkipForward size={18} />
                                <span>تخطي</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gameState.relativesData?.map((r, idx) => {
                            const isSelected = gameState.selectedRelativeIndex === idx;
                            const hasEnvelopes = r.availableEnvelopes.length > 0;
                            // Show hint bubble if this relative is selected or if a "tense" moment is happening
                            const showHint = isSelected || (isTense && isSelected);

                            return (
                                <div
                                    key={idx}
                                    className={`relative rounded-3xl overflow-visible border-2 transition-all duration-500 min-h-[180px] flex items-center p-6 ${isSelected ? 'border-gold shadow-[0_0_30px_rgba(255,215,0,0.3)] scale-[1.02]' : 'border-white/10 opacity-60 grayscale'}`}
                                    style={{
                                        opacity: hasEnvelopes ? (isSelected ? 1 : 0.6) : 0.4,
                                        filter: hasEnvelopes ? 'none' : 'grayscale(1)',
                                    }}
                                >
                                    <CalligraphySpeechBubble 
                                        message={r.hint} 
                                        isVisible={showHint} 
                                        position="top" 
                                    />
                                    <img 
                                        src={r.image} 
                                        alt={r.name} 
                                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 rounded-3xl"
                                    />
                                    <div className="relative z-10 w-full flex items-center justify-between">
                                        <div className="text-right">
                                            <h3 className="text-2xl font-bold mb-1">{r.name}</h3>
                                            <p className="text-sm opacity-80">{r.personality}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 justify-end max-w-[150px]">
                                            {r.availableEnvelopes.map((env, envIdx) => {
                                                const colorIndex = parseInt(env.id.split('-')[1]) || 0;
                                                return (
                                                    <Tilt
                                                        key={env.id}
                                                        tiltMaxAngleX={15}
                                                        tiltMaxAngleY={15}
                                                        perspective={1000}
                                                        scale={1.1}
                                                        transitionSpeed={1000}
                                                    >
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg animate-float"
                                                            style={{
                                                                animationDelay: `${envIdx * 0.2}s`,
                                                                background: ENVELOPE_COLORS[colorIndex % ENVELOPE_COLORS.length]
                                                            }}
                                                        >
                                                            <Gift size={20} color="black" />
                                                        </div>
                                                    </Tilt>
                                                );
                                            })}
                                            {r.availableEnvelopes.length === 0 && (
                                                <div className="text-gold font-bold bg-black/40 py-1 px-3 rounded-full text-xs">بحت العيديات! 💸</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedRelative && (
                        <div className="glass-panel mt-8 py-4 bg-gold/10 border-gold/30 animate-pulse">
                            <h2 className="text-gold text-2xl font-bold m-0">{activePlayer?.name} يزور {selectedRelative.name}...</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HostMajlis;
