import React from 'react';

function ParticleBackground({ type = 'stars' }) {
    const Fanous = () => (
        <svg viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))' }}>
            <path d="M12 1L14 4H10L12 1Z" fill="#FFD700"/>
            <circle cx="12" cy="1" r="1.5" stroke="#FFD700" strokeWidth="0.5"/>
            <path d="M8 4L16 4L18 8L6 8L8 4Z" fill="#DAA520"/>
            <path d="M6 8L18 8L20 26L4 26L6 8Z" fill="#FFD700" stroke="#DAA520" strokeWidth="0.5"/>
            <rect x="9" y="11" width="6" height="12" rx="1" fill="#FFFACD" opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
            </rect>
            <line x1="12" y1="8" x2="12" y2="26" stroke="#DAA520" strokeWidth="0.5"/>
            <path d="M4 26L20 26L18 30L6 30L4 26Z" fill="#DAA520"/>
            <path d="M8 30L16 30L17 35L7 35L8 30Z" fill="#FFD700"/>
        </svg>
    );

    const getParticleStyle = (i, type) => {
        const baseStyle = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 10}s`,
        };

        if (type === 'stars') {
            return {
                ...baseStyle,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.3 + 0.05,
                backgroundColor: '#fff',
                borderRadius: '50%',
                boxShadow: '0 0 3px #fff',
                animationName: 'drift'
            };
        } else if (type === 'lanterns') {
            const size = Math.random() * 25 + 20;
            return {
                ...baseStyle,
                width: `${size}px`,
                height: `${size * 1.5}px`,
                opacity: Math.random() * 0.2 + 0.1,
                animationDuration: `${Math.random() * 25 + 20}s`,
                backgroundColor: 'transparent',
                animationName: 'drift-lantern',
                borderRadius: '0'
            };
        } else if (type === 'confetti') {
            const colors = ['#FFD700', '#FF5733', '#33FF57', '#3357FF', '#F333FF'];
            return {
                ...baseStyle,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 16 + 8}px`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.4 + 0.1,
                animationDuration: `${Math.random() * 5 + 3}s`,
                borderRadius: '0',
                animationName: 'drift-down'
            };
        }
        return baseStyle;
    };

    const getParticleCount = (type) => {
        if (type === 'confetti') return 15;
        if (type === 'lanterns') return 6;
        return 10; // stars
    };

    const count = getParticleCount(type);

    return (
        <div className="particle-container">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className={`particle particle-${type}`}
                    style={getParticleStyle(i, type)}
                >
                    {type === 'lanterns' ? <Fanous /> : ''}
                </div>
            ))}
        </div>
    );
}

export default ParticleBackground;
