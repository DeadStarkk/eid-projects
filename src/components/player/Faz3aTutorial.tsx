import React, { useState } from 'react';
import { HelpCircle, X, Info, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_RULES } from '../../constants';

function Faz3aTutorial() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faz3a-tutorial-container">
            <button 
                className="btn-icon-gold" 
                onClick={() => setIsOpen(!isOpen)}
                title="نظام الفزعة"
            >
                <HelpCircle size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="faz3a-tooltip glass-panel"
                    >
                        <div className="flex-row-between mb-1">
                            <h4 className="text-gold m-0 flex-row gap-05">
                                <Zap size={18} /> نظام الفزعة
                            </h4>
                            <button className="btn-close" onClick={() => setIsOpen(false)}>
                                <X size={16} />
                            </button>
                        </div>

                        <div className="text-right text-sm">
                            <p className="mb-1">نظام الفزعة يتيح لك "الفوز" بمبالغ أكبر في المجلس إذا لم تختر الظرف الأفضل!</p>
                            
                            <div className="tutorial-step mb-1">
                                <div className="flex-row gap-05 fw-bold text-gold">
                                    <Info size={14} /> كيف يعمل؟
                                </div>
                                <p className="text-xs">عندما تختار ظرفاً في المجلس، إذا كان هناك ظرف آخر يحتوي على مبلغ أكبر، سيظهر لك تنبيه "فزعة" يخيرك بين تأكيد اختيارك أو استخدام "فزعة" للحصول على المبلغ الأكبر.</p>
                            </div>

                            <div className="tutorial-step mb-1">
                                <div className="flex-row gap-05 fw-bold text-silver">
                                    <ShieldCheck size={14} /> مستويات الفزعة
                                </div>
                                <ul className="text-xs list-none p-0">
                                    <li>👑 <span className="text-gold">الحفيد المفضل:</span> 5 فزعات ({GAME_RULES.FAZ3A_THRESHOLDS.FAVORITE_GRANDSON}+ نقطة)</li>
                                    <li>🥈 <span className="text-silver">الابن البار:</span> 3 فزعات ({GAME_RULES.FAZ3A_THRESHOLDS.GOOD_SON}+ نقطة)</li>
                                    <li>🥉 <span className="text-bronze">المشاغب:</span> فزعة واحدة ({GAME_RULES.FAZ3A_THRESHOLDS.TROUBLEMAKER}+ نقطة)</li>
                                </ul>
                            </div>

                            <div className="tutorial-step">
                                <div className="flex-row gap-05 fw-bold text-red">
                                    <AlertTriangle size={14} /> تنبيه
                                </div>
                                <p className="text-xs">استخدم فزعاتك بحكمة، فهي محدودة وتعتمد على نقاطك التي تجمعها من الأسئلة!</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Faz3aTutorial;
