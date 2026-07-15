import { createSlice } from '@reduxjs/toolkit';

const PLATFORM_CONFIGS = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    maxChars: 63206,
    maxPhotos: 10,
    allowHashtags: true,
    allowEmojis: true,
    minChars: 1,
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    color: '#000000',
    maxChars: 280,
    maxPhotos: 4,
    allowHashtags: true,
    allowEmojis: true,
    minChars: 1,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    maxChars: 2200,
    maxPhotos: 10,
    allowHashtags: true,
    allowEmojis: true,
    minChars: 1,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    maxChars: 3000,
    maxPhotos: 9,
    allowHashtags: true,
    allowEmojis: true,
    minChars: 1,
  },
};

const initialState = {
  selectedPlatform: 'twitter',
  platforms: PLATFORM_CONFIGS,
  validationErrors: [],
  validationWarnings: [],
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    selectPlatform: (state, action) => {
      state.selectedPlatform = action.payload;
      state.validationErrors = [];
      state.validationWarnings = [];
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
    setValidationWarnings: (state, action) => {
      state.validationWarnings = action.payload;
    },
    clearValidation: (state) => {
      state.validationErrors = [];
      state.validationWarnings = [];
    },
  },
});

export const { 
  selectPlatform, 
  setValidationErrors, 
  setValidationWarnings,
  clearValidation 
} = platformsSlice.actions;

export const selectSelectedPlatform = (state) => state.platforms.selectedPlatform;
export const selectPlatformConfig = (state) => {
  const id = state.platforms.selectedPlatform;
  return state.platforms.platforms[id];
};
export const selectAllPlatforms = (state) => Object.values(state.platforms.platforms);
export const selectValidationErrors = (state) => state.platforms.validationErrors;
export const selectValidationWarnings = (state) => state.platforms.validationWarnings;

export default platformsSlice.reducer;