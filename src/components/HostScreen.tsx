import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import StageBanner from './shared/StageBanner';
import ConnectionStatus from './shared/ConnectionStatus';
import HostLobby from './host/HostLobby';
import HostTrivia from './host/HostTrivia';
import HostMajlis from './host/HostMajlis';
import HostGameOver from './host/HostGameOver';
import QuestionEditor from './host/QuestionEditor';
import HostLogin from './host/HostLogin';
import { getBackgroundStyle } from '../utils/backgrounds';
import { useGameStore } from '../store/gameStore';
import SceneTransition from './shared/SceneTransition';
import ParticleBackground from './shared/ParticleBackground';
import LaylatulQadrAtmosphere from './player/LaylatulQadrAtmosphere';

function HostScreen() {
  const {
    socket,
    connectionStatus,
    players,
    gameState,
    flyingMoney,
    volume,
    setVolume,
    isTense,
    revealState,
    isHostClaimed,
    isYouHost,
    connect,
    startGame,
    nextDay,
    jumpToMajlis,
    animationFinished,
    playAgainSameLobby
  } = useGameStore();

  const majlisAudioRef = useRef(null);
  const [bannerInfo, setBannerInfo] = useState(null);
  const [lastStatus, setLastStatus] = useState(null);
  const [viewMode, setViewMode] = useState('lobby');
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    connect(true); // isHost = true
    
    const savedQuestions = localStorage.getItem('eidFarhaQuestions');
    if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions));
    }
  }, [connect]);

  useEffect(() => {
    if (!majlisAudioRef.current) {
        majlisAudioRef.current = new Audio('/majlis-optimized_obb.opus');
        majlisAudioRef.current.loop = true;
    }
    majlisAudioRef.current.volume = volume;
    if (gameState.status === 'majlis') {
        majlisAudioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    } else {
        majlisAudioRef.current.pause();
        majlisAudioRef.current.currentTime = 0;
    }
    return () => { if (majlisAudioRef.current) majlisAudioRef.current.pause(); };
  }, [gameState.status, volume]);

  useEffect(() => {
    if (gameState.status && gameState.status !== lastStatus) {
        const labels = {
            'day_trivia': { title: 'مرحلة الصباح', desc: 'أسئلة رمضانية منوعة ☀️' },
            'night_trivia': { title: 'مرحلة المساء', desc: 'تحديات اللياقة والذكاء 🌙' },
            'majlis': { title: 'مرحلة المجلس', desc: 'وقت العيدية والقرابة ☕' },
            'final_scores': { title: 'النتائج النهائية', desc: 'من هو بطل العيد؟ 🏆' }
        };
        const label = labels[gameState.status];
        if (label) { setBannerInfo(label); setTimeout(() => setBannerInfo(null), 3000); }
        setLastStatus(gameState.status);
    }
  }, [gameState.status, lastStatus]);

  const backgroundStyle = getBackgroundStyle(gameState.status, false);

  const getParticleType = (status) => {
    if (['fitr_trivia', 'majlis', 'game_over'].includes(status)) return 'confetti';
    if (['day_trivia', 'waiting'].includes(status)) return 'lanterns';
    return 'stars';
  };

  return (
    <div className="app-container" style={backgroundStyle}>
      <ParticleBackground type={getParticleType(gameState.status)} />
      {gameState.currentDay === gameState.laylatulQadrDay && <LaylatulQadrAtmosphere />}
      <ConnectionStatus status={connectionStatus} onRetry={() => connect(true)} />
      <StageBanner info={bannerInfo} />

      <div className="volume-control">
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="volume-slider" />
      </div>

      {!isYouHost ? (
          <HostLogin />
      ) : viewMode === 'editor' ? (
          <QuestionEditor
              questions={questions} setQuestions={setQuestions} onClose={() => setViewMode('lobby')}
          />
      ) : (
          <SceneTransition status={gameState.status}>
            {gameState.status === 'waiting' && <HostLobby players={players} onStartGame={startGame} onOpenEditor={() => setViewMode('editor')} />}
            {['day_trivia', 'night_trivia', 'fitr_trivia'].includes(gameState.status) && <HostTrivia players={players} gameState={gameState} onNextDay={nextDay} onJumpToMajlis={jumpToMajlis} />}
            {gameState.status === 'transition_to_night' && (
                <div className="screen-content transition-screen">
                    <video 
                        autoPlay 
                        muted 
                        preload="none" 
                        className="transition-video"
                        onEnded={() => animationFinished('transition')}
                    >
                        <source src="/transition.mp4" type="video/mp4" />
                    </video>
                </div>
            )}
            {gameState.status === 'majlis' && <HostMajlis players={players} gameState={gameState} flyingMoney={flyingMoney} isTense={isTense} revealState={revealState} />}
            {gameState.status === 'game_over' && (
              <HostGameOver 
                players={players} 
                onRestart={() => socket?.emit('restart_game')} 
                onPlayAgainSameLobby={playAgainSameLobby}
              />
            )}
          </SceneTransition>
      )}
    </div>
  );
}

export default HostScreen;
