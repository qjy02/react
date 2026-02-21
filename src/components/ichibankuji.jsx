import { useState, useEffect, useRef } from 'react';
import '../css/style.css';

function IchibanKuji() {
  const [config, setConfig] = useState({
    title: "Ichiban Kuji",
    image: 'kuji/default.png',
    description: "TVアニメ『多聞くん今どっち!?』がキャラ福くじONLINEに登場!",
    prizes: [
      { 
        id: 'A', 
        name: 'A 賞', 
        description: 'キャンバスボード',
        probability: 1, 
        color: 'from-pink-400 to-pink-600',
        items: [
          { id: 'A-1', name: 'A-1キャンバスボード', image: 'kuji/prize_a/tamon_A-1.png', description: 'A-1 Canvas Board' }
        ]
      },
      { 
        id: 'B', 
        name: 'B 賞', 
        description: 'アクリルスタンド',
        probability: 10, 
        color: 'from-yellow-300 via-amber-400 to-orange-500',
        items: [
          { id: 'B-1', name: 'B-1アクリルスタンド 福原多聞', image: 'kuji/prize_b/tamon_B-1.png', description: 'Fukuhara Tamon' },
          { id: 'B-2', name: 'B-2アクリルスタンド 坂口桜利', image: 'kuji/prize_b/tamon_B-2.png', description: 'Sakaguchi Ouri' },
          { id: 'B-3', name: 'B-3アクリルスタンド 橘 敬人', image: 'kuji/prize_b/tamon_B-3.png', description: 'Tachibana Keito' },
          { id: 'B-4', name: 'B-4アクリルスタンド 石橋ナツキ', image: 'kuji/prize_b/tamon_B-4.png', description: 'Ishibashi Natsuki' },
          { id: 'B-5', name: 'B-5アクリルスタンド 甲斐倫太郎', image: 'kuji/prize_b/tamon_B-5.png', description: 'Kai Rintaro' }
        ]
      },
      { 
        id: 'C', 
        name: 'C 賞', 
        description: 'アクリルキーホルダー',
        probability: 20, 
        color: 'from-lime-400 to-emerald-600',
        items: [
          { id: 'C-1', name: 'C-1アクリルキーホルダー 福原多聞', image: 'kuji/prize_c/tamon_C-1.png', description: 'Fukuhara Tamon' },
          { id: 'C-2', name: 'C-2アクリルキーホルダー 坂口桜利', image: 'kuji/prize_c/tamon_C-2.png', description: 'Sakaguchi Ouri' },
          { id: 'C-3', name: 'C-3アクリルキーホルダー 橘 敬人', image: 'kuji/prize_c/tamon_C-3.png', description: 'Tachibana Keito' },
          { id: 'C-4', name: 'C-4アクリルキーホルダー 石橋ナツキ', image: 'kuji/prize_c/tamon_C-4.png', description: 'Ishibashi Natsuki' },
          { id: 'C-5', name: 'C-5アクリルキーホルダー 甲斐倫太郎', image: 'kuji/prize_c/tamon_C-5.png', description: 'Kai Rintaro' }
        ]
      },
      { 
        id: 'D', 
        name: 'D 賞', 
        description: 'ミニ色紙',
        probability: 30, 
        color: 'from-sky-300 to-blue-400',
        items: [
          { id: 'D-1', name: 'D-1ミニ色紙 福原多聞', image: 'kuji/prize_d/tamon_D-1.png', description: 'Fukuhara Tamon' },
          { id: 'D-2', name: 'D-2ミニ色紙 坂口桜利', image: 'kuji/prize_d/tamon_D-2.png', description: 'Sakaguchi Ouri' },
          { id: 'D-3', name: 'D-3ミニ色紙 橘 敬人', image: 'kuji/prize_d/tamon_D-3.png', description: 'Tachibana Keito' },
          { id: 'D-4', name: 'D-4ミニ色紙 石橋ナツキ', image: 'kuji/prize_d/tamon_D-4.png', description: 'Ishibashi Natsuki' },
          { id: 'D-5', name: 'D-5ミニ色紙 甲斐倫太郎', image: 'kuji/prize_d/tamon_D-5.png', description: 'Kai Rintaro' },
          { id: 'D-6', name: 'D-6ミニ色紙 集合', image: 'kuji/prize_d/tamon_D-6.png', description: 'F/ACE' }
        ]
      },
      { 
        id: 'E', 
        name: 'E 賞', 
        description: '缶バッジ(ホログラム＆ノーマル)',
        probability: 39, 
        color: 'from-fuchsia-400 to-purple-600',
        items: [
          { id: 'E-1', name: 'E-1缶バッジ 福原多聞(描き下ろし)', image: 'kuji/prize_e/tamon_E-1.png', description: 'Fukuhara Tamon' },
          { id: 'E-2', name: 'E-2缶バッジ 坂口桜利(描き下ろし)', image: 'kuji/prize_e/tamon_E-2.png', description: 'Sakaguchi Ouri' },
          { id: 'E-3', name: 'E-3缶バッジ 橘 敬人(描き下ろし)', image: 'kuji/prize_e/tamon_E-3.png', description: 'Tachibana Keito' },
          { id: 'E-4', name: 'E-4缶バッジ 石橋ナツキ(描き下ろし)', image: 'kuji/prize_e/tamon_E-4.png', description: 'Ishibashi Natsuki' },
          { id: 'E-5', name: 'E-5缶バッジ 甲斐倫太郎(描き下ろし)', image: 'kuji/prize_e/tamon_E-5.png', description: 'Kai Rintaro' },
          { id: 'E-6', name: 'E-6缶バッジ 福原多聞(ホログラム)', image: 'kuji/prize_e/tamon_E-6.png', description: 'Fukuhara Tamon' },
          { id: 'E-7', name: 'E-7缶バッジ 坂口桜利(ホログラム)', image: 'kuji/prize_e/tamon_E-7.png', description: 'Sakaguchi Ouri' },
          { id: 'E-8', name: 'E-8缶バッジ 橘 敬人(ホログラム)', image: 'kuji/prize_e/tamon_E-8.png', description: 'Tachibana Keito' },
          { id: 'E-9', name: 'E-9缶バッジ 石橋ナツキ(ホログラム)', image: 'kuji/prize_e/tamon_E-9.png', description: 'Ishibashi Natsuki' },
          { id: 'E-10', name: 'E-10缶バッジ 甲斐倫太郎(ホログラム)', image: 'kuji/prize_e/tamon_E-10.png', description: 'Kai Rintaro' },
        ]
      }
    ]
  });

  const [drawHistory, setDrawHistory] = useState([]);
  const [lastDraw, setLastDraw] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedPrize, setExpandedPrize] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [showTenResults, setShowTenResults] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tenDrawsResult, setTenDrawsResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  
  const sliderRef = useRef(null);

  // Calculate total probability for validation
  const totalProbability = config.prizes.reduce((sum, prize) => sum + prize.probability, 0);

  // Handle image error - fallback to colored div with text
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Get image source with fallback
  const getImageSrc = (item) => {
    if (imageErrors[item.id]) {
      return null; // Will show colored fallback
    }
    return item.image;
  };

  // Get main image source
  const getMainImageSrc = () => {
    return config.image;
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-32 h-32">
        {/* Envelope base */}
        <div className="absolute inset-0">
            {/* Envelope body */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-r from-purple-200 to-pink-200 rounded-b-lg"></div>
            
            {/* Envelope flap (closing)*/}
            <div className="absolute top-0 left-0 right-0 animate-kuji-flap">
            <div className="w-0 h-0 border-l-64 border-r-64 border-b-40 border-l-transparent border-r-transparent border-b-purple-300"></div>
            </div>
            
            {/* Envelope bottom triangle */}
            <div className="absolute bottom-0 left-0 right-0">
            <div className="w-0 h-0 border-l-64 border-r-64 border-t-40 border-l-transparent border-r-transparent border-t-purple-300"></div>
            </div>
        </div>
        
        {/* Letter emerging */}
        <div className="absolute inset-x-4 bottom-2 animate-kuji-emerge">
            <div className="bg-white rounded shadow-md p-2 transform -rotate-3">
            {/* Fortune paper lines */}
            <div className="space-y-1">
                <div className="h-1 w-12 bg-linear-to-r from-purple-400 to-pink-400 rounded animate-kuji-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="h-1 w-8 bg-linear-to-r from-purple-400 to-pink-400 rounded animate-kuji-pulse" style={{ animationDelay: '100ms' }}></div>
                <div className="h-1 w-10 bg-linear-to-r from-purple-400 to-pink-400 rounded animate-kuji-pulse" style={{ animationDelay: '200ms' }}></div>
            </div>
            </div>
        </div>
        </div>
        
        <div className="mt-12 text-center">
        <p className="text-lg font-medium bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading
        </p>
        <div className="flex space-x-1 justify-center mt-2">
            <span className="w-1 h-1 bg-purple-600 rounded-full animate-kuji-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-1 bg-purple-600 rounded-full animate-kuji-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-1 bg-purple-600 rounded-full animate-kuji-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        </div>
    </div>
  );

  // Draw multiple prizes at once
  const drawMultiplePrizes = (count) => {
    setIsDrawing(true);
    setLoading(true);
    
    // Reset states for any new draw
    setShowTenResults(false);
    setTenDrawsResult([]);
    setCurrentSlide(0);

    setTimeout(() => {
        const newDraws = [];
        for (let i = 0; i < count; i++) {
        const random = Math.random() * 100;
        let cumulativeProbability = 0;

        for (const prize of config.prizes) {
            cumulativeProbability += prize.probability;
            if (random < cumulativeProbability) {
            const randomItem = prize.items[Math.floor(Math.random() * prize.items.length)];
            newDraws.push({
                ...prize,
                selectedItem: randomItem,
                drawNumber: drawHistory.length + i + 1
            });
            break;
            }
        }
        }

        // Set the last draw as the most recent one
        setLastDraw(newDraws[newDraws.length - 1]);
        setDrawHistory(prev => [...newDraws, ...prev]);
        
        // Auto-show history when user draws something, but only if it's not already visible
        setShowHistory(true);
        
        if (count === 10) {
        setTenDrawsResult(newDraws);
        setCurrentSlide(0);
        setShowTenResults(true);
        } else {
        // For single draw, ensure ten results is hidden
        setShowTenResults(false);
        }
        
        setIsDrawing(false);
        setLoading(false);
    }, 1500);
  };

  // Draw a single prize
  const drawSinglePrize = () => {
    drawMultiplePrizes(1);
  };

  // Draw ten prizes
  const drawTenPrizes = () => {
    drawMultiplePrizes(10);
  };

  // Reset the Kuji
  const resetKuji = () => {
    if (window.confirm('Reset all draws? Your history will be cleared.')) {
      setDrawHistory([]);
      setLastDraw(null);
      setImageErrors({});
      setShowHistory(false);
      setExpandedPrize(null);
      setShowTenResults(false);
      setTenDrawsResult([]);
      setCurrentSlide(0);
    }
  };

  // Toggle prize expansion
  const togglePrizeExpansion = (prizeId) => {
    setExpandedPrize(expandedPrize === prizeId ? null : prizeId);
  };

  // Slider navigation
  const nextSlide = () => {
    if (currentSlide < tenDrawsResult.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Get statistics for history view
  const getPrizeStats = () => {
    const stats = {};
    config.prizes.forEach(prize => {
      stats[prize.id] = {
        ...prize,
        count: drawHistory.filter(d => d.id === prize.id).length,
        percentage: drawHistory.length > 0 
          ? Math.round((drawHistory.filter(d => d.id === prize.id).length / drawHistory.length) * 100) 
          : 0
      };
    });
    return stats;
  };

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showTenResults && tenDrawsResult.length > 0) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTenResults, currentSlide, tenDrawsResult]);

  return (
    <div className="mt-8 animate-[fadeInside_1s_ease-out_forwards] opacity-0 space-y-8 px-4 sm:px-6 pb-8 sm:pb-12 w-full max-w-6xl mx-auto font-patrick">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-patrick text-slate-800 mb-4">
          {config.title}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-8 px-4">{config.description}</p>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-blue-100">
          
          {/* KUJI IMAGE SECTION */}
          <div className="mb-8 flex justify-center px-4">
            <div className="relative group w-full max-w-md">
                {!imageErrors['main'] ? (
                <img 
                    src={getMainImageSrc()}
                    alt={config.title}
                    className="w-full aspect-square object-contain rounded-2xl shadow-lg"
                    onError={() => handleImageError('main')}
                />
                ) : (
                // Optional: Show a fallback image or placeholder when the main image fails to load
                <div className="w-full aspect-square rounded-2xl shadow-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">画像が見つかりません</span>
                </div>
                )}
            </div>
           </div>

           {/* PERIOD INFORMATION SECTION */}
          <div className="bg-amber-100/70 border border-amber-300 rounded-lg p-4 mb-6">
            <dl className="period text-center px-4">
              <dt className="inline-block font-bold text-gray-700 mr-2">販売期間</dt>
              <dd className="inline-block">
                <span id="ctl00_body_LotteryPlanSaleStartDateLabel" className="text-gray-700">
                  2026年2月20日(金) 17:30
                </span>
                <span className="mx-1 text-gray-700">～</span>
                <span id="ctl00_body_LotteryPlanSaleEndDateLabel" className="text-gray-700">
                  2026年3月13日(金) 23:59
                </span>
              </dd>
            </dl>
          </div>
                
          {/* STATS SECTION */}
          <div className="flex justify-center items-center gap-4 sm:gap-6 mb-8 flex-wrap">
            <div className="bg-blue-50 px-4 sm:px-6 py-3 rounded-lg min-w-30">
              <p className="text-xs sm:text-sm text-slate-500">Total Pulls</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{drawHistory.length}</p>
            </div>
          </div>

          {/* LOADING EFFECT */}
          {loading && <LoadingSpinner />}

          {/* TEN TIMES RESULT SLIDER SECTIOn */}
          {showTenResults && tenDrawsResult.length > 0 && !loading && (
            <div className="mb-8 p-4 sm:p-6 bg-green-50 rounded-xl border-2 border-green-200 relative">
                <div className="relative flex items-center justify-center">
                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={`
                    absolute left-0 z-10
                    text-4xl sm:text-5xl font-bold
                    transition-all duration-300
                    ${currentSlide === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-green-600 hover:text-green-700 hover:scale-110 cursor-pointer'
                    }
                    `}
                >
                    ←
                </button>

                {/* Current Draw Result */}
                <div className="w-full max-w-md mx-12">
                    <p className="text-lg text-green-600 mb-3 text-center font-medium">Result:</p>
                    <div className="mb-4 flex justify-center">
                    {imageErrors[tenDrawsResult[currentSlide].selectedItem.id] ? (
                        <div 
                        className={`w-40 h-40 rounded-lg bg-linear-to-br ${tenDrawsResult[currentSlide].color} flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300`}
                        onClick={() => setSelectedDraw(tenDrawsResult[currentSlide])}
                        >
                        <span className="text-5xl animate-kuji-bounce">🎁</span>
                        </div>
                    ) : (
                        <img 
                        src={tenDrawsResult[currentSlide].selectedItem.image}
                        alt={tenDrawsResult[currentSlide].selectedItem.name}
                        className="w-40 h-40 object-contain drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                        onError={() => handleImageError(tenDrawsResult[currentSlide].selectedItem.id)}
                        onClick={() => setSelectedDraw(tenDrawsResult[currentSlide])}
                        />
                    )}
                    </div>
                    <p className={`text-xl sm:text-2xl font-bold bg-linear-to-r ${tenDrawsResult[currentSlide].color} bg-clip-text text-transparent text-center`}>
                    {tenDrawsResult[currentSlide].selectedItem.name}
                    </p>
                    
                    {/* Simple counter to show position */}
                    <p className="text-xs text-green-600 mt-2 text-center">
                    {currentSlide + 1} / 10
                    </p>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    disabled={currentSlide === tenDrawsResult.length - 1}
                    className={`
                    absolute right-0 z-10
                    text-4xl sm:text-5xl font-bold
                    transition-all duration-300
                    ${currentSlide === tenDrawsResult.length - 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-green-600 hover:text-green-700 hover:scale-110 cursor-pointer'
                    }
                    `}
                >
                    →
                </button>
                </div>
            </div>
          )}

          {/* LAST DRAW RESULT SECTION */}
          {lastDraw && !loading && !showTenResults && (
            <div className="mb-8 p-4 sm:p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-lg text-green-600 mb-3 text-center font-medium">Result:</p>
                <div className="mb-4 flex justify-center">
                {imageErrors[lastDraw.selectedItem.id] ? (
                    <div 
                        className={`w-40 h-40 rounded-lg bg-linear-to-br ${lastDraw.color} flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300`}
                        onClick={() => setSelectedDraw(lastDraw)}
                    >
                        <span className="text-5xl animate-kuji-bounce">🎁</span>
                    </div>
                ) : (
                    <img 
                    src={lastDraw.selectedItem.image}
                    alt={lastDraw.selectedItem.name}
                    className="w-40 h-40 object-contain drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(lastDraw.selectedItem.id)}
                    onClick={() => setSelectedDraw(lastDraw)}
                    />
                )}
                </div>
                <p className={`text-xl sm:text-2xl font-bold bg-linear-to-r ${lastDraw.color} bg-clip-text text-transparent text-center`}>
                {lastDraw.selectedItem.name}
                </p>
                <p className="text-sm text-slate-600 mt-2 text-center">{lastDraw.name} ({lastDraw.id})</p>
            </div>
          )}

          {/* DRAW BUTTONS SECTION */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mb-8">
            <div className="flex flex-row justify-center gap-2 w-full sm:hidden">
              {/* SINGLE DRAW BUTTON */}
              <button
                onClick={drawSinglePrize}
                disabled={isDrawing}
                className={`
                  px-2 py-2 text-sm font-bold font-patrick rounded-lg flex-1
                  transition-all duration-300 transform cursor-pointer
                  ${isDrawing
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700 shadow-[0_4px_0_0_#9d174d] hover:shadow-[0_2px_0_0_#9d174d] active:shadow-[0_1px_0_0_#9d174d] active:translate-y-1 hover:translate-y-0.5'
                  }
                  text-white border-2 border-pink-700
                  relative
                `}
              >
                <span className="block transform transition-transform">
                  1回くじ
                </span>
                <span className="block text-xs mt-0.5 opacity-90">
                  1枚 770円
                </span>
              </button>

              {/* TEN TIMES DRAW BUTTON */}
              <button
                onClick={drawTenPrizes}
                disabled={isDrawing}
                className={`
                  px-2 py-2 text-sm font-bold font-patrick rounded-lg flex-1
                  transition-all duration-300 transform cursor-pointer
                  ${isDrawing
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-[0_4px_0_0_#1e40af] hover:shadow-[0_2px_0_0_#1e40af] active:shadow-[0_1px_0_0_#1e40af] active:translate-y-1 hover:translate-y-0.5'
                  }
                  text-white border-2 border-blue-700
                  relative
                `}
              >
                <span className="block transform transition-transform">
                  10回くじ
                </span>
                <span className="block text-xs mt-0.5 opacity-90">
                  10枚 7,700円
                </span>
              </button>
            </div>

            <button
              onClick={drawSinglePrize}
              disabled={isDrawing}
              className={`
                hidden sm:block px-8 py-4 text-xl font-bold font-patrick rounded-lg
                transition-all duration-300 transform cursor-pointer
                ${isDrawing
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700 shadow-[0_8px_0_0_#9d174d] hover:shadow-[0_4px_0_0_#9d174d] active:shadow-[0_2px_0_0_#9d174d] active:translate-y-1.5 hover:translate-y-0.5 hover:scale-105'
                }
                text-white border-2 border-pink-700
                w-48 relative
              `}
            >
              <span className="block transform transition-transform">
                1回くじ
              </span>
              <span className="block text-sm mt-1 opacity-90">
                1枚 770円
              </span>
            </button>

            <button
              onClick={drawTenPrizes}
              disabled={isDrawing}
              className={`
                hidden sm:block px-8 py-4 text-xl font-bold font-patrick rounded-lg
                transition-all duration-300 transform cursor-pointer
                ${isDrawing
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-[0_8px_0_0_#1e40af] hover:shadow-[0_4px_0_0_#1e40af] active:shadow-[0_2px_0_0_#1e40af] active:translate-y-1.5 hover:translate-y-0.5 hover:scale-105'
                }
                text-white border-2 border-blue-700
                w-48 relative
              `}
            >
              <span className="block transform transition-transform">
                10回くじ
              </span>
              <span className="block text-sm mt-1 opacity-90">
                10枚 7,700円
              </span>
            </button>

            {/* RESET BUTTON */}
            <button
              onClick={resetKuji}
              className={`
                px-4 sm:px-8 py-2 sm:py-4 text-base sm:text-xl font-bold font-patrick rounded-lg
                transition-all duration-300 transform cursor-pointer
                bg-purple-300 hover:bg-purple-400 active:bg-purple-500
                shadow-[0_4px_0_0_#6b21a8] sm:shadow-[0_8px_0_0_#6b21a8] hover:shadow-[0_2px_0_0_#6b21a8] sm:hover:shadow-[0_4px_0_0_#6b21a8] active:shadow-[0_1px_0_0_#6b21a8] sm:active:shadow-[0_2px_0_0_#6b21a8]
                active:translate-y-1 sm:active:translate-y-1.5 hover:translate-y-0.5
                text-purple-900 border-2 border-purple-600
                w-full sm:w-48 relative
              `}
            >
              <span className="block transform transition-transform">
                リセット
              </span>
              <span className="block text-xs sm:text-sm mt-1 opacity-90">
                Reset Kuji
              </span>
            </button>
          </div>

          {/* VIEW HISTORY BUTTON */}
          {drawHistory.length > 0 && (
            <div className="mb-4">
                <button
                onClick={() => setShowHistory(!showHistory)}
                className={`
                    px-4 sm:px-5 py-2 sm:py-2.5 text-base sm:text-lg font-bold font-patrick rounded-lg
                    transition-all duration-300 transform cursor-pointer
                    bg-emerald-400 hover:bg-emerald-500 active:bg-emerald-600 
                    shadow-[0_6px_0_0_#047857] hover:shadow-[0_3px_0_0_#047857] 
                    active:shadow-[0_1px_0_0_#047857] active:translate-y-1 
                    hover:translate-y-0.5 hover:scale-105
                    text-white border-2 border-emerald-600
                    w-full sm:w-auto relative
                `}
                >
                <span className="block transform transition-transform">
                    {showHistory ? 'Hide History' : 'View History'}
                </span>
                </button>
            </div>
            )}

          {/* DRAW HISTORY SECTION */}
          {showHistory && drawHistory.length > 0 && (
            <div className="mb-8">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                {/* History Stats */}
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.values(getPrizeStats()).map((stat) => (
                    <div key={stat.id} className="bg-white p-2 rounded-lg text-center kuji-stat-card">
                        <div className={`text-xs font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.name}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-slate-700">{stat.count}</div>
                        <div className="text-xs text-slate-500">{stat.percentage}%</div>
                    </div>
                    ))}
                </div>
                
                {/* History Grid */}
                <h4 className="text-sm sm:text-md font-bold text-slate-600 mb-2">History List:</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                    {drawHistory.slice(0, 1000).map((draw, index) => (
                    <div
                        key={index}
                        className={`
                        aspect-square rounded-lg flex items-center justify-center
                        bg-linear-to-br ${draw.color} text-white
                        shadow-md transform transition-all duration-300
                        hover:scale-110 cursor-pointer p-1 relative group
                        `}
                        title={`${draw.selectedItem.name} (${draw.id})`}
                        onClick={() => setSelectedDraw(draw)}
                    >
                        {imageErrors[draw.selectedItem.id] ? (
                        <span className="text-xl animate-kuji-bounce">🎁</span>
                        ) : (
                        <img 
                            src={draw.selectedItem.image}
                            alt={draw.selectedItem.name}
                            className="w-full h-full object-contain"
                            onError={() => handleImageError(draw.selectedItem.id)}
                        />
                        )}
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none hidden sm:block">
                        {draw.selectedItem.name}
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            )}

          {/* PRIZE TABLE SECTION */}
          <div className="mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-4">Prize List</h3>
            <div className="space-y-2 sm:space-y-3">
                {config.prizes.map((prize) => (
                <div key={prize.id} className="border border-blue-100 rounded-xl overflow-hidden">
                    {/* Prize Header */}
                    <div
                    onClick={() => togglePrizeExpansion(prize.id)}
                    className={`
                        bg-linear-to-r ${prize.color} p-2 sm:p-4
                        text-white cursor-pointer transform transition-all duration-300
                        hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                        flex items-center justify-between
                    `}
                    >
                    <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
                        <div className="text-base sm:text-2xl font-bold shrink-0">{prize.id}</div>
                        <div className="text-left min-w-0">
                        <div className="font-bold text-xs sm:text-base truncate">{prize.name}</div>
                        <div className="text-[10px] sm:text-xs opacity-90 truncate">{prize.description}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        <div className="text-right">
                        <div className="text-[10px] sm:text-xs opacity-90 whitespace-nowrap">{prize.items.length} items</div>
                        <div className="text-xs sm:text-base font-bold whitespace-nowrap">{prize.probability}%</div>
                        </div>
                        <div className="flex items-center">
                        <svg 
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${expandedPrize === prize.id ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        </div>
                    </div>
                    </div>

                    {/* Expanded Items */}
                    {expandedPrize === prize.id && (
                    <div className="bg-gray-50 p-2 sm:p-4 animate-kuji-fadeIn">
                        <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {prize.items.map((item) => (
                            <li
                            key={item.id}
                            className="bg-white rounded-lg p-1.5 sm:p-3 shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDraw({
                                ...prize,
                                selectedItem: item
                                });
                            }}
                            >
                            <div className="flex items-center gap-1.5 sm:gap-3">
                                <div className="shrink-0">
                                {imageErrors[item.id] ? (
                                    <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-lg bg-linear-to-br ${prize.color} flex items-center justify-center`}>
                                    <span className="text-lg sm:text-2xl animate-kuji-bounce">🎁</span>
                                    </div>
                                ) : (
                                    <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                                    onError={() => handleImageError(item.id)}
                                    />
                                )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                <p className="font-bold text-xs text-slate-700 truncate">{item.id}</p>
                                <p className="text-xs text-slate-600 truncate">{item.name}</p>
                                <p className="text-xs text-slate-400 mt-1 hidden sm:block truncate">{item.description}</p>
                                </div>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
                ))}
            </div>
          </div>

            {/* DRAW DETAILS DIALOG SECTION */}
            {selectedDraw && (
            <div 
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedDraw(null)}
            >
                {/* Backdrop with blur effect */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                
                {/* Dialog content */}
                <div 
                className="bg-white rounded-xl max-w-2xl w-full shadow-2xl transform transition-all relative"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Header with close button */}
                <div className="flex justify-end p-4">
                    <button
                    onClick={() => setSelectedDraw(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Close"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                
                {/* Content */}
                <div className="px-8 pb-8 text-center">
                    <div className="mb-6">
                    {/* Larger image container */}
                    <div className={`flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 mx-auto bg-linear-to-br ${selectedDraw.color} mb-4 rounded-xl overflow-hidden`}>
                        {imageErrors[selectedDraw.selectedItem.id] ? (
                        <span className="text-8xl animate-kuji-bounce">🎁</span>
                        ) : (
                        <img 
                            src={selectedDraw.selectedItem.image}
                            alt={selectedDraw.selectedItem.name}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(selectedDraw.selectedItem.id)}
                        />
                        )}
                    </div>
                    
                    {/* Prize name */}
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
                        {selectedDraw.selectedItem.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-base sm:text-lg text-slate-500 max-w-md mx-auto">
                        {selectedDraw.selectedItem.description}
                    </p>
                    </div>
                </div>
                </div>
            </div>
            )}

          {/* INSTRUCTION SECTION */}
          <div className="mt-8 pt-6 border-t border-blue-200 space-y-2">
            <p className="text-sm sm:text-base text-slate-600 px-2">
                This Ichiban Kuji is provided for entertainment purposes only and may not be used for commercial purposes.
            </p>

            <p className="text-sm sm:text-base text-slate-600 px-2">
                この一番くじは娯楽目的でのみ提供されており、商用利用は禁止されています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IchibanKuji;