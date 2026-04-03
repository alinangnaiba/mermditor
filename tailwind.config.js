/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'selector',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Design system tokens (aligned with CSS custom properties)
        'deep-black': '#0c0f14',
        'dark-surface': '#13171f',
        'brand-blue': '#4a8eff',

        // Semantic tokens matching CSS vars
        surface: {
          primary: '#0c0f14',    // --bg
          secondary: '#13171f',  // --surface
          tertiary: '#191e28',   // --raised
          quaternary: '#232836', // --border
        },
        text: {
          primary: '#e2e6f0',   // --text
          secondary: '#8892a4', // --dim
          tertiary: '#8892a4',  // --dim
          quaternary: '#505869',// --muted
        },
        border: {
          primary: '#232836',   // --border
          secondary: '#232836',
          accent: '#4a8eff',    // --accent
        },
        accent: {
          primary: '#4a8eff',   // --accent
          hover: '#5f9fff',
          active: '#3a7eef',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Roboto"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        preview: ['"Inter"', '"Roboto"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem', // 72px - useful for larger components
        88: '22rem', // 352px - large container widths
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.preview').join(', '),
            color: theme('colors.gray.100'),
            '[class~="lead"]': {
              color: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            strong: {
              color: theme('colors.gray.100'),
              fontWeight: '700',
            },
            'ol > li::marker': {
              color: theme('colors.gray.400'),
            },
            'ul > li::marker': {
              color: theme('colors.gray.400'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.gray.700'),
            },
            h1: {
              color: theme('colors.gray.100'),
              fontWeight: '800',
            },
            h2: {
              color: theme('colors.gray.100'),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.gray.100'),
              fontWeight: '700',
            },
            h4: {
              color: theme('colors.gray.100'),
              fontWeight: '600',
            },
            'figure figcaption': {
              color: theme('colors.gray.400'),
            },
            code: {
              color: theme('colors.gray.100'),
              backgroundColor: theme('colors.gray.800'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.375rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.deep-black'),
              color: theme('colors.gray.100'),
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            table: {
              borderColor: theme('colors.gray.700'),
            },
            thead: {
              borderBottomColor: theme('colors.gray.600'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
