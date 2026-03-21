import { randomUUID } from 'crypto';
import { store } from './store.js';
import { Player, GameState, Relative, GameStatus, Question } from './src/types.js';
import { GAME_RULES } from './src/constants.js';

// Constants
export const MAX_PLAYERS = 10;
export const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF',
  '#33FFF3', '#F3FF33', '#FF8333', '#8333FF',
  '#FF3380', '#33FFB5'
];

export const RELATIVES: Relative[] = [
  {
    name: 'الجد',
    title: 'The Heavy Hitter',
    image: '/grandfather.webp',
    personality: 'وقور، كريم لدرجة كبيرة، يلبس مشلح. لا يؤمن بالفكة؛ يا يعطيك الجائزة الكبرى يا يعطيك "درس في الصبر".',
    envelopes: [500, 200, 5],
    hint: "يا ولدي، ترا العيدية ما تجي إلا مرة بالسنة... متأكد من هالظرف؟",
    lottiePath: "https://lottie.host/8017e4f1-3316-43dd-9333-66f97f7ca72d/mX78r6z1R4.json"
  },
  {
    name: 'الجدة',
    title: 'The Safe Haven',
    image: '/grandmother.webp',
    personality: 'ودودة، ريحتها عود ومعمول. ما تحب تشوف أحد "خسران". ما عندها الـ 500 لكن تضمن الكل يطلع مبسوط.',
    envelopes: [100, 50, 20],
    hint: "يا حبيبي، قلبي يقول لي الظرف الثاني فيه خير أكثر... وش رايك؟",
    lottiePath: "https://lottie.host/8017e4f1-3316-43dd-9333-66f97f7ca72d/mX78r6z1R4.json"
  },
  {
    name: 'العم',
    title: 'The Traditionalist',
    image: '/paternal-uncle.webp',
    personality: 'عملي وصريح. هو الرجل "المتوسط". يعطي المطلوب بالضبط - لا أكثر ولا أقل.',
    envelopes: [100, 50, 10],
    hint: "خلك فطين، فكر زين قبل ما تفتح... تبي تغير؟",
    lottiePath: "https://lottie.host/8017e4f1-3316-43dd-9333-66f97f7ca72d/mX78r6z1R4.json"
  },
  {
    name: 'العمة',
    title: 'The Generous Favorite',
    image: '/paternal-aunt.webp',
    personality: 'أنيقة، اجتماعية وتحب تدلع عيالها. هي اللي دائماً تزيد "بونص" لأن لبسك عجبها.',
    envelopes: [200, 100, 50],
    hint: "يا بطل، عيديّتي دايماً هي الأفضل، لا تستعجل... تبي تختار غيره؟",
    lottiePath: "https://lottie.host/8017e4f1-3316-43dd-9333-66f97f7ca72d/mX78r6z1R4.json"
  },
  {
    name: 'الخال',
    title: 'The Wild Card / Prankster',
    image: '/maternal-uncle.webp',
    personality: 'فرفوش ويحب يطقطق. ممكن يغنيك، وممكن يعطيك "لبانة". اللعب معه مغامرة.',
    envelopes: [500, 10, 1],
    hint: "هاه! طحت في الفخ؟ ولا تبيني أعطيك فرصة ثانية وتغير رايك؟",
    lottiePath: "https://lottie.host/8017e4f1-3316-43dd-9333-66f97f7ca72d/mX78r6z1R4.json"
  }
];

function getRandomLaylatulQadrDay() {
    const oddNights = [21, 23, 25, 27, 29];
    return oddNights[Math.floor(Math.random() * oddNights.length)];
}

// Initialize Store
const INITIAL_GAME_STATE: GameState = {
  status: 'waiting',
  currentDay: 0,
  currentQuestion: null,
  activePlayerIndex: 0,
  currentRelativeIndex: 0,
  selectedRelativeIndex: null,
  endTime: null,
  timeLeft: null,
  isLocked: false,
  answeredPlayers: [],
  playerChoices: {},
  laylatulQadrDay: getRandomLaylatulQadrDay()
};

await store.set('players', []);
await store.set('gameState', INITIAL_GAME_STATE);
await store.set('hostSocketId', null);
await store.set('submissionTimes', {});

