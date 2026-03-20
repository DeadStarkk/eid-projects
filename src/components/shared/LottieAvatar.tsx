import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import ResponsiveImage from './ResponsiveImage';

function LottieAvatar({ lottiePath, staticImage, className, style }) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        if (lottiePath) {
            fetch(lottiePath)
                .then(res => res.json())
                .then(data => setAnimationData(data))
                .catch(err => console.error("Error loading Lottie animation:", err));
        }
    }, [lottiePath]);

    if (!lottiePath || !animationData) {
        return <ResponsiveImage src={staticImage} alt="Avatar" className={className} style={style} />;
    }

    return (
        <div className={`lottie-avatar-container ${className}`} style={{ ...style, overflow: 'hidden' }}>
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="lottie-animation-layer"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}

export default LottieAvatar;
