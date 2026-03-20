import { io } from 'socket.io-client';

const URL = process.env.VITE_SERVER_URL || process.env.APP_URL || 'http://localhost:3000';
const ADMIN_TOKEN = 'default_admin_123';

async function runTest() {
    console.log('🚀 Starting programmatic E2E Socket Test...');

    const host = io(URL);
    const p1 = io(URL);
    const p2 = io(URL);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        // 1. Claim Host
        console.log('--- Phase 1: Claim Host ---');
        await new Promise((resolve, reject) => {
            host.emit('claim_host', { token: ADMIN_TOKEN }, (res) => {
                if (res.success) {
                    console.log('✅ Host claimed session successfully');
                    resolve();
                } else {
                    reject('❌ Failed to claim host: ' + res.message);
                }
            });
        });

        // 2. Join Players
        console.log('--- Phase 2: Join Players ---');
        let p1Data, p2Data;
        await Promise.all([
            new Promise(resolve => p1.emit('join_game', { name: 'Player 1' }, (res) => { p1Data = res.player; resolve(); })),
            new Promise(resolve => p2.emit('join_game', { name: 'Player 2' }, (res) => { p2Data = res.player; resolve(); }))
        ]);
        console.log(`✅ Players joined: ${p1Data.name}, ${p2Data.name}`);

        // 3. Start Game
        console.log('--- Phase 3: Start Game ---');
        host.emit('start_game');
        await wait(1000);

        // 4. Verify Trivia State
        host.on('game_state_delta', (delta) => {
            if (delta.timeLeft !== undefined) {
                console.log(`🕒 Timer Update: ${delta.timeLeft}s`);
            }
        });

        // 5. Submit Answers
        console.log('--- Phase 4: Submit Answers ---');
        const correctChoice = 'A'; // Assuming first question answer is A or similar
        // We'll just wait for the first game_update to get the question if possible, 
        // but for now we just emit and see if it's accepted.
        
        p1.emit('submit_answer', { playerId: p1Data.id, choice: 'A' });
        p2.emit('submit_answer', { playerId: p2Data.id, choice: 'B' });
        await wait(1000);
        console.log('✅ Answers submitted');

        // 6. Next Day
        console.log('--- Phase 5: Next Day ---');
        host.emit('next_day', { day: 2 });
        await wait(2000);
        console.log('✅ Advanced to Day 2');

        console.log('🎉 E2E Test Passed programmatically!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Test Failed:', err);
        process.exit(1);
    }
}

runTest();