let timerInterval = null;

export async function getPlayers(): Promise<Player[]> { return await store.get('players') || []; }
export async function getGameState(): Promise<GameState> { return await store.get('gameState') || INITIAL_GAME_STATE; }
export async function getHostSocketId(): Promise<string | null> { return await store.get('hostSocketId'); }
export async function setHostSocketId(id: string | null) { await store.set('hostSocketId', id); }
export async function clearSubmissionTimes() { await store.set('submissionTimes', {}); }

export async function handleToggleReady(io: any, socket: any, data: { playerId: string }) {
    const players = await getPlayers();
    const playerIndex = players.findIndex(p => p.id === data.playerId);
    if (playerIndex !== -1) {
        players[playerIndex].isReady = !players[playerIndex].isReady;
        await store.set('players', players);
        await broadcastGameUpdate(io);
    }
}


// Rate Limiting Helpers
export const ipRateLimits = new Map();
export const socketRateLimits = new Map();

export function checkRateLimit(id, map, limit, interval) {
    const now = Date.now();
    const entry = map.get(id) || { lastTime: 0, count: 0 };
    
    if (now - entry.lastTime > interval) {
        entry.count = 1;
        entry.lastTime = now;
        map.set(id, entry);
        return true;
    }
    
    if (entry.count < limit) {
        entry.count++;
        map.set(id, entry);
        return true;
    }
    
    return false;
}

// Logic Functions
export function stripAnswer(state) {
    if (state.isLocked) return state;
    
    // Create a copy to avoid modifying the original gameState
    const stripped = { ...state };
    delete stripped.playerChoices;
    
    if (stripped.currentQuestion) {
        const { a, ...strippedQuestion } = stripped.currentQuestion;
        stripped.currentQuestion = strippedQuestion;
    }
    
    return stripped;
}

export async function handleJoinGame(io, socket, data, callback) {
    const players = await getPlayers();
    const activePlayers = players.filter(p => !p.disconnected);
    if (activePlayers.length >= MAX_PLAYERS) {
        if (callback) callback({ success: false, message: 'المجلس ممتلئ!' });
        return;
    }

    let playerName = (typeof data === 'object' && data !== null) ? data.name : data;
    let avatarUrl = (typeof data === 'object' && data !== null) ? data.avatar : '';

    if (typeof playerName !== 'string') playerName = 'Guest';
    playerName = playerName.trim().substring(0, 25) || 'Guest';

    // Idempotency check: if player with same socketId is already in
    const existingPlayer = players.find(p => p.socketId === socket.id && !p.disconnected);
    if (existingPlayer) {
        if (callback) callback({ success: true, player: existingPlayer });
        return;
    }

    const newPlayer = {
        id: randomUUID(),
        socketId: socket.id,
        name: playerName,
        points: 0,
        wallet: 0,
        faz3aLevel: 'none',
        faz3aUsesLeft: 0,
        color: COLORS[players.length % COLORS.length],
        avatar: avatarUrl,
        disconnected: false,
        stats: {
            fastestCorrectCount: 0,
            totalResponseTime: 0,
            pointsAtMidpoint: 0,
            riskScore: 0
        }
    };

    players.push(newPlayer);
    await store.set('players', players);
    io.emit('player_joined', newPlayer);
    if (callback) callback({ success: true, player: newPlayer });
}

export async function handleRejoinGame(io, socket, { playerId }, callback) {
    const players = await getPlayers();
    const player = players.find(p => p.id === playerId);
    if (!player) {
        if (callback) callback({ success: false, message: 'لم يتم العثور على اللاعب.' });
        return;
    }
    
    // Idempotency check: if already rejoined with same socket
    if (player.socketId === socket.id && !player.disconnected) {
        if (callback) callback({ success: true, player });
        return;
    }

    player.socketId = socket.id;
    player.disconnected = false;
    await store.set('players', players);
    broadcastPlayerUpdate(io, player);
    
    // Send full state to the rejoining player
    const gameState = await getGameState();
    const hostSocketId = await getHostSocketId();
    const strippedGS = stripAnswer(gameState);
    socket.emit('game_update', { 
        players, 
        gameState: strippedGS,
        isHostClaimed: !!hostSocketId,
        isYouHost: false
    });

    if (callback) callback({ success: true, player });
}

