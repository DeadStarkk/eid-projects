import React from 'react';
import DOMPurify from 'dompurify';
import { useGameStore } from '../../store/gameStore';
import Faz3aTutorial from './Faz3aTutorial';

function PlayerHeader() {
    const { player, players, showMiniLeaderboard, setShowMiniLeaderboard } = useGameStore();

    if (!player) return null;

    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    const playerRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;

    return (
        <div className="bg-black/40 p-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm sm:text-base">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                    <img src={player.avatar} alt="Me" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2" style={{ borderColor: player.color }} />
                    <span className="font-bold truncate max-w-[100px] sm:max-w-[150px]">{DOMPurify.sanitize(player.name)}</span>
                </div>
                <div className="sm:hidden">
                    <Faz3aTutorial />
                </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="hidden sm:block">
                    <Faz3aTutorial />
                </div>
                <span className="hidden sm:inline text-white/30">|</span>
                <button 
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors" 
                    onClick={() => setShowMiniLeaderboard(!showMiniLeaderboard)}
                >
                    المركز #{playerRank}
                </button>
                <span className="hidden sm:inline text-white/30">|</span>
                <span className="text-gold font-bold bg-gold/10 px-3 py-1 rounded-full">{player.points} pts</span>
                <span className="hidden sm:inline text-white/30">|</span>
                <span className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full">{player.wallet} ⃁</span>
                {player.faz3aLevel && player.faz3aLevel !== 'none' && (
                    <>
                        <span className="hidden sm:inline text-white/30">|</span>
                        <span className={`px-3 py-1 rounded-full font-bold ${
                            player.faz3aLevel === 'الحفيد المفضل' ? 'text-gold bg-gold/10' : 
                            player.faz3aLevel === 'الابن البار' ? 'text-silver bg-silver/10' : 
                            'text-bronze bg-bronze/10'
                        }`}>{player.faz3aLevel}</span>
                    </>
                )}
            </div>
        </div>
    );
}

export default PlayerHeader;
