import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Loads and parses questions from questions.json
 * @returns {Record<number, {id: number, q: string, options: string[], a: string}>}
 */
export function loadQuestionsFromFile() {
    try {
        const filePath = join(__dirname, 'questions.json');
        const content = readFileSync(filePath, 'utf-8');
        const questions = JSON.parse(content);

        console.log(`✅ Loaded ${Object.keys(questions).length} questions from JSON.`);
        return questions;
    } catch (err) {
        console.error('⚠️ Could not load questions JSON:', err.message);
        // Fallback or attempt to re-run conversion if needed
        return {};
    }
}