export async function handleSubmitAnswer(io, socket, { playerId, choice }) {
    const gameState = await getGameState();
    if (gameState.isLocked) return;
    // Idempotency check: ensure player hasn't already answered
    if (gameState.answeredPlayers.includes(playerId) || gameState.playerChoices[playerId] !== undefined) return;

    const players = await getPlayers();
    const player = players.find(p => p.id === playerId);
    if (player && gameState.currentQuestion) {
        gameState.answeredPlayers.push(playerId);
        gameState.playerChoices[playerId] = choice;
        
        const submissionTimes = await store.get('submissionTimes') || {};
        const now = Date.now();
        const duration = GAME_RULES.TRIVIA_DURATION_SEC * 1000; // trivia duration
        const elapsed = Math.max(0, Math.min(duration, duration - (gameState.endTime - now)));
        submissionTimes[playerId] = elapsed / 1000;
        await store.set('submissionTimes', submissionTimes);
        
        await store.set('gameState', gameState);
        
        broadcastGameStateDelta(io, { 
            answeredPlayers: gameState.answeredPlayers
        });
    }
}

export async function handleNextDay(io, socket, { day }, defaultQuestions) {
    const gameState = await getGameState();
    
    // Initialize usedQuestionIds if missing
    if (!gameState.usedQuestionIds) {
        gameState.usedQuestionIds = [];
    }

    // Idempotency check: don't process same day twice unless game was waiting or over
    if (gameState.currentDay === day && !['waiting', 'game_over'].includes(gameState.status)) {
        return;
    }

    stopTimer();
    gameState.currentDay = day;
    
    // Pick next question in order
    const allQuestionIds = Object.keys(defaultQuestions).map(Number).sort((a, b) => a - b);
    
    // Find the next question ID that hasn't been used, or restart if all used
    let nextQuestionId = allQuestionIds.find(id => !gameState.usedQuestionIds.includes(id));
    
    if (nextQuestionId === undefined) {
        gameState.usedQuestionIds = [];
        nextQuestionId = allQuestionIds[0];
    }
    
    gameState.currentQuestion = defaultQuestions[nextQuestionId];
    gameState.usedQuestionIds.push(nextQuestionId);

    gameState.isLocked = false;
    gameState.answeredPlayers = [];
    gameState.playerChoices = {};
    await clearSubmissionTimes();
    gameState.timeLeft = GAME_RULES.TRIVIA_DURATION_SEC;
    
    await store.set('gameState', gameState);
    
    const players = await getPlayers();
    if (day === 15) {
        players.forEach(p => {
            p.stats.pointsAtMidpoint = p.points;
        });
        await store.set('players', players);
    }

    if (day === GAME_RULES.NIGHT_TRIVIA_START_DAY) {
        gameState.status = 'transition_to_night';
        await store.set('gameState', gameState);
        await broadcastGamePhase(io);
        return;
    }

    if (day > GAME_RULES.NIGHT_TRIVIA_START_DAY && day <= 29) gameState.status = 'night_trivia';
    else if (day === 30) gameState.status = 'fitr_trivia';
    else if (day > 30) {
        await calculateFaz3aLevels();
        const updatedPlayers = await getPlayers();
        updatedPlayers.sort((a, b) => b.points - a.points);
        await store.set('players', updatedPlayers);

        gameState.status = 'majlis';
        gameState.activePlayerIndex = 0;
        gameState.selectedRelativeIndex = null;
        gameState.timeLeft = null;
        gameState.relativesData = RELATIVES.map((r, idx) => {
            const shuffledAmounts = [...r.envelopes].sort(() => Math.random() - 0.5);
            return {
                id: idx, name: r.name, title: r.title, image: r.image,
                personality: r.personality, hint: r.hint,
                availableEnvelopes: shuffledAmounts.map((amt, oIdx) => ({ id: `${idx}-${oIdx}`, amount: amt }))
            };
        });
        await store.set('gameState', gameState);
        await advanceMajlis(io, true);
        return;
    } else gameState.status = 'day_trivia';

    await store.set('gameState', gameState);

    if (['day_trivia', 'night_trivia', 'fitr_trivia'].includes(gameState.status)) await startTriviaTimer(io);
    else await broadcastGamePhase(io);
}

