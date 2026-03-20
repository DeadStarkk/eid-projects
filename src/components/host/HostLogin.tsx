import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

function HostLogin() {
    const [token, setToken] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, error
    const [message, setMessage] = useState('');
    const { claimHost } = useGameStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!token.trim()) return;

        setStatus('loading');
        claimHost(token, (response) => {
            if (response.success) {
                setStatus('idle');
            } else {
                setStatus('error');
                setMessage(response.message || 'فشل التحقق من الرمز');
            }
        });
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="glass-panel w-full max-w-[400px] text-center animate-in-up">
                <div className="avatar-gold mx-auto mb-8 flex items-center justify-center w-20 h-20 rounded-full">
                    <ShieldCheck size={40} className="text-gold" />
                </div>
                
                <h2 className="text-gradient">مدخل المضيف 🔑</h2>
                <p className="opacity-50 mb-8">يرجى إدخال رمز الإدارة لبدء إدارة مجلس العيد</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="w-full mb-4">
                        <input
                            type="password"
                            placeholder="رمز الدخول (ADMIN_TOKEN)"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="input-field text-center"
                            autoFocus
                        />
                    </div>

                    {status === 'error' && (
                        <div className="text-red-500 flex items-center justify-center gap-2 animate-shake">
                            <AlertCircle size={16} />
                            <span>{message}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={`btn btn-gold w-full ${status === 'loading' ? 'loading' : ''}`}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'جاري التحقق...' : 'دخول المجلس'}
                    </button>
                </form>

                <div className="mt-8 text-xs opacity-50">
                    <Lock size={12} className="inline-block mr-2" />
                    جلسة مشفرة وآمنة
                </div>
            </div>
        </div>
    );
}

export default HostLogin;
