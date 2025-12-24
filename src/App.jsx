import './style.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './layout';
import Hello from './hello';
import Navigate from './navigate';
import MemoryGame from './memorygame';

// Create a wrapper component that has access to navigate
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
  const [introDone, setIntroDone] = useState(false);

  // Set basename for GitHub Pages compatibility
  // In development, use '/', in production use '/react/'
  const basename = import.meta.env.PROD ? '/react' : '/';

  return (
    <Router basename={basename}> {/* BASENAME DEFINITION*/}
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Routes>
            {/* Intro route */}
            <Route 
              path="*" 
              element={
                !introDone ? (
                  <Hello onFinish={() => setIntroDone(true)} />
                ) : (
                  <NavigateWithNavigation />
                )
              } 
            />
            
            {/* MEMORY GAME ROUTE SECTION */}
            <Route 
              path="/memory-game" 
              element={
                introDone ? (
                  <MemoryGame />
                ) : (
                  <Hello onFinish={() => setIntroDone(true)} />
                )
              } 
            />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;