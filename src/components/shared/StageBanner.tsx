import React from 'react';

function StageBanner({ info }) {
    if (!info) return null;

    return (
        <div className="stage-banner-wrapper">
            <div className="stage-banner">
                <h2>{info.title}</h2>
                <p>{info.desc}</p>
            </div>
        </div>
    );
}

export default StageBanner;
