import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users } from 'lucide-react';

import { getBackgroundStyle } from '../utils/backgrounds';
import ParticleBackground from './shared/ParticleBackground';

function Home() {
  const navigate = useNavigate();
  const backgroundStyle = getBackgroundStyle('waiting', true);

  return (
    <div className="app-container" style={backgroundStyle}>
      <ParticleBackground type="lanterns" />
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center">
        <div className="glass-panel w-full max-w-[600px]">
          <div className="animate-float mb-4">
            <Sparkles size={48} color="var(--gold)" />
          </div>
          <h1 className="text-gradient main-title">فرحة العيد</h1>
          <p className="text-lg mb-8 opacity-80">
            تحدي اجتماعي تفاعلي يجمع العائلة!
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <button className="btn flex items-center justify-center gap-2" onClick={() => navigate('/host')}>
              <Sparkles size={20} />
              إنشاء مجلس جديد (الشاشة الكبيرة)
            </button>
            
            <button className="btn btn-outline-gold flex items-center justify-center gap-2" onClick={() => navigate('/player')}>
              <Users size={20} />
              الانضمام كلاعب (الجوال)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