export async function handleSelectRelative(io, socket, relativeIndex) {
    const gameState = await getGameState();
    
    // Idempotency check
    if (gameState.selectedRelativeIndex === relativeIndex) return;

    const players = await getPlayers();
    const activePlayer = players[gameState.activePlayerIndex];
    if (activePlayer && activePlayer.socketId === socket.id) {
        gameState.selectedRelativeIndex = relativeIndex;
        await store.set('gameState', gameState);
        broadcastGameStateDelta(io, { selectedRelativeIndex: relativeIndex });
    }
}

export async function handleChooseEnvelope(io, socket, { playerId, envelopeIndex }) {
    const gameState = await getGameState();
    const players = await getPlayers();
    const activePlayer = players[gameState.activePlayerIndex];
    if (activePlayer && activePlayer.id === playerId && gameState.selectedRelativeIndex !== null) {
        const relative = gameState.relativesData[gameState.selectedRelativeIndex];
        const envelope = relative.availableEnvelopes[envelopeIndex];
        const amount = envelope.amount;
        const maxPossible = Math.max(...relative.availableEnvelopes.map(e => e.amount));
        
        // Track risk: Choosing Grandfather (0) or Maternal Uncle (4) adds risk points
        if (gameState.selectedRelativeIndex === 0 || gameState.selectedRelativeIndex === 4) {
            activePlayer.stats.riskScore += 10;
        }

        if (amount < maxPossible && activePlayer.faz3aUsesLeft > 0) {
            socket.emit('faz3a_triggered', { 
                message: relative.hint || "متاكد؟ القريب يلمح لك تغير رايك! 😉",
                pendingIndex: envelopeIndex, pendingAmount: amount
            });
            io.emit('faz3a_warning', { playerName: activePlayer.name });
            await store.set('players', players); // Save risk score
            return;
        }
        await finalizeEnvelopeChoice(io, activePlayer, envelopeIndex);
    }
}

export async function handleConfirmFaz3a(io, socket, { playerId, envelopeIndex }) {
    const gameState = await getGameState();
    if (gameState.selectedRelativeIndex === null) return;

    const players = await getPlayers();
    const activePlayer = players[gameState.activePlayerIndex];
    if (activePlayer && activePlayer.id === playerId && gameState.selectedRelativeIndex !== null) {
        await finalizeEnvelopeChoice(io, activePlayer, envelopeIndex);
    }
}

export async function handleCancelFaz3a(io, socket, { playerId }) {
    const gameState = await getGameState();
    const players = await getPlayers();
    const activePlayer = players[gameState.activePlayerIndex];
    if (activePlayer && activePlayer.id === playerId && activePlayer.faz3aUsesLeft > 0) {
        // Idempotency check: ensure we don't cancel if already cancelled (selectedRelativeIndex is null)
        if (gameState.selectedRelativeIndex === null) return;
        
        activePlayer.faz3aUsesLeft--;
        await store.set('players', players);
        broadcastPlayerUpdate(io, activePlayer);
    }
}

export async function handleTriggerHaptic(io, { playerId }) {
    const players = await getPlayers();
    const targetPlayer = players.find(p => p.id === playerId);
    if (targetPlayer && targetPlayer.socketId) io.to(targetPlayer.socketId).emit('vibrate');
}

export async function handleSkipPlayer(io, socket) {
    const hostSocketId = await getHostSocketId();
    if (socket.id === hostSocketId) {
        await advanceMajlis(io);
    }
}

export async function handleDisconnect(io, socket) {
    const players = await getPlayers();
    const player = players.find(p => p.socketId === socket.id);
    if (player) {
        player.disconnected = true;
        player.socketId = null;
        await store.set('players', players);
        broadcastPlayerUpdate(io, player);
    }
}

export async function broadcastGameUpdate(io) {
    const gameState = await getGameState();
    const players = await getPlayers();
    const hostSocketId = await getHostSocketId();
    const strippedGS = stripAnswer(gameState);
    io.emit('game_update', { 
        players: players.filter(p => !p.disconnected), 
        gameState: strippedGS,
        isHostClaimed: !!hostSocketId
    });
}

