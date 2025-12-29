// App.jsx
import './css/style.css';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/layout';
import Hello from './components/hello';
import Navigate from './components/navigate';

// Vipo Playground Imports
import MemoryGame from './components/memorygame';
import TicTacToe from './components/tictactoe';
import Dictionary from './components/dictionary';  
import MusicPlayer from './components/musicplayer';

function NavigateWithNavigation() {
  const navigate = useNavigate();

  // Handle card click to navigate to different pages
  const handleCardClick = (page) => {
    if (page === 'memorygame') {
      navigate('/memory_game');
    }
    else if (page === 'tictactoe') {
      navigate('/tictactoe');
    }
    else if (page === 'dictionary') {
      navigate('/dictionary');
    }
    else if (page === 'musicplayer') {
      navigate('/musicplayer');
    }
  };
  
  return <Navigate onCardClick={handleCardClick} />;
}

function App() {
  const location = useLocation();
  const [introDone, setIntroDone] = useState(() => {
    const hash = window.location.hash;
    // Check if we're on any route except the root
    return hash !== '#/' && hash !== '';
  });

  useEffect(() => {
    // Update introDone based on current location
    // If we're on the root path, show intro, otherwise hide it
    const isRootPath = location.pathname === '/' && location.hash === '#/';
    setIntroDone(!isRootPath);
  }, [location]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Routes>
        { /* HOME / NAVIGATE */ }
        <Route 
          path="/" 
          element={
            !introDone ? (
              <Hello onFinish={() => setIntroDone(true)} />
            ) : (
              <NavigateWithNavigation />
            )
          } 
        />
        
        { /* MEMORY GAME */ }
        <Route 
          path="/memory_game" 
          element={<MemoryGame />}
        />

        { /* TIC TAC TOE */ }
        <Route
          path="/tictactoe"
          element={<TicTacToe />}
        />

        { /* DICTIONARY */ }  
        <Route
          path="/dictionary"
          element={<Dictionary />}
        />

        { /* MUSIC PLAYER */ }
        <Route
          path="/musicplayer"
          element={<MusicPlayer />}
        />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Layout>
        <App />
      </Layout>
    </Router>
  );
}

export default AppWrapper;