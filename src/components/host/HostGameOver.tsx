import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Trophy, Share2, Medal, RefreshCw, Zap, TrendingUp, Dice5 } from 'lucide-react';

function HostGameOver({ players, onRestart, onPlayAgainSameLobby }) {
    const { width, height } = useWindowSize();
    const sortedPlayers = [...players].sort((a, b) => b.wallet - a.wallet);
    const top3 = sortedPlayers.slice(0, 3);
    const others = sortedPlayers.slice(3);

    // Calculate Advanced Analytics
    const fastestFinger = [...players].sort((a, b) => {
        const avgA = a.stats.fastestCorrectCount > 0 ? a.stats.totalResponseTime / a.stats.fastestCorrectCount : 999;
        const avgB = b.stats.fastestCorrectCount > 0 ? b.stats.totalResponseTime / b.stats.fastestCorrectCount : 999;
        return avgA - avgB;
    })[0];

    const mostImproved = [...players].sort((a, b) => {
        const gainA = a.points - a.stats.pointsAtMidpoint;
        const gainB = b.points - b.stats.pointsAtMidpoint;
        return gainB - gainA;
    })[0];

    const riskTaker = [...players].sort((a, b) => b.stats.riskScore - a.stats.riskScore)[0];

    const handleShare = () => {
        const text = `🏆 نتائج فرحة العيد 🏆\n\n` + 
            sortedPlayers.map((p, i) => `${i + 1}. ${p.name}: ${p.wallet} ⃁`).join('\n') + 
            `\n\nعيدكم مبارك! 🎉`;
        
        navigator.clipboard.writeText(text);
        alert('تم نسخ النتائج! شاركها مع العائلة 📱');
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <Confetti width={width} height={height} numberOfPieces={200} gravity={0.1} />
            
            <div className="glass-panel w-full max-w-[1200px] text-center p-12">
                <h1 className="text-gradient text-6xl font-black mb-4">عيدكم مبارك! 🎉</h1>
                <p className="text-2xl opacity-80 mb-12">انتهى مجلسنا لهذا العام، وهذه حصيلة العيديات:</p>

                {/* Podium Section */}
                <div className="flex items-end justify-center gap-4 mb-16 h-[400px]">
                    {top3.map((p, i) => {
                        const rank = i + 1;
                        // Map rank to podium order: 2 (left), 1 (center), 3 (right)
                        const order = rank === 1 ? 'order-2' : rank === 2 ? 'order-1' : 'order-3';
                        const heightClass = rank === 1 ? 'h-[250px]' : rank === 2 ? 'h-[180px]' : 'h-[140px]';
                        const avatarSize = rank === 1 ? 'w-32 h-32' : 'w-24 h-24';
                        
                        return (
                            <div key={p.id} className={`flex flex-col items-center ${order} flex-1 max-w-[250px]`}>
                                <div className="relative mb-4">
                                    <img src={p.avatar} alt={p.name} className={`${avatarSize} rounded-full border-4 border-gold shadow-2xl shadow-gold/30 object-cover`} />
                                    {rank === 1 && <Trophy className="absolute -top-8 left-1/2 -translate-x-1/2 text-gold drop-shadow-lg" size={48} />}
                                    {rank === 2 && <Medal className="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-300 drop-shadow-lg" size={36} />}
                                    {rank === 3 && <Medal className="absolute -top-6 left-1/2 -translate-x-1/2 text-orange-400 drop-shadow-lg" size={36} />}
                                </div>
                                <h2 className="text-gold text-2xl font-bold mb-2 truncate w-full">{p.name}</h2>
                                <div className={`w-full ${heightClass} bg-gradient-to-b from-gold/20 to-transparent rounded-t-3xl border-x-2 border-t-2 border-gold/30 flex flex-col items-center justify-center gap-2`}>
                                    <span className="text-6xl font-black opacity-20">{rank}</span>
                                    <div className="text-gold text-2xl font-bold">{p.wallet} ⃁</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Advanced Analytics Section */}
                <div className="mb-12">
                    <h2 className="text-gradient text-3xl font-bold mb-8">جوائز المجلس المميزة ✨</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {fastestFinger && (
                            <div className="glass-panel p-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                                    <Zap className="text-blue-400" size={32} />
                                </div>
                                <h3 className="text-gold text-xl font-bold">الأسرع إجابة</h3>
                                <div className="flex items-center gap-3">
                                    <img src={fastestFinger.avatar} alt={fastestFinger.name} className="w-10 h-10 rounded-full border-2 border-gold/30" />
                                    <span className="text-lg font-medium">{fastestFinger.name}</span>
                                </div>
                                <p className="text-sm opacity-60">صاحب أسرع ردود فعل في المجلس!</p>
                            </div>
                        )}

                        {mostImproved && (
                            <div className="glass-panel p-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                    <TrendingUp className="text-emerald-400" size={32} />
                                </div>
                                <h3 className="text-gold text-xl font-bold">الأكثر تطوراً</h3>
                                <div className="flex items-center gap-3">
                                    <img src={mostImproved.avatar} alt={mostImproved.name} className="w-10 h-10 rounded-full border-2 border-gold/30" />
                                    <span className="text-lg font-medium">{mostImproved.name}</span>
                                </div>
                                <p className="text-sm opacity-60">قلب الموازين في النصف الثاني من اللعبة!</p>
                            </div>
                        )}

                        {riskTaker && (
                            <div className="glass-panel p-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600">
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                                    <Dice5 className="text-orange-400" size={32} />
                                </div>
                                <h3 className="text-gold text-xl font-bold">المغامر الجريء</h3>
                                <div className="flex items-center gap-3">
                                    <img src={riskTaker.avatar} alt={riskTaker.name} className="w-10 h-10 rounded-full border-2 border-gold/30" />
                                    <span className="text-lg font-medium">{riskTaker.name}</span>
                                </div>
                                <p className="text-sm opacity-60">لا يخشى المخاطرة في اختيار العيديات!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Remaining Players List */}
                {others.length > 0 && (
                    <div className="mb-12">
                        <p className="text-xl font-bold mb-6 opacity-60">بقية المشاركين ✨</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {others.map((p, i) => (
                                <div key={p.id} className="glass-panel p-4 flex items-center gap-4 bg-white/5 border-white/5">
                                    <div className="w-10 text-xl font-black opacity-20">#{i + 4}</div>
                                    <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full border-2 border-white/10" />
                                    <h3 className="flex-1 text-right text-lg font-bold">{p.name}</h3>
                                    <div className="text-gold font-bold text-xl">{p.wallet} ⃁</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    <button className="btn btn-outline-gold flex items-center gap-2 py-4 px-8 text-lg" onClick={handleShare}>
                        <Share2 size={24} />
                        نشر النتائج
                    </button>
                    <button className="btn btn-gold flex items-center gap-2 py-4 px-8 text-lg" onClick={onPlayAgainSameLobby}>
                        <RefreshCw size={24} />
                        إعادة اللعب (نفس المجلس)
                    </button>
                    <button className="btn btn-blue flex items-center gap-2 py-4 px-8 text-lg" onClick={onRestart}>
                        <RefreshCw size={24} />
                        مجلس جديد
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HostGameOver;
