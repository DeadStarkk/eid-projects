import React from 'react';
import DOMPurify from 'dompurify';

function Leaderboard({ players, gameState }) {
    const sorted = [...players].sort((a, b) => b.points - a.points);

    return (
        <div className="grid-auto-200">
            {sorted.map((p, index) => (
                <div key={p.id} className={`leaderboard-item ${gameState.answeredPlayers?.includes(p.id) ? 'leaderboard-item-answered' : 'leaderboard-item-waiting'}`} style={{ borderRight: `4px solid ${p.color}` }}>
                    <div className="leaderboard-rank">#{index + 1}</div>
                    <img src={p.avatar} alt={p.name} className="avatar avatar-md" />
                    <div className="flex-1 text-right">
                        <div className="fw-bold">{DOMPurify.sanitize(p.name)}</div>
                        <div className="text-gold">{p.points} نقطة</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Leaderboard;
