// utils/paths.js
const BASE_PATH = '/react';

export const paths = {
  // Define paths for different pages
  home: `${BASE_PATH}/`,
  memoryGame: `${BASE_PATH}/memory_game`,
  ticTacToe: `${BASE_PATH}/tictactoe`,
  dictionary: `${BASE_PATH}/dictionary`,
  musicPlayer: `${BASE_PATH}/musicplayer`,
  dinner: `${BASE_PATH}/dinner`,
};

// Helper function to navigate
export const navigateTo = (path, navigate) => {
  navigate(path.replace(BASE_PATH, ''));
};