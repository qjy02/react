// App.jsx
import './style.css';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './layout';
import Hello from './hello';
import Navigate from './navigate';

// Vipo Playground Imports
import MemoryGame from './memorygame';
import TicTacToe from './tictactoe';
import Dictionary from './dictionary';  

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
  };
  
  return <Navigate onCardClick={handleCardClick} />;
}

function App() {
  const [introDone, setIntroDone] = useState(() => {
    const hash = window.location.hash;
    return hash === '#/memory_game';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/') {
        setIntroDone(false);
      } else if (hash === '#/memory_game') {
        setIntroDone(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <Router>
      <Layout>
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
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;