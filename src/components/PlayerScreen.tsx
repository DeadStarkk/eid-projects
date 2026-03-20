import React, { useState, useEffect } from 'react';

import ConnectionStatus from './shared/ConnectionStatus';
import PlayerLogin from './player/PlayerLogin';
import PlayerWaiting from './player/PlayerWaiting';
import PlayerTrivia from './player/PlayerTrivia';
import PlayerMajlis from './player/PlayerMajlis';
import PlayerGameOver from './player/PlayerGameOver';
import PlayerHeader from './player/PlayerHeader';
import MiniLeaderboard from './player/MiniLeaderboard';
import PlayerOverlays from './player/PlayerOverlays';
import LaylatulQadrAtmosphere from './player/LaylatulQadrAtmosphere';
import { getBackgroundStyle } from '../utils/backgrounds';
import { useGameStore } from '../store/gameStore';
import SceneTransition from './shared/SceneTransition';
import ParticleBackground from './shared/ParticleBackground';

function PlayerScreen() {
  const {
    socket,
    connectionStatus,
    player,
    players,
    gameState,
    faz3aAlert,
    setFaz3aAlert,
    isSelectionPending,
    setIsSelectionPending,
    feedback,
    showLaylatulQadr,
    showMiniLeaderboard,
    scorePopup,
    connect,
    joinGame,
    submitAnswer
  } = useGameStore();

  useEffect(() => {
    connect(false); // isHost = false
  }, [connect]);

  const backgroundStyle = getBackgroundStyle(!player ? 'waiting' : gameState.status, true);

  const getParticleType = (status) => {
    if (['fitr_trivia', 'majlis', 'game_over'].includes(status)) return 'confetti';
    if (['day_trivia', 'waiting'].includes(status)) return 'lanterns';
    return 'stars';
  };

  if (connectionStatus !== 'connected') {
    return (
      <div className="app-container" style={backgroundStyle}>
        <ParticleBackground type={getParticleType(!player ? 'waiting' : gameState.status)} />
        <ConnectionStatus status={connectionStatus} onRetry={() => connect(false)} />
      </div>
    );
  }

  if (!player) return <PlayerLogin onJoin={(data) => joinGame(data.name, data.avatar)} isJoining={false} backgroundStyle={backgroundStyle} />;

  return (
    <div className="app-container" style={backgroundStyle}>
        <ParticleBackground type={getParticleType(gameState.status)} />
        
        {gameState.currentDay === gameState.laylatulQadrDay && <LaylatulQadrAtmosphere />}

        <PlayerHeader />

        {showMiniLeaderboard && <MiniLeaderboard />}

        <div className="screen-content flex-1" style={{ padding: '1rem', minHeight: 'auto' }}>
            <SceneTransition status={gameState.status}>
                {gameState.status === 'waiting' && <PlayerWaiting />}

                {['day_trivia', 'night_trivia', 'fitr_trivia'].includes(gameState.status) && (
                    <PlayerTrivia player={player} gameState={gameState} onAnswer={submitAnswer} />
                )}

                {gameState.status === 'transition_to_night' && (
                    <div className="glass-panel text-center w-full mt-4">
                        <h3 className="text-gradient">العشر الأواخر تقترب...</h3>
                        <p>راقب الشاشة الكبيرة 🌙✨</p>
                        <div className="animate-float mt-2">
                            <span className="text-emoji">⏳</span>
                        </div>
                    </div>
                )}

                {gameState.status === 'majlis' && <PlayerMajlis />}

                {gameState.status === 'game_over' && <PlayerGameOver />}
            </SceneTransition>
        </div>


        <PlayerOverlays 
            feedback={feedback} 
            showLaylatulQadr={showLaylatulQadr} 
            scorePopup={scorePopup} 
        />
    </div>
  );
}


export default PlayerScreen;

