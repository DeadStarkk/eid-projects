import React, { useState, useEffect } from 'react';
import { Brain, Coins, Gift, Info, CheckCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const RulesCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { icon: <Brain size={48} className="text-gold" />, title: "سباق الـ 30 ليلة 🌙", text: "أجب على الأسئلة اليومية بسرعة لتجمع أكبر قدر من النقاط" },
        { icon: <Coins size={48} className="text-silver" />, title: "نظام الفزعة ✨", text: "نقاطك ترفع مستوى الفزعة عندك (المشاغب، الابن البار، الحفيد المفضل)" },
        { icon: <Gift size={48} className="text-primary" />, title: "وقت العيدية 🎁", text: "في المجلس، الفزعة تنبهك إذا كان الظرف فيه عيدية بسيطة وتساعدك تغيره!" }
    ];

    useEffect(() => {
        const timer = setInterval(() => { setCurrentSlide(prev => (prev + 1) % slides.length); }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative overflow-hidden p-4 w-full" style={{ direction: 'ltr' }}>
            <div className="flex transition-transform duration-500 ease-in-out w-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, i) => (
                    <div key={i} className="shrink-0 grow-0 basis-full w-full flex flex-col items-center gap-4 box-border text-center" style={{ direction: 'rtl' }}>
                        <div className="animate-bounce-subtle text-lg">{slide.icon}</div>
                        <h3 className="text-gradient m-0 text-xl font-bold">{slide.title}</h3>
                        <p className="m-0 text-base opacity-90" style={{ lineHeight: '1.6' }}>{slide.text}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-6" style={{ direction: 'ltr' }}>
                {slides.map((_, i) => (
                    <div key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === i ? 'bg-gold scale-150' : 'bg-white/20 scale-100'}`} />
                ))}
            </div>
        </div>
    );
};

function PlayerWaiting() {
    const { player, toggleReady } = useGameStore();
    const isReady = player?.isReady;

    return (
        <div className="glass-panel text-center w-full max-w-md mx-auto p-6 sm:p-8">
            <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Info size={24} className="text-gold" />
                    <h4 className="m-0 text-xl font-bold opacity-90">قواعد المجلس</h4>
                </div>
                <RulesCarousel />
            </div>

            <div className="border-t border-white/10 pt-6 mt-6">
                <button 
                    className={`btn w-full mb-4 py-4 text-xl font-bold flex items-center justify-center gap-2 ${isReady ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 border-2 border-gold text-gold hover:bg-gold/20'}`}
                    onClick={toggleReady}
                >
                    {isReady ? <CheckCircle size={24} /> : null}
                    {isReady ? 'جاهز!' : 'أنا جاهز'}
                </button>
                <p className="opacity-60 text-sm">بانتظار انطلاق السباق... ⏳</p>
                <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin my-4 mx-auto"></div>
            </div>
        </div>
    );
}

export default PlayerWaiting;
