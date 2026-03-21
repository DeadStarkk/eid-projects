import { create, StateCreator } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { Player, GameState, RelativeData } from '../types.js';

// Ensure we use the correct origin, and ignore invalid VITE_SERVER_URL values
const getSocketServerUrl = () => {
  const envUrl = import.meta.env.VITE_SERVER_URL;
  if (envUrl && envUrl !== 'default_admin_123') {
    return envUrl;
  }
  return window.location.origin;
};

const SOCKET_SERVER_URL = getSocketServerUrl();

interface SocketSlice {
  socket: Socket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'failed';
  connect: (isHost?: boolean) => void;
  disconnect: () => void;
}

interface GameSlice {
  players: Player[];
  gameState: GameState;
  relatives: RelativeData[];
  isHostClaimed: boolean;
  isYouHost: boolean;
  claimHost: (token: string, callback?: (response: any) => void) => void;
  startGame: () => void;
  nextDay: () => void;
  jumpToMajlis: () => void;
  skipPlayer: () => void;
  kickPlayer: (playerId: string) => void;
  playAgainSameLobby: () => void;
  animationFinished: (type: string) => void;
}

interface PlayerSlice {
  player: Player | null;
  faz3aAlert: any;
  showLaylatulQadr: boolean;
  isSelectionPending: boolean;
  feedback: any;
  showMiniLeaderboard: boolean;
  envelopeReveal: any;
  scorePopup: any;
  setFaz3aAlert: (alert: any) => void;
  setIsSelectionPending: (pending: boolean) => void;
  setFeedback: (feedback: any) => void;
  setShowMiniLeaderboard: (show: boolean) => void;
  setEnvelopeReveal: (reveal: any) => void;
  setScorePopup: (popup: any) => void;
  joinGame: (name: string, avatar: string) => void;
  submitAnswer: (choice: string) => void;
  toggleReady: () => void;
}

interface UiSlice {
  flyingMoney: any[];
  revealState: any;
  isTense: boolean;
  bannerInfo: any;
  volume: number;
  setVolume: (volume: number) => void;
}

type GameStore = SocketSlice & GameSlice & PlayerSlice & UiSlice;

const createSocketSlice: StateCreator<GameStore, [], [], SocketSlice> = (set, get) => ({
  socket: null,
  connectionStatus: 'connecting',
  
  connect: (isHost = false) => {
    const { socket: existingSocket } = get();
    if (existingSocket) existingSocket.close();

    console.log('Connecting to socket server:', SOCKET_SERVER_URL);
    set({ connectionStatus: 'connecting' });

    const newSocket = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
      path: '/socket.io',
      transports: ['websocket'], // Force websocket to avoid XHR polling issues
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      set({ connectionStatus: 'connected' });
      if (!isHost) {
        const savedSessionId = localStorage.getItem('sessionId');
        if (savedSessionId) {
          newSocket.emit('rejoin_game', { playerId: savedSessionId }, (response: any) => {
            if (response.success) set({ player: response.player });
            else localStorage.removeItem('sessionId');
          });
        }
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      set({ connectionStatus: 'disconnected' });
    });
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      set({ connectionStatus: 'failed' });
    });
    newSocket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      set({ connectionStatus: 'failed' });
    });

    newSocket.on('game_update', (data: any) => {
      const currentPlayer = get().player;
      set({ 
        players: data.players, 
        gameState: data.gameState,
        relatives: data.relatives || get().relatives,
        isHostClaimed: data.isHostClaimed !== undefined ? data.isHostClaimed : get().isHostClaimed,
        isSelectionPending: false,
        player: !isHost ? (data.players.find((p: Player) => p.id === currentPlayer?.id) || currentPlayer) : null
      });
      if (data.isYouHost !== undefined) set({ isYouHost: data.isYouHost });
    });

    newSocket.on('player_joined', (newPlayer: Player) => {
      set(state => ({ players: [...state.players, newPlayer] }));
    });

    newSocket.on('player_update', (updatedPlayer: Player) => {
      set(state => {
        const exists = state.players.some(p => p.id === updatedPlayer.id);
        const players = exists 
          ? state.players.map(p => p.id === updatedPlayer.id ? { ...p, ...updatedPlayer } : p)
          : [...state.players, updatedPlayer];
        
        const currentPlayer = (!isHost && state.player?.id === updatedPlayer.id) ? { ...state.player, ...updatedPlayer } : state.player;
        return { players, player: currentPlayer };
      });
    });

    newSocket.on('game_state_delta', (delta: any) => {
      set(state => ({ gameState: { ...state.gameState, ...delta } }));
    });

    newSocket.on('game_phase_change', (data: any) => {
      set(state => ({ 
        gameState: { ...state.gameState, ...data },
        relatives: data.relativesData || state.relatives 
      }));
    });

    if (isHost) {
      newSocket.on('envelope_chosen', ({ playerId, amount, relativeIndex }: any) => {
        const player = get().players.find(p => p.id === playerId || p.socketId === playerId);
        const playerName = player ? player.name : 'أحد الضيوف';
        
        set({ revealState: { playerName, amount, relativeIndex } });
      });

      newSocket.on('faz3a_warning', () => {
        set({ isTense: true });
        setTimeout(() => set({ isTense: false }), 3000);
      });
    } else {
      newSocket.on('faz3a_triggered', ({ message, pendingIndex, pendingAmount }: any) => {
        set({ faz3aAlert: { message, pendingIndex, pendingAmount } });
      });

      newSocket.on('vibrate', () => { 
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]); 
      });

      newSocket.on('laylatul_qadr_bonus', () => {
        set({ showLaylatulQadr: true });
        setTimeout(() => set({ showLaylatulQadr: false }), 3000);
      });

      newSocket.on('kicked', () => {
        set({ player: null });
        localStorage.removeItem('sessionId');
        alert('تم طردك من المجلس! 👋');
        window.location.href = '/';
      });

      newSocket.on('envelope_chosen', ({ playerId, amount, relativeIndex }: any) => {
        const currentPlayer = get().player;
        if (currentPlayer && currentPlayer.id === playerId) {
          set({ envelopeReveal: { amount, relativeIndex }, isSelectionPending: false });
          setTimeout(() => set({ envelopeReveal: null }), 6000);
        }
      });

      newSocket.on('answer_result', ({ isCorrect, points }: any) => {
        if (isCorrect) {
          const id = Date.now();
          set({ scorePopup: { points, id } });
          setTimeout(() => set({ scorePopup: null }), 2000);
        }
      });
    }

    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) socket.close();
    set({ socket: null, connectionStatus: 'disconnected' });
  },
});

