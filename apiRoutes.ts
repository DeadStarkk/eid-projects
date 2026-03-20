import express from 'express';
import cors from 'cors';

export function createApiRouter() {
    const router = express.Router();
    
    // Middlewares
    router.use(cors());
    router.use(express.json());

    // Serve static files with cache headers
    const cacheOptions = {
        maxAge: '7d', // 7 days
        setHeaders: (res, path) => {
            if (path.match(/\.(webp|mp4|opus)$/)) {
                res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
            }
        }
    };
    
    // We assume the server is running from the root and assets are in 'public'
    router.use(express.static('public', cacheOptions));

    // Basic health check
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    return router;
}
