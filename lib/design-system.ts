/**
 * Solo Jackpot Design System
 * Reusable signature style for multiple mini apps
 */

export const DesignSystem = {
  // Color Palette
  colors: {
    // Primary brand color (Celo)
    brand: {
      yellow: '#FCFF52',
      yellowDark: '#FBCC5C',
    },

    // Neutral grayscale (professional)
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
      950: '#0a0a0a',
    },

    // Status colors (muted professional)
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },

    // Crypto-specific accent colors
    crypto: {
      btc: '#F7931A',
      eth: '#627EEA',
      xrp: '#23292F',
      bnb: '#F3BA2F',
      sol: '#9945FF',
      celo: '#FBCC5C',
      op: '#FF0420',
    },
  },

  // Border styles
  borders: {
    primary: '2px solid #FCFF52',
    secondary: '2px solid #404040',
    layered: '2px solid #404040', // Use with boxShadow for yellow layer
  },

  // Shadow styles
  shadows: {
    card: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    cardLayered: '0 0 0 6px #FCFF52, 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    button: '0 6px 20px rgba(239,68,68,0.5), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
    buttonLayered: '0 0 0 6px #FCFF52, 0 6px 20px rgba(239,68,68,0.5)',
    machine: '0 0 0 6px #FCFF52, 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Gradients
  gradients: {
    background: 'from-gray-100 via-gray-50 to-[#FCFF52]/30',
    cardBase: 'from-gray-100 to-gray-200',
    cardDark: 'from-gray-700 to-gray-800',
    cardDarker: 'from-gray-800 to-gray-900',
    buttonPrimary: 'from-red-500 via-red-600 to-red-700',
    buttonSecondary: 'from-gray-800 to-gray-900',
    textHighlight: 'from-gray-900 via-[#FCFF52] to-gray-900',

    // Win/Loss states (professional, toned down)
    resultWin: 'from-gray-700 via-gray-800 to-gray-900',
    resultLoss: 'from-gray-600 via-gray-700 to-gray-800',
  },

  // Typography
  typography: {
    fontFamilies: {
      base: 'system-ui, -apple-system, sans-serif',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    weights: {
      normal: '400',
      semibold: '600',
      bold: '700',
      black: '900',
    },
  },

  // Spacing
  spacing: {
    cardPadding: '1rem',
    sectionGap: '1rem',
    buttonPadding: '0.75rem 1.5rem',
  },

  // Border radius
  radius: {
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '1rem',  // 16px (Tailwind's rounded-2xl)
    full: '9999px',
  },

  // Animation durations
  animation: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    verySlow: '500ms',
    spin: '800ms',
  },
} as const;

/**
 * Helper: Card styles for consistent containers
 */
export const cardStyles = {
  base: `
    bg-white/95 backdrop-blur-lg rounded-2xl p-4
    border-2 border-gray-700
  `,
  withYellowBorder: (includeBoxShadow = true) => `
    bg-white/95 backdrop-blur-lg rounded-2xl p-4
    border-2 border-gray-700
    ${includeBoxShadow ? 'shadow-xl' : ''}
  `,
};

/**
 * Helper: Button styles for consistent interactions
 */
export const buttonStyles = {
  primary: `
    bg-gradient-to-b from-red-500 via-red-600 to-red-700
    hover:from-red-600 hover:via-red-700 hover:to-red-800
    border-2 border-gray-800 text-white font-black rounded-full
    transition-all duration-200
  `,
  secondary: `
    bg-gradient-to-r from-gray-800 to-gray-900
    hover:from-gray-900 hover:to-black
    border-2 border-[#FCFF52] text-white font-bold rounded-xl
    transition-all duration-200 hover:scale-105
  `,
  ghost: `
    bg-transparent hover:bg-gray-100
    border-2 border-gray-300 text-gray-700 font-semibold rounded-lg
    transition-all duration-200
  `,
};

/**
 * Helper: Text styles for consistent typography
 */
export const textStyles = {
  heading: `
    font-black bg-gradient-to-r from-gray-900 via-[#FCFF52] to-gray-900
    bg-clip-text text-transparent drop-shadow-sm
  `,
  subheading: `
    font-bold text-gray-800
  `,
  body: `
    font-normal text-gray-700
  `,
  label: `
    font-semibold text-gray-600
  `,
  accent: `
    font-bold text-[#FCFF52]
  `,
};
