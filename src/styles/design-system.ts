import { cn } from '@/lib/utils';

// Modern color palette for enterprise feel
export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#e879f9',
    400: '#d946ef',
    500: '#c026d3',
    600: '#a21caf',
    700: '#86198f',
    800: '#701a75',
    900: '#581c87',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
};

// Modern typography scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    display: ['Cal Sans', 'Inter', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  }
};

// Advanced spacing system
export const spacing = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

// Modern border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadow system for depth
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// Animation system
export const animations = {
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  keyframes: {
    'fade-in': {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    'slide-up': {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    'scale-in': {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    'pulse-slow': {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.8' },
    }
  }
};

// Component variants
export const variants = {
  button: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    outline: 'border border-neutral-300 bg-white hover:bg-neutral-50',
    ghost: 'hover:bg-neutral-100 text-neutral-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  },
  card: {
    default: 'bg-white border border-neutral-200 shadow-sm',
    elevated: 'bg-white border border-neutral-200 shadow-lg',
    flat: 'bg-neutral-50 border-0',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl',
  },
  input: {
    default: 'border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  }
};

// Utility classes
export const utils = {
  // Glass morphism
  glass: 'bg-white/10 backdrop-blur-lg border border-white/20',
  glassDark: 'bg-black/10 backdrop-blur-lg border border-white/10',
  
  // Gradients
  gradientPrimary: 'bg-gradient-to-r from-primary-500 to-primary-600',
  gradientAccent: 'bg-gradient-to-r from-accent-500 to-accent-600',
  gradientSuccess: 'bg-gradient-to-r from-success-500 to-success-600',
  
  // Text effects
  textGradient: 'bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent',
  textShadow: 'drop-shadow-sm',
  
  // Hover effects
  hoverLift: 'hover:transform hover:scale-105 transition-transform duration-200',
  hoverGlow: 'hover:shadow-lg hover:shadow-primary-500/25 transition-shadow duration-300',
  
  // Loading states
  skeleton: 'animate-pulse bg-neutral-200 rounded',
  shimmer: 'bg-gradient-to-r from-transparent via-neutral-200 to-transparent bg-[length:200%_100%] animate-shimmer',
};

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Custom utility function for dynamic styling
export const createVariant = (base: string, variants: Record<string, string>) => {
  return cn(base, Object.values(variants).join(' '));
};

// Theme provider configuration
export const themeConfig = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  variants,
  utils,
  breakpoints,
};