const createGameSlice: StateCreator<GameStore, [], [], GameSlice> = (set, get) => ({
  players: [],
  gameState: { status: 'waiting' } as GameState,
  relatives: [],
  isHostClaimed: false,
  isYouHost: false,

  claimHost: (token, callback) => {
    const { socket } = get();
    if (socket) {
      socket.emit('claim_host', { token }, (response: any) => {
        if (response.success) {
          set({ isYouHost: true, isHostClaimed: true });
        }
        if (callback) callback(response);
      });
    }
  },

  startGame: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('start_game');
      socket.emit('next_day', { day: 1 });
    }
  },

  nextDay: () => {
    const { socket, gameState } = get();
    if (socket) {
      socket.emit('next_day', { day: gameState.currentDay + 1 });
    }
  },

  jumpToMajlis: () => {
    const { socket } = get();
    if (socket) socket.emit('next_day', { day: 31 });
  },

  skipPlayer: () => {
    const { socket } = get();
    if (socket) socket.emit('skip_player');
  },
  
  kickPlayer: (playerId) => {
    const { socket } = get();
    if (socket) socket.emit('kick_player', { playerId });
  },

  playAgainSameLobby: () => {
    const { socket } = get();
    if (socket) socket.emit('play_again_same_lobby');
  },

  animationFinished: (type) => {
    const { socket, revealState } = get();
    if (socket) {
      socket.emit('animation_finished', { type });
      
      if (type === 'reveal' && revealState) {
        const amount = revealState.amount;
        set({ revealState: null });
        const id = Date.now();
        set(state => ({ flyingMoney: [...state.flyingMoney, { id, amount }] }));
        setTimeout(() => set(state => ({ flyingMoney: state.flyingMoney.filter(m => m.id !== id) })), 2000);
      }
    }
  },
});

const createPlayerSlice: StateCreator<GameStore, [], [], PlayerSlice> = (set, get) => ({
  player: null,
  faz3aAlert: null,
  showLaylatulQadr: false,
  isSelectionPending: false,
  feedback: null,
  showMiniLeaderboard: false,
  envelopeReveal: null,
  scorePopup: null,

  setFaz3aAlert: (alert) => set({ faz3aAlert: alert }),
  setIsSelectionPending: (pending) => set({ isSelectionPending: pending }),
  setFeedback: (feedback) => set({ feedback }),
  setShowMiniLeaderboard: (show) => set({ showMiniLeaderboard: show }),
  setEnvelopeReveal: (reveal) => set({ envelopeReveal: reveal }),
  setScorePopup: (popup) => set({ scorePopup: popup }),

  toggleReady: () => {
    const { socket, player } = get();
    if (socket && player) {
      socket.emit('toggle_ready', { playerId: player.id });
    }
  },

  joinGame: (name, avatar) => {
    const { socket } = get();
    if (socket) {
      socket.emit('join_game', { name, avatar }, (response: any) => {
        if (response.success) {
          set({ player: response.player });
          localStorage.setItem('sessionId', response.player.id);
        } else {
          alert(response.message);
        }
      });
    }
  },

  submitAnswer: (choice) => {
    const { socket, player } = get();
    if (socket && player) {
      set({ feedback: { isCorrect: null, id: Date.now() } });
      setTimeout(() => set({ feedback: null }), 800);
      socket.emit('submit_answer', { playerId: player.id, choice });
    }
  }
});

const createUiSlice: StateCreator<GameStore, [], [], UiSlice> = (set) => ({
  flyingMoney: [],
  revealState: null,
  isTense: false,
  bannerInfo: null,
  volume: 0.5,
  setVolume: (volume) => set({ volume }),
});

export const useGameStore = create<GameStore>((...a) => ({
  ...createSocketSlice(...a),
  ...createGameSlice(...a),
  ...createPlayerSlice(...a),
  ...createUiSlice(...a),
}));

