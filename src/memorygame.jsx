import { useEffect, useState } from 'react';
import './style.css';

// Card types with emojis
const CARD_TYPES = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'
];

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCongratsDialog, setShowCongratsDialog] = useState(false);

  // Initialize game
  const initializeGame = () => {
    const cardPairs = [...CARD_TYPES.slice(0, 8), ...CARD_TYPES.slice(0, 8)];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((type, index) => ({
        id: index,
        type,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setShowCongratsDialog(false);
  };

  // Handle card click
  const handleCardClick = (id) => {
    // Don't process if: card is already flipped/matched, processing another turn, or 2 cards already flipped
    if (isProcessing || flipped.length >= 2 || cards.find(card => card.id === id).isMatched) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlipped(prev => [...prev, id]);

    // Increment moves when flipping first card of a pair
    if (flipped.length === 0) {
      setMoves(moves + 1);
    }
  };

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      setIsProcessing(true);
      const [firstId, secondId] = flipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.type === secondCard.type) {
        // Match found
        setMatched(prev => [...prev, firstCard.type]);
        
        // Update cards to show they're matched
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlipped([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlipped([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  // Check if game is complete
  useEffect(() => {
    if (matched.length === 8 && cards.length > 0) {
      setTimeout(() => {
        setGameComplete(true);
        setShowCongratsDialog(true);
      }, 500);
    }
  }, [matched, cards.length]);

  // Initialize game on first render
  useEffect(() => {
    initializeGame();
  }, []);

  // Handle new game from dialog
  const handleNewGame = () => {
    initializeGame();
  };

  return (
    <div className="mt-8 animate-[fadeInside_1s_ease-out_forwards] opacity-0 space-y-8 px-4 sm:px-6 pb-8 sm:pb-12 w-full max-w-6xl mx-auto font-patrick">
      {/* CONGRATS DIALOG */}
      {showCongratsDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full animate-[slideUp_0.4s_ease-out] shadow-2xl relative overflow-hidden">
            {/* BACKGROUND DECORATION */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 opacity-70" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-30" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-200 rounded-full opacity-30" />
            
            <div className="relative z-10">
              {/* DIALOG HEADER SECTION */}
              <div className="text-center mb-6">
                <div className="flex justify-center gap-3 mb-4">
                  {['🎉', '🌟', '🏆', '✨'].map((emoji, i) => (
                    <div
                      key={i}
                      className="text-3xl sm:text-4xl animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                
                <h3 className="text-2xl sm:text-2xl font-bold font-patrick mb-2 bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Congratulations!
                </h3>
                <p className="text-lg font-patrick text-blue-700 mb-2">
                  You matched all {matched.length} pairs!
                </p>
                <p className="text-slate-600 font-patrick">
                  Total moves: <span className="font-bold text-blue-600">{moves}</span>
                </p>
              </div>

              {/* DIALOG ACTION SECTION */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                    onClick={handleNewGame}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold font-patrick rounded-full shadow-[0_4px_0_0_rgba(59,130,246,0.8)] hover:shadow-[0_4px_0_0_rgba(59,130,246,0.8),0_8px_16px_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(59,130,246,0.8)] active:translate-y-0.5 transform transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-b-4 border-blue-600 hover:border-blue-700 text-center"
                >
                    New Game
                </button>
                <button
                    onClick={() => {
                        if (window.confirm('Return to home page? Your current game progress will be lost.')) {
                        window.location.href = '/react/';
                        }
                    }}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-slate-100 to-slate-200 text-slate-700 font-bold font-patrick rounded-full shadow-[0_4px_0_0_rgba(148,163,184,0.8)] hover:shadow-[0_4px_0_0_rgba(148,163,184,0.8),0_8px_16px_rgba(0,0,0,0.1)] active:shadow-[0_2px_0_0_rgba(148,163,184,0.8)] active:translate-y-0.5 transform transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-b-4 border-slate-300 hover:border-slate-400 text-center"
                    >
                    Back to Home
                </button>
              </div>

              {/* DIALOG FOOTER SECTION */}
              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500 font-patrick">
                  Ready for another challenge?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold font-patrick text-slate-800 mb-4">
          Memory Game
        </h2>
        <p className="text-slate-600 font-patrick text-lg mb-8">
          Test your memory with Vipo! Match all the pairs to win.
        </p>
        
        <div className="memory-theme rounded-2xl p-6 shadow-xl">
          {gameComplete && (
            <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animation: `confettiFall ${1 + Math.random() * 2}s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    background: `linear-linear(45deg, 
                      ${['#64b5f6', '#42a5f5', '#2196f3', '#90caf9'][Math.floor(Math.random() * 4)]},
                      ${['#4fc3f7', '#29b6f6', '#03a9f4', '#81d4fa'][Math.floor(Math.random() * 4)]})`
                  }}
                />
              ))}
            </div>
          )}

          {/* GAME STATS SECTION */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-blue-100">
              <p className="text-sm text-slate-500 font-patrick">Moves</p>
              <p className="text-2xl font-bold text-blue-600 font-patrick">{moves}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-blue-100">
              <p className="text-sm text-slate-500 font-patrick">Matches</p>
              <p className="text-2xl font-bold text-blue-600 font-patrick">{matched.length}/8</p>
            </div>
          </div>

          {/* GAME CONTROLS SECTION */}
          <div className="mb-8">
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold font-patrick rounded-full shadow-[0_4px_0_0_rgba(59,130,246,0.8),0_8px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_0_rgba(59,130,246,0.8),0_12px_20px_rgba(0,0,0,0.3)] active:shadow-[0_2px_0_0_rgba(59,130,246,0.8)] active:translate-y-0.5 transform transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-b-4 border-blue-600 hover:border-blue-700"
            >
              🔄 New Game
            </button>
          </div>

          {/* GAME BOARD SECTION */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square rounded-xl flex items-center justify-center text-3xl sm:text-4xl
                  font-patrick transition-all duration-300 transform relative overflow-hidden
                  ${card.isFlipped || card.isMatched 
                    ? 'bg-white scale-100 rotate-0 shadow-md' 
                    : 'bg-linear-to-br from-blue-400 to-cyan-400 scale-95 hover:scale-100'
                  }
                  ${card.isMatched 
                    ? 'border-2 border-green-400 animate-pulse' 
                    : card.isFlipped 
                    ? 'border-2 border-blue-200' 
                    : 'shadow-md hover:shadow-lg cursor-pointer'
                  }
                  ${!card.isFlipped && !card.isMatched ? 'hover:rotate-1' : ''}
                  ${gameComplete && card.isMatched ? 'celebrate' : ''}
                `}
                disabled={card.isMatched || card.isFlipped || isProcessing}
              >
                {card.isFlipped || card.isMatched ? card.type : '?'}
                
                {card.isMatched && (
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shine"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shineEffect 1.5s ease-in-out infinite'
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* GAME INSTRUCTION SECTION */}
          <div className="mt-8 pt-6 border-t border-blue-200">
            <h4 className="text-lg font-bold font-patrick text-blue-700 mb-2">
              How to Play:
            </h4>
            <ul className="text-slate-800 font-patrick text-sm sm:text-base grid grid-cols-1 sm:grid-cols-3 gap-2 font-bold">
              <li className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg">
                <span className="bg-blue-100 text-slate-800 px-2 py-1 rounded">1</span>
                Click on a card to flip it
              </li>
              <li className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg">
                <span className="bg-blue-100 text-slate-800 px-2 py-1 rounded">2</span>
                Find matching pairs
              </li>
              <li className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg">
                <span className="bg-blue-100 text-slate-800 px-2 py-1 rounded">3</span>
                Complete with fewest moves!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;