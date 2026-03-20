import React, { useState, useEffect } from 'react';

function QuestionEditor({ questions, setQuestions, onClose }) {
    const [editingDay, setEditingDay] = useState(1);
    const [questionText, setQuestionText] = useState('');
    const [optionsText, setOptionsText] = useState(['', '', '', '']);
    const [answerText, setAnswerText] = useState('');

    useEffect(() => {
        setQuestionText(questions[editingDay]?.q || '');
        setOptionsText(questions[editingDay]?.options || ['', '', '', '']);
        setAnswerText(questions[editingDay]?.a || '');
    }, [editingDay, questions]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            
            // Try JSON first
            try {
                const newQuestions = JSON.parse(text);
                if (newQuestions && typeof newQuestions === 'object' && Object.keys(newQuestions).length > 0) {
                    setQuestions(newQuestions);
                    localStorage.setItem('eidFarhaQuestions', JSON.stringify(newQuestions));
                    setEditingDay(1);
                    alert('تم استيراد الأسئلة (JSON) بنجاح! 📥');
                    return;
                }
            } catch (err) {
                // Not JSON, continue to legacy TXT parsing
            }

            const lines = text.split('\n');
            const newQuestions = {};
            let currentDay = null, currentQ = '', currentOptions = [], currentA = '';
            lines.forEach(line => {
                line = line.trim();
                if (line.startsWith('اليوم')) { const m = line.match(/\d+/); if (m) currentDay = parseInt(m[0]); }
                else if (line.startsWith('السؤال:')) currentQ = line.replace('السؤال:', '').trim();
                else if (line.startsWith('الخيارات:')) { currentOptions = line.replace('الخيارات:', '').trim().split('|').map(o => o.trim()); while(currentOptions.length < 4) currentOptions.push(''); }
                else if (line.startsWith('الإجابة:')) {
                    currentA = line.replace('الإجابة:', '').trim();
                    if (currentDay !== null) { newQuestions[currentDay] = { q: currentQ, options: currentOptions, a: currentA }; currentDay = null; currentQ = ''; currentOptions = []; currentA = ''; }
                }
            });
            if (Object.keys(newQuestions).length > 0) {
                setQuestions(newQuestions); 
                localStorage.setItem('eidFarhaQuestions', JSON.stringify(newQuestions));
                setEditingDay(1); 
                alert('تم استيراد الأسئلة بنجاح! 📥');
            } else { alert('صيغة الملف غير صحيحة.'); }
        };
        reader.readAsText(file);
    };

    const saveQuestion = () => {
        const updated = { ...questions, [editingDay]: { q: questionText, options: optionsText, a: answerText } };
        setQuestions(updated); 
        localStorage.setItem('eidFarhaQuestions', JSON.stringify(updated));
        if (editingDay < 30) { 
            setEditingDay(editingDay + 1); 
        } else { 
            alert('تم حفظ جميع أسئلة الـ 30 يوم بنجاح! 🎉'); 
        }
    };

    const downloadJsonFile = () => {
        const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = 'questions.json';
        document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    };

    const downloadTextFile = () => {
        let content = "أسئلة وأجوبة فرحة العيد\n=========================\n\n";
        for (let i = 1; i <= 30; i++) {
            const pair = questions[i] || { q: "لم يتم تعيين سؤال", options: ["", "", "", ""], a: "لم يتم تعيين إجابة" };
            content += `اليوم ${i}:\nالسؤال: ${pair.q}\nالخيارات: ${pair.options.join(' | ')}\nالإجابة: ${pair.a}\n-------------------------\n\n`;
        }
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = 'farha-al-eid-questions.txt';
        document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    };

    return (
        <div className="screen-content screen-content-full screen-content-padded">
            <div className="glass-panel panel-editor panel-flush">
                <div className="flex-row-between">
                    <h2 className="text-gradient m-0">محرر الأسئلة 📝</h2>
                    <div className="flex-row gap-05">
                        <label className="btn btn-orange btn-sm">
                            استيراد 📂
                            <input type="file" accept=".txt,.json" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button className="btn btn-blue btn-sm" onClick={downloadJsonFile}>JSON 💾</button>
                        <button className="btn btn-silver btn-sm" onClick={downloadTextFile}>TXT 📄</button>
                        <button className="btn btn-red btn-sm" onClick={onClose}>إغلاق</button>
                    </div>
                </div>


                <p>قم بتجهيز أسئلة وإجابات الـ 30 يوم قبل بدء اللعب. (يتم حفظها تلقائياً على هذا الجهاز)</p>

                <div className="flex-row gap-1">
                    <label className="label-heading">اختر اليوم:</label>
                    <select
                        value={editingDay}
                        onChange={(e) => setEditingDay(parseInt(e.target.value))}
                        className="select-glass"
                    >
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>اليوم {day} {questions[day]?.q ? '✅' : ''}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-col gap-05">
                    <label className="label-heading">السؤال:</label>
                    <textarea
                        placeholder="اكتب السؤال هنا..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="textarea-glass textarea-lg"
                    />
                </div>

                <div className="flex-col gap-05">
                    <label className="label-heading">الخيارات الشائعة (اختر 4):</label>
                    <div className="grid-2col">
                        {[0, 1, 2, 3].map(idx => (
                            <input
                                key={idx}
                                type="text"
                                placeholder={`خيار ${idx + 1}`}
                                value={optionsText[idx]}
                                onChange={(e) => {
                                    const newOptions = [...optionsText];
                                    newOptions[idx] = e.target.value;
                                    setOptionsText(newOptions);
                                }}
                                className="input-glass"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-col gap-05">
                    <label className="label-heading">الإجابة:</label>
                    <textarea
                        placeholder="اكتب الإجابة الصحيحة هنا..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="textarea-glass textarea-md"
                    />
                </div>

                <div className="flex-end">
                    <button className="btn btn-green" onClick={saveQuestion}>
                        حفظ والانتقال للتالي 👉
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestionEditor;
