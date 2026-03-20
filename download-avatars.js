const https = require('https');
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

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function downloadAvatars() {
    console.log('Starting avatar download...');
    
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const prompt = `A headshot photograph of a cheerful ${subject}, designed in a 3D Pixar animation style, vibrant, wearing a traditional saudi wear, laughing, cinematic lighting, high-quality rendering, soft studio background`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
        
        console.log(`Downloading avatar ${i + 1}/9 for: ${subject}...`);
        try {
            const filePath = path.join(avatarsDir, `avatar-${i + 1}.jpg`);
            await downloadFile(url, filePath);
            console.log(`Saved: ${filePath}`);
        } catch (error) {
            console.error(`Error downloading avatar ${i + 1}:`, error);
        }
    }
    
    console.log('All avatars downloaded successfully!');
}

downloadAvatars();
