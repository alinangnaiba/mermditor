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
        // Legacy colors (keeping for backward compatibility)
        'deep-black': '#0a0a0a',
        'dark-surface': '#1e1e1e',
        'brand-blue': '#3b82f6',

        // Semantic color tokens for consistent theming
        surface: {
          primary: '#0f172a', // slate-900 - main background
          secondary: '#1e293b', // slate-800 - secondary surfaces
          tertiary: '#334155', // slate-700 - elevated surfaces
          quaternary: '#475569', // slate-600 - hover states
        },
        text: {
          primary: '#d2d4d6', // slate-200 - darker white, more readable
          secondary: '#cbd5e1', // slate-300 - secondary text
          tertiary: '#94a3b8', // slate-400 - muted text
          quaternary: '#989a9c', // slate-500 - disabled text
        },
        border: {
          primary: '#334155', // slate-700 - main borders
          secondary: '#475569', // slate-600 - subtle borders
          accent: '#3b82f6', // blue-500 - accent borders
        },
        accent: {
          primary: '#79B5D7', // Custom blue - primary brand
          hover: '#6BA5C7', // Darker shade for hover state
          active: '#5D95B7', // Even darker shade for active state
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
        pdf: {
          css: {
            '--tw-prose-body': '#000000',
            '--tw-prose-headings': '#000000',
            '--tw-prose-lead': '#4b5563',
            '--tw-prose-links': '#2563eb',
            '--tw-prose-bold': '#000000',
            '--tw-prose-counters': '#6b7280',
            '--tw-prose-bullets': '#d1d5db',
            '--tw-prose-hr': '#e5e7eb',
            '--tw-prose-quotes': '#111827',
            '--tw-prose-quote-borders': '#e5e7eb',
            '--tw-prose-captions': '#6b7280',
            '--tw-prose-code': '#1f2937',
            '--tw-prose-pre-code': '#1f2937',
            '--tw-prose-pre-bg': '#f3f4f6',
            '--tw-prose-th-borders': '#d1d5db',
            '--tw-prose-td-borders': '#e5e7eb',
            '--tw-prose-invert-body': '#000000',
            '--tw-prose-invert-headings': '#000000',
            '--tw-prose-invert-lead': '#4b5563',
            '--tw-prose-invert-links': '#2563eb',
            '--tw-prose-invert-bold': '#000000',
            '--tw-prose-invert-counters': '#6b7280',
            '--tw-prose-invert-bullets': '#d1d5db',
            '--tw-prose-invert-hr': '#e5e7eb',
            '--tw-prose-invert-quotes': '#111827',
            '--tw-prose-invert-quote-borders': '#e5e7eb',
            '--tw-prose-invert-captions': '#6b7280',
            '--tw-prose-invert-code': '#1f2937',
            '--tw-prose-invert-pre-code': '#1f2937',
            '--tw-prose-invert-pre-bg': '#f3f4f6',
            '--tw-prose-invert-th-borders': '#d1d5db',
            '--tw-prose-invert-td-borders': '#e5e7eb',
            color: '#000000',
            maxWidth: 'none',
            fontSize: '12px',
            h1: { color: '#000000' },
            h2: { color: '#000000' },
            h3: { color: '#000000' },
            h4: { color: '#000000' },
            a: { color: '#2563eb' },
            blockquote: {
              color: '#4b5563',
              borderLeftColor: '#e5e7eb',
            },
            code: {
              color: '#1f2937',
              backgroundColor: '#f3f4f6',
            },
            pre: {
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
            },
            'pre code': {
              color: '#1f2937',
            },
            strong: { color: '#000000' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
