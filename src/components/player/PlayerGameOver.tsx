import React from 'react';
import { Sparkles, Zap, TrendingUp, Dice5 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

function PlayerGameOver() {
    const { player, players } = useGameStore();
    if (!player || !players) return null;

    // Calculate winners for awards
    const fastestFinger = [...players].sort((a, b) => {
        const avgA = a.stats?.fastestCorrectCount > 0 ? a.stats.totalResponseTime / a.stats.fastestCorrectCount : 999;
        const avgB = b.stats?.fastestCorrectCount > 0 ? b.stats.totalResponseTime / b.stats.fastestCorrectCount : 999;
        return avgA - avgB;
    })[0];

    const mostImproved = [...players].sort((a, b) => {
        const gainA = (a.points || 0) - (a.stats?.pointsAtMidpoint || 0);
        const gainB = (b.points || 0) - (b.stats?.pointsAtMidpoint || 0);
        return gainB - gainA;
    })[0];

    const riskTaker = [...players].sort((a, b) => (b.stats?.riskScore || 0) - (a.stats?.riskScore || 0))[0];

    const isFastest = fastestFinger?.id === player.id;
    const isImproved = mostImproved?.id === player.id;
    const isRiskTaker = riskTaker?.id === player.id;

    return (
        <div className="glass-panel text-center w-full max-w-md mx-auto p-6 sm:p-8 flex flex-col items-center">
            <h1 className="text-gradient text-4xl sm:text-5xl font-bold mb-6">عيدكم مبارك! 🌙🎉</h1>
            <p className="text-xl sm:text-2xl mb-8">لقد جمعت <span className="text-gold font-bold">{player.wallet} ⃁</span> عيدية</p>
            
            <div className="flex flex-col gap-4 w-full">
                {isFastest && (
                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl animate-bounce-subtle">
                        <div className="flex items-center justify-center gap-3">
                            <Zap className="text-blue-400" size={28} />
                            <span className="text-gold font-bold text-lg">أنت الأسرع في المجلس! ⚡</span>
                        </div>
                    </div>
                )}
                {isImproved && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl animate-bounce-subtle">
                        <div className="flex items-center justify-center gap-3">
                            <TrendingUp className="text-emerald-400" size={28} />
                            <span className="text-gold font-bold text-lg">أنت الأكثر تطوراً! 📈</span>
                        </div>
                    </div>
                )}
                {isRiskTaker && (
                    <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl animate-bounce-subtle">
                        <div className="flex items-center justify-center gap-3">
                            <Dice5 className="text-orange-400" size={28} />
                            <span className="text-gold font-bold text-lg">أنت المغامر الجريء! 🎲</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12">
                <Sparkles size={64} className="text-gold animate-pulse" />
            </div>
        </div>
    );
}

export default PlayerGameOver;
