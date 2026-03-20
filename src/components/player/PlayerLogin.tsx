import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import ParticleBackground from '../shared/ParticleBackground';

const PREMADE_AVATARS = [
    '/avatars/avatar-1.webp', '/avatars/avatar-2.webp', '/avatars/avatar-3.webp',
    '/avatars/avatar-4.webp', '/avatars/avatar-5.webp', '/avatars/avatar-6.webp',
    '/avatars/avatar-7.webp', '/avatars/avatar-8.webp', '/avatars/avatar-9.webp'
];

function PlayerLogin({ backgroundStyle }) {
    const { joinGame, connectionStatus } = useGameStore();
    const location = useLocation();
    const isJoining = connectionStatus === 'connecting';
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('EID24');
    const [selectedAvatar, setSelectedAvatar] = useState(PREMADE_AVATARS[0]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (code) setRoomCode(code.toUpperCase());
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !roomCode.trim() || isJoining) return;
        // In this single-room app, we just join with name and avatar.
        // The roomCode is purely for UI consistency as requested.
        joinGame(name, selectedAvatar);
    };

    return (
        <div className="app-container" style={backgroundStyle}>
            <ParticleBackground type="lanterns" />
            <div className="screen-content">
                <div className="glass-panel panel-narrow w-full max-w-md p-6 sm:p-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gradient">تسجيل الدخول</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="رمز المجلس (مثلاً: EID24)"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="input-base w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors"
                            maxLength={10}
                        />
                        <input
                            type="text"
                            placeholder="اسمك الكريم؟"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-base w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors"
                            maxLength={25}
                        />

                        <div className="mt-4">
                            <p className="mb-3 text-right font-bold text-lg">اختر شخصيتك:</p>
                            <div className="grid grid-cols-3 gap-3">
                                {PREMADE_AVATARS.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`Avatar ${idx + 1}`}
                                        onClick={() => setSelectedAvatar(url)}
                                        className={`w-full aspect-square rounded-xl cursor-pointer transition-all object-cover ${selectedAvatar === url ? 'border-4 border-gold scale-105 shadow-lg shadow-gold/30' : 'border-2 border-transparent opacity-70 hover:opacity-100'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <button className="btn mt-6 w-full py-4 text-xl font-bold" type="submit" disabled={isJoining}>
                            {isJoining ? 'جاري الدخول...' : 'دخول المجلس'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PlayerLogin;
