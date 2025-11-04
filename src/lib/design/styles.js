/**
 * Reusable Style Utilities
 * Helper functions for applying design tokens consistently
 */

import { colors, typography, borderRadius, shadows, spacing } from './tokens';

/**
 * Get text color by variant
 */
export const textColor = (variant = 'primary') => {
  return colors.text[variant] || colors.text.primary;
};

/**
 * Get background gradient
 */
export const bgGradient = (direction = 180, from = 'var(--background)', to = 'transparent') => {
  return `linear-gradient(${direction}deg, ${from}, ${to})`;
};

/**
 * Get primary gradient
 */
export const primaryGradient = (direction = 90) => {
  return `linear-gradient(${direction}deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))`;
};

/**
 * Get border style
 */
export const borderStyle = (variant = 'DEFAULT', width = '1px') => {
  const color = colors.border[variant] || colors.border.DEFAULT;
  return `${width} solid ${color}`;
};

/**
 * Get shadow by variant
 */
export const shadowStyle = (variant = 'md') => {
  return shadows[variant] || shadows.md;
};

/**
 * Responsive font size
 */
export const fontSize = (variant = 'base') => {
  return typography.size[variant] || typography.size.base;
};

/**
 * Button style presets
 */
export const buttonStyles = {
  primary: {
    background: primaryGradient(),
    color: 'white',
    boxShadow: shadows.primary,
    borderRadius: borderRadius.full,
    padding: `${spacing.sm} ${spacing.lg}`,
    transition: 'all 200ms ease-out',
    '&:hover': {
      transform: 'scale(1.02)',
      opacity: 0.9,
    },
  },
  secondary: {
    background: 'transparent',
    color: colors.text.primary,
    border: borderStyle('light'),
    borderRadius: borderRadius.full,
    padding: `${spacing.sm} ${spacing.lg}`,
    transition: 'all 200ms ease-out',
    '&:hover': {
      background: 'color-mix(in oklab, var(--background) 60%, transparent)',
    },
  },
  ghost: {
    background: 'transparent',
    color: colors.text.secondary,
    borderRadius: borderRadius.full,
    padding: `${spacing.sm} ${spacing.md}`,
    transition: 'all 200ms ease-out',
    '&:hover': {
      background: 'color-mix(in oklab, var(--accent-3) 60%, transparent)',
    },
  },
};

/**
 * Badge/Pill style presets
 */
export const badgeStyles = {
  default: {
    background: 'color-mix(in oklab, var(--accent-3) 22%, transparent)',
    color: colors.accent[2],
    border: borderStyle('light'),
    borderRadius: borderRadius.full,
    padding: `${spacing.xs} ${spacing.md}`,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.tracking.ultra,
    boxShadow: shadows.sm,
  },
  primary: {
    background: 'color-mix(in oklab, var(--primary) 18%, transparent)',
    color: colors.primary.DEFAULT,
    borderRadius: borderRadius.full,
    padding: `${spacing.xs} ${spacing.md}`,
  },
};

/**
 * Card style presets
 */
export const cardStyles = {
  default: {
    background: 'var(--background)',
    border: borderStyle('DEFAULT'),
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    boxShadow: shadows.md,
  },
  elevated: {
    background: 'color-mix(in oklab, var(--background) 92%, transparent)',
    border: borderStyle('DEFAULT'),
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    boxShadow: shadows['2xl'],
    backdropFilter: 'blur(10px) saturate(1.1)',
  },
  gradient: {
    background: bgGradient(145, 'color-mix(in oklab, var(--primary) 18%, var(--background))', 'var(--background)'),
    border: borderStyle('DEFAULT'),
    borderRadius: borderRadius['3xl'],
    padding: spacing.xl,
  },
};

