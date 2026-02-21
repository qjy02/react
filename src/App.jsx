// App.jsx
import './css/style.css';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate as RouterNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/layout';
import Hello from './components/hello';
import Navigate from './components/navigate';

// Vipo Playground Imports
import MemoryGame from './components/memorygame';
import TicTacToe from './components/tictactoe';
import Dictionary from './components/dictionary';  
import MusicPlayer from './components/musicplayer';
import Dinner from './components/dinner';
import IchibanKuji from './components/ichibankuji';

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
    else if (page === 'dinner') {
      navigate('/dinner');
    }
    else if (page === 'ichibankuji') {
      navigate('/ichibankuji');
    }
  };
  
  return <Navigate onCardClick={handleCardClick} />;
}

function App() {
  const location = useLocation();
  const [showHello, setShowHello] = useState(true);
  
  // Reset showHello when we're at the root path
  useEffect(() => {
    // With HashRouter, the root path is either empty hash or '#/'
    const isRootPath = location.hash === '#/' || location.hash === '';
    
    if (isRootPath) {
      setShowHello(true);
    }
  }, [location]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Routes>
        { /* ROOT PATH */ }
        <Route 
          path="/" 
          element={
            showHello ? (
              <Hello 
                onFinish={() => {
                  setShowHello(false);
                }} 
              />
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

        { /* DINNER TIME */ }
        <Route
          path="/dinner"
          element={<Dinner />}
        />

        { /* ICHIBAN KUJI */ }
        <Route
          path="/ichibankuji"
          element={<IchibanKuji />}
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