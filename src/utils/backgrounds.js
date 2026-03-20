export const getBackgroundStyle = (status, isPlayer = false) => {
  const base = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    transition: 'background 1s ease-in-out'
  };

  const bgMap = {
    'waiting': '/ramadan-bg.webp',
    'day_trivia': '/ramadan-bg.webp',
    'night_trivia': '/ramadan-night-bg.webp',
    'fitr_trivia': '/ramadan-night-bg.webp',
    'majlis': '/majlis-bg.webp',
    'game_over': '/ramadan-bg.webp',
    'transition_to_night': '/ramadan-night-bg.webp'
  };

  const bg = bgMap[status] || '/ramadan-bg.webp';
  const opacity = isPlayer ? 0.5 : 0.4;
  
  return {
    ...base,
    backgroundImage: `linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity})), url('${bg}')`
  };
};
