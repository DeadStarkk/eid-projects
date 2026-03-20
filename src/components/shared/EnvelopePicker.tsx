import React from 'react';
import { Gift } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const ENVELOPE_COLORS = ['#FFD700', '#4CAF50', '#F44336'];

function EnvelopePicker({ envelopes, onChoose, disabled }) {
    return (
        <div className="grid-auto-80">
            {envelopes.map((env, idx) => {
                const colorIndex = parseInt(env.id.split('-')[1]) || 0;
                return (
                    <Tilt
                        key={env.id}
                        tiltMaxAngleX={25}
                        tiltMaxAngleY={25}
                        perspective={1000}
                        scale={1.1}
                        transitionSpeed={1000}
                        gyroscope={true}
                    >
                        <button
                            onClick={() => onChoose && onChoose(env, idx)}
                            disabled={disabled}
                            className="envelope-btn"
                            style={{ width: '100%', height: '100%' }}
                        >
                            <div className="gift-envelope envelope-lg" style={{ background: ENVELOPE_COLORS[colorIndex % ENVELOPE_COLORS.length] }}>
                                <Gift size={32} color="black" />
                            </div>
                        </button>
                    </Tilt>
                );
            })}
        </div>
    );
}

export { ENVELOPE_COLORS };
export default EnvelopePicker;
