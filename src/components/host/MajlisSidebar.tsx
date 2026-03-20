import React from 'react';
import DOMPurify from 'dompurify';
import { Crown, Coins } from 'lucide-react';

function MajlisSidebar({ players, activePlayerIndex }) {
    return (
        <div className="glass-panel majlis-sidebar">
            <h3 className="majlis-sidebar-title">ترتيب الضيوف</h3>
            {players.map((p, index) => {
                const isActive = index === activePlayerIndex;
                return (
                    <div key={p.id} className={`majlis-player ${isActive ? 'majlis-player-active spotlight' : 'majlis-player-idle'}`}>
                        <img src={p.avatar} alt={p.name} className={`avatar avatar-lg ${isActive ? 'avatar-gold' : ''}`} />
                        <div className="flex-1">
                            <div className="fw-bold flex-row-between">
                                <span>{DOMPurify.sanitize(p.name)}</span>
                                {p.faz3aLevel === 'الحفيد المفضل' && <div className="flex-row gap-05"><span className="text-gold text-xs">الحفيد المفضل</span><Crown size={16} className="text-gold" /></div>}
                                {p.faz3aLevel === 'الابن البار' && <div className="flex-row gap-05"><span className="text-silver text-xs">الابن البار</span><Crown size={16} className="text-silver" /></div>}
                                {p.faz3aLevel === 'المشاغب' && <div className="flex-row gap-05"><span className="text-bronze text-xs">المشاغب</span><Crown size={16} className="text-bronze" /></div>}
                            </div>
                            <div className="flex-row gap-05 mt-05">
                                <Coins size={14} className="text-gold" />
                                <span className="text-gold fw-bold">{p.wallet} ⃁</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MajlisSidebar;