export function broadcastPlayerUpdate(io, player) {
    if (!player) return;
    io.emit('player_update', { 
        id: player.id, 
        points: player.points, 
        wallet: player.wallet, 
        faz3aLevel: player.faz3aLevel, 
        faz3aUsesLeft: player.faz3aUsesLeft,
        disconnected: player.disconnected,
        stats: player.stats
    });
}

export function broadcastGameStateDelta(io, delta) {
    io.emit('game_state_delta', delta);
}

export async function broadcastGamePhase(io) {
    const gameState = await getGameState();
    const strippedGS = stripAnswer(gameState);
    io.emit('game_phase_change', { 
        status: gameState.status, 
        currentDay: gameState.currentDay,
        currentQuestion: strippedGS.currentQuestion,
        relativesData: gameState.relativesData,
        endTime: gameState.endTime
    });
}

export function stopTimer() {
    if (timerInterval) {
        clearTimeout(timerInterval);
        timerInterval = null;
    }
}

export async function startTriviaTimer(io) {
    stopTimer();
    const duration = GAME_RULES.TRIVIA_DURATION_SEC * 1000;
    const endTime = Date.now() + duration;
    await store.update('gameState', gs => ({ ...gs, endTime, timeLeft: GAME_RULES.TRIVIA_DURATION_SEC, isLocked: false }));
    
    // Initial sync for phase start
    await broadcastGamePhase(io);

    timerInterval = setTimeout(async () => {
        await store.update('gameState', gs => ({ ...gs, isLocked: true, timeLeft: 0 }));
        timerInterval = null;
        
        const updatedGS = await getGameState();
        const players = await getPlayers();
        const submissionTimes = await store.get('submissionTimes') || {};

        // Process all answers now that the timer has locked
        if (updatedGS.currentQuestion) {
            const correctAnswer = updatedGS.currentQuestion.a;
            for (const player of players) {
                const choice = updatedGS.playerChoices[player.id];
                if (choice !== undefined) {
                    const isCorrect = choice === correctAnswer;
                    let points = 0;
                    let isLaylatulQadr = false;

                    if (isCorrect) {
                        points = updatedGS.status === 'night_trivia' ? 200 : (updatedGS.status === 'fitr_trivia' ? 500 : 100);
                        isLaylatulQadr = updatedGS.currentDay === updatedGS.laylatulQadrDay;
                        if (isLaylatulQadr) points = 1000;

                        player.points += points;
                        player.stats.fastestCorrectCount++;
                        if (submissionTimes[player.id] !== undefined) {
                            player.stats.totalResponseTime += submissionTimes[player.id];
                        }
                        
                        broadcastPlayerUpdate(io, player);
                    }

                    // Notify individual player of their result
                    if (player.socketId) {
                        io.to(player.socketId).emit('answer_result', { isCorrect, points });
                        if (isLaylatulQadr) io.to(player.socketId).emit('laylatul_qadr_bonus');
                    }
                }
            }
            await store.set('players', players);
        }
        // Broadcast final state with answer revealed
        await broadcastGameUpdate(io);
    }, duration);
}

export async function calculateFaz3aLevels(io) {
    const players = await getPlayers();
    players.forEach(p => {
        let changed = false;
        const oldLevel = p.faz3aLevel;
        if (p.points >= GAME_RULES.FAZ3A_THRESHOLDS.FAVORITE_GRANDSON) { p.faz3aLevel = 'الحفيد المفضل'; p.faz3aUsesLeft = 5; changed = (oldLevel !== 'الحفيد المفضل'); }
        else if (p.points >= GAME_RULES.FAZ3A_THRESHOLDS.GOOD_SON) { p.faz3aLevel = 'الابن البار'; p.faz3aUsesLeft = 3; changed = (oldLevel !== 'الابن البار'); }
        else if (p.points >= GAME_RULES.FAZ3A_THRESHOLDS.TROUBLEMAKER) { p.faz3aLevel = 'المشاغب'; p.faz3aUsesLeft = 1; changed = (oldLevel !== 'المشاغب'); }
        else { p.faz3aLevel = 'none'; p.faz3aUsesLeft = 0; changed = (oldLevel !== 'none'); }
        
        if (changed && io) broadcastPlayerUpdate(io, p);
    });
    await store.set('players', players);
}

