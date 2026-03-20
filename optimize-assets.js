import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs/promises';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegStatic);

const PUBLIC_DIR = 'public';
const AVATARS_DIR = path.join(PUBLIC_DIR, 'avatars');

async function optimizeImages(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        if (file.toLowerCase().endsWith('.png')) {
            const inputPath = path.join(dir, file);
            const outputPath = inputPath.replace(/\.png$/i, '.webp');
            
            console.log(`Optimizing image: ${file} -> ${path.basename(outputPath)}`);
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);
            console.log(`Finished ${file}`);
        }
    }
}

async function optimizeAudio() {
    const inputPath = path.join(PUBLIC_DIR, 'majlis.mp3');
    const outputPath = path.join(PUBLIC_DIR, 'majlis-optimized.mp3');
    
    console.log(`Optimizing audio: majlis.mp3 -> majlis-optimized.mp3`);
    
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioBitrate(128)
            .on('end', () => {
                console.log('Finished audio optimization');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error optimizing audio:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

async function main() {
    try {
        console.log('Starting optimization...');
        
        await optimizeImages(PUBLIC_DIR);
        await optimizeImages(AVATARS_DIR);
        await optimizeAudio();
        
        console.log('Optimization complete!');
    } catch (error) {
        console.error('Optimization failed:', error);
    }
}

main();
