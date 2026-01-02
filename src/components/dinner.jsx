import { useEffect, useState } from 'react';
import '../css/style.css';

function Dinner() {
  // Game state
  const [currentScreen, setCurrentScreen] = useState('intro'); // 'intro', 'story', 'quiz', 'result'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Speech bubble state
  const [displayedText, setDisplayedText] = useState('');
  const [vipoExpression, setVipoExpression] = useState('vipo_happy');
  const [showExcitedVipo, setShowExcitedVipo] = useState(false);
  
  // Story images state
  const [storyImages, setStoryImages] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  
  // Questions for the quiz
  const questions = [
    {
      question: "How hungry are you right now?",
      options: [
        { text: "Just a little snack", marks: 1 },
        { text: "I could eat", marks: 2 },
        { text: "Quite hungry", marks: 4 },
        { text: "Starving!", marks: 5 }
      ]
    },
    {
      question: "How much time do you have to cook?",
      options: [
        { text: "5-15 minutes", marks: 1 },
        { text: "15-30 minutes", marks: 2 },
        { text: "30-60 minutes", marks: 4 },
        { text: "I can take my time", marks: 5 }
      ]
    },
    {
      question: "What's your cooking skill level?",
      options: [
        { text: "I can make toast", marks: 1 },
        { text: "I follow recipes", marks: 2 },
        { text: "I can improvise", marks: 4 },
        { text: "Master chef", marks: 5 }
      ]
    },
    {
      question: "What are you craving?",
      options: [
        { text: "Something light", marks: 1 },
        { text: "Comfort food", marks: 2 },
        { text: "Something exotic", marks: 4 },
        { text: "Whatever's easiest", marks: 5 }
      ]
    },
    {
      question: "How adventurous are you feeling?",
      options: [
        { text: "Stick to classics", marks: 1 },
        { text: "Try something new", marks: 2 },
        { text: "Be adventurous", marks: 4 },
        { text: "Surprise me!", marks: 5 }
      ]
    }
  ];

  // Results based on total score
  const results = [
    {
      range: "1-5",
      min: 1,
      max: 5,
      title: "Quick & Easy!",
      description: "You should go for something simple like a sandwich, salad, or instant noodles. Perfect for when you need a quick fix!",
      emoji: "🍜",
      color: "from-slate-100/80 to-slate-200/80"
    },
    {
      range: "6-10",
      min: 6,
      max: 10,
      title: "Comfort Food!",
      description: "How about some pasta, grilled cheese, or a simple stir-fry? Quick to make and super satisfying!",
      emoji: "🍝",
      color: "from-blue-50/80 to-blue-100/80"
    },
    {
      range: "11-15",
      min: 11,
      max: 15,
      title: "Home-cooked Meal!",
      description: "You've got time and skills! Try making a proper meal like curry, casserole, or roasted chicken with veggies.",
      emoji: "🍛",
      color: "from-slate-50/80 to-blue-50/80"
    },
    {
      range: "16-20",
      min: 16,
      max: 20,
      title: "Gourmet Night!",
      description: "Time to impress! Make something fancy like homemade pizza, sushi, or a steak dinner with all the sides.",
      emoji: "🍣",
      color: "from-blue-100/80 to-slate-100/80"
    },
    {
      range: "21-25",
      min: 21,
      max: 25,
      title: "Feast Time!",
      description: "Go all out! Multiple courses, try that complicated recipe you've been saving, or host a mini dinner party!",
      emoji: "🎉",
      color: "from-slate-100/80 to-blue-200/80"
    }
  ];

  // Typing animation for messages
  const typeMessage = (message, expression = 'vipo', callback = null) => {
    setDisplayedText('');
    setVipoExpression(expression);
    setShowExcitedVipo(true);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(message.slice(0, index));

      if (index >= message.length) {
        clearInterval(interval);
        setShowExcitedVipo(false);
        if (callback) {
          setTimeout(callback, 500);
        }
      }
    }, 30);
  };

  // Initialize with intro message
  useEffect(() => {
    if (currentScreen === 'intro') {
      setTimeout(() => {
        const welcomeMessage = "Let's find out what's for dinner!";
        typeMessage(welcomeMessage, 'vipo_excited');
      }, 500);
    }
  }, [currentScreen]);

  // Start the story
  const startStory = () => {
    setCurrentScreen('story');
    const storyMessages = [
      "I know that feeling... when your tummy is rumbling...",
      "And you're staring at the fridge...",
      "Wondering what to make...",
      "Let's find out with a fun quiz!"
    ];
    
    const storyImageSequence = [
      'dinner/dinnertime.png',
      'dinner/starving.png',
      'dinner/think.png',
      'dinner/findoutwithaquiz.png'
    ];
    
    let currentStep = 0;
    
    const showNextStep = () => {
      if (currentStep >= storyMessages.length) {
        setTimeout(() => {
          setCurrentScreen('quiz');
          typeMessage("Let's begin! First question:", 'vipo_speak');
        }, 1000);
        return;
      }
      
      setStoryImages(prev => [...prev.slice(-1), storyImageSequence[currentStep]]);
      setCurrentStoryIndex(currentStep);
      
      typeMessage(storyMessages[currentStep], 
        currentStep === 0 ? 'vipo_think' : 
        currentStep === 1 ? 'vipo' :
        currentStep === 2 ? 'vipo_think' : 'vipo_excited',
        () => {
          currentStep++;
          setTimeout(showNextStep, 1000);
        }
      );
    };
    
    setStoryImages([]);
    setCurrentStoryIndex(0);
    showNextStep();
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex, marks) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setSelectedOption(optionIndex);
    
    setScore(prev => prev + marks);
    
    const reactions = [
      "Got it!",
      "Interesting choice!",
      "Good to know!",
      "Nice!",
      "Perfect!"
    ];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    typeMessage(randomReaction, 'vipo_speak', () => {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedOption(null);
          setIsProcessing(false);
          
          setTimeout(() => {
            typeMessage(`Question ${currentQuestion + 2}: ${questions[currentQuestion + 1].question}`, 'vipo_happy');
          }, 300);
        } else {
          setTimeout(() => {
            setCurrentScreen('result');
            const result = getResult();
            typeMessage(`Based on your answers, I recommend: ${result.title}! ${result.emoji}`, 'vipo_excited');
          }, 800);
        }
      }, 1000);
    });
  };

  // Get result based on score
  const getResult = () => {
    if (score <= 5) return results[0];
    if (score <= 10) return results[1];
    if (score <= 15) return results[2];
    if (score <= 20) return results[3];
    return results[4];
  };

  // Restart quiz
  const restartQuiz = () => {
    setCurrentScreen('intro');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setStoryImages([]);
    setCurrentStoryIndex(0);
    
    setTimeout(() => {
      const welcomeMessage = "Let's find out what's for dinner!";
      typeMessage(welcomeMessage, 'vipo_excited');
    }, 300);
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
            <div className="max-w-xs sm:max-w-sm mx-auto">
              <img src="card/dinner.png" alt="Dinner Intro" className="w-full h-auto mb-6 drop-shadow-2xl" />
              <div className="flex flex-col gap-4">
                <button
                    onClick={startStory}
                    className="
                        px-6 py-4
                        bg-linear-to-r from-slate-500/90 to-slate-600/90
                        text-white font-bold font-patrick rounded-full

                        shadow-[0_4px_0_0_rgba(71,85,105,0.9)]
                        hover:shadow-[0_4px_0_0_rgba(71,85,105,0.9),0_8px_16px_rgba(0,0,0,0.3)]
                        active:shadow-[0_2px_0_0_rgba(71,85,105,0.9)]

                        border-b-2 border-slate-700/90 hover:border-slate-800
                        transform transition-all duration-200
                        hover:-translate-y-0.5 active:translate-y-0.5
                        cursor-pointer text-base
                    "
                    >
                    Let's Begin! 🍽️
                    </button>
                <div className="text-center text-slate-800 font-bold font-patrick text-sm mt-2 drop-shadow-md">
                  <a href="https://www.youtube.com/watch?v=b6jtx7Vfwps" target="_blank" rel="noopener noreferrer">A meal makes you forget all your worries</a>
                </div>
              </div>
            </div>
          </div>
        );

      case 'story':
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="relative w-full max-w-sm h-64 flex items-center justify-center">
                    {storyImages.length > 0 && (
                    <div className="relative transition-all duration-500 ease-out">
                        <img
                        src={storyImages[storyImages.length - 1]}
                        alt="Story scene"
                        className="w-56 h-56 object-contain drop-shadow-2xl"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('Failed to load image:', storyImages[storyImages.length - 1]);
                        }}
                        />
                    </div>
                    )}
                </div>
            </div>
          </div>
        );

      case 'quiz':
        const question = questions[currentQuestion];
        return (
          <div className="w-full max-w-lg mx-auto px-4">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-patrick text-white text-sm drop-shadow-md">
                  Question {currentQuestion + 1}/{questions.length}
                </span>
                <span className="font-patrick text-white text-sm drop-shadow-md">
                  Score: {score}
                </span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-slate-500/90 to-blue-500/90 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question area */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 mb-6">
              <h3 className="text-lg font-patrick font-bold text-white mb-4 text-center px-2 drop-shadow-lg">
                {question.question}
              </h3>
              
              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index, option.marks)}
                    disabled={isProcessing}
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-300
                              font-patrick text-base
                              ${selectedOption === index 
                                ? 'border-blue-400 bg-blue-500/20 scale-[1.02] shadow-lg' 
                                : 'border-white/30 hover:border-blue-300/50 hover:bg-white/10'
                              }
                              ${isProcessing ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-[1.01]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="wrap-break-word pr-2 text-white drop-shadow-md">{option.text}</span>
                      {selectedOption === index && (
                        <span className="text-blue-300 ml-1 shrink-0 text-base">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question counter */}
            <div className="text-center text-white/70 font-patrick text-sm drop-shadow-md">
              Select an option to continue...
            </div>
          </div>
        );

      case 'result':
        const result = getResult();
        return (
          <div className="w-full max-w-lg mx-auto px-4">
            {/* Result area */}
            <div className={`bg-linear-to-br ${result.color} backdrop-blur-md
                          rounded-xl p-6 shadow-2xl border border-white/30 mb-6`}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce">
                  {result.emoji}
                </div>
                <h3 className="text-2xl font-patrick font-bold text-white mb-4 drop-shadow-lg">
                  {result.title}
                </h3>
                <div className="inline-block bg-white/30 px-4 py-2 rounded-full mb-4">
                  <span className="font-patrick text-white text-sm drop-shadow-md">
                    Score: <span className="font-bold">{score}</span> ({result.range} range)
                  </span>
                </div>
                <p className="text-white text-base font-patrick mb-6 px-2 drop-shadow-md">
                  {result.description}
                </p>
              </div>

              {/* Score breakdown */}
              <div className="bg-white/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <h4 className="font-patrick font-bold text-white mb-4 text-center text-lg drop-shadow-md">
                  Your Dinner Profile
                </h4>
                <div className="space-y-2">
                  {questions.map((q, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-patrick text-white text-sm flex-1 mr-2 truncate drop-shadow-md">
                        Q{index + 1}: {q.question.length > 20 ? q.question.substring(0, 20) + '...' : q.question}
                      </span>
                      <span className="font-patrick font-bold text-blue-300 text-sm shrink-0 drop-shadow-md">
                        +{Math.floor(Math.random() * 4) + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={restartQuiz}
                  className="w-full px-6 py-3 bg-linear-to-r from-slate-500/90 to-blue-500/90 
                          text-white font-bold font-patrick rounded-full 
                          shadow-[0_4px_0_0_rgba(100,116,139,0.8)]
                          hover:shadow-[0_4px_0_0_rgba(100,116,139,0.8),0_8px_16px_rgba(0,0,0,0.3)]
                          active:shadow-[0_2px_0_0_rgba(100,116,139,0.8)]
                          active:translate-y-0.5 transform transition-all duration-200 
                          hover:-translate-y-0.5 cursor-pointer 
                          border-b-2 border-slate-600/90 hover:border-slate-700 text-center text-base"
                >
                  Take Quiz Again
                </button>
                <button
                  onClick={() => window.location.href = '/react/'}
                  className="w-full px-6 py-3 bg-linear-to-r from-white/20 to-white/10 
                          text-white font-bold font-patrick rounded-full 
                          shadow-[0_4px_0_0_rgba(148,163,184,0.8)]
                          hover:shadow-[0_4px_0_0_rgba(148,163,184,0.8),0_8px_16px_rgba(0,0,0,0.2)]
                          active:shadow-[0_2px_0_0_rgba(148,163,184,0.8)]
                          active:translate-y-0.5 transform transition-all duration-200 
                          hover:-translate-y-0.5 cursor-pointer 
                          border-b-2 border-white/30 hover:border-white/40 text-center text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>

            {/* Share result */}
            <div className="text-center">
              <p className="font-patrick text-white/80 mb-2 text-sm drop-shadow-md">
                Share your dinner recommendation with friends!
              </p>
              <div className="flex justify-center gap-3">
                {['🍕', '🍔', '🍣', '🥗', '🍝'].map((emoji, i) => (
                  <button
                    key={i}
                    className="text-2xl hover:scale-110 transition-transform duration-200 drop-shadow-lg"
                    onClick={() => alert(`You should have ${emoji} for dinner!`)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen background-theme-with-image pt-4 pb-8 px-4 flex flex-col items-center relative overflow-x-hidden">      {/* Background overlay */}
      <div className="fixed inset-0 bg-linear-to-b from-black/20 to-black/10 pointer-events-none z-0"></div>
      
      {/* HEADER SECTION */}
      <div className="text-center pt-4 pb-2 w-full">
        <h1 className="text-4xl sm:text-5xl font-patrick font-bold text-slate-800 mb-2">
          Dinner Time
        </h1>
      </div>

      {/* MAIN CONTENT CONTAINER SECTION */}
      <div className="mt-4 space-y-6 pb-8 w-full max-w-lg mx-auto relative z-10">
        {/* SPEECH BUBBLE SECTION */}
        <div className="relative animate-[fadeIn_1s_ease-out_forwards] opacity-0">
          {/* SPEECH BUBBLE CONTAINER SECTION */}
          <div className="bg-linear-to-r from-slate-500/90 to-slate-600/90 p-4 rounded-3xl shadow-2xl max-w-lg relative mr-20">
              <p className="text-white font-bold font-patrick text-base drop-shadow-md">
                  {displayedText || '\u00A0'}
                  {displayedText.length > 0 && displayedText.length < 100 && (
                      <span className="inline-block w-1 h-4 ml-1 bg-white animate-pulse"></span>
                  )}
              </p>

              {/* SPEECH BUBBLE POINTER */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-10 border-b-10 border-l-12 border-t-transparent border-b-transparent border-l-slate-600/90"></div>
          </div>
          
          {/* VIPO CHARACTER */}
          <div className="absolute -bottom-2 right-2">
            <img
              src={showExcitedVipo ? "vipo/vipo_excited.png" : `vipo/${vipoExpression}.png`}
              alt="Vipo Mascot"
              className="w-16 h-16 drop-shadow-xl transition-all duration-200"
              onError={(e) => {
                e.target.src = 'vipo/vipo_excited.png';
                console.error('Failed to load Vipo image');
              }}
            />
          </div>
        </div>

        {/* CURRENT SCREEN CONTENT */}
        <div className="transition-all duration-700 opacity-100">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}

export default Dinner;