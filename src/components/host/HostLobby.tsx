import React from 'react';
import { Settings, CheckCircle, XCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useGameStore } from '../../store/gameStore';

function HostLobby({ onOpenEditor }) {
    const { players, startGame, kickPlayer } = useGameStore();
    const readyCount = players.filter(p => p.isReady).length;

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center">
            <div className="glass-panel text-center relative">
                <button className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all" onClick={onOpenEditor}>
                    <Settings size={20} />
                </button>
                
                <h1 className="text-gradient">مجلس فرحة العيد 🌙</h1>
                <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="flex flex-col text-right">
                        <p className="text-2xl font-bold m-0">رمز الدخول: <span className="text-gold">EID24</span></p>
                        <p className="opacity-80 m-0">الضيوف الموجودين: {players.length} ({readyCount} جاهز)</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-xl">
                        <QRCodeCanvas 
                            value={`${window.location.origin}/player?code=EID24`}
                            size={120}
                            level={"H"}
                            includeMargin={false}
                        />
                        <p className="text-black text-[0.7rem] mt-2 font-bold">امسح للدخول</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {players.map(player => (
                        <div key={player.id} className="lobby-player-card w-40 animate-pop relative group">
                            {player.isReady && (
                                <div className="ready-badge">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                            )}
                            <button 
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                onClick={() => {
                                    if (window.confirm(`هل أنت متأكد من طرد ${player.name}؟`)) {
                                        kickPlayer(player.id);
                                    }
                                }}
                                title="طرد اللاعب"
                            >
                                <XCircle size={20} className="text-red-500" />
                            </button>
                            <img src={player.avatar} alt={player.name} className="avatar avatar-hero" style={{ borderColor: player.color }} />
                            <p className="mt-4 font-bold">{player.name}</p>
                        </div>
                    ))}
                    {players.length === 0 && <p className="opacity-50 mt-16">بانتظار وصول الضيوف...</p>}
                </div>

                {players.length > 0 && (
                    <button className="btn text-2xl py-4 px-12 mt-8" onClick={startGame}>
                        {readyCount === players.length ? 'الكل جاهز! ابدأ 🎉' : 'ابدأ المجلس 🎉'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default HostLobby;
