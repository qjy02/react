import { useEffect, useState, useCallback } from 'react';

function TicTacToe() {
    // Game state
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);
    const [isVipoThinking, setIsVipoThinking] = useState(false);

    // Speech bubble state
    const [displayedText, setDisplayedText] = useState('');
    const [vipoExpression, setVipoExpression] = useState('vipo');

    // Dialog state
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'win', 'lose', 'draw'

    // Game messages
    const messages = {
    welcome: "Let's play Tic Tac Toe! You go first!",
    userTurn: "Your turn! Make a move!",
    vipoTurn: "My turn! Let me think...",
    userWin: "Wow! You won! Great job!",
    vipoWin: "Yay! I won! Better luck next time!",
    draw: "It's a draw! Good game!",
    playAgain: "Want to play again?"
    };

    // Initialize game with typing animation
    useEffect(() => {
    let index = 0;

    const startDelay = setTimeout(() => {
    setVipoExpression('vipo_excited');

    const interval = setInterval(() => {
        index++;
        setDisplayedText(messages.welcome.slice(0, index));
        
        if (index >= messages.welcome.length) {
        clearInterval(interval);
        setVipoExpression('vipo');
        }
    }, 50);

    return () => clearInterval(interval);
    }, 300);

    return () => {
    clearTimeout(startDelay);
    };
    }, []);

    // Typing animation for messages with expression changes
    const typeMessage = (message, expression = 'vipo_excited') => {
    setDisplayedText('');
    setVipoExpression(expression);

    let index = 0;
    const interval = setInterval(() => {
    index++;
    setDisplayedText(message.slice(0, index));

    if (index >= message.length) {
        clearInterval(interval);
        // Set appropriate expression after typing
        if (expression === 'vipo_think') {
        setVipoExpression('vipo_think'); // Keep think for thinking
        } else if (expression === 'vipo_sad') {
        setVipoExpression('vipo_sad'); // Keep sad for losing
        } else if (expression === 'vipo_excited') {
        setVipoExpression('vipo_excited'); // Keep excited for winning
        } else {
        setVipoExpression('vipo'); // Default back to normal
        }
    }
    }, 50);
    };

    // Check for winner
    const calculateWinner = useCallback((squares) => {
    const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
    }
    }
    return null;
    }, []);

    // Check if board is full
    const checkDraw = useCallback((squares) => {
    return squares.every(square => square !== null);
    }, []);

    // Vipo's move with expressions
    const makeVipoMove = (currentBoard) => {
        setIsVipoThinking(true);
        setVipoExpression('vipo_think');
        
        setTimeout(() => {
            const emptySquares = currentBoard
            .map((square, index) => (square === null ? index : null))
            .filter(val => val !== null);
            
            if (emptySquares.length > 0) {
            let moveIndex;
            
            // 1. First, check if Vipo can win
            moveIndex = findWinningMove(currentBoard, 'O');
            
            // 2. If not, check if user is about to win and block
            if (moveIndex === -1) {
                moveIndex = findWinningMove(currentBoard, 'X');
            }
            
            // 3. If no immediate win/block, make a strategic move
            if (moveIndex === -1) {
                moveIndex = findStrategicMove(currentBoard);
            }
            
            // 4. If still no move (shouldn't happen), pick random
            if (moveIndex === -1) {
                moveIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            }
            
            const newBoard = [...currentBoard];
            newBoard[moveIndex] = 'O';
            
            setBoard(newBoard);
            setXIsNext(true);
            setIsVipoThinking(false);
            
            const winnerResult = calculateWinner(newBoard);
            const drawResult = checkDraw(newBoard);
            
            if (winnerResult === 'O') {
                setWinner('Vipo');
                setVipoExpression('vipo_excited');
                typeMessage(messages.vipoWin, 'vipo_excited');
                setTimeout(() => {
                setDialogType('lose');
                setShowDialog(true);
                }, 1000);
            } else if (drawResult) {
                setIsDraw(true);
                setVipoExpression('vipo_think');
                typeMessage(messages.draw, 'vipo_think');
                setTimeout(() => {
                setDialogType('draw');
                setShowDialog(true);
                }, 1000);
            } else {
                setVipoExpression('vipo_speak');
                typeMessage(messages.userTurn, 'vipo_speak');
            }
            }
        }, 1500);
    };

    // Helper functions
    const findWinningMove = (board, player) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let line of lines) {
        const [a, b, c] = line;
        
        // Check if this line has 2 of the player's marks and 1 empty
        if (board[a] === player && board[b] === player && board[c] === null) return c;
        if (board[a] === player && board[c] === player && board[b] === null) return b;
        if (board[b] === player && board[c] === player && board[a] === null) return a;
    }
    
    return -1;
    };

    const findStrategicMove = (board) => {
    // Priority: center > corners > edges
    if (board[4] === null) return 4;
    
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === null);
    if (availableCorners.length > 0) {
        // Sometimes pick randomly from corners for variety
        if (Math.random() < 0.3) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        return availableCorners[0];
    }
    
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => board[i] === null);
    if (availableEdges.length > 0) {
        return availableEdges[0];
    }
    
    return -1;
    };

    // Handle user move
    const handleClick = (index) => {
    // Prevent move if:
    // 1. Square is already filled
    // 2. It's Vipo's turn
    // 3. Game has ended
    if (board[index] || !xIsNext || isVipoThinking || winner || isDraw) {
        return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X'; // User is X
    setBoard(newBoard);
    setXIsNext(false);

    const winnerResult = calculateWinner(newBoard);
    const drawResult = checkDraw(newBoard);

    if (winnerResult === 'X') {
        setWinner('You');
        setVipoExpression('vipo_excited');
        typeMessage(messages.userWin, 'vipo_excited');
        setTimeout(() => {
        setDialogType('win');
        setShowDialog(true);
        }, 1000);
    } else if (drawResult) {
        setIsDraw(true);
        setVipoExpression('vipo_speak');
        typeMessage(messages.draw, 'vipo_speak');
        setTimeout(() => {
        setDialogType('draw');
        setShowDialog(true);
        }, 1000);
    } else {
        setVipoExpression('vipo_shocked');
        typeMessage(messages.vipoTurn, 'vipo_shocked');
        // Pass the current board to Vipo
        makeVipoMove(newBoard);
    }
    };

    // Reset game (called from dialog)
    const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
    setIsVipoThinking(false);
    setVipoExpression('vipo');
    setShowDialog(false);
    typeMessage(messages.playAgain, 'vipo_happy');
    };

    // Render square
    const renderSquare = (index) => {
    const value = board[index];
    const isWinningSquare = winner && board[index] === (winner === 'You' ? 'X' : 'O');
    
    return (
      <button
        key={index}
        className={`
          w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
          border-3 border-slate-300 
          flex items-center justify-center
          text-4xl sm:text-5xl md:text-6xl font-bold font-patrick
          transition-all duration-300
          ${isWinningSquare ? 'bg-blue-100 scale-105 shadow-lg' : 'bg-white hover:bg-slate-50'}
          ${value === 'X' ? 'text-blue-600' : value === 'O' ? 'text-pink-500' : 'text-slate-400'}
          ${!value && !winner && !isDraw && xIsNext && !isVipoThinking 
            ? 'hover:scale-110 hover:shadow-lg cursor-pointer active:scale-95' 
            : 'cursor-not-allowed opacity-80'}
          rounded-xl
        `}
        onClick={() => handleClick(index)}
        disabled={!!value || winner || isDraw || !xIsNext || isVipoThinking}
      >
        {value === 'X' ? 'X' : value === 'O' ? 'O' : ''}
      </button>
    );
  };

  return (
    <div className="min-h-screen background-theme-with-image pt-8 pb-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {/* Game Title at the very top */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-patrick font-bold text-slate-800 mb-2">
            Tic Tac Toe
          </h1>
          <p className="text-slate-600 font-patrick text-lg">
            Play against Vipo!
          </p>
        </div>

        {/* Speech Bubble and Vipo */}
        <div className="mb-8 sm:mb-12">
          <div className="relative animate-[fadeIn_1s_ease-out_forwards]">
            {/* Speech Bubble Container */}
            <div className="bg-linear-to-r from-slate-400 to-slate-500 p-4 sm:p-6 rounded-3xl shadow-2xl max-w-lg relative mr-20 sm:mr-28 min-h-20 flex items-center">
              <p className="text-white font-bold font-patrick text-base sm:text-lg w-full">
                {displayedText || '\u00A0'}
                {displayedText.length > 0 && displayedText.length < Object.values(messages).join('').length && (
                  <span className="inline-block w-1 h-4 sm:h-5 ml-1 bg-white animate-pulse"></span>
                )}
              </p>

              {/* Speech Bubble Pointer */}
              <div className="absolute -right-2 sm:-right-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-10 sm:border-t-12 border-b-10 sm:border-b-12 border-l-12 sm:border-l-18 border-t-transparent border-b-transparent border-l-slate-500"></div>
            </div>
            
            {/* Vipo Character with different expressions */}
            <div className="absolute -bottom-4 sm:-bottom-2 right-2 sm:right-4 ml-2 sm:ml-8">
              <img
                src={`vipo/${vipoExpression}.png`}
                alt="Vipo Mascot"
                className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex flex-col items-center">
          {/* Game Board */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 
                        rounded-2xl p-6 sm:p-8 shadow-xl border-3 border-blue-100 
                        mb-8 w-full">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="flex justify-center">
                  {renderSquare(index)}
                </div>
              ))}
            </div>
          </div>

          {/* Simple Legend (No Reset Button) */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 border-2 
                            border-blue-300 rounded-lg flex items-center 
                            justify-center">
                <span className="text-blue-600 font-bold text-2xl">X</span>
              </div>
              <span className="font-patrick text-slate-700 font-bold">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-pink-100 border-2 
                            border-pink-300 rounded-lg flex items-center 
                            justify-center">
                <span className="text-pink-500 font-bold text-2xl">O</span>
              </div>
              <span className="font-patrick text-slate-700 font-bold">Vipo</span>
            </div>
          </div>
        </div>
      </div>

      {/* DIALOG POPUP */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full animate-[slideUp_0.4s_ease-out] shadow-2xl relative overflow-hidden">
            {/* BACKGROUND DECORATION */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-50 opacity-70" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-30" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-200 rounded-full opacity-30" />
            
            <div className="relative z-10">
              {/* DIALOG HEADER SECTION */}
              <div className="text-center mb-6">
                <div className="flex justify-center gap-3 mb-4">
                  {dialogType === 'win' && ['🎉', '🌟', '🏆', '✨'].map((emoji, i) => (
                    <div
                      key={i}
                      className="text-3xl sm:text-4xl animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {emoji}
                    </div>
                  ))}
                  {dialogType === 'lose' && ['😅', '🤔', '🎯', '💪'].map((emoji, i) => (
                    <div
                      key={i}
                      className="text-3xl sm:text-4xl animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {emoji}
                    </div>
                  ))}
                  {dialogType === 'draw' && ['🤝', '🤔', '🔄', '🎮'].map((emoji, i) => (
                    <div
                      key={i}
                      className="text-3xl sm:text-4xl animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                
                <h3 className="text-2xl sm:text-2xl font-bold font-patrick mb-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {dialogType === 'win' && "Congratulations!"}
                  {dialogType === 'lose' && "Game Over!"}
                  {dialogType === 'draw' && "It's a Draw!"}
                </h3>
                
                <p className="text-lg font-patrick text-slate-700 mb-2">
                  {dialogType === 'win' && "You outsmarted Vipo! Great job!"}
                  {dialogType === 'lose' && "Vipo won this round! Try again!"}
                  {dialogType === 'draw' && "The game ended in a tie!"}
                </p>
                
                {/* Show Vipo mini image in dialog */}
                <div className="flex justify-center my-4">
                  <img
                    src={`vipo/${
                      dialogType === 'win' ? 'vipo_excited' :
                      dialogType === 'lose' ? 'vipo_speak' :
                      'vipo_think'
                    }.png`}
                    alt="Vipo"
                    className="w-16 h-16"
                  />
                </div>
              </div>

              {/* DIALOG ACTION SECTION */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={resetGame}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-500 
                           text-white font-bold font-patrick rounded-full 
                           shadow-[0_4px_0_0_rgba(59,130,246,0.8)] 
                           hover:shadow-[0_4px_0_0_rgba(59,130,246,0.8),0_8px_16px_rgba(0,0,0,0.2)] 
                           active:shadow-[0_2px_0_0_rgba(59,130,246,0.8)] 
                           active:translate-y-0.5 transform transition-all duration-200 
                           hover:-translate-y-0.5 cursor-pointer 
                           border-b-4 border-blue-600 hover:border-blue-700 text-center"
                >
                  Play Again
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Return to home page? Your current game will be lost.')) {
                      window.location.href = '/react/';
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-slate-100 to-slate-200 
                           text-slate-700 font-bold font-patrick rounded-full 
                           shadow-[0_4px_0_0_rgba(148,163,184,0.8)] 
                           hover:shadow-[0_4px_0_0_rgba(148,163,184,0.8),0_8px_16px_rgba(0,0,0,0.1)] 
                           active:shadow-[0_2px_0_0_rgba(148,163,184,0.8)] 
                           active:translate-y-0.5 transform transition-all duration-200 
                           hover:-translate-y-0.5 cursor-pointer 
                           border-b-4 border-slate-300 hover:border-slate-400 text-center"
                >
                  Back to Home
                </button>
              </div>

              {/* DIALOG FOOTER SECTION */}
              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500 font-patrick">
                  {dialogType === 'win' && "Ready to beat Vipo again?"}
                  {dialogType === 'lose' && "You'll get Vipo next time!"}
                  {dialogType === 'draw' && "So close! Try again!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;