import React from 'react';
import { AlertTriangle } from 'lucide-react';
import CalligraphySpeechBubble from './CalligraphySpeechBubble';

function FazaAlert({ alert, onConfirm, onCancel }) {
    if (!alert) return null;

    return (
        <div className="faza-alert" style={{ position: 'relative' }}>
            <AlertTriangle color="orange" size={48} className="faza-alert-icon" />
            <CalligraphySpeechBubble 
                message={alert.message} 
                isVisible={true} 
                position="top" 
            />
            <div className="flex-row gap-1 mt-15">
                <button className="btn btn-green flex-1" onClick={onConfirm}>أبي الظرف!</button>
                <button className="btn btn-red flex-1" onClick={onCancel}>بغير اختياري</button>
            </div>
        </div>
    );
}

export default FazaAlert;
