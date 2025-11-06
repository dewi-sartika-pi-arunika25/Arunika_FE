/**
 * Design System Tokens
 * Centralized design tokens for consistent styling across the app
 */

export const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: '#ff8300',
    light: '#ff9d33',
    dark: '#cc6600',
    hover: '#ff9500',
  },
  
  // Text colors
  text: {
    primary: 'var(--text)',
    secondary: 'color-mix(in oklab, var(--text) 88%, transparent)',
    tertiary: 'color-mix(in oklab, var(--text) 78%, transparent)',
    muted: 'color-mix(in oklab, var(--text) 65%, transparent)',
  },
  
  // Background colors
  background: {
    DEFAULT: 'var(--background)',
    secondary: 'color-mix(in oklab, var(--background) 95%, var(--primary))',
    overlay: 'color-mix(in oklab, var(--background) 70%, transparent)',
  },
  
  // Accent colors
  accent: {
    1: 'var(--accent-1)',
    2: 'var(--accent-2)',
    3: 'var(--accent-3)',
  },
  
  // Border colors
  border: {
    DEFAULT: 'var(--border)',
    light: 'color-mix(in oklab, var(--border) 45%, transparent)',
    medium: 'color-mix(in oklab, var(--border) 55%, transparent)',
  },
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

export const typography = {
  // Font sizes (responsive clamp)
  size: {
    xs: 'clamp(11px, 1.5vw, 12px)',
    sm: 'clamp(13px, 1.8vw, 14px)',
    base: 'clamp(14px, 2vw, 16px)',
    lg: 'clamp(16px, 2.2vw, 18px)',
    xl: 'clamp(18px, 2.5vw, 20px)',
    '2xl': 'clamp(24px, 3.5vw, 32px)',
    '3xl': 'clamp(28px, 4vw, 40px)',
    '4xl': 'clamp(32px, 4.5vw, 48px)',
    '5xl': 'clamp(36px, 5vw, 56px)',
  },
  
  // Font weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  leading: {
    tight: 1.15,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter spacing
  tracking: {
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    ultra: '0.18em',
  },
};

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 26px 60px rgba(0, 0, 0, 0.08)',
  primary: '0 16px 36px -18px color-mix(in oklab, var(--primary) 75%, black)',
};

export const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  easing: {
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
  },
};

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

/**
 * Animation presets for consistent motion
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  fadeUp: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  fadeUpBlur: {
    initial: { opacity: 0, y: 14, filter: 'blur(2px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.38, ease: 'easeOut' },
  },
  stagger: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  },
};

/**
 * Responsive breakpoints (matching Tailwind defaults)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

