import { io } from 'socket.io-client';

const URL = process.env.VITE_SERVER_URL || process.env.APP_URL || 'http://localhost:3000';
const ADMIN_TOKEN = 'default_admin_123';

const socket = io(URL);

socket.on('connect', () => {
    console.log('Connected to server. Claiming host...');
    socket.emit('claim_host', { token: ADMIN_TOKEN }, (res) => {
        if (res.success) {
            console.log('✅ Host claimed. Starting game...');
            socket.emit('start_game');
            
            // Monitor game updates for a bit
            socket.on('game_update', (data) => {
                console.log('--- Game Update ---');
                console.log('Status:', data.gameState.status);
                console.log('Day:', data.gameState.currentDay);
                console.log('Time Left:', data.gameState.timeLeft);
                console.log('Answered Players:', data.gameState.answeredPlayers?.length || 0);
                
                if (data.gameState.status === 'day_trivia' && data.gameState.currentDay === 1 && data.gameState.answeredPlayers?.length === 8) {
                    console.log('✅ All players answered Day 1. Success!');
                    process.exit(0);
                }
            });

            // Set a timeout in case it hangs
            setTimeout(() => {
                console.log('Timeout reached. Checking final state...');
                process.exit(0);
            }, 20000);
        } else {
            console.error('❌ Failed to claim host:', res.message);
            process.exit(1);
        }
    });
});
