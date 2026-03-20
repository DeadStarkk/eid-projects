import React from 'react';
import { Gift } from 'lucide-react';
import FazaAlert from '../shared/FazaAlert';
import { useGameStore } from '../../store/gameStore';
import Tilt from 'react-parallax-tilt';

const ENVELOPE_COLORS = ['#FFD700', '#4CAF50', '#F44336'];

function MajlisEnvelopeSelection() {
    const { player, gameState, socket, faz3aAlert, setFaz3aAlert, isSelectionPending, setIsSelectionPending } = useGameStore();

    if (!gameState.relativesData || gameState.selectedRelativeIndex === null) return null;

    const currentRelative = gameState.relativesData[gameState.selectedRelativeIndex];

    const confirmFaz3a = () => {
        socket?.emit('confirm_faz3a', { playerId: player.id, envelopeIndex: faz3aAlert.pendingIndex });
        setFaz3aAlert(null);
    };

    const cancelFaz3a = () => {
        socket?.emit('cancel_faz3a', { playerId: player.id });
        setFaz3aAlert(null);
        setIsSelectionPending(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-gold/10 p-6 rounded-3xl border border-gold flex flex-col items-center gap-4 text-center">
                <img 
                    src={currentRelative.image} 
                    alt={currentRelative.name} 
                    className="w-24 h-24 rounded-full border-4 border-gold shadow-lg shadow-gold/30 object-cover"
                />
                <div>
                    <h3 className="m-0 text-2xl font-bold text-gold">زيارة {currentRelative.name}</h3>
                    <p className="text-sm mt-2 opacity-80">{currentRelative.personality}</p>
                </div>
            </div>

            {faz3aAlert ? (
                <FazaAlert alert={faz3aAlert} onConfirm={confirmFaz3a} onCancel={cancelFaz3a} />
            ) : (
                <>
                    <p className="text-lg font-bold opacity-90">اختر أحد الأظرف للحصول على العيدية:</p>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {currentRelative.availableEnvelopes.map((env, idx) => (
                            <Tilt
                                key={env.id}
                                tiltMaxAngleX={25}
                                tiltMaxAngleY={25}
                                perspective={1000}
                                scale={1.1}
                                transitionSpeed={1000}
                                gyroscope={true}
                            >
                                <button
                                    onClick={() => {
                                        if (faz3aAlert || isSelectionPending) return;
                                        const amt = env.amount;
                                        const maxPossible = Math.max(...currentRelative.availableEnvelopes.map(e => e.amount));

                                        if (amt < maxPossible && player.faz3aUsesLeft > 0) {
                                            socket?.emit('trigger_haptic', { playerId: player.id });
                                            setFaz3aAlert({
                                                message: currentRelative?.hint || "متاكد؟ القريب يلمح لك تغير رايك! 😉",
                                                pendingIndex: idx,
                                                pendingAmount: amt
                                            });
                                            return;
                                        }
                                        setIsSelectionPending(true);
                                        socket?.emit('choose_envelope', { playerId: player.id, envelopeIndex: idx });
                                    }}
                                    className={`w-full aspect-[2/3] rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${isSelectionPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{ background: ENVELOPE_COLORS[(parseInt(env.id.split('-')[1]) || 0) % ENVELOPE_COLORS.length] }}
                                >
                                    {isSelectionPending ? (
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Gift size={40} color="black" />
                                    )}
                                </button>
                            </Tilt>
                        ))}
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-full font-bold transition-colors mt-8" onClick={() => socket?.emit('select_relative', null)}>
                        تغيير القريب ⬅️
                    </button>
                </>
            )}
        </div>
    );
}

export default MajlisEnvelopeSelection;
