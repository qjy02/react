import { useEffect, useState } from 'react';
import { paths } from './utils/path';
import './style.css';

function Navigate({ onCardClick }) {
  const cards = [
    { id: 1, title: 'Memory Game', image: 'card/memory_game.png', page: 'memorygame', path: paths.memoryGame },
    { id: 2, title: 'Tic Tac Toe', image: 'card/tictactoe.png', page: 'tictactoe', path: paths.ticTacToe },
    { id: 3, title: 'Dictionary', image: 'card/dictionary.png', page: 'dictionary', path: paths.dictionary },
    { id: 4, title: 'Music Player', image: 'card/musicplayer.png', page: '', path: '' },
    { id: 5, title: 'Photo Booth', image: 'card/photobooth.png', page: '', path: '' },
    { id: 6, title: '???', image: 'vipo/vipo_shocked.png', page: '', path: '' },
    { id: 7, title: '???', image: 'vipo/vipo_confused.png', page: '', path: '' },
    { id: 8, title: '???', image: 'vipo/vipo_sleepy.png', page: '', path: '' },
  ];

  const message = "Welcome! Let's play together ~ ";
  const [displayedText, setDisplayedText] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const [showExcitedVipo, setShowExcitedVipo] = useState(false); // Start with normal face

  useEffect(() => {
    let index = 0;
    
    // Add a small delay before starting the typing animation
    const startDelay = setTimeout(() => {
      // Switch to excited face when typing starts (after delay)
      setShowExcitedVipo(true);
      
      const interval = setInterval(() => {
        index++;
        setDisplayedText(message.slice(0, index));
        
        if (index >= message.length) {
          clearInterval(interval);
          // Switch back to normal face when text is complete
          setShowExcitedVipo(false);
          // Show grid after text animation completes
          setTimeout(() => setShowGrid(true), 300);
        }
      }, 50);

      return () => clearInterval(interval);
    }, 500); // 500ms delay before typing starts

    return () => {
      clearTimeout(startDelay);
    };
  }, [message]);

  const handleCardClick = (card) => {
    if (card.page && onCardClick) {
      onCardClick(card.page, card.path);
    }
  };

 return (
    <div className="mt-8 space-y-8 px-4 sm:px-6 pb-8 sm:pb-12">
      {/* Speech BUBBLE SECTION */}
      <div className="relative animate-[fadeIn_1s_ease-out_forwards] opacity-0">
        {/* SPEECH BUBBLE CONTAINER */}
        <div className="bg-linear-to-r from-slate-400 to-slate-500 p-4 sm:p-6 rounded-3xl shadow-2xl max-w-lg relative mr-20 sm:mr-28">
            <p className="text-white font-bold font-patrick text-base sm:text-lg">
                {displayedText}
                {displayedText.length < message.length && (
                    <span className="inline-block w-1 h-4 sm:h-5 ml-1 bg-white animate-pulse"></span>
                )}
            </p>

            {/* SPEECH BUBBLE POINTER */}
            <div className="absolute -right-2 sm:-right-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-10 sm:border-t-12 border-b-10 sm:border-b-12 border-l-12 sm:border-l-18 border-t-transparent border-b-transparent border-l-slate-500"></div>
        </div>
        
        {/* VIPO CHARACTER */}
        <div className="absolute -bottom-4 sm:-bottom-2 right-2 sm:right-4 ml-2 sm:ml-8">
          <img
            src={showExcitedVipo ? "vipo/vipo_excited.png" : "vipo/vipo.png"}
            alt="Vipo Mascot"
            className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg transition-all duration-200"
          />
        </div>
      </div>

      {/* CARD GRID SECTION */}
      <div className={`transition-all duration-700 ${showGrid ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-8 px-2 sm:px-0 mb-8 sm:mb-12">
          {cards.map((card) => (
              <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`flex flex-col items-center bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-3 sm:p-4 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-slate-200 ${
                    !card.page ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                  <img
                    src={card.image}
                    alt={card.title}
                    className={`w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mb-2 sm:mb-3 drop-shadow-md ${
                      !card.page ? 'opacity-70' : ''
                    }`}
                  />
                  <span className="text-slate-700 font-patrick font-bold text-center decoration-slate-400 text-sm sm:text-base">
                    {card.title}
                    {!card.page && (
                      <span className="block text-xs text-slate-500 font-normal mt-1">
                        Coming Soon
                      </span>
                    )}
                  </span>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navigate;