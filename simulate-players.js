import { io } from "socket.io-client";

const SERVER_URL = process.env.VITE_SERVER_URL || process.env.APP_URL || "http://localhost:3000";
const PLAYER_NAMES = ["أحمد", "ياسر", "خالد", "محمد", "فهد", "سعد", "سلمان", "عبدالله"];

const bots = [];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function startSimulation() {
    console.log("🚀 جاري بدء محاكاة 8 لاعبين...");

    for (const name of PLAYER_NAMES) {
        const socket = io(SERVER_URL);
        
        socket.on("connect", () => {
            socket.emit("join_game", name, (res) => {
                if (res?.success) {
                    console.log(`✅ [${name}] دخل المجلس بنجاح!`);
                    bots.push({ socket, player: res.player, lastDayAnswered: 0, isMyTurn: false });
                } else {
                    console.error(`❌ [${name}] فشل في الدخول: ${res?.message}`);
                }
            });
        });

        socket.on("game_update", async (data) => {
            const { gameState, players } = data;
            
            // Find this bot
            const myBot = bots.find(b => b.socket.id === socket.id);
            if (!myBot) return;
            
            // Update local player data
            const updatedPlayer = players.find(p => p.id === myBot.player.id);
            if (updatedPlayer) myBot.player = updatedPlayer;

            // ==========================================
            // 1. Simulator for Trivia Days (30 Nights)
            // ==========================================
            if (["day_trivia", "night_trivia", "fitr_trivia"].includes(gameState.status)) {
                // Ensure bot only answers once per advanced day
                if (myBot.lastDayAnswered !== gameState.currentDay) {
                    myBot.lastDayAnswered = gameState.currentDay;
                    
                    // Add realistic reaction delay (0.5s to 2.5s)
                    await delay(Math.random() * 2000 + 500);
                    
                    // 80% chance of getting the answer right
                    const isCorrect = Math.random() > 0.2; 
                    let points = 100;
                    if (gameState.status === 'night_trivia') points = 200;
                    if (gameState.status === 'fitr_trivia') points = 500;
                    // Laylatul Qadr simulation
                    if (gameState.status === 'night_trivia' && Math.random() < 0.2) points = 1000;
                    
                    socket.emit("submit_answer", { 
                        playerId: myBot.player.id, 
                        isCorrect, 
                        pointsAwarded: isCorrect ? points : 0 
                    });
                    
                    // console.log(`[${name}] أجاب على اليوم ${gameState.currentDay}. صحيح؟ ${isCorrect}`);
                }
            }

            // ==========================================
            // 2. Simulator for Majlis (Envelopes)
            // ==========================================
            if (gameState.status === "majlis") {
                const activePlayer = players[gameState.activePlayerIndex];
                
                if (activePlayer && activePlayer.id === myBot.player.id) {
                    if (!myBot.isMyTurn) {
                        myBot.isMyTurn = true;
                        console.log(`\n🎁 [${name}] جاء دوري في المجلس!`);
                        
                        await delay(1000); 

                        // Step 1: Select a relative with available envelopes
                        const availableRelatives = (gameState.relativesData || []).filter(r => r.availableEnvelopes.length > 0);
                        if (availableRelatives.length === 0) return;

                        const targetRelative = availableRelatives[Math.floor(Math.random() * availableRelatives.length)];
                        socket.emit('select_relative', targetRelative.id);
                        
                        await delay(1000);

                        // Step 2: Pick random envelope index
                        const envelopeIndex = Math.floor(Math.random() * targetRelative.availableEnvelopes.length);
                        const envelope = targetRelative.availableEnvelopes[envelopeIndex];
                        
                        socket.emit('choose_envelope', { 
                            playerId: myBot.player.id, 
                            envelopeIndex 
                        });
                         
                        console.log(`💵 [${name}] سحب ظرفاً من ${targetRelative.name}!`);
                    }
                } else {
                    myBot.isMyTurn = false;
                }
            }
        });
        
        socket.on("faz3a_triggered", async ({ message, pendingIndex }) => {
            console.log(`✨ [${name}] حصل على فزعة: ${message}`);
            await delay(1500);
            
            // 50% chance to confirm or cancel
            if (Math.random() > 0.5) {
                console.log(`[${name}] قرر يفتح الظرف رغم التحذير!`);
                socket.emit('confirm_faz3a', { playerId: myBot.player.id, envelopeIndex: pendingIndex });
            } else {
                console.log(`[${name}] سمع الكلام وقرر يغير الظرف!`);
                socket.emit('cancel_faz3a', { playerId: myBot.player.id });
                
                // If they cancel, they need to pick again. The game_update will trigger a new turn logic.
                myBot.isMyTurn = false; 
            }
        });

        // Stagger connections to look natural
        await delay(400);
    }
    
    console.log("\n🎮 جميع اللاعبين الـ 8 جاهزون!");
    console.log("👉 اذهب إلى شاشة المضيف (الشاشة الكبيرة) واضغط على 'بدء سباق الـ 30 ليلة'.");
}

startSimulation();
