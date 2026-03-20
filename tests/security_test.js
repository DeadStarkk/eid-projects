import { io } from "socket.io-client";

const SERVER_URL = process.env.VITE_SERVER_URL || process.env.APP_URL || "http://localhost:3000";
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function runTests() {
    console.log("🔍 Starting security tests...");

    // Test 1: Host Authorization
    console.log("\n--- Test 1: Host Authorization ---");
    const host = io(SERVER_URL);
    const attacker = io(SERVER_URL);

    await delay(1000);

    // Host claims host status by being first to connect (in our implementation)
    // Actually, in our implementation, the first one to call an admin event claims it if hostSocketId is null.
    // Or just the first one to connect? Let's check server.js logic.
    // server.js: if (!hostSocketId) hostSocketId = socket.id; // Claim host if first time
    
    console.log("Host attempting to start game...");
    host.emit('start_game'); 
    await delay(500);

    console.log("Attacker attempting to restart game (should be ignored)...");
    attacker.emit('restart_game');
    await delay(500);
    // We can't easily verify 'ignored' without server logs, but we can check if state changed.

    // Test 2: Rate Limiting (Haptic)
    console.log("\n--- Test 2: Rate Limiting (Haptic) ---");
    console.log("Emitting 10 haptic events in 1 second...");
    for (let i = 0; i < 10; i++) {
        host.emit('trigger_haptic', { playerId: 'some-id' });
    }
    console.log("Check server logs for 'Unauthorized' or dropped events.");

    // Test 3: Join Rate Limiting
    console.log("\n--- Test 3: Join Rate Limiting ---");
    for (let i = 0; i < 7; i++) {
        console.log(`Join attempt ${i+1}...`);
        host.emit('join_game', `TestPlayer${i}`, (res) => {
            if (res.success) {
                console.log(`✅ Join ${i+1} success`);
            } else {
                console.log(`❌ Join ${i+1} failed: ${res.message}`);
            }
        });
        await delay(100);
    }

    await delay(2000);
    host.disconnect();
    attacker.disconnect();
    console.log("\n✅ Security tests completed. Check server logs for enforcement confirmation.");
}

runTests();
