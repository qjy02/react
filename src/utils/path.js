// utils/paths.js
const BASE_PATH = '/react';

export const paths = {
  home: `${BASE_PATH}/`,
  memoryGame: `${BASE_PATH}/memory_game`,
  // Add more paths as needed
};

// Helper function to navigate
export const navigateTo = (path, navigate) => {
  navigate(path.replace(BASE_PATH, ''));
};