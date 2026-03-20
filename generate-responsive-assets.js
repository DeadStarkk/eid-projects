import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, 'public');
const OUTPUT_DIR = join(PUBLIC_DIR, 'assets', 'responsive');

const SIZES = [300, 600, 1200];
const TARGET_FILES = [
    'grandfather.webp',
    'grandmother.webp',
    'paternal-uncle.webp',
    'paternal-aunt.webp',
    'maternal-uncle.webp',
    'majlis-bg.webp',
    'ramadan-bg.webp',
    'ramadan-night-bg.webp'
];

if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function processImages() {
    console.log('🚀 Generating responsive assets...');
    for (const file of TARGET_FILES) {
        const inputPath = join(PUBLIC_DIR, file);
        if (!existsSync(inputPath)) {
            console.warn(`⚠️ File not found: ${file}`);
            continue;
        }

        const name = basename(file, extname(file));
        for (const size of SIZES) {
            const outputPath = join(OUTPUT_DIR, `${name}-${size}w.webp`);
            try {
                await sharp(inputPath)
                    .resize(size)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`✅ Generated ${name}-${size}w.webp`);
            } catch (err) {
                console.error(`❌ Failed to process ${file} @ ${size}w:`, err.message);
            }
        }
    }
}

processImages().catch(console.error);
