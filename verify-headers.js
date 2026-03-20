import http from 'http';

/**
 * Quick check for asset cache headers.
 */
function checkHeaders(url) {
    http.get(url, (res) => {
        console.log(`URL: ${url}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Cache-Control: ${res.headers['cache-control']}`);
        res.resume();
    }).on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
}

const SERVER_URL = process.env.VITE_SERVER_URL || process.env.APP_URL || "http://localhost:3000";

// Wait for server to start
setTimeout(() => {
    checkHeaders(`${SERVER_URL}/grandfather.webp`);
    checkHeaders(`${SERVER_URL}/assets/responsive/grandfather-300w.webp`);
    checkHeaders(`${SERVER_URL}/transition.mp4`);
}, 2000);
