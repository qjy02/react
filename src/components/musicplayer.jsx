import { useState, useEffect, useRef } from 'react';
import '../css/style.css';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Repeat,
  Info,
  X,
  Upload,
  FolderOpen
} from 'lucide-react';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [isRepeatingPlaylist, setIsRepeatingPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songDetails, setSongDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [currentSongInfo, setCurrentSongInfo] = useState({
    title: 'Select music to play',
    artist: 'Unknown Artist',
    album: 'Unknown Album'
  });

  const PLACEHOLDER = "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png";
  const [isFading, setIsFading] = useState(false);
  const [currentImage, setCurrentImage] = useState(PLACEHOLDER);
  const [isFlipped, setIsFlipped] = useState(false);
  const audioRef = useRef(null);
  const albumArtRef = useRef(null);
  const progressBarRef = useRef(null);
  const swipeDirRef = useRef('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDir, setSwipeDir] = useState('next');

  const handleImageFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const changeAlbumArt = (newImage, direction) => {
    if (direction) {
      swipeDirRef.current = direction;
      setSwipeDir(direction);
    }

    setIsAnimating(true);

    setTimeout(() => {
      setCurrentImage(newImage);
    }, 400);

    setTimeout(() => {
      setIsAnimating(false);
    }, 420);
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load a song from the playlist
  const loadSong = (index) => {
    if (index < 0 || index >= playlist.length) return;
    
    // Store the current playing state
    const wasPlaying = isPlaying;
    
    if (currentUrl) URL.revokeObjectURL(currentUrl);

    const file = playlist[index];
    const url = URL.createObjectURL(file);
    setCurrentUrl(url);
    
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
    
    setCurrentIndex(index);
    
    // Update current song info with filename as fallback
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    setCurrentSongInfo({
      title: fileName,
      artist: 'Unknown Artist',
      album: 'Unknown Album'
    });
    
    // Start fade out effect
    setIsFading(true);
    
    // Load metadata using jsmediatags if available
    if (window.jsmediatags) {
      window.jsmediatags.read(file, {
        onSuccess: function(tag) {
          const tags = tag.tags;
          const image = tags.picture;
          
          let newImageUrl = "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png";
          
          // Create new image URL if available
          if (image) {
            const base64String = arrayBufferToBase64(image.data);
            newImageUrl = `data:${image.format};base64,${base64String}`;
          }
          
          // Store the new image for later use (after fade out)
          changeAlbumArt(newImageUrl);
          
          // Update song details with metadata
          setSongDetails(tags);
          setCurrentSongInfo({
            title: tags.title || fileName,
            artist: tags.artist || 'Unknown Artist',
            album: tags.album || 'Unknown Album'
          });
          
          // Auto-play after metadata is loaded
          if (wasPlaying && audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(e => {
                console.log('Auto-play failed:', e);
                setIsPlaying(false);
              });
            }
          }
        },
        onError: function(error) {
          console.log('Error reading tags:', error);
          setSongDetails(null);
          
          // Store placeholder as pending image
          changeAlbumArt(PLACEHOLDER);
          
          // Auto-play even if metadata fails
          if (wasPlaying && audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(e => {
                console.log('Auto-play failed:', e);
                setIsPlaying(false);
              });
            }
          }
        }
      });
    } else {
      // If jsmediatags is not available, set placeholder
      changeAlbumArt(PLACEHOLDER);
      
      // If jsmediatags is not available, still try to auto-play
      if (wasPlaying && audioRef.current) {
        setTimeout(() => {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              console.log('Auto-play failed:', e);
              setIsPlaying(false);
            });
          }
        }, 100);
      }
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.includes('audio'));
    if (files.length > 0) {
      setPlaylist(files);
      setShowUploadModal(false);
    }
  };

  useEffect(() => {
    if (playlist.length > 0) loadSong(0);
  }, [playlist]);

  const togglePlayPause = () => {
    if (!audioRef.current || playlist.length === 0) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Play failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const clickedTime = percentage * audioRef.current.duration;
    audioRef.current.currentTime = clickedTime;
    setCurrentTime(clickedTime);
  };

  useEffect(() => {
    // Load jsmediatags script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsmediatags@3.9.1/dist/jsmediatags.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    // Auto-play when metadata is loaded and music was playing
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // If music was playing before loading this song, continue playing
      if (isPlaying && audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log('Auto-play failed:', e);
            setIsPlaying(false);
          });
        }
      }
    };
    
    const handleEnded = () => {
      if (isRepeatingPlaylist) {
        loadSong(currentIndex);
      } else if (currentIndex + 1 < playlist.length) {
        loadSong(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, playlist, isRepeatingPlaylist, isPlaying]);

  return (
    <div className="min-h-screen p-4 font-patrick flex flex-col items-center w-full">
      {/* TITLE SECTION */}
      <div className="text-center pt-4 pb-2 w-full">
        <h2 className="text-3xl sm:text-4xl font-bold font-patrick text-slate-800 mb-2">
          Music Player
        </h2>
        {/* <p className="text-slate-600 font-patrick text-lg">
          Listening to your favorite tunes
        </p> */}
      </div>

      {/* MAIN CONTAINER SECTION */}
      <div className="w-full max-w-md sm:max-w-lg mx-auto mt-auto mb-auto bg-white/30 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl">
        
        {/* ALBUM ART SECTION */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative w-full max-w-64 sm:max-w-80 aspect-square overflow-hidden cursor-pointer" onClick={handleImageFlip}>            {/* CURRENT IMAGE SECTION */}
            <img ref={albumArtRef} src={currentImage} alt="Album Art"
              className={`
                absolute inset-0 w-full h-full object-cover rounded-2xl border-2 border-slate-500/20 to transparent
                transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${
                  isAnimating
                    ? swipeDir === 'next'
                      ? 'opacity-0 translate-x-10 scale-95'
                      : 'opacity-0 -translate-x-10 scale-95'
                    : 'opacity-100 translate-x-0 scale-100'
                }
                ${isFlipped ? 'scale-x-[-1]' : ''}
              `}
            />
            <div className="absolute inset-0"></div>
          </div>
        </div>

        {/* SONG INFO SECTION */}
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-slate-800">Now Playing</h3>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate px-3 sm:px-4 py-2 rounded-xl mb-2 sm:mb-3">
            {currentSongInfo.title}
          </div>
          {/* <div className="text-blue-gray-300 mt-1 sm:mt-2 text-sm sm:text-base space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-2">
              <span className="text-slate-800 font-medium">Artist:</span>
              <span className="truncate">{currentSongInfo.artist}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-2">
              <span className="text-slate-800 font-medium">Album:</span>
              <span className="truncate">{currentSongInfo.album}</span>
            </div>
          </div> */}
        </div>

        {/* CONTROLS SECTION */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          {/* PREVIOUS BUTTON */}
          <button 
            onClick={() => { changeAlbumArt(currentImage, 'prev'); loadSong((currentIndex - 1 + playlist.length) % playlist.length);}}
            disabled={playlist.length === 0}
            className="cursor-pointer p-2 sm:p-3 hover:text-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack size={24} sm:size={28} fill="currentColor" />
          </button>

          {/* DETAILS BUTTON */}
          <button 
            onClick={() => setShowDetailsModal(true)} 
            disabled={playlist.length === 0}
            className="cursor-pointer p-2 sm:p-3 text-slate-800 hover:text-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Info size={20} sm:size={24} />
          </button>

          {/* PLAY / PAUSE BUTTON */}
          <button 
            onClick={togglePlayPause} 
            disabled={playlist.length === 0}
            className="cursor-pointer p-2 sm:p-3 hover:text-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? 
              <Pause size={28} sm:size={32} fill="currentColor" /> : 
              <Play size={28} sm:size={32} fill="currentColor" className="ml-0.5 sm:ml-1" />
            }
          </button>

          {/* REPEAT BUTTONS */}
          <button 
            onClick={() => setIsRepeatingPlaylist(!isRepeatingPlaylist)} 
            disabled={playlist.length === 0}
            className={`cursor-pointer p-2 sm:p-3 transition-colors ${isRepeatingPlaylist ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Repeat size={20} sm:size={24} />
          </button>

          {/* NEXT BUTTON */}
          <button 
            onClick={() => { changeAlbumArt(currentImage, 'next'); loadSong((currentIndex + 1) % playlist.length);}}
            disabled={playlist.length === 0}
            className="cursor-pointer p-2 sm:p-3 hover:text-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward size={24} sm:size={28} fill="currentColor" />
          </button>
        </div>

        {/* PROGRESS BAR SECTION */}
        <div className="mb-6 sm:mb-8">
          <div 
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="w-full h-2.5 sm:h-3 bg-slate-800/30 rounded-full cursor-pointer relative shadow-inner"
          >
            <div 
              className="h-full bg-linear-to-r from-slate-700 to-slate-600 rounded-full transition-all duration-150 relative overflow-hidden"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            >
              {/* Diagonal stripes */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.1)_4px,rgba(255,255,255,0.1)_8px)]"></div>
            </div>
          </div>
          <div className="flex justify-between text-slate-700 mt-2 sm:mt-3 text-xs sm:text-sm font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* UPLOAD BUTTON SECTION */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="cursor-pointer w-full py-3 sm:py-4 bg-linear-to-r from-slate-700 to-slate-600 text-white rounded-2xl font-bold text-lg sm:text-xl shadow-lg flex items-center justify-center gap-2 sm:gap-3 hover:opacity-90 transition-all hover:shadow-slate-600/30 hover:scale-[1.02]"
        >
          <Upload size={20} sm:size={24} /> Upload Music
        </button>

        {/* DISPLAY HOW MAY SONGS LOADED */}
        {/* {playlist.length > 0 && (
          <p className="mt-4 sm:mt-6 text-center text-blue-gray-400 text-sm sm:text-base">
            {currentIndex + 1} / {playlist.length} Songs Loaded
          </p>
        )} */}
      </div>

      {/* LOGIC COMPONENTS SECTION */}
      <audio ref={audioRef} className="hidden" />
      <input type="file" id="filesInput" multiple accept="audio/*" onChange={handleFileUpload} className="hidden" />
      <input type="file" id="folderInput" webkitdirectory="true" onChange={handleFileUpload} className="hidden" />

      {/* UPLOAD MODAL SECTION */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-linear-to-b from-gray-800 via-gray-800 to-gray-900 w-full max-w-xs sm:max-w-sm rounded-3xl p-6 sm:p-8 text-white border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Add Music</h3>
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="cursor-pointer text-gray-300 hover:text-white transition-colors p-1 hover:bg-gray-700/50 rounded-full"
              >
                <X />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <button 
                onClick={() => document.getElementById('filesInput').click()} 
                className="cursor-pointer w-full p-4 sm:p-5 bg-gray-700/90 rounded-2xl flex items-center gap-3 sm:gap-4 hover:bg-gray-600 transition-all border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:shadow-gray-900/30 active:scale-[0.98]"
              >
                <Upload size={24} sm:size={28} className="text-white" /> 
                <span className="text-white font-medium text-sm sm:text-base">Select Files</span>
              </button>
              <button 
                onClick={() => document.getElementById('folderInput').click()} 
                className="cursor-pointer w-full p-4 sm:p-5 bg-gray-700/90 rounded-2xl flex items-center gap-3 sm:gap-4 hover:bg-gray-600 transition-all border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:shadow-gray-900/30 active:scale-[0.98]"
              >
                <FolderOpen size={24} sm:size={28} className="text-white" /> 
                <span className="text-white font-medium text-sm sm:text-base">Select Folder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL SECTION */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-linear-to-b from-gray-800 via-gray-800 to-gray-900 w-full max-w-xs sm:max-w-md rounded-3xl p-6 sm:p-8 text-white border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Song Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="cursor-pointer text-gray-300 hover:text-white transition-colors p-1 hover:bg-gray-700/50 rounded-full"
              >
                <X />
              </button>
            </div>
            
            {songDetails ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-300">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-700/50 p-3 rounded-xl">
                      <p className="text-sm text-gray-400">Title</p>
                      <p className="font-medium truncate">{songDetails.title || currentSongInfo.title}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-xl">
                      <p className="text-sm text-gray-400">Artist</p>
                      <p className="font-medium truncate">{songDetails.artist || currentSongInfo.artist}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-xl">
                      <p className="text-sm text-gray-400">Album</p>
                      <p className="font-medium truncate">{songDetails.album || currentSongInfo.album}</p>
                    </div>
                    {songDetails.year && (
                      <div className="bg-gray-700/50 p-3 rounded-xl">
                        <p className="text-sm text-gray-400">Year</p>
                        <p className="font-medium">{songDetails.year}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Info */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-300">Audio Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-700/50 p-3 rounded-xl">
                      <p className="text-sm text-gray-400">Duration</p>
                      <p className="font-medium">{formatTime(duration)}</p>
                    </div>
                    {songDetails.track && (
                      <div className="bg-gray-700/50 p-3 rounded-xl">
                        <p className="text-sm text-gray-400">Track</p>
                        <p className="font-medium">{songDetails.track}</p>
                      </div>
                    )}
                    {songDetails.genre && (
                      <div className="bg-gray-700/50 p-3 rounded-xl col-span-1 sm:col-span-2">
                        <p className="text-sm text-gray-400">Genre</p>
                        <p className="font-medium truncate">{songDetails.genre}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical Details */}
                {songDetails.version && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-slate-300">Technical Details</h4>
                    <div className="bg-gray-700/50 p-3 rounded-xl">
                      <p className="text-sm text-gray-400">Version</p>
                      <p className="font-medium truncate">{songDetails.version}</p>
                    </div>
                  </div>
                )}

                {/* Comments if available */}
                {songDetails.comment && songDetails.comment.text && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-slate-300">Comments</h4>
                    <div className="bg-gray-700/50 p-3 rounded-xl">
                      <p className="text-sm text-gray-400">Comment</p>
                      <p className="font-medium wrap-break-word">{songDetails.comment.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No metadata available for this track.</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500">Current Information:</p>
                  <div className="bg-gray-700/50 p-4 rounded-xl space-y-2">
                    <p><span className="text-gray-400">Title:</span> {currentSongInfo.title}</p>
                    <p><span className="text-gray-400">Artist:</span> {currentSongInfo.artist}</p>
                    <p><span className="text-gray-400">Album:</span> {currentSongInfo.album}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;