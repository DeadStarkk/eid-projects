const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(__dirname, 'public', 'avatars');
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
}

const subjects = [
    "young Saudi man",
    "young Saudi woman",
    "Saudi man",
    "Saudi woman",
    "Saudi boy",
    "Saudi girl",
    "Saudi grandfather",
    "Saudi grandmother",
    "Saudi teenager"
];

async function downloadAvatar(url, dest, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
            
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.startsWith('image/')) {
                throw new Error(`Invalid content type: ${contentType}`);
            }

            const buffer = await response.arrayBuffer();
            if (buffer.byteLength < 5000) {
                // Suspiciously small image (error message disguised as image)
                throw new Error(`Image too small, likely corrupted. Size: ${buffer.byteLength}`);
            }

            fs.writeFileSync(dest, Buffer.from(buffer));
            return true; // Success
        } catch (error) {
            console.warn(`Attempt ${attempt} failed for ${dest}: ${error.message}`);
            if (attempt === retries) {
                console.error(`All ${retries} attempts failed for ${dest}`);
                return false;
            }
            // Wait slightly before retrying
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

async function downloadAll() {
    console.log('Starting resilient avatar download...');
    
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const seed = Math.floor(Math.random() * 10000);
        const prompt = `A headshot photograph of a cheerful ${subject}, designed in a 3D Pixar animation style, vibrant, wearing a traditional saudi wear, laughing, cinematic lighting, high-quality rendering, soft studio background`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&nologo=true&seed=${seed}`;
        
        console.log(`Downloading avatar ${i + 1}/9 for: ${subject}...`);
        const filePath = path.join(avatarsDir, `avatar-${i + 1}.jpg`);
        
        await downloadAvatar(url, filePath);
        
        if (i < subjects.length - 1) {
            console.log('Waiting 5s to avoid rate limiting...');
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    
    console.log('Finished downloading avatars!');
}

downloadAll();
