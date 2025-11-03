/**
 * Application-wide constants
 * Centralized configuration for better maintainability
 */

// Assessment constants
export const ASSESSMENT = {
  MIN_SCORE: 1,
  MAX_SCORE: 5,
  SCALE_LABELS: {
    MIN: 'Sangat Tidak Setuju',
    MAX: 'Sangat Setuju',
  },
  TRAITS: {
    DISC: 'DISC',
    RIASEC: 'RIASEC',
  },
};

// Color scheme (matching globals.css)
export const COLORS = {
  PRIMARY: '#FF8300',
  ACCENT: '#E4B200',
  SECONDARY: '#F7E6A4',
  BACKGROUND: '#FFFDF4',
  WARNING_BG: '#FFF4E6',
  WARNING_BORDER: '#FFE4CC',
  WARNING_TEXT: '#E67300',
};

// Trait-specific colors
export const TRAIT_COLORS = {
  DISC: {
    bg: '#FFF4E6',
    text: '#FF8300',
    border: '#FFE4CC',
  },
  RIASEC: {
    bg: '#F7E6A4',
    text: '#E4B200',
    border: '#E4B200',
    borderOpacity: '30%',
  },
};

// API constants
export const API_ENDPOINTS = {
  ASSESSMENT: {
    START: '/assessment/start',
    SUBMIT: '/assessment/submit',
    RESULTS: '/assessment/results',
    STATUS: '/assessment/status',
  },
};

// Storage keys
export const STORAGE_KEYS = {
  DISC_RIASEC_RESULTS: 'disc_riasec_results',
  ASSESSMENT_TYPE: 'assessment_type',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

