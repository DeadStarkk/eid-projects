import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const txtPath = join(__dirname, 'farha-al-eid-questions.txt');
const jsonPath = join(__dirname, 'questions.json');

try {
    const content = readFileSync(txtPath, 'utf-8');
    const lines = content.split('\n');
    const questions = {};

    let currentDay = null;
    let currentQ = '';
    let currentOptions = [];
    let currentA = '';

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('اليوم')) {
            const dayMatch = line.match(/\d+/);
            if (dayMatch) currentDay = parseInt(dayMatch[0]);
        } else if (line.startsWith('السؤال:')) {
            currentQ = line.replace('السؤال:', '').trim();
        } else if (line.startsWith('الخيارات:')) {
            const optsStr = line.replace('الخيارات:', '').trim();
            currentOptions = optsStr.split('|').map(o => o.trim());
            while (currentOptions.length < 4) currentOptions.push('');
        } else if (line.startsWith('الإجابة:')) {
            currentA = line.replace('الإجابة:', '').trim();
            if (currentDay !== null) {
                questions[currentDay] = { 
                    id: currentDay,
                    q: currentQ, 
                    options: currentOptions, 
                    a: currentA 
                };
                currentDay = null;
                currentQ = '';
                currentOptions = [];
                currentA = '';
            }
        }
    });

    writeFileSync(jsonPath, JSON.stringify(questions, null, 2));
    console.log(`✅ Converted ${Object.keys(questions).length} questions to JSON.`);
} catch (err) {
    console.error('❌ Conversion failed:', err.message);
}
