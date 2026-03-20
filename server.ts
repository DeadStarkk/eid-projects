import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { loadQuestionsFromFile } from './questionParser.js';
import { createApiRouter } from './apiRoutes.js';
import { registerSocketHandlers } from './socketHandlers.js';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { Question } from './src/types.js';

async function startServer() {
  // Initialize core server components
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Load resources
  const defaultQuestions: Record<number, Question> = loadQuestionsFromFile();

  // Mount API routes
  app.use(createApiRouter());

  // Register Socket.io events
  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);
    registerSocketHandlers(io, socket, defaultQuestions);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start listening
  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Modular Server running on port ${PORT}`);
  });
}

startServer();
