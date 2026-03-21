import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Home from './components/Home';
import HostScreen from './components/HostScreen';
import PlayerScreen from './components/PlayerScreen';

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/host" element={
        <ErrorBoundary><HostScreen /></ErrorBoundary>
      } />
      <Route path="/player" element={
        <ErrorBoundary><PlayerScreen /></ErrorBoundary>
      } />
    </Routes>
  );
}

export default App;
