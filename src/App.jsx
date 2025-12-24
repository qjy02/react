// App.jsx
import './style.css';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './layout';
import Hello from './hello';
import Navigate from './navigate';
import MemoryGame from './memorygame';

function NavigateWithNavigation() {
  const navigate = useNavigate();
  
  const handleCardClick = (page) => {
    if (page === 'memorygame') {
      navigate('/memory-game');
    }
  };
  
  return <Navigate onCardClick={handleCardClick} />;
}

function App() {
  const [introDone, setIntroDone] = useState(() => {
    const hash = window.location.hash;
    return hash === '#/memory-game';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/') {
        setIntroDone(false);
      } else if (hash === '#/memory-game') {
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
            
            <Route 
              path="/memory-game" 
              element={<MemoryGame />}
            />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;