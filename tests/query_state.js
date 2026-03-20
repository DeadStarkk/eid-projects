import { io } from 'socket.io-client';

const URL = process.env.VITE_SERVER_URL || process.env.APP_URL || 'http://localhost:3000';

const socket = io(URL);

socket.on('connect', () => {
    console.log('Querying game state...');
    socket.on('game_update', (data) => {
        console.log('--- Current Game State ---');
        console.log('Status:', data.gameState.status);
        console.log('Day:', data.gameState.currentDay);
        console.log('Time Left:', data.gameState.timeLeft);
        console.log('Players:', data.players.length);
        console.log('Answered Players Count:', data.gameState.answeredPlayers?.length || 0);
        
        const bots = data.players.filter(p => !p.disconnected);
        console.log('Active Bots:', bots.length);
        
        process.exit(0);
    });
    
    // Fallback if no update is broadcast immediately
    setTimeout(() => {
        console.log('No update received.');
        process.exit(0);
    }, 5000);
});
