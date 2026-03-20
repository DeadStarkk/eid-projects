import React from 'react';
import { useGameStore } from '../../store/gameStore';

function MiniLeaderboard() {
    const { players, player, setShowMiniLeaderboard } = useGameStore();

    if (!player) return null;

    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    const playerRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;

    return (
        <div className="mini-leaderboard">
            <div className="flex-row-between mb-1">
                <h4 className="m-0 text-gold">لوحة الصدارة المباشرة 🏆</h4>
                <button className="btn btn-ghost" style={{ padding: '2px 8px' }} onClick={() => setShowMiniLeaderboard(false)}>إغلاق</button>
            </div>
            <div className="flex-col gap-05">
                {sortedPlayers.slice(0, 5).map((p, i) => (
                    <div key={p.id} className={`mini-leaderboard-item ${p.id === player.id ? 'me' : ''}`}>
                        <span className="mini-leaderboard-rank">{i + 1}</span>
                        <img src={p.avatar} className="avatar avatar-xs" alt="" />
                        <span className="mini-leaderboard-name">{p.name}</span>
                        <span className="mini-leaderboard-points">{p.points}</span>
                    </div>
                ))}
                {playerRank > 5 && (
                    <>
                        <div className="text-center text-dim">...</div>
                        <div className="mini-leaderboard-item me">
                            <span className="mini-leaderboard-rank">{playerRank}</span>
                            <img src={player.avatar} className="avatar avatar-xs" alt="" />
                            <span className="mini-leaderboard-name">{player.name}</span>
                            <span className="mini-leaderboard-points">{player.points}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MiniLeaderboard;
