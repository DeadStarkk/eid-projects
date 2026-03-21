import { 
    getPlayers, getGameState, RELATIVES, 
    getHostSocketId, setHostSocketId, 
    checkRateLimit, ipRateLimits, socketRateLimits,
    broadcastGameUpdate,
    startTriviaTimer,
    resetGameState, resetGameSameLobby, advanceMajlis, kickPlayer,
    handleJoinGame, handleRejoinGame, handleSubmitAnswer, handleNextDay, 
    handleSelectRelative, handleChooseEnvelope, handleConfirmFaz3a, handleCancelFaz3a,
    handleTriggerHaptic, handleSkipPlayer, handleDisconnect, handleToggleReady
} from './gameLogic.js';
import { store } from './store.js';

export async function registerSocketHandlers(io, socket, defaultQuestions) {
    const clientIp = socket.handshake.address;
    const players = await getPlayers();
    const gameState = await getGameState();
    const hostSocketId = await getHostSocketId();

    // Initial state
    socket.emit('game_update', { 
        players: players.filter(p => !p.disconnected), 
        gameState, 
        relatives: RELATIVES,
        isHostClaimed: !!hostSocketId,
        isYouHost: socket.id === hostSocketId
    });

    // Rate limited join
    socket.on('join_game', async (data, callback) => {
        if (!checkRateLimit(clientIp, ipRateLimits, 5, 60000)) {
            if (callback) callback({ success: false, message: 'Too many join attempts. Please wait.' });
            return;
        }
        await handleJoinGame(io, socket, data, callback);
    });

    socket.on('rejoin_game', async (data, callback) => await handleRejoinGame(io, socket, data, callback));

    // Host Authorization Helper (Strict)
    const hostOnly = (handler) => async (...args) => {
        const hostSocketId = await getHostSocketId();
        if (socket.id !== hostSocketId) {
            console.warn(`Unauthorized host action from ${socket.id}`);
            return;
        }
        await handler(...args);
    };

    socket.on('claim_host', async ({ token }, callback) => {
        const currentHost = await getHostSocketId();
        if (currentHost === socket.id) {
            if (callback) callback({ success: true });
            return;
        }

        const adminToken = process.env.ADMIN_TOKEN || '123';
        if (token === adminToken) {
            await setHostSocketId(socket.id);
            console.log(`Host claimed by ${socket.id}`);
            if (callback) callback({ success: true });
            
            const players = await getPlayers();
            const gameState = await getGameState();

            // Re-sync all to show host is claimed
            io.emit('game_update', { 
                players: players.filter(p => !p.disconnected), 
                gameState, 
                relatives: RELATIVES,
                isHostClaimed: true
            });
            // Inform specifically the new host
            socket.emit('game_update', { 
                players: players.filter(p => !p.disconnected), 
                gameState, 
                relatives: RELATIVES,
                isHostClaimed: true,
                isYouHost: true
            });
        } else {
            if (callback) callback({ success: false, message: 'Invalid Admin Token' });
        }
    });

    socket.on('start_game', hostOnly(async () => {
        await store.update('gameState', gs => ({ ...gs, status: 'day_trivia', currentDay: 1, usedQuestionIds: [] }));
        await startTriviaTimer(io);
        await broadcastGameUpdate(io);
        console.log('Game started');
    }));

    socket.on('next_day', hostOnly(async (data) => await handleNextDay(io, socket, data, defaultQuestions)));
    socket.on('advance_majlis', hostOnly(async () => await advanceMajlis(io)));
    socket.on('restart_game', hostOnly(async () => {
        await resetGameState();
        await broadcastGameUpdate(io);
        console.log('Game restarted by host');
    }));

    socket.on('play_again_same_lobby', hostOnly(async () => {
        await resetGameSameLobby(io);
        console.log('Game reset for same lobby by host');
    }));

    socket.on('submit_answer', async (data) => {
        if (!checkRateLimit(socket.id, socketRateLimits, 5, 1000)) return;
        await handleSubmitAnswer(io, socket, data);
    });

    socket.on('toggle_ready', async (data) => await handleToggleReady(io, socket, data));

    socket.on('select_relative', async (data) => await handleSelectRelative(io, socket, data));
    socket.on('choose_envelope', async (data) => await handleChooseEnvelope(io, socket, data));
    socket.on('confirm_faz3a', async (data) => await handleConfirmFaz3a(io, socket, data));
    socket.on('cancel_faz3a', async (data) => await handleCancelFaz3a(io, socket, data));

    socket.on('trigger_haptic', async (data) => {
        if (!checkRateLimit(socket.id, socketRateLimits, 2, 1000)) return;
        await handleTriggerHaptic(io, data);
    });

    socket.on('skip_player', hostOnly(async () => await handleSkipPlayer(io, socket)));
    socket.on('kick_player', hostOnly(async ({ playerId }) => await kickPlayer(io, playerId)));

    socket.on('animation_finished', hostOnly(async ({ type }) => {
        if (type === 'reveal') {
            await advanceMajlis(io);
        } else if (type === 'transition') {
            await store.update('gameState', gs => ({ ...gs, status: 'night_trivia' }));
            await startTriviaTimer(io);
        }
    }));

    socket.on('disconnect', async () => {
        const hostSocketId = await getHostSocketId();
        if (socket.id === hostSocketId) await setHostSocketId(null);
        await handleDisconnect(io, socket);
        socketRateLimits.delete(socket.id);
    });
}


