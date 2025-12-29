import { useEffect, useState, useRef } from 'react';
import '../css/style.css';

function Dictionary() {
  const [word, setWord] = useState('');
  const [definitions, setDefinitions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [popularSearches, setPopularSearches] = useState(['hello', 'time', 'year', 'man', 'day']);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingPhonetic, setPlayingPhonetic] = useState(null);
  const [expandedParts, setExpandedParts] = useState({});
  const phoneticAudioRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize with a default word
  useEffect(() => {
    fetchWordDefinition('hello');
  }, []);

  const fetchSuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
    }
    
    setLoadingSuggestions(true);
    try {
        const response = await fetch(`https://api.datamuse.com/sug?s=${searchTerm}&max=8`);
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        
        const data = await response.json();
        const words = data.map(item => item.word);
        setSuggestions(words);
        setShowSuggestions(words.length > 0);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
    } finally {
        setLoadingSuggestions(false);
    }
    };

  const fetchWordDefinition = async (searchWord) => {
    if (!searchWord.trim()) return;
    
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setExpandedParts({});
    
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Word not found in dictionary');
        }
        throw new Error('Failed to fetch definition');
      }
      
      const data = await response.json();
      setDefinitions(data[0]);
      setWord(searchWord);
      
      // Add to search history
      if (!searchHistory.includes(searchWord)) {
        setSearchHistory(prev => [searchWord, ...prev.slice(0, 4)]);
      }
      
    } catch (err) {
      setError(err.message);
      setDefinitions(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setWord(value);
    
    // Debounce the API call
    if (value.trim().length > 1) {
        const debounceTimer = setTimeout(() => {
        fetchSuggestions(value);
        }, 300); // 300ms debounce to avoid too many API calls
        
        return () => clearTimeout(debounceTimer);
    } else {
        setSuggestions([]);
        setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (word.trim()) {
      fetchWordDefinition(word.trim().toLowerCase());
    }
  };

  const handlePopularSearch = (popularWord) => {
    setWord(popularWord);
    fetchWordDefinition(popularWord);
  };

  const getAudioUrl = () => {
    if (!definitions?.phonetics) return null;
    
    // Find the first phonetic with audio
    const phoneticWithAudio = definitions.phonetics.find(p => p.audio);
    if (!phoneticWithAudio) return null;
    
    // Return the full URL - API returns URLs without protocol
    let audioUrl = phoneticWithAudio.audio;
    if (audioUrl.startsWith('//')) {
      return `https:${audioUrl}`;
    }
    return audioUrl;
  };

  const toggleAudio = () => {
    const audioUrl = getAudioUrl();
    if (!audioUrl) return;

    if (isPlaying) {
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      // Play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
    }
  };

  const formatPhonetic = (phonetic) => {
    if (!phonetic) return '';
    // Add slashes around phonetic text
    return `/${phonetic}/`;
  };

  const getFirstPhoneticText = () => {
    if (!definitions?.phonetics) return '';
    
    // Get first phonetic with text
    const phoneticWithText = definitions.phonetics.find(p => p.text);
    return phoneticWithText?.text || '';
  };

  return (
    <div className="mt-8 animate-[fadeInside_1s_ease-out_forwards] opacity-0 space-y-8 px-4 sm:px-6 pb-8 sm:pb-12 w-full max-w-6xl mx-auto font-patrick">
      {/* HEADER SECTION */}
      <div className="text-center">
        <h1 className="text-4xl font-bold font-patrick text-slate-800 mb-2">
          English Dictionary
        </h1>
        <p className="text-slate-600 font-patrick text-lg">
          Learning English is fun with Vipo
        </p>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-slate-200 relative overflow-hidden">
        {/* BOOK SPINE DECORATION SECTION */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-b from-slate-700 via-slate-600 to-slate-800"></div>
        <div className="absolute left-4 top-0 bottom-0 w-2 bg-linear-to-b from-slate-900 to-slate-800"></div>
        
        {/* PAGE CURL EFFECT SECTION */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white/20 to-transparent"></div>

        {/* SEARCH SECTION SECTION */}
        <div className="ml-8 mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={word}
                onChange={handleInputChange}
                placeholder="Search for any English word..."
                className="w-full px-6 py-4 pl-14 pr-12 text-lg font-patrick rounded-2xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none shadow-lg bg-white/90 backdrop-blur-sm cursor-text"
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => word.length > 1 && setShowSuggestions(true)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <span className="text-2xl">🔍</span>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold font-patrick rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md cursor-pointer"
              >
                Search
              </button>

              {/* AUTOCOMPLETE SUGGESTIONS SECTION */}
                {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-60 overflow-y-auto">
                    {loadingSuggestions ? (
                    <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-slate-600 font-patrick">Loading suggestions...</span>
                    </div>
                    ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                        <button
                        key={index}
                        type="button"
                        onClick={() => {
                            setWord(suggestion);
                            setShowSuggestions(false);
                            fetchWordDefinition(suggestion);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-150 font-patrick border-b border-slate-100 last:border-b-0 flex items-center justify-between group cursor-pointer"
                        >
                        <span className="text-slate-700 group-hover:text-blue-700">
                            {suggestion}
                        </span>
                        <span className="text-sm text-slate-400 group-hover:text-blue-500">
                            ↵
                        </span>
                        </button>
                    ))
                    ) : (
                    <div className="p-4 text-center text-slate-500 font-patrick">
                        No suggestions found
                    </div>
                    )}
                </div>
                )}
            </div>
            
            {/* POPULAR SEARCHES SECTION */}
            <div className="mt-4">
              <p className="text-slate-600 font-patrick mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((popularWord, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(popularWord)}
                    className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-patrick text-slate-700 shadow-sm cursor-pointer"
                  >
                    {popularWord}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* LOADING STATE SECTION */}
        {loading && (
          <div className="ml-8 text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-600 font-patrick text-lg">Searching dictionary...</p>
          </div>
        )}

        {/* ERROR STATE SECTION */}
        {error && !loading && (
        <div className="flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-linear-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">📕</div>
            <h3 className="text-xl font-bold font-patrick text-red-700 mb-2">
                Word Not Found
            </h3>
            <p className="text-red-600 font-patrick">{error}</p>
            <p className="text-slate-600 font-patrick mt-4">
                Try searching for a different word or check your spelling.
            </p>
            </div>
        </div>
        )}

        {/* DICTIONARY RESULTS SECTION */}
        {definitions && !loading && !error && (
          <div className="ml-8 space-y-8 animate-[slideUp_0.5s_ease-out]">
            {/* WORD HEADER SECTION */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1"> {/* Added flex-1 to take available space */}
                  <h2 className="text-3xl sm:text-4xl font-bold font-patrick text-slate-800 mb-2">
                    {definitions.word}
                  </h2>
                  {getFirstPhoneticText() && (
                    <p className="text-xl text-blue-700 font-patrick">
                      {formatPhonetic(getFirstPhoneticText())}
                    </p>
                  )}
                  {definitions.origin && (
                    <div className="mt-3">
                      <p className="text-sm text-slate-500 font-patrick mb-1">Origin:</p>
                      <p className="text-slate-700 font-patrick italic">{definitions.origin}</p>
                    </div>
                  )}
                </div>
                
                {/* SINGLE AUDIO BUTTON SECTION */}
                {getAudioUrl() && (
                <div className="flex gap-2 items-center self-end sm:self-auto">
                    <button
                    onClick={toggleAudio}
                    className="p-2 rounded-full font-patrick text-white transition-transform duration-200 flex items-center justify-center cursor-pointer
                                hover:scale-110 active:scale-95"
                    >
                        <span className="text-2xl text-blue-500">
                            {isPlaying ? '⏸' : (
                                <span className="scale-x-[-1] inline-block">🔊</span>
                            )}
                        </span>
                    </button>

                    <img 
                    src={isPlaying ? "vipo/vipo_speak.png" : "vipo/vipo.png"} 
                    alt="Vipo" 
                    className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg transition-all duration-300"
                    />
                </div>
                )}
              </div>
            </div>

            {/* MEANINGS SECTION */}
            {definitions.meanings?.length > 0 && (
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="text-2xl font-bold font-patrick text-slate-800 mb-6">
                    Definitions
                  </h3>
                  
                  <div className="space-y-8">
                    {definitions.meanings?.map((meaning, index) => (
                      <div key={index} className="space-y-4">
                        {/* PART OF SPEECH SECTION */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block px-4 py-1.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold font-patrick rounded-full text-sm cursor-default">
                            {meaning.partOfSpeech}
                          </span>
                          <div className="h-px flex-1 bg-linear-to-r from-blue-200 to-transparent"></div>
                        </div>

                        {/* DEFINITIONS SECTION */}
                        <div className="space-y-4 ml-2">
                          {meaning.definitions?.slice(0, expandedParts[meaning.partOfSpeech] ? meaning.definitions.length : 3).map((definition, defIndex) => (
                            <div key={defIndex} className="pl-4 border-l-3 border-blue-300">
                              <div className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center min-w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm font-bold cursor-default mt-1">
                                  {defIndex + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="text-slate-800 font-patrick text-lg mb-2">
                                    {definition.definition}
                                  </p>
                                  
                                  {definition.example && (
                                    <div className="ml-4 pl-4 border-l-2 border-blue-200">
                                      <p className="text-slate-600 font-patrick italic">
                                        <span className="font-bold text-blue-600">Example:</span> "{definition.example}"
                                      </p>
                                    </div>
                                  )}

                                  {/* SYNONYMS SECTION */}
                                  {definition.synonyms?.length > 0 && (
                                    <div className="mt-3">
                                      <p className="text-sm text-slate-500 font-patrick mb-1">Synonyms:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {definition.synonyms.slice(0, 5).map((synonym, synIndex) => (
                                          <span
                                            key={synIndex}
                                            className="px-3 py-1 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg text-emerald-700 font-patrick text-sm cursor-default"
                                          >
                                            {synonym}
                                          </span>
                                        ))}
                                        {definition.synonyms.length > 5 && (
                                          <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-800 font-patrick text-sm cursor-default">
                                            +{definition.synonyms.length - 5} more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* ANTONYMS SECTION */}
                                  {definition.antonyms?.length > 0 && (
                                    <div className="mt-3">
                                      <p className="text-sm text-slate-500 font-patrick mb-1">Antonyms:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {definition.antonyms.slice(0, 5).map((antonym, antIndex) => (
                                          <span
                                            key={antIndex}
                                            className="px-3 py-1 bg-linear-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg text-rose-700 font-patrick text-sm cursor-default"
                                          >
                                            {antonym}
                                          </span>
                                        ))}
                                        {definition.antonyms.length > 5 && (
                                          <span className="px-3 py-1 bg-rose-100 border border-rose-300 rounded-lg text-rose-800 font-patrick text-sm cursor-default">
                                            +{definition.antonyms.length - 5} more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* SHOW MORE BUTTON SECTION */}
                          {meaning.definitions?.length > 3 && (
                            <div className="text-center mt-4">
                              <button
                                onClick={() => {
                                  // Toggle showing all definitions
                                  const expanded = expandedParts[meaning.partOfSpeech] || false;
                                  setExpandedParts(prev => ({
                                    ...prev,
                                    [meaning.partOfSpeech]: !expanded
                                  }));
                                }}
                                className="px-4 py-2 text-sm font-patrick text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer"
                              >
                                {expandedParts[meaning.partOfSpeech] ? 'Show fewer definitions' : `Show ${meaning.definitions.length - 3} more definitions`}
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Add a subtle separator between parts of speech, but not after the last one */}
                        {index < definitions.meanings.length - 1 && (
                          <div className="pt-4">
                            <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ADDITIONAL INFORMATION SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PHONETICS SECTION */}
              {definitions.phonetics?.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold font-patrick text-slate-800 mb-4">Phonetics</h3>
                  <div className="space-y-3">
                    {definitions.phonetics.map((phonetic, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-patrick text-slate-700 cursor-default">
                          {phonetic.text ? formatPhonetic(phonetic.text) : 'N/A'}
                        </span>
                        {phonetic.audio && (
                            <button
                                onClick={() => {
                                let audioUrl = phonetic.audio;
                                if (audioUrl.startsWith('//')) {
                                    audioUrl = `https:${audioUrl}`;
                                }
                                
                                // If same audio is already playing, pause it
                                if (playingPhonetic === audioUrl && phoneticAudioRef.current) {
                                    phoneticAudioRef.current.pause();
                                    setPlayingPhonetic(null);
                                    return;
                                }
                                
                                // Stop any currently playing audio
                                if (phoneticAudioRef.current) {
                                    phoneticAudioRef.current.pause();
                                    phoneticAudioRef.current = null;
                                }
                                
                                // Play new audio
                                const audio = new Audio(audioUrl);
                                phoneticAudioRef.current = audio;
                                setPlayingPhonetic(audioUrl);
                                
                                audio.play()
                                    .catch(error => {
                                    console.error('Error playing audio:', error);
                                    setPlayingPhonetic(null);
                                    phoneticAudioRef.current = null;
                                    });
                                
                                audio.onended = () => {
                                    setPlayingPhonetic(null);
                                    phoneticAudioRef.current = null;
                                };
                                
                                audio.onerror = () => {
                                    setPlayingPhonetic(null);
                                    phoneticAudioRef.current = null;
                                };
                                }}
                                className="px-3 py-1 bg-linear-to-r from-blue-400 to-cyan-400 text-white rounded-lg text-sm font-patrick hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 cursor-pointer flex items-center gap-1"
                            >
                                {playingPhonetic === phonetic.audio ? '⏸' : '🔊'}
                            </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEARCH HISTORY SECTION */}
                {searchHistory.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100">
                    <h3 className="text-xl font-bold font-patrick text-slate-800 mb-4">Your Search History</h3>
                    <div className="space-y-2">
                    {searchHistory.slice(0, 5).map((historyWord, index) => (
                        <button
                        key={index}
                        onClick={() => handlePopularSearch(historyWord)}
                        className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group cursor-pointer"
                        >
                        <span className="font-patrick text-slate-700 group-hover:text-blue-700">
                            {historyWord}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity duration-200">
                            →
                        </span>
                        </button>
                    ))}
                    </div>
                </div>
                )}
            </div>
          </div>
        )}

        {/* DEFAULT STATE SECTION */}
        {!definitions && !loading && !error && (
          <div className="ml-8 text-center py-12">
            <div className="text-6xl mb-6">📖</div>
            <h3 className="text-2xl font-bold font-patrick text-slate-700 mb-4">
              Welcome to Dictionary Explorer
            </h3>
            <p className="text-slate-600 font-patrick max-w-md mx-auto">
              Type any English word in the search box above to get definitions, pronunciations, examples, and more!
            </p>
          </div>
        )}

        {/* FOOTER TIPS SECTION */}
        <div className="ml-8 mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-lg font-bold font-patrick text-blue-700 mb-4">
            💡 Dictionary Tips:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100">
              <h5 className="font-bold font-patrick text-slate-700 mb-2">🔊 Audio Pronunciation</h5>
              <p className="text-sm text-slate-600 font-patrick">
                Click the listen button to hear how the word is pronounced
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100">
              <h5 className="font-bold font-patrick text-slate-700 mb-2">📚 Multiple Meanings</h5>
              <p className="text-sm text-slate-600 font-patrick">
                Words often have multiple meanings based on their part of speech
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100">
              <h5 className="font-bold font-patrick text-slate-700 mb-2"> ✨ Quick Search</h5>
              <p className="text-sm text-slate-600 font-patrick">
                Quick access to frequently searched terms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dictionary;