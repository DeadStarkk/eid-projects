import React from 'react';
import { Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

function MajlisRelativeSelection() {
    const { gameState, socket } = useGameStore();
    return (
        <div className="flex flex-col gap-6">
            <p className="text-xl font-bold opacity-90">من تبي تزور أول؟</p>
            <div className="flex flex-col gap-4 w-full">
                {gameState.relativesData?.map((r, idx) => {
                    const hasEnvelopes = r.availableEnvelopes.length > 0;
                    return (
                        <button
                            key={idx}
                            className={`relative rounded-2xl overflow-hidden min-h-[100px] flex items-center p-4 transition-all duration-300 ${hasEnvelopes ? 'hover:scale-105 active:scale-95' : ''}`}
                            disabled={!hasEnvelopes}
                            onClick={() => socket?.emit('select_relative', idx)}
                            style={{
                                opacity: hasEnvelopes ? 1 : 0.5,
                                cursor: hasEnvelopes ? 'pointer' : 'not-allowed',
                                border: `2px solid ${hasEnvelopes ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                                background: hasEnvelopes ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <img 
                                src={r.image} 
                                alt={r.name} 
                                className="absolute inset-0 w-full h-full object-cover opacity-20"
                            />
                            <div className="relative z-10 flex items-center justify-between w-full">
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold m-0 text-white">{r.name}</h3>
                                    <span className="text-sm opacity-80">
                                        {hasEnvelopes ? `${r.availableEnvelopes.length} ظرف باقية` : 'بحت!'}
                                    </span>
                                </div>
                                {hasEnvelopes && (
                                    <div className="bg-gold text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-gold/30">
                                        <Sparkles size={20} />
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default MajlisRelativeSelection;
