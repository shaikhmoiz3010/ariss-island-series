/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── Custom fonts matching index.css import ──
      fontFamily: {
        ui:   ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // ── Brand colours ──
      colors: {
        amber: {
          brand: '#e9c87c',
          glow:  'rgba(233,200,124,0.35)',
          dim:   'rgba(233,200,124,0.14)',
        },
        glass: '#030406',
        housing: {
          top: '#2b2d31',
          bot: '#111315',
        },
        btn: {
          top: '#5c8a6e',
          mid: '#4d7860',
          bot: '#3d6350',
        },
      },

      // ── Border radius matching the switch design ──
      borderRadius: {
        housing: '34px',
        display: '18px',
        pill:    '20px',
      },

      // ── Box shadows ──
      boxShadow: {
        housing: [
          '0 80px 160px rgba(0,0,0,0.9)',
          '0 40px 80px rgba(0,0,0,0.7)',
          '0 16px 32px rgba(0,0,0,0.5)',
          '0 0 0 1px rgba(255,255,255,0.07)',
          '0 0 0 2px rgba(0,0,0,0.55)',
          'inset 0 1px 0 rgba(255,255,255,0.10)',
          'inset 0 -3px 0 rgba(0,0,0,0.55)',
        ].join(', '),

        display: [
          'inset 0 0 40px rgba(0,0,0,0.95)',
          'inset 0 1px 0 rgba(255,255,255,0.03)',
          'inset 0 -1px 0 rgba(0,0,0,0.4)',
          '0 2px 10px rgba(0,0,0,0.6)',
        ].join(', '),

        led: [
          '0 0 5px rgba(255,248,180,1)',
          '0 0 14px rgba(255,248,180,0.5)',
          '0 0 28px rgba(255,248,180,0.2)',
        ].join(', '),

        'info-card': [
          '0 4px 24px rgba(0,0,0,0.45)',
          'inset 0 1px 0 rgba(255,255,255,0.04)',
        ].join(', '),
      },

      // ── Keyframes ──
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        flashPulse: {
          '0%':   { opacity: '0.25' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        blink:       'blink 1s step-end infinite',
        fadeIn:      'fadeIn 0.2s ease forwards',
        flashPulse:  'flashPulse 0.28s ease-out forwards',
      },

      // ── Backdrop blur ──
      backdropBlur: {
        card: '20px',
      },
    },
  },
  plugins: [],
}