export async function kickPlayer(io, playerId) {
    const players = await getPlayers();
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex !== -1) {
        const player = players[playerIndex];
        const socketId = player.socketId;
        players.splice(playerIndex, 1);
        await store.set('players', players);
        
        if (socketId) {
            io.to(socketId).emit('kicked');
            const socket = io.sockets.sockets.get(socketId);
            if (socket) socket.disconnect();
        }
        await broadcastGameUpdate(io);
    }
}

export async function resetGameState() {
    await store.set('players', []);
    await store.set('gameState', {
        ...INITIAL_GAME_STATE,
        laylatulQadrDay: getRandomLaylatulQadrDay()
    });
    await store.set('submissionTimes', {});
    stopTimer();
}

export async function resetGameSameLobby(io) {
    const players = await getPlayers();
    // Reset players' points and wallets
    players.forEach(player => {
        player.points = 0;
        player.wallet = 0;
        player.faz3aLevel = 'none';
        player.faz3aUsesLeft = 0;
        player.stats = {
            fastestCorrectCount: 0,
            totalResponseTime: 0,
            pointsAtMidpoint: 0,
            riskScore: 0
        };
    });
    await store.set('players', players);

    // Reset game state
    await store.set('gameState', {
        ...INITIAL_GAME_STATE,
        laylatulQadrDay: getRandomLaylatulQadrDay()
    });
    await store.set('submissionTimes', {});
    stopTimer();

    // Broadcast the update to everyone
    await broadcastGameUpdate(io);
}

export async function finalizeEnvelopeChoice(io, player, envelopeIndex) {
    const gameState = await getGameState();
    if (gameState.selectedRelativeIndex === null) return;
    
    const relative = gameState.relativesData[gameState.selectedRelativeIndex];
    if (!relative) return;

    const envelope = relative.availableEnvelopes[envelopeIndex];
    if (!envelope) return;
    const amount = envelope.amount;
    
    relative.availableEnvelopes.splice(envelopeIndex, 1);
    io.emit('envelope_chosen', { playerId: player.id, amount, relativeIndex: gameState.selectedRelativeIndex });
    
    player.wallet += amount;
    
    // Update player in players list
    const players = await getPlayers();
    const pIdx = players.findIndex(p => p.id === player.id);
    if (pIdx !== -1) players[pIdx] = player;
    await store.set('players', players);

    await store.update('gameState', gs => ({ ...gs, selectedRelativeIndex: null, relativesData: gs.relativesData }));

    broadcastPlayerUpdate(io, player);
    broadcastGameStateDelta(io, { 
        selectedRelativeIndex: null, 
        relativesData: gameState.relativesData 
    });
}

export async function advanceMajlis(io, isInitial = false) {
    const gameState = await getGameState();
    const players = await getPlayers();
    if (gameState.status !== 'majlis' || players.length === 0) return;
    stopTimer();

    const totalEnvelopesLeft = (gameState.relativesData || []).reduce((acc, r) => acc + (r.availableEnvelopes?.length || 0), 0);
    
    if (totalEnvelopesLeft === 0) {
        await store.update('gameState', gs => ({ ...gs, status: 'game_over' }));
        await broadcastGamePhase(io);
    } else {
        let newActiveIndex = gameState.activePlayerIndex;
        if (!isInitial) {
            newActiveIndex = (gameState.activePlayerIndex + 1) % players.length;
        }
        
        const duration = 30000;
        const endTime = Date.now() + duration;

        await store.update('gameState', gs => ({ 
            ...gs, 
            activePlayerIndex: newActiveIndex,
            selectedRelativeIndex: null,
            endTime,
            timeLeft: 30
        }));

        broadcastGameStateDelta(io, { 
            activePlayerIndex: newActiveIndex,
            selectedRelativeIndex: null,
            endTime,
            timeLeft: 30
        });
        
        // Start turn timer
        timerInterval = setTimeout(async () => {
            timerInterval = null;
            await advanceMajlis(io);
        }, duration);
    }
}